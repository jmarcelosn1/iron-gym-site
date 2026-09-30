// Depois do build: dist/app.html vira dist/index.html (entrada padrão de qualquer hospedagem),
// e são gerados robots.txt + sitemap.xml (quando há VITE_SITE_URL) e a página 404.
import { readFile, writeFile, rename, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
await access(path.join(dist, "app.html"));
await rename(path.join(dist, "app.html"), path.join(dist, "index.html"));

const env = await readFile(path.resolve(dist, "../.env"), "utf8").catch(() => "");
const site = (process.env.VITE_SITE_URL ?? env.match(/^VITE_SITE_URL=(.*)$/m)?.[1] ?? "").trim().replace(/\/?$/, "/");
if (site !== "/") {
  await writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site}sitemap.xml\n`);
  const today = new Date().toISOString().slice(0, 10);
  await writeFile(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
  );
}

await writeFile(
  path.join(dist, "404.html"),
  `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Página não encontrada | Iron Gym</title>
<style>
  html { background: #070808; color: #c5cacf; font-family: system-ui, sans-serif; }
  body { min-height: 100vh; margin: 0; display: grid; place-items: center; text-align: center; padding: 24px; box-sizing: border-box; }
  h1 { color: #f2f3f3; font-size: clamp(2rem, 8vw, 3.5rem); margin: 0 0 12px; }
  p { color: #8b9197; margin: 0 0 28px; }
  a { display: inline-block; background: #d70a1e; color: #fff; text-decoration: none; font-weight: 700; padding: 14px 28px; border-radius: 2px; }
</style>
</head>
<body>
<main>
  <h1>Página não encontrada</h1>
  <p>Esse endereço não existe no site da Iron Gym.</p>
  <a href="/">Ir para o início</a>
</main>
</body>
</html>
`,
);
console.log("✓ dist/index.html pronto (abre com dois cliques ou em qualquer hospedagem)");
