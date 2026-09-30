import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "./gsap";

/** Título: as palavras sobem de trás da máscara de cada linha, uma depois da outra (em onda). */
export function sobePalavras(el: Element | string, vars: gsap.TweenVars = {}) {
  return SplitText.create(el, {
    type: "lines,words",
    mask: "lines",
    linesClass: "linha",
    autoSplit: true,
    onSplit: (self) => gsap.from(self.words, { yPercent: 125, duration: 1.25, ease: "expo.out", stagger: 0.055, ...vars }),
  });
}

/** Parágrafo: o texto sobe linha por linha, cada linha saindo de trás de uma máscara. */
export function sobeLinhas(el: Element | string, vars: gsap.TweenVars = {}) {
  return SplitText.create(el, {
    type: "lines",
    mask: "lines",
    linesClass: "linha",
    // parágrafo não aceita aria-label: o leitor de tela lê o próprio texto das linhas
    aria: "none",
    autoSplit: true,
    onSplit: (self) => gsap.from(self.lines, { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: 0.085, ...vars }),
  });
}

/**
 * Animações de rolagem, ligadas por atributos no HTML:
 *   data-titulo   título: as palavras sobem em onda, de trás da máscara de cada linha
 *   data-texto    parágrafo: sobe linha por linha, logo depois do título
 *   data-surge    bloco curto (botão, dado de contato): sobe um pouco e aparece, em sequência
 *   data-acende   frase que "acende" palavra por palavra (acompanha a rolagem no desktop; no celular, de uma vez)
 *   data-marca    o nome da academia no rodapé: sobe inteiro, devagar
 *   data-foto     foto que se revela crescendo levemente de dentro do quadro
 *   data-parallax foto de fundo que anda um pouco mais devagar que a página (só no desktop)
 * Com "reduzir movimento" nada disso roda: o conteúdo já nasce visível.
 */
export function useAnimacoesDeRolagem(escopo: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-titulo]").forEach((el) => {
          sobePalavras(el, { scrollTrigger: { trigger: el, start: "top 86%", once: true } });
        });

        gsap.utils.toArray<HTMLElement>("[data-texto]").forEach((el) => {
          sobeLinhas(el, { delay: 0.15, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        });

        gsap.set("[data-surge]", { autoAlpha: 0, y: 22 });
        ScrollTrigger.batch("[data-surge]", {
          start: "top 92%",
          once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.09, delay: 0.1, overwrite: true }),
        });

        gsap.utils.toArray<HTMLElement>("[data-marca]").forEach((el) => {
          gsap.from(el, { yPercent: 32, autoAlpha: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 96%", once: true } });
        });

        gsap.set("[data-foto]", { autoAlpha: 0, scale: 0.96 });
        ScrollTrigger.batch("[data-foto]", {
          start: "top 94%",
          once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "expo.out", stagger: 0.08, overwrite: true, clearProps: "transform" }),
        });
      });

      // Desktop com mouse: a frase acende acompanhando a rolagem e as fotos de fundo têm parallax.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (hover: hover)", () => {
        gsap.utils.toArray<HTMLElement>("[data-acende]").forEach((el) => {
          SplitText.create(el, {
            type: "words",
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { color: "rgb(245 246 246 / 0.22)" },
                {
                  color: "rgb(245 246 246 / 1)",
                  stagger: 0.1,
                  ease: "none",
                  // termina antes de a seção encaixar na tela: parada, a frase já está toda acesa
                  scrollTrigger: { trigger: el, start: "top 88%", end: "bottom 64%", scrub: 0.4 },
                },
              ),
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -4 },
            { yPercent: 4, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });

      // Celular e tablet: nada que recalcule a cada movimento do dedo (era o que travava a rolagem).
      // A frase acende de uma vez, palavra por palavra, quando entra na tela.
      mm.add("(prefers-reduced-motion: no-preference) and ((max-width: 1023px) or (hover: none))", () => {
        gsap.utils.toArray<HTMLElement>("[data-acende]").forEach((el) => {
          SplitText.create(el, {
            type: "words",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                opacity: 0.16,
                y: 10,
                duration: 0.9,
                stagger: 0.075,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 82%", once: true },
              }),
          });
        });
      });

      // a troca de fonte muda a altura dos blocos: recalcula as posições depois que as fontes chegam
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { scope: escopo },
  );
}
