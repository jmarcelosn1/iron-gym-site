/**
 * Vídeo da abertura: o trecho de 2:00 a 3:30 do "Conheça a Iron Gym" (canal da academia no YouTube,
 * baixado em 1080p para rodar na hora, sem esperar o player do YouTube).
 *
 *   abertura-horizontal.mp4  1280×720  (desktop; com o escurecido do topo por cima, não perde nada)
 *   abertura-vertical.mp4    540×960   (celular em pé: recorte central 9:16)
 *   capas .webp/.jpg do primeiro quadro (aparecem no primeiro instante e com "reduzir movimento")
 *
 * Com som (o botão "Ativar som" da abertura), suavizado no começo e no fim para o loop não dar corte seco.
 * H.264 + faststart: o navegador começa a tocar com os primeiros segundos baixados.
 *
 * Uso: npm run abertura
 */
import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "source-assets/originais/conheca-iron-gym.mp4");
const OUT = path.join(ROOT, "public/assets/video");
const INICIO = 120;
const DURACAO = 90;

await mkdir(OUT, { recursive: true });
const rodar = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
const audio = ["-c:a", "aac", "-b:a", "96k", "-ac", "2", "-af", `afade=t=in:d=0.6,afade=t=out:st=${DURACAO - 1}:d=1`];
const video = ["-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-g", "60"];

for (const v of [
  // arquivos leves (limite de 25 MB por arquivo na Cloudflare; menos dados no celular)
  { nome: "abertura-horizontal", filtro: "scale=1280:720:flags=lanczos", crf: "30" },
  { nome: "abertura-vertical", filtro: "crop=608:1080:656:0,scale=540:960:flags=lanczos", crf: "31" },
]) {
  const mp4 = path.join(OUT, `${v.nome}.mp4`);
  rodar(["-ss", String(INICIO), "-t", String(DURACAO), "-i", SRC, "-vf", v.filtro, ...video, "-crf", v.crf, ...audio, mp4]);
  rodar(["-i", mp4, "-frames:v", "1", "-q:v", "3", path.join(OUT, `${v.nome}.jpg`)]);
  rodar(["-i", mp4, "-frames:v", "1", "-quality", "80", path.join(OUT, `${v.nome}.webp`)]);
  console.log(`✓ ${v.nome}`);
}
