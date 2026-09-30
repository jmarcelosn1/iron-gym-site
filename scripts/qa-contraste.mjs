// Contraste real dos textos que ficam sobre foto/degradê (o axe não consegue medir esses):
// fotografa o fundo atrás de cada texto (com o texto escondido) e compara com a cor do texto.
// Uso: node scripts/qa-contraste.mjs [url]
import { chromium } from "playwright";
import sharp from "sharp";
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const ALVOS = [
  ["título da abertura (sobre o vídeo)", "#inicio h1", null],
  ["texto da abertura", "#inicio h1 + div p", null],
  ["frase da casa (sobre a foto)", "#titulo-sobre", null],
  ["texto da Iron (sobre a foto)", "#titulo-sobre + p", null],
  ["desafio: título", "#titulo-desafio", null],
  ["desafio: parte cinza", "#titulo-desafio .tom-2", null],
  ["desafio: texto", "#titulo-desafio + p", null],
  ["contato: título sobre a equipe", "#contato .isolate #titulo-contato", null],
  ["duração do vídeo", "#videos .etiqueta", null],
];
const b = await chromium.launch();
for (const [nome, vp] of [["celular", { width: 390, height: 844 }], ["desktop", { width: 1440, height: 900 }]]) {
  const p = await b.newPage({ viewport: vp, reducedMotion: "reduce" });
  await p.goto(process.argv[2] ?? "http://localhost:4184/", { waitUntil: "load" });
  await p.waitForTimeout(800);
  console.log(`\n• ${nome}`);
  for (const [rot, sel, fixo] of ALVOS) {
    const el = p.locator(sel).first();
    if (!(await el.isVisible())) continue; // só existe em outra largura de tela
    await el.scrollIntoViewIfNeeded();
    await p.waitForTimeout(300);
    // qualquer formato de cor (rgb, oklab, color-mix) → rgb, pintando num canvas sobre o fundo escuro
    const cor =
      fixo ??
      (await el.evaluate((e) => {
        const c = document.createElement("canvas");
        c.width = c.height = 1;
        const x = c.getContext("2d");
        x.fillStyle = "#070808";
        x.fillRect(0, 0, 1, 1);
        x.fillStyle = getComputedStyle(e).color;
        x.fillRect(0, 0, 1, 1);
        return [...x.getImageData(0, 0, 1, 1).data.slice(0, 3)];
      }));
    // esconde o texto para fotografar só o fundo atrás dele
    // (um pedaço do título em outro tom divide a linha com o resto: o título inteiro some)
    await el.evaluate((e) => { const t = e.closest("h1, h2, h3"); if (t && t !== e) { t.dataset.ct = t.style.cssText; t.style.setProperty("color", "transparent", "important"); } e.dataset.c = e.style.cssText; e.style.setProperty("color", "transparent", "important"); e.style.setProperty("-webkit-text-fill-color", "transparent", "important"); e.style.setProperty("text-shadow", "none", "important"); e.style.setProperty("filter", "none", "important"); e.style.setProperty("background", "none", "important"); e.querySelectorAll("*").forEach((c) => c.style.setProperty("color", "transparent", "important")); });
    const buf = await el.screenshot();
    await el.evaluate((e) => { const t = e.closest("h1, h2, h3"); if (t && t !== e) t.style.cssText = t.dataset.ct; e.style.cssText = e.dataset.c; e.querySelectorAll("*").forEach((c) => c.style.removeProperty("color")); });
    const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const ls = [];
    for (let i = 0; i < data.length; i += 3) ls.push([data[i], data[i + 1], data[i + 2]]);
    ls.sort((x, y) => lum(y) - lum(x));
    const pior = ls[Math.floor(ls.length * 0.02)]; // fundo mais claro (2% mais claros)
    const r = ratio(cor, pior);
    console.log(`  ${r >= 4.5 ? "ok " : r >= 3 ? "~  " : "✗  "} ${rot}: ${r.toFixed(2)}:1  (texto rgb(${cor.join(",")}) × fundo rgb(${pior.join(",")}))`);
  }
  await p.close();
}
await b.close();
