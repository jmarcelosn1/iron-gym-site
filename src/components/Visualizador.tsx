import { useEffect, useRef } from "react";
import type { AssetKey } from "@/data/assets.generated";
import { Foto } from "./Foto";
import { IconFechar } from "./icons";

export type ItemVisualizador = { tipo: "foto"; foto: AssetKey; titulo: string; alt: string } | { tipo: "video"; id: string; titulo: string };

type Props = {
  itens: ItemVisualizador[];
  /** índice aberto; null = fechado */
  indice: number | null;
  onIndice: (i: number) => void;
  onFechar: () => void;
};

/**
 * Tela cheia para ver foto ou vídeo (<dialog>: foco preso, Esc fecha, o foco volta para quem abriu).
 * Troca com as setas do teclado, arrastando o dedo ou pelos botões Anterior/Próxima.
 * O player do YouTube (youtube-nocookie) só existe enquanto está aberto.
 */
export function Visualizador({ itens, indice, onIndice, onFechar }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const toque = useRef<number | null>(null);
  const aberto = indice !== null;
  const item = aberto ? itens[indice] : null;
  const varios = itens.length > 1;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberto && !d.open) {
      d.showModal();
      document.body.classList.add("travado");
    } else if (!aberto && d.open) d.close();
  }, [aberto]);

  const ir = (passo: number) => indice !== null && onIndice((indice + passo + itens.length) % itens.length);

  return (
    <dialog
      ref={ref}
      className="visualizador"
      aria-label={item?.titulo ?? "Visualizador"}
      onClose={() => {
        document.body.classList.remove("travado");
        onFechar();
      }}
      onKeyDown={(e) => {
        if (!varios) return;
        if (e.key === "ArrowRight") ir(1);
        if (e.key === "ArrowLeft") ir(-1);
      }}
      onPointerDown={(e) => (toque.current = e.clientX)}
      onPointerUp={(e) => {
        if (toque.current === null || !varios) return;
        const dx = e.clientX - toque.current;
        toque.current = null;
        if (Math.abs(dx) > 60) ir(dx < 0 ? 1 : -1);
      }}
    >
      {item && (
        <div className="margem flex h-full flex-col pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex h-16 shrink-0 items-center justify-between gap-4 lg:h-20">
            <p className="truncate font-medium text-giz">{item.titulo}</p>
            <button type="button" onClick={() => ref.current?.close()} className="botao-icone" autoFocus>
              <IconFechar className="size-6" />
              <span className="sr-only">Fechar</span>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center">
            {item.tipo === "foto" ? (
              <Foto
                key={item.foto}
                foto={item.foto}
                alt={item.alt}
                carregar="agora"
                sizes="100vw"
                className="flex h-full min-h-0 items-center justify-center"
                imgClassName="max-h-full w-auto max-w-full rounded-3xl object-contain select-none"
              />
            ) : (
              <div className="w-full max-w-[min(100%,calc((100svh-10rem)*16/9))]">
                <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-grafite">
                  <iframe
                    key={item.id}
                    src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0&playsinline=1`}
                    title={item.titulo}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {varios && (
            <div className="flex shrink-0 justify-center gap-2 pt-5">
              <button type="button" onClick={() => ir(-1)} className="botao botao-suave min-h-11 px-5 text-[0.95rem]">
                Anterior
              </button>
              <button type="button" onClick={() => ir(1)} className="botao botao-suave min-h-11 px-5 text-[0.95rem]">
                Próxima
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
