import path from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * Build pensado para abrir com dois cliques:
 * - base "./": caminhos relativos (funciona em file:// e em qualquer hospedagem);
 * - vite-plugin-singlefile: JS e CSS embutidos no HTML. Fotos continuam em dist/assets.
 * Código-fonte da página: app.html (o index.html da raiz só redireciona para dist/index.html).
 */

/**
 * URL pública (VITE_SITE_URL no .env). Sem ela, as tags que exigem endereço absoluto
 * (canonical, og:url, og:image) saem do HTML em vez de apontarem para lugar nenhum.
 */
function siteUrl(site: string): Plugin {
  return {
    name: "iron-site-url",
    transformIndexHtml(html) {
      if (site) return html.replaceAll("%SITE%", site.replace(/\/$/, ""));
      return html.replace(/^.*%SITE%.*\r?\n/gm, "");
    },
  };
}

/** Fontes: só woff2 (todos os navegadores atuais). O .woff de reserva só dobraria o HTML embutido. */
function soWoff2(): Plugin {
  return {
    name: "iron-so-woff2",
    enforce: "pre",
    transform(code, id) {
      if (!/@fontsource[\\/].*\.css/.test(id)) return;
      return code.replace(/,\s*url\([^)]*\.woff\)\s*format\(['"]woff['"]\)/g, "");
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [soWoff2(), react(), tailwindcss(), siteUrl(loadEnv(mode, import.meta.dirname, "VITE_").VITE_SITE_URL ?? ""), viteSingleFile({ removeViteModuleLoader: true })],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  server: { port: 5181, strictPort: true, host: true },
  build: {
    target: ["es2020", "safari15", "firefox100", "chrome100", "edge100"],
    cssTarget: ["safari15", "firefox100", "chrome100"],
    rollupOptions: {
      input: path.resolve(import.meta.dirname, "app.html"),
    },
  },
}));
