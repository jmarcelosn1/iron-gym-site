/**
 * Iron Gym — tratamento das fotos e geração dos assets do site (direção AÇO).
 *
 * Os originais ficam intactos em /source-assets/originais. Para cada foto:
 *   1. recorte (quando só uma parte da foto serve, ex.: os fundos de tatame das modalidades);
 *   2. ampliação lanczos3 quando a foto é pequena (máx. 2,5× o original);
 *   3. nitidez leve — as cores ficam as originais (fidelidade à academia real, pedido do cliente);
 *   4. AVIF + WebP em várias larguras + JPG de reserva, em /public/assets/fotos.
 * Também gera a logo com fundo transparente, favicons, a imagem Open Graph, o grão de filme e
 * src/data/assets.generated.ts (dimensões e srcsets — sem layout shift).
 *
 * Sem IA: se um dia houver versões ampliadas por IA, basta salvar em /source-assets/ia/<chave>.png.
 *
 * Uso: npm run assets
 */
import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "source-assets/originais");
const AI = path.join(ROOT, "source-assets/ia");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "assets/fotos");
const FERRO = "#070808";

const exists = (p) => access(p).then(() => true, () => false);
// libvips não lida bem com caminhos longos/acentuados no Windows: toda E/S passa por buffers do Node.
const load = async (p) => sharp(await readFile(p));
const save = async (img, p) => writeFile(p, await img.toBuffer());

/**
 * Fotos do site. crop em pixels do original. maxSide: lado maior final.
 * alt fica em src/data/site.ts (texto é conteúdo, não asset).
 */
const PHOTOS = [
  // imagem de compartilhamento (Open Graph)
  { key: "pesos", file: "pesos.png", maxSide: 1449 },
  // fundos de seção
  { key: "musculacao", file: "1.webp", maxSide: 1444 },
  // a foto original tem uma faixa preta de 9 px na borda esquerda: fica de fora
  { key: "equipe", file: "equipe.png", crop: { left: 10, top: 0, width: 1309, height: 1190 }, maxSide: 1309 },
  { key: "martelo", file: "3.webp", maxSide: 1449 },
  // letreiro "Iron Gym" na parede de folhas: fica no lugar do vídeo da abertura quando o navegador
  // não deixa o vídeo tocar sozinho (modo de economia de energia)
  { key: "letreiro", file: "2.webp", maxSide: 1275 },
  // palco das modalidades: a foto inteira da área de lutas (os personagens ficam em pé no tatame)
  { key: "lutas", file: "area-de-luta.png", maxSide: 1362 },
];

const WIDTHS = [480, 800, 1200, 1600];
const MAX_SCALE = 2.5;

async function photo({ key, file, crop, maxSide }) {
  const aiFile = path.join(AI, `${key}.png`);
  const useAi = await exists(aiFile);
  const orig = await load(path.join(SRC, file));
  const base = useAi ? await load(aiFile) : crop ? orig.extract(crop) : orig;
  const { info: i0 } = await base.clone().toBuffer({ resolveWithObject: true });
  const scale = Math.min(MAX_SCALE, maxSide / Math.max(i0.width, i0.height));
  const width = Math.round(i0.width * Math.max(1, scale));
  const height = Math.round(i0.height * Math.max(1, scale));
  const ampliada = width > i0.width;
  const master = await base
    .removeAlpha()
    .resize(width, height, { kernel: "lanczos3" })
    .sharpen(ampliada ? { sigma: 1.2, m1: 0.8, m2: 2.4 } : { sigma: 0.8, m1: 0.4, m2: 1.6 })
    .png()
    .toBuffer();

  await mkdir(OUT, { recursive: true });
  const widths = [...WIDTHS.filter((w) => w < width * 0.94), width];
  const avif = [];
  const webp = [];
  for (const w of widths) {
    const r = () => sharp(master).resize({ width: w });
    await save(r().avif({ quality: 56, effort: 4 }), path.join(OUT, `${key}-${w}.avif`));
    await save(r().webp({ quality: 80 }), path.join(OUT, `${key}-${w}.webp`));
    avif.push(`/assets/fotos/${key}-${w}.avif ${w}w`);
    webp.push(`/assets/fotos/${key}-${w}.webp ${w}w`);
  }
  const fallback = widths.find((w) => w >= 800) ?? width;
  await save(sharp(master).resize({ width: fallback }).jpeg({ quality: 82, mozjpeg: true }), path.join(OUT, `${key}-${fallback}.jpg`));
  console.log(`✓ ${key}: ${i0.width}×${i0.height} → ${width}×${height} ${useAi ? " (IA)" : ""}`);
  return { key, width, height, avif: avif.join(", "), webp: webp.join(", "), src: `/assets/fotos/${key}-${fallback}.jpg`, master };
}

/**
 * Logo: o fundo preto de fora vira transparente (preenchimento a partir das bordas), mas o contorno
 * preto de dentro do desenho continua — o emblema não "vaza" em cima de foto.
 */
