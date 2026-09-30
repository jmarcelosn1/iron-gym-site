// Auditoria de responsividade em 11 tamanhos (Android pequeno → 2560 px, celular deitado, tablets).
// Para cada um: rolagem horizontal, elementos saindo da tela, texto estourando a caixa, topo apertado
// e alvos de toque pequenos (até 1023 px). Salva a página inteira em qa-output/resp-<tamanho>.png.
// Uso: node scripts/qa-responsivo.mjs [url]   (padrão: http://localhost:4184/, o `npm run serve`)
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL_SITE = process.argv[2] ?? "http://localhost:4184/";
const TAMANHOS = [
  [320, 640], [360, 780], [412, 915], [844, 390], [768, 1024], [820, 1180],
  [1180, 820], [1366, 768], [1536, 864], [1920, 1080], [2560, 1440],
];
await mkdir("qa-output", { recursive: true });

const b = await chromium.launch();
let problemas = 0;
for (const [w, h] of TAMANHOS) {
  const toque = w < 1024;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: toque && w < 900, hasTouch: toque, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(URL_SITE, { waitUntil: "load" });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
    window.scrollTo(0, 0);
  });
  await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 }).catch(() => {}); // o mapa do Google nunca fica "ocioso"
  await p.waitForTimeout(400);

  const r = await p.evaluate(([toque, largura]) => {
    const W = largura; // largura do aparelho (no celular, conteúdo vazando faz a janela crescer)
    const nome = (e) => `${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}.${[...e.classList].slice(0, 3).join(".")}`;
    const recortado = (e) => { for (let a = e.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a); if (/(hidden|clip|auto|scroll)/.test(o.overflowX + o.overflow)) return true; } return false; };
    const visivel = (e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return s.visibility !== "hidden" && s.display !== "none" && r.width > 0 && r.height > 0; };
    const todos = [...document.querySelectorAll("body *")].filter(visivel);
    const fora = todos.filter((e) => { const r = e.getBoundingClientRect(); return (r.right > W + 1 || r.left < -1) && !recortado(e); }).map(nome);
    const estouro = [...document.querySelectorAll("h1,h2,h3,p,a,li,dt,dd,address,span")].filter(visivel)
      .filter((e) => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX === "visible" && e.clientWidth > 0 && getComputedStyle(e).display !== "inline" && !recortado(e))
      .map(nome);
    const topo = document.querySelector("header > div");
    const pequenos = toque
      ? [...document.querySelectorAll("a, button")].filter(visivel).filter((e) => !e.closest("[aria-hidden='true']") && !e.classList.contains("sr-only"))
          .map((e) => [e.textContent.trim().slice(0, 24), e.getBoundingClientRect()]).filter(([, r]) => r.height < 40 || r.width < 40)
          .map(([t, r]) => `${t} ${Math.round(r.width)}×${Math.round(r.height)}`)
      : [];
    return {
      rolagemLateral: document.documentElement.scrollWidth > W || innerWidth > W,
      foraDaTela: [...new Set(fora)].slice(0, 5),
      textoEstourado: [...new Set(estouro)].slice(0, 5),
      topoApertado: topo.scrollWidth > topo.clientWidth + 1,
      toquePequeno: pequenos.slice(0, 5),
    };
  }, [toque, w]);
  const ok = !r.rolagemLateral && !r.foraDaTela.length && !r.textoEstourado.length && !r.topoApertado && !r.toquePequeno.length;
  if (!ok) problemas++;
  console.log(`${w}x${h}`.padEnd(10), ok ? "ok" : "PROBLEMA " + JSON.stringify(r));
  await p.screenshot({ path: `qa-output/resp-${w}x${h}.png`, fullPage: true });
  await ctx.close();
}
await b.close();
console.log(problemas ? `\n${problemas} tamanho(s) com problema.` : "\n✓ Responsivo nos 11 tamanhos.");
process.exit(problemas ? 1 : 0);
