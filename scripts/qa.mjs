/**
 * QA do site: capturas + verificações automáticas em Chromium, Firefox e WebKit.
 *
 *   node scripts/qa.mjs [url]     (padrão: http://localhost:5181/app.html)
 *
 * Para cada navegador × largura (375, 768, 1440):
 *   - sem rolagem horizontal;
 *   - todas as imagens carregadas;
 *   - links de ação apontando para os destinos certos;
 *   - capturas da página inteira (movimento reduzido) em qa-output/.
 * No Chromium 375 também testa com animação: rola até o fim e confere se todas as fotos
 * foram reveladas (nenhum quadro preso com clip-path fechado).
 */
import { chromium, firefox, webkit } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const URL_SITE = process.argv[2] ?? "http://localhost:5181/app.html";
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../qa-output");
await mkdir(OUT, { recursive: true });

const LARGURAS = [
  { nome: "celular", width: 375, height: 812, isMobile: true },
  { nome: "tablet", width: 768, height: 1024, isMobile: true },
  { nome: "desktop", width: 1440, height: 900, isMobile: false },
];
const ESPERADOS = [
  "google.com/maps/dir",
  "youtube.com/@IronGymslz",
  "wa.me/5598981604258",
  "instagram.com/irongymslz",
  "google.com/maps/dir",
];

const falhas = [];
const pulados = [];
const falha = (msg) => {
  falhas.push(msg);
  console.log("  ✗ " + msg);
};

async function rolarAteOFim(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
}

for (const [nomeNav, tipo] of [["chromium", chromium], ["firefox", firefox], ["webkit", webkit]]) {
  let browser;
  try {
    browser = await tipo.launch();
  } catch (e) {
    console.log(`! ${nomeNav} não abriu nesta máquina (${e.message.split("\n")[0]}) — pulando`);
    pulados.push(nomeNav);
    continue;
  }
  for (const l of LARGURAS) {
    const tag = `${nomeNav}-${l.nome}`;
    console.log(`• ${tag}`);
    const ctx = await browser.newContext({
      viewport: { width: l.width, height: l.height },
      deviceScaleFactor: nomeNav === "chromium" ? 2 : 1,
      isMobile: nomeNav === "firefox" ? undefined : l.isMobile,
      hasTouch: l.isMobile,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    const erros = [];
    page.on("pageerror", (e) => !/(youtube|google|gstatic)/i.test(e.message) && erros.push(e.message));
    // erros vindos dos players/mapas de terceiros (YouTube, Google) não são do site
    page.on("console", (m) => m.type() === "error" && !/(youtube|google|gstatic|ytimg|doubleclick)/i.test(m.text() + (m.location()?.url ?? "")) && erros.push(m.text()));
    await page.goto(URL_SITE, { waitUntil: "load" });
    // leva cada foto visível até a tela (inclusive as do carrossel horizontal) e espera carregar.
    // O passo é dado daqui de fora: dentro de um evaluate longo o WebKit não processa o lazy-load.
    const fotos = page.locator("img");
    for (let i = 0, n = await fotos.count(); i < n; i++) {
      const f = fotos.nth(i);
      if (!(await f.evaluate((e) => e.getClientRects().length))) continue; // oculta nesta largura
      await f.evaluate((e) => e.scrollIntoView({ block: "center", inline: "center" }));
      await page.waitForFunction((e) => e.complete && e.naturalWidth > 0, await f.elementHandle(), { timeout: 5000 }).catch(() => {});
    }
    await rolarAteOFim(page);
    await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 }).catch(() => {}); // o mapa do Google nunca fica "ocioso"
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // compara com a largura do aparelho: no celular, conteúdo vazando faz a própria janela "crescer"
    const larg = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    if (larg[0] > l.width || larg[1] > l.width) falha(`${tag}: rolagem horizontal (página ${larg[0]} px, janela ${larg[1]} px, aparelho ${l.width} px)`);

    const quebradas = await page.evaluate(() =>
      [...document.images].filter((i) => i.getClientRects().length && (!i.complete || i.naturalWidth === 0)).map((i) => i.currentSrc || i.src),
    );
    if (quebradas.length) falha(`${tag}: imagens sem carregar: ${quebradas.join(", ")}`);

    const hrefs = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.href));
    for (const e of ESPERADOS) if (!hrefs.some((h) => h.includes(e))) falha(`${tag}: nenhum link para ${e}`);
    const externosSemRel = await page.evaluate(() =>
      [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/noopener/.test(a.rel)).map((a) => a.href),
    );
    if (externosSemRel.length) falha(`${tag}: links externos sem rel=noopener`);

    const pequenos = await page.evaluate(() =>
      [...document.querySelectorAll("a, button")]
        .filter((a) => a.offsetParent && !a.classList.contains("sr-only"))
        .map((a) => [a.textContent.trim().slice(0, 30), a.getBoundingClientRect()])
        .filter(([, r]) => r.width > 0 && (r.height < 40 || r.width < 40))
        .map(([t, r]) => `${t} (${Math.round(r.width)}×${Math.round(r.height)})`),
    );
    if (pequenos.length) falha(`${tag}: alvos de toque pequenos: ${pequenos.join("; ")}`);

    if (erros.length) falha(`${tag}: erros no console: ${erros.join(" | ")}`);

    await page.screenshot({ path: path.join(OUT, `${tag}-inteira.png`), fullPage: true });
    await page.screenshot({ path: path.join(OUT, `${tag}-topo.png`) });
    await ctx.close();
  }

  // Com animação: abertura completa e todas as fotos reveladas depois de rolar.
  if (nomeNav === "chromium") {
    for (const l of [LARGURAS[0], LARGURAS[2]]) {
      const ctx = await browser.newContext({ viewport: { width: l.width, height: l.height }, deviceScaleFactor: 2, isMobile: l.isMobile, hasTouch: l.isMobile });
      const page = await ctx.newPage();
      await page.goto(URL_SITE, { waitUntil: "load" });
      await page.waitForTimeout(2600);
      await page.screenshot({ path: path.join(OUT, `animado-${l.nome}-abertura.png`) });
      // rolagem de verdade (roda do mouse), como uma pessoa: a abertura fica presa por várias telas
      const altura = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < altura; y += 200) {
        await page.mouse.wheel(0, 200);
        await page.waitForTimeout(70);
      }
      await page.waitForTimeout(3000);
      const presos = await page.evaluate(() =>
        [...document.querySelectorAll("[data-quadro]")].filter((q) => !/inset\(0(%|px)?\s/.test(getComputedStyle(q).clipPath) && getComputedStyle(q).clipPath !== "none").length,
      );
      if (presos) falha(`animado-${l.nome}: ${presos} foto(s) não revelada(s) depois de rolar`);
      await page.screenshot({ path: path.join(OUT, `animado-${l.nome}-inteira.png`), fullPage: true });
      await ctx.close();
    }
  }
  await browser.close();
}

const testados = ["chromium", "firefox", "webkit"].filter((n) => !pulados.includes(n)).join(", ");
console.log(falhas.length ? `\n${falhas.length} problema(s).` : `\n✓ Tudo certo em ${testados} (375, 768, 1440).`);
if (pulados.length) console.log(`(não testado: ${pulados.join(", ")})`);
process.exit(falhas.length ? 1 : 0);
