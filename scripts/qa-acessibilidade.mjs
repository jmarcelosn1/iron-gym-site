// Auditoria de acessibilidade com axe-core (o mesmo motor do Lighthouse), no celular e no desktop,
// com e sem "reduzir movimento". Rola a página inteira antes (fotos lazy e animações de entrada).
// Uso: node scripts/qa-acessibilidade.mjs [url]   (padrão: http://localhost:4184/)
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const URL_SITE = process.argv[2] ?? "http://localhost:4184/";
const axe = await readFile(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

const b = await chromium.launch();
let total = 0;
for (const [nome, vp, reduced] of [
  ["celular", { width: 390, height: 844 }, "no-preference"],
  ["desktop", { width: 1440, height: 900 }, "no-preference"],
  ["celular-sem-movimento", { width: 390, height: 844 }, "reduce"],
]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: vp.width < 768, hasTouch: vp.width < 768, reducedMotion: reduced });
  const p = await ctx.newPage();
  await p.goto(URL_SITE, { waitUntil: "load" });
  await p.waitForTimeout(3000);
  const altura = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < altura; y += 250) {
    await p.mouse.wheel(0, 250);
    await p.waitForTimeout(60);
  }
  await p.waitForTimeout(3500);
  await p.addScriptTag({ content: axe });
  const r = await p.evaluate(async () => {
    // eslint-disable-next-line no-undef
    const res = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } });
    return {
      violacoes: res.violations.map((v) => ({ id: v.id, impacto: v.impact, ajuda: v.help, alvos: v.nodes.slice(0, 4).map((n) => n.target.join(" ")) })),
      incompletos: res.incomplete.map((v) => `${v.id} (${v.nodes.length})`),
    };
  });
  total += r.violacoes.length;
  console.log(`\n• ${nome}: ${r.violacoes.length} violação(ões)`);
  for (const v of r.violacoes) console.log(`  ✗ [${v.impacto}] ${v.id}: ${v.ajuda}\n      ${v.alvos.join("\n      ")}`);
  if (r.incompletos.length) console.log(`  ? para conferir à mão: ${r.incompletos.join(", ")}`);
  await ctx.close();
}
await b.close();
process.exit(total ? 1 : 0);
