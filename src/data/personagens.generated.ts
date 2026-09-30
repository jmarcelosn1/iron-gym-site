// Gerado por scripts/build-personagens.mjs — não editar manualmente.
export const PERSONAGENS = {
  "muay-thai": {
    "width": 376,
    "height": 927,
    "avif": "/assets/personagens/muay-thai-360.avif 360w, /assets/personagens/muay-thai-376.avif 376w",
    "webp": "/assets/personagens/muay-thai-360.webp 360w, /assets/personagens/muay-thai-376.webp 376w",
    "src": "/assets/personagens/muay-thai-376.webp"
  },
  "jiu-jitsu": {
    "width": 452,
    "height": 834,
    "avif": "/assets/personagens/jiu-jitsu-360.avif 360w, /assets/personagens/jiu-jitsu-452.avif 452w",
    "webp": "/assets/personagens/jiu-jitsu-360.webp 360w, /assets/personagens/jiu-jitsu-452.webp 452w",
    "src": "/assets/personagens/jiu-jitsu-452.webp"
  },
  "judo": {
    "width": 433,
    "height": 879,
    "avif": "/assets/personagens/judo-360.avif 360w, /assets/personagens/judo-433.avif 433w",
    "webp": "/assets/personagens/judo-360.webp 360w, /assets/personagens/judo-433.webp 433w",
    "src": "/assets/personagens/judo-433.webp"
  },
  "bale": {
    "width": 369,
    "height": 946,
    "avif": "/assets/personagens/bale-360.avif 360w, /assets/personagens/bale-369.avif 369w",
    "webp": "/assets/personagens/bale-360.webp 360w, /assets/personagens/bale-369.webp 369w",
    "src": "/assets/personagens/bale-369.webp"
  },
  "mma": {
    "width": 804,
    "height": 1479,
    "avif": "/assets/personagens/mma-360.avif 360w, /assets/personagens/mma-640.avif 640w",
    "webp": "/assets/personagens/mma-360.webp 360w, /assets/personagens/mma-640.webp 640w",
    "src": "/assets/personagens/mma-640.webp"
  },
  "musculacao": {
    "width": 849,
    "height": 1505,
    "avif": "/assets/personagens/musculacao-360.avif 360w, /assets/personagens/musculacao-640.avif 640w",
    "webp": "/assets/personagens/musculacao-360.webp 360w, /assets/personagens/musculacao-640.webp 640w",
    "src": "/assets/personagens/musculacao-640.webp"
  }
} as const;

export type PersonagemKey = keyof typeof PERSONAGENS;
