import { useState } from "react";
import { LINKS, VIDEOS } from "@/data/site";
import { cn } from "@/lib/utils";
import { IconPlay, IconYouTube } from "./icons";
import { Visualizador } from "./Visualizador";


/** Vídeos do canal. Só a miniatura carrega; o player do YouTube entra ao tocar. */
export function Videos() {
  const [aberto, setAberto] = useState<number | null>(null);

  return (
    <section id="videos" aria-labelledby="titulo-videos" className="py-24 lg:py-36">
      <div className="margem largura">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="titulo-videos" data-titulo className="titulo-2 max-w-[18ch]">
            A Iron em movimento. <span className="tom-2">Treinos, desafios e bastidores.</span>
          </h2>
          <a data-surge href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="botao botao-suave self-start lg:self-auto">
            <IconYouTube className="size-5" />
            Ver o canal
            <span className="sr-only"> da Iron Gym no YouTube (abre em nova aba)</span>
          </a>
        </div>

        <ul className="fileira mt-12 lg:mx-0 lg:mt-16 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12 lg:overflow-visible lg:px-0">
          {VIDEOS.map((v, i) => (
            <li key={v.id} className="w-[84%] sm:w-[52%] lg:w-auto">
              <button type="button" data-foto onClick={() => setAberto(i)} className="group block w-full text-left">
                <span className="relative block aspect-video overflow-hidden rounded-3xl bg-grafite">
                  <img
                    src={`https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`}
                    srcSet={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg 320w, https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg 1280w`}
                    sizes="(min-width: 1024px) 30vw, 84vw"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-[scale] duration-700 ease-[var(--ease-suave)] group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-ferro/20 transition-colors duration-300 group-hover:bg-transparent" />
                  <span
                    className={cn(
                      "absolute top-1/2 left-1/2 grid -translate-1/2 place-items-center rounded-full bg-ferro/65 text-giz transition-[background-color,scale] lg:bg-ferro/55 lg:backdrop-blur-md duration-300 group-hover:scale-105 group-hover:bg-brasa",
                      "size-16",
                    )}
                  >
                    <IconPlay className="size-7 translate-x-[6%]" />
                  </span>
                  <span className="etiqueta absolute right-3 bottom-3 tabular-nums">{v.duracao}</span>
                </span>
                <span className="mt-4 block text-[1.1rem] leading-snug font-medium text-giz lg:text-[1.3rem] lg:tracking-[-0.015em]">
                  {v.titulo}
                </span>
                <span className="sr-only"> (assistir vídeo)</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Visualizador
        itens={VIDEOS.map((v) => ({ tipo: "video", id: v.id, titulo: v.titulo }))}
        indice={aberto}
        onIndice={setAberto}
        onFechar={() => setAberto(null)}
      />
    </section>
  );
}
