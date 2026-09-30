import { useRef, useState } from "react";
import { MODALIDADES, whatsapp } from "@/data/site";
import { PERSONAGENS } from "@/data/personagens.generated";
import { assetSrcSet, assetUrl } from "@/lib/asset-url";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Foto } from "./Foto";

/**
 * Posição de cada personagem no tatame (em % do palco): centro x e onde ficam os pés (y).
 * Alternar a profundidade (pés mais acima = mais ao fundo) dá o jeito de foto de equipe.
 */
const LUGAR = [
  { x: 11.5, pes: 97 },
  { x: 27, pes: 92 },
  { x: 42.5, pes: 97 },
  { x: 57.5, pes: 92 },
  { x: 73, pes: 97 },
  { x: 88.5, pes: 92 },
];

/**
 * Modalidades: a foto inteira da área de lutas é o palco (carrega uma vez só) e os seis
 * personagens ficam em pé no tatame. Tocar num personagem acende ele e troca o texto ao lado.
 */
export function Modalidades() {
  const [ativa, setAtiva] = useState(0);
  const palco = useRef<HTMLDivElement>(null);
  const m = MODALIDADES[ativa];

  // quando o palco aparece, cada personagem dá um pulinho em sequência (uma vez): convite ao toque
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-personagem]", {
          keyframes: [
            { y: -14, duration: 0.22, ease: "power2.out" },
            { y: 0, duration: 0.38, ease: "bounce.out" },
          ],
          stagger: 0.11,
          delay: 0.4,
          scrollTrigger: { trigger: palco.current, start: "top 70%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: palco },
  );

  return (
    <section id="modalidades" aria-labelledby="titulo-modalidades" className="py-24 lg:py-36">
      <div className="margem largura">
        <h2 id="titulo-modalidades" data-titulo className="titulo-2 max-w-[20ch]">
          Seis modalidades. <span className="tom-2">Um só objetivo: evoluir.</span>
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-8">
          {/* palco: a área de lutas inteira, com os personagens em pé no tatame */}
          <div className="min-w-0 lg:order-2 lg:col-span-6 lg:col-start-7">
            <p data-surge className="mb-4 text-[0.95rem] text-aco lg:hidden">Toque em um personagem para conhecer a modalidade.</p>
            <div ref={palco} data-foto className="relative mx-auto aspect-[1155/1362] w-full max-w-[36rem] overflow-hidden rounded-3xl bg-grafite select-none">
              <Foto
                foto="lutas"
                alt="Área de lutas da Iron Gym: tatame azul e preto, ringue ao fundo, sacos de pancada e equipamentos na parede"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="absolute inset-0 h-full"
                imgClassName="h-full w-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ferro/60 via-transparent to-ferro/30" />

              <ul aria-label="Modalidades" className="absolute inset-0">
                {MODALIDADES.map((x, i) => {
                  const p = PERSONAGENS[x.personagem];
                  const on = ativa === i;
                  const lugar = LUGAR[i];
                  return (
                    <li
                      key={x.id}
                      className="absolute h-[36%] -translate-x-1/2 -translate-y-full"
                      style={{ left: `${lugar.x}%`, top: `${lugar.pes}%`, zIndex: on ? 20 : lugar.pes === 97 ? 10 : 5 }}
                    >
                      {/* brilho vermelho aos pés do escolhido */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute -bottom-[5%] left-1/2 h-[16%] w-[170%] -translate-x-1/2 rounded-[50%] transition-opacity duration-500",
                          on ? "opacity-100" : "opacity-0",
                        )}
                        style={{ background: "radial-gradient(closest-side, rgb(235 20 40 / 0.95), rgb(215 10 30 / 0.35) 60%, transparent)" }}
                      />
                      <button
                        type="button"
                        onClick={() => setAtiva(i)}
                        aria-pressed={on}
                        aria-label={x.nome}
                        data-personagem
                        className="group relative block h-full cursor-pointer rounded-2xl focus-visible:outline-offset-4"
                      >
                        <picture className="block h-full">
                          <source type="image/avif" srcSet={assetSrcSet(p.avif)} sizes="(min-width: 1024px) 9vw, 22vw" />
                          <source type="image/webp" srcSet={assetSrcSet(p.webp)} sizes="(min-width: 1024px) 9vw, 22vw" />
                          <img
                            src={assetUrl(p.src)}
                            width={p.width}
                            height={p.height}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            className={cn(
                              "pointer-events-none h-full w-auto max-w-none origin-bottom drop-shadow-[0_14px_18px_rgb(0_0_0/0.55)] transition-[scale,translate,filter] duration-500 ease-[var(--ease-suave)] motion-reduce:transition-none",
                              on ? "scale-[1.16] brightness-100 saturate-100" : "brightness-[0.38] saturate-[0.6] group-hover:-translate-y-1.5 group-hover:brightness-90 group-hover:saturate-100",
                            )}
                          />
                        </picture>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* a modalidade escolhida */}
          <div data-surge className="min-w-0 lg:order-1 lg:col-span-5" aria-live="polite">
            <p className="hidden text-[0.95rem] text-aco lg:block">Toque em um personagem para conhecer a modalidade.</p>
            {/* a cada troca, as linhas entram uma depois da outra */}
            <div key={m.id} className="troca lg:mt-8">
              <p className="text-[0.95rem] text-aco">{m.categoria}</p>
              <h3 className="mt-1 text-[clamp(2.6rem,1.6rem+3vw,4.75rem)] leading-none font-medium tracking-[-0.045em] text-giz">{m.nome}</h3>
              <p className="mt-5 max-w-[30rem] text-[1.1rem] leading-relaxed text-aco-claro lg:text-[1.15rem]">{m.descricao}</p>
              {m.horarios && <p className="mt-3 text-[0.95rem] font-medium text-giz">Horários: {m.horarios}</p>}
              <a href={whatsapp(m.mensagem)} target="_blank" rel="noopener noreferrer" className="botao botao-brasa mt-7">
                Quero conhecer
                <span className="sr-only"> {m.nome} pelo WhatsApp (abre em nova aba)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
