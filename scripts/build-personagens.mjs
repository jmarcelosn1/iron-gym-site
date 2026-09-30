/**
 * Personagens das modalidades (ilustrações enviadas pelo cliente, já com fundo transparente).
 *
 * 1. separa os 4 personagens da imagem coletiva (Muay Thai, Jiu-Jitsu, Judô, Balé) por componentes
 *    conectados do canal alfa — cada um sai sem pedaço do vizinho;
 * 2. limpa a borda: tira o resíduo do fundo branco dos pixels semitransparentes (sem halo claro em
 *    cima do tatame escuro) e firma o alfa do corpo (o WebP original vem com 252–253);
 * 3. gera WebP + AVIF com transparência em duas larguras, em /public/assets/personagens, e
 *    src/data/personagens.generated.ts.
 *
 * Uso: npm run personagens
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "source-assets/originais");
const OUT = path.join(ROOT, "public/assets/personagens");

const load = async (f) => {
  const { data, info } = await sharp(await readFile(path.join(SRC, f))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
};

/** Tira o "branco" misturado na borda (o recorte foi feito sobre fundo branco). */
function limparBorda(img) {
  const { data } = img;
  for (let i = 0; i < data.length; i += 4) {
    let a = data[i + 3];
    if (a < 10) {
      data[i + 3] = 0;
      continue;
    }
    if (a >= 245) {
      data[i + 3] = 255;
      continue;
    }
    const f = a / 255;
    for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - 255 * (1 - f)) / f)));
    data[i + 3] = a;
  }
  return img;
}

/** Componentes conectados (alfa > 60) — devolve rótulos e as caixas dos maiores. */
function componentes(img) {
  const { data, width: W, height: H } = img;
  const rot = new Int32Array(W * H);
  const caixas = [];
  let n = 0;
  const pilha = [];
  for (let p0 = 0; p0 < W * H; p0++) {
    if (rot[p0] || data[p0 * 4 + 3] <= 60) continue;
    n++;
    const c = { id: n, x0: W, y0: H, x1: 0, y1: 0, area: 0 };
    pilha.push(p0);
    rot[p0] = n;
    while (pilha.length) {
      const p = pilha.pop();
      const x = p % W;
      const y = (p - x) / W;
      c.area++;
      if (x < c.x0) c.x0 = x;
      if (x > c.x1) c.x1 = x;
      if (y < c.y0) c.y0 = y;
      if (y > c.y1) c.y1 = y;
      for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1])
        if (q >= 0 && !rot[q] && data[q * 4 + 3] > 60) {
          rot[q] = n;
          pilha.push(q);
        }
    }
    caixas.push(c);
  }
  return { rot, caixas: caixas.sort((a, b) => b.area - a.area) };
}

/**
 * Recorta um personagem: tudo o que não pertence aos componentes dele (dentro da caixa) vira
 * transparente. Pedacinhos soltos do próprio personagem (fios de cabelo, pontas) ficam, desde que
 * estejam mais perto dele do que de um vizinho.
 */
function extrair(img, rot, principal, outros, margem = 12) {
  const { data, width: W, height: H } = img;
  const x0 = Math.max(0, principal.x0 - margem);
  const y0 = Math.max(0, principal.y0 - margem);
  const x1 = Math.min(W - 1, principal.x1 + margem);
  const y1 = Math.min(H - 1, principal.y1 + margem);
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const out = Buffer.alloc(w * h * 4);
  const ids = new Set(outros.map((o) => o.id));
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const p = (y + y0) * W + (x + x0);
      const o = (y * w + x) * 4;
      if (ids.has(rot[p])) continue; // pixel de outro personagem
      data.copy(out, o, p * 4, p * 4 + 4);
    }
  return { data: out, width: w, height: h };
}

const salvos = {};
async function salvar(chave, img) {
  await mkdir(OUT, { recursive: true });
  const base = await sharp(img.data, { raw: { width: img.width, height: img.height, channels: 4 } })
    .trim({ threshold: 0 })
    .png()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = base.info;
  const larguras = [360, 640].map((w) => Math.min(w, width));
  const avif = [];
  const webp = [];
  for (const w of [...new Set(larguras)]) {
    const r = () => sharp(base.data).resize({ width: w, kernel: "lanczos3" });
    await writeFile(path.join(OUT, `${chave}-${w}.avif`), await r().avif({ quality: 62, effort: 4 }).toBuffer());
    await writeFile(path.join(OUT, `${chave}-${w}.webp`), await r().webp({ quality: 84, alphaQuality: 90 }).toBuffer());
    avif.push(`/assets/personagens/${chave}-${w}.avif ${w}w`);
    webp.push(`/assets/personagens/${chave}-${w}.webp ${w}w`);
  }
  const maior = Math.max(...larguras);
  salvos[chave] = {
    width,
    height,
    avif: avif.join(", "),
    webp: webp.join(", "),
    src: `/assets/personagens/${chave}-${maior}.webp`,
  };
  console.log(`✓ ${chave}: ${width}×${height}`);
}

// imagem coletiva: da esquerda para a direita, Muay Thai, Jiu-Jitsu, Judô e Balé
{
  const img = limparBorda(await load("personagens-lutas.webp"));
  const { rot, caixas } = componentes(img);
  // os 4 maiores são os corpos; o resto (fios de cabelo soltos, pontas) vai para o corpo mais próximo
  const corpos = caixas.slice(0, 4).sort((a, b) => a.x0 - b.x0);
  const soltos = caixas.slice(4);
  const dono = (c) => {
    const cx = (c.x0 + c.x1) / 2;
    const cy = (c.y0 + c.y1) / 2;
    let melhor = corpos[0];
    let d = Infinity;
    for (const k of corpos) {
      const dx = Math.max(k.x0 - cx, 0, cx - k.x1);
      const dy = Math.max(k.y0 - cy, 0, cy - k.y1);
      const dd = dx * dx + dy * dy;
      if (dd < d) {
        d = dd;
        melhor = k;
      }
    }
    return melhor;
  };
  const grupos = new Map(corpos.map((k) => [k.id, [k]]));
  for (const s of soltos) grupos.get(dono(s).id).push(s);
  const chaves = ["muay-thai", "jiu-jitsu", "judo", "bale"];
  for (const [i, k] of corpos.entries()) {
    const meus = grupos.get(k.id);
    const caixa = meus.reduce((a, c) => ({ ...a, x0: Math.min(a.x0, c.x0), y0: Math.min(a.y0, c.y0), x1: Math.max(a.x1, c.x1), y1: Math.max(a.y1, c.y1) }), { ...k });
    const outros = caixas.filter((c) => !meus.includes(c));
    await salvar(chaves[i], extrair(img, rot, caixa, outros));
  }
}
await salvar("mma", limparBorda(await load("personagem-mma.webp")));
await salvar("musculacao", limparBorda(await load("personagem-musculacao.webp")));

await writeFile(
  path.join(ROOT, "src/data/personagens.generated.ts"),
  `// Gerado por scripts/build-personagens.mjs — não editar manualmente.
export const PERSONAGENS = ${JSON.stringify(salvos, null, 2)} as const;

export type PersonagemKey = keyof typeof PERSONAGENS;
`,
);
console.log("✓ src/data/personagens.generated.ts");
