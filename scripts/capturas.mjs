// Capturas de revisão, com animação ligada: rola até cada seção (roda do mouse, como uma pessoa),
// espera as entradas terminarem e fotografa a tela. Uso: node scripts/capturas.mjs [url] [celular|desktop|ambos]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL_SITE = process.argv[2] ?? "http://localhost:5181/app.html";
const QUAL = process.argv[3] ?? "ambos";
await mkdir("qa-output/capturas", { recursive: true });
const TELAS = [
  ["desktop", { width: 1440, height: 900 }, false],
  ["celular", { width: 390, height: 844 }, true],
].filter(([n]) => QUAL === "ambos" || QUAL === n);

const b = await chromium.launch();
for (const [nome, vp, movel] of TELAS) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: movel, hasTouch: movel });
  const p = await ctx.newPage();
  const erros = [];
  p.on("pageerror", (e) => erros.push(e.message));
  p.on("console", (m) => m.type() === "error" && erros.push(m.text()));
  await p.goto(URL_SITE, { waitUntil: "load" });
  await p.waitForTimeout(2600);
  await p.screenshot({ path: `qa-output/capturas/${nome}-00-inicio.png` });
  const alvos = await p.evaluate(() => [...document.querySelectorAll("main > section, #rodape")].map((s, i) => [i, s.id || s.getAttribute("aria-labelledby") || "secao"]));
  for (const [i, id] of alvos.slice(1)) {
    const topo = await p.evaluate((i) => document.querySelectorAll("main > section, #rodape")[i].getBoundingClientRect().top + scrollY, i);
    // rola aos poucos até a seção
    let y = await p.evaluate(() => scrollY);
    while (y < topo - 10) {
      const passo = Math.min(300, topo - y);
      await p.mouse.wheel(0, passo);
      y += passo;
      await p.waitForTimeout(40);
    }
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `qa-output/capturas/${nome}-${String(i).padStart(2, "0")}-${id}.png` });
  }
  console.log(`${nome}: ${alvos.length} capturas${erros.length ? " | ERROS: " + erros.join(" | ") : ""}`);
  await ctx.close();
}
await b.close();
