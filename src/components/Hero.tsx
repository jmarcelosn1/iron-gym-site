import { useEffect, useRef, useState } from "react";
import { sobeLinhas, sobePalavras } from "@/lib/animacoes";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Foto } from "./Foto";
import { IconPlay, IconSemSom, IconSom } from "./icons";

/**
 * Abertura: o trecho de 2:00 a 3:30 do vídeo "Conheça a Iron Gym" (canal da academia), servido pelo
 * próprio site para começar na hora. Vertical no celular em pé, horizontal no resto. Começa sem som
 * (regra dos navegadores para tocar sozinho); o botão "Ativar som" liga o áudio.
 *
 * Para rodar direto no celular:
 *   - o <video id="video-abertura"> está no próprio app.html, fora do React: começa a baixar e a tocar
 *     enquanto o código do site ainda carrega, já com autoplay, muted e playsinline no HTML (sem o
 *     atributo "muted" o Safari do iPhone recusa tocar sozinho);
 *   - toca mesmo com "reduzir movimento" ligado (é o vídeo da academia, não um efeito da página).
 * Quando o navegador não deixa o vídeo tocar sozinho (modo de pouca energia do iPhone, economia de
 * bateria ou de dados, navegador do Instagram/WhatsApp), em vez do vídeo parado entra a foto do
 * letreiro "Iron Gym" na parede de folhas, e o botão vira "Assistir ao vídeo". Um toque no botão
 * (ou em qualquer lugar da tela) faz o vídeo começar, e a foto sai.
 * Fora da tela o vídeo pausa (no celular, vídeo tocando atrás da página pesa na rolagem).
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const [tocando, setTocando] = useState(false);
  const [som, setSom] = useState(false);
  const [barrado, setBarrado] = useState(false);
  const [usaFoto, setUsaFoto] = useState(false);
  const [fotoPronta, setFotoPronta] = useState(false);

  useEffect(() => {
    const v = document.getElementById("video-abertura") as HTMLVideoElement | null;
    if (!v) return;
    video.current = v;
    v.muted = true;
    v.defaultMuted = true;
    let naTela = true;
    const barrar = () => {
      setBarrado(true);
      setUsaFoto(true);
    };
    const tocar = () => {
      if (!naTela) return;
      Promise.resolve(v.play()).catch((e: unknown) => {
        if ((e as DOMException | null)?.name === "NotAllowedError") barrar();
      });
    };
    // bloqueado pelo navegador: o primeiro toque/clique/tecla em qualquer lugar faz tocar
    const primeiroToque = () => tocar();
    const eventos = ["touchend", "pointerup", "click", "keydown"] as const;
    eventos.forEach((ev) => window.addEventListener(ev, primeiroToque, { passive: true }));
    const aoTocar = () => {
      setTocando(true);
      setBarrado(false);
      eventos.forEach((ev) => window.removeEventListener(ev, primeiroToque));
    };
    v.addEventListener("playing", aoTocar);
    v.addEventListener("loadeddata", tocar);
    v.addEventListener("canplay", tocar);
    if (!v.paused && v.readyState > 2) aoTocar();
    tocar();
    // rede de segurança: o navegador nem respondeu ao pedido e o vídeo continua parado
    const vigia = window.setTimeout(() => {
      if (v.paused && naTela) barrar();
    }, 2500);
    const io = new IntersectionObserver(([e]) => {
      naTela = e.isIntersecting;
      if (naTela) tocar();
      else v.pause();
    });
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      window.clearTimeout(vigia);
      eventos.forEach((ev) => window.removeEventListener(ev, primeiroToque));
      v.removeEventListener("playing", aoTocar);
      v.removeEventListener("loadeddata", tocar);
      v.removeEventListener("canplay", tocar);
    };
  }, []);

  const parado = barrado && !tocando;

  const aoBotao = () => {
    const v = video.current;
    if (!v) return;
    if (parado) {
      v.play().catch(() => {});
      return;
    }
    v.muted = som;
    if (!som) v.volume = 0.8;
    setSom(!som);
  };

  // Entrada: o título sobe palavra por palavra, o texto linha por linha, o botão por último.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        sobePalavras("[data-hero-titulo]", { duration: 1.4, stagger: 0.085, delay: 0.25 });
        sobeLinhas("[data-hero-texto]", { delay: 0.85 });
        gsap.from("[data-hero-surge]", { autoAlpha: 0, y: 16, duration: 1.1, ease: "expo.out", delay: 1.2 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="inicio" aria-labelledby="titulo-inicio" className="relative isolate h-[100svh] min-h-[36rem] overflow-hidden">
      {/* o vídeo em si está no app.html (#video-abertura), atrás desta seção */}

      {/* vídeo barrado pelo navegador: o letreiro da academia no lugar (só carrega nesse caso) */}
      {usaFoto && (
        <div
          aria-hidden="true"
          className={cn("absolute inset-0 -z-10 bg-ferro transition-opacity duration-700 motion-reduce:transition-none", parado && fotoPronta ? "opacity-100" : "opacity-0")}
        >
          {/* em pé: o letreiro ocupa o alto da tela, acima do título. Deitado: inteiro, encostado à direita */}
          <div className="absolute top-0 right-0 left-0 h-[72%] landscape:left-auto landscape:aspect-[2/3] landscape:h-full">
            <Foto
              foto="letreiro"
              alt=""
              sizes="(orientation: landscape) 67vh, 100vw"
              carregar="agora"
              aoCarregar={() => setFotoPronta(true)}
              className="h-full"
              imgClassName="h-full w-full object-cover"
              style={{ objectPosition: "42% 55%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ferro via-transparent to-ferro/45 landscape:bg-gradient-to-r landscape:from-ferro landscape:via-ferro/10 landscape:to-transparent" />
          </div>
        </div>
      )}

      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ferro via-ferro/40 to-ferro/50" />

      <div className="margem largura flex h-full flex-col justify-end pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:pb-16">
        <div className="grid gap-7 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1 id="titulo-inicio" data-hero-titulo className="titulo-1 max-w-[11ch] lg:col-span-8">
            Seu limite é só o começo.
          </h1>
          <div className="lg:col-span-4 lg:pb-3">
            <p data-hero-texto className="max-w-[26rem] text-[1.08rem] leading-relaxed text-aco-claro lg:text-[1.15rem]">
              Estrutura, intensidade e um ambiente preparado para quem decidiu evoluir de verdade.
            </p>
            {/* vídeo tocando: liga e desliga o som. Vídeo barrado pelo navegador: começa o vídeo. */}
            <div data-hero-surge className="mt-5">
              <button
                type="button"
                onClick={aoBotao}
                aria-pressed={parado ? undefined : som}
                tabIndex={tocando || parado ? 0 : -1}
                aria-hidden={!(tocando || parado)}
                className={cn(
                  "botao botao-suave min-h-11 gap-2 px-4 text-[0.95rem] transition-opacity duration-700",
                  tocando || parado ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                {parado ? <IconPlay className="size-4" /> : som ? <IconSom className="size-5" /> : <IconSemSom className="size-5" />}
                {parado ? "Assistir ao vídeo" : som ? "Tirar o som" : "Ativar som"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
