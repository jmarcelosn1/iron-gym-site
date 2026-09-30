import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/** Só ícones reais e funcionais: marcas (WhatsApp, Instagram, YouTube), play, menu e fechar. */
export const IconMenu = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M5 9h14M5 15h14" />
  </svg>
);
export const IconFechar = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </svg>
);
export const IconPlay = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.1-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
  </svg>
);
export const IconWhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.43 9.43 0 0 1-4.81-1.32l-.34-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03C2.6 6.83 6.84 2.6 12.06 2.6a9.4 9.4 0 0 1 6.68 2.77 9.39 9.39 0 0 1 2.76 6.68c0 5.21-4.24 9.45-9.45 9.45Zm8.04-17.5A11.3 11.3 0 0 0 12.05.67C5.78.67.68 5.77.68 12.04c0 2 .52 3.96 1.52 5.68L.58 23.62l6.03-1.58a11.34 11.34 0 0 0 5.43 1.38h.01c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.9-3.33-8.05Z" />
  </svg>
);
export const IconInstagram = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" strokeWidth={2.4} />
  </svg>
);
export const IconYouTube = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);
export const IconSom = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M11 5 6.5 9H3.5v6h3L11 19V5Z" />
    <path d="M15.5 8.8a4.5 4.5 0 0 1 0 6.4M18.3 6a8.5 8.5 0 0 1 0 12" />
  </svg>
);
export const IconSemSom = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M11 5 6.5 9H3.5v6h3L11 19V5Z" />
    <path d="m16 9.5 5 5M21 9.5l-5 5" />
  </svg>
);