async function logo() {
  const img = await load(path.join(SRC, "logo.png"));
  const { data, info } = await img.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const escuro = (p) => Math.max(data[p * 3], data[p * 3 + 1], data[p * 3 + 2]) < 34;
  const fora = new Uint8Array(W * H);
  const fila = [];
  for (let x = 0; x < W; x++) fila.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) fila.push(y * W, y * W + W - 1);
  while (fila.length) {
    const p = fila.pop();
    if (fora[p] || !escuro(p)) continue;
    fora[p] = 1;
    const x = p % W;
    if (x > 0) fila.push(p - 1);
    if (x < W - 1) fila.push(p + 1);
    if (p >= W) fila.push(p - W);
    if (p < W * (H - 1)) fila.push(p + W);
  }
  const rgba = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    rgba[p * 4] = data[p * 3];
    rgba[p * 4 + 1] = data[p * 3 + 1];
    rgba[p * 4 + 2] = data[p * 3 + 2];
    rgba[p * 4 + 3] = fora[p] ? 0 : 255;
  }
  // borda suave: um desfoque leve só no canal alfa evita serrilhado
  const alfa = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extractChannel(3).blur(0.8).raw().toBuffer();
  for (let p = 0; p < W * H; p++) rgba[p * 4 + 3] = alfa[p];
  const transp = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
  const { width: lw, height: lh } = transp.info;

  const dir = path.join(PUBLIC, "assets/marca");
  await mkdir(dir, { recursive: true });
  for (const w of [160, 320, 640]) {
    await save(sharp(transp.data).resize({ width: w }).png({ compressionLevel: 9 }), path.join(dir, `logo-${w}.png`));
    await save(sharp(transp.data).resize({ width: w }).webp({ quality: 90, alphaQuality: 100 }), path.join(dir, `logo-${w}.webp`));
  }
  // ícones: emblema centralizado num quadrado da cor do site
  const quadrado = async (lado, margem) => {
    const inner = Math.round(lado * (1 - margem * 2));
    const e = await sharp(transp.data).resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    // paleta de 256 cores: ícone 4–6× menor, sem diferença visível
    return sharp({ create: { width: lado, height: lado, channels: 4, background: FERRO } }).composite([{ input: e, gravity: "centre" }]).png({ palette: true, quality: 92, effort: 10 });
  };
  await save(await quadrado(32, 0.02), path.join(PUBLIC, "favicon-32.png"));
  await save(await quadrado(48, 0.03), path.join(PUBLIC, "favicon-48.png"));
  await save(await quadrado(192, 0.06), path.join(PUBLIC, "icon-192.png"));
  await save(await quadrado(512, 0.06), path.join(PUBLIC, "icon-512.png"));
  await save((await quadrado(180, 0.08)).flatten({ background: FERRO }), path.join(PUBLIC, "apple-touch-icon.png"));
  console.log(`✓ logo: ${lw}×${lh} transparente + favicons`);
  return { width: lw, height: lh, data: transp.data };
}

/** Open Graph 1200×630: logo à esquerda, as anilhas à direita. */
async function ogImage(pesos, marca) {
  const foto = await sharp(pesos.master).resize(600, 630, { fit: "cover", position: "centre" }).toBuffer();
  const emblema = await sharp(marca.data).resize({ height: 440 }).png().toBuffer();
  const { width: ew } = await sharp(emblema).metadata();
  // degradê que funde a foto no preto
  const fade = Buffer.from(
    `<svg width="600" height="630"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${FERRO}"/><stop offset=".45" stop-color="${FERRO}" stop-opacity="0"/></linearGradient></defs><rect width="600" height="630" fill="url(#g)"/></svg>`,
  );
  await save(
    sharp({ create: { width: 1200, height: 630, channels: 3, background: FERRO } })
      .composite([
        { input: foto, left: 600, top: 0 },
        { input: fade, left: 600, top: 0 },
        { input: emblema, left: Math.round(330 - ew / 2), top: 95 },
      ])
      .jpeg({ quality: 86, mozjpeg: true }),
    path.join(PUBLIC, "og-image.jpg"),
  );
  console.log("✓ og-image.jpg");
}

/** Grão de filme: textura de ruído pronta (mais leve que um filtro SVG calculado a cada quadro). */
async function grao() {
  const N = 160;
  const px = Buffer.alloc(N * N * 2);
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < N * N; i++) {
    px[i * 2] = rnd() > 0.5 ? 255 : 0;
    px[i * 2 + 1] = Math.round(rnd() * 70);
  }
  const dir = path.join(PUBLIC, "assets/marca");
  await mkdir(dir, { recursive: true });
  await save(sharp(px, { raw: { width: N, height: N, channels: 2 } }).png({ compressionLevel: 9 }), path.join(dir, "grao.png"));
  console.log("✓ grao.png");
}

const results = [];
for (const p of PHOTOS) results.push(await photo(p));
const marca = await logo();
await grao();
await ogImage(results.find((r) => r.key === "pesos"), marca);

const assets = Object.fromEntries(results.map(({ master: _m, ...r }) => [r.key, r]));
await writeFile(
  path.join(ROOT, "src/data/assets.generated.ts"),
  `// Gerado por scripts/build-assets.mjs — não editar manualmente.
export const ASSETS = ${JSON.stringify(assets, null, 2)} as const;

export type AssetKey = keyof typeof ASSETS;

export const LOGO = { width: ${marca.width}, height: ${marca.height} } as const;
`,
);
console.log("✓ src/data/assets.generated.ts");
