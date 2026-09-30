import { useState } from "react";
import { VIDEO_MARTELO } from "@/data/site";
import { FundoFoto } from "./FundoFoto";
import { IconPlay } from "./icons";
import { Visualizador } from "./Visualizador";

/**
 * O desafio da casa: o Martelo do Thor (vídeo no canal da academia). A foto do martelo é o fundo:
 * no celular ocupa a tela inteira, no desktop a metade direita, fundida no preto.
 */
export function Martelo() {
  const [aberto, setAberto] = useState<number | null>(null);

  return (
    <section id="desafio" aria-labelledby="titulo-desafio" className="relative isolate flex min-h-[100svh] items-end overflow-hidden lg:min-h-[max(90svh,44rem)] lg:items-center">
      <FundoFoto
        foto="martelo"
        posicao="50% 40%"
        lado="direita"
        veu="bg-gradient-to-t from-ferro via-ferro/80 to-ferro/15 lg:bg-gradient-to-r lg:from-ferro lg:via-ferro/20 lg:to-transparent"
      />
      <div className="margem largura py-24 lg:py-32">
        <div className="max-w-[40rem]">
          <h2 id="titulo-desafio" data-titulo className="titulo-2">
            Desafio Martelo do Thor. <span className="tom-2">Quanto tempo você aguenta?</span>
          </h2>
          <p data-texto className="mt-6 max-w-[30rem] text-[1.1rem] leading-relaxed lg:text-[1.2rem]">
            O desafio da casa: segurar o martelo suspenso pelo maior tempo possível. Veja quem já encarou.
          </p>
          <div data-surge className="mt-8">
            <button type="button" onClick={() => setAberto(0)} className="botao botao-suave">
              <IconPlay className="size-5" />
              Assistir ao desafio
            </button>
          </div>
        </div>
      </div>

      <Visualizador itens={[{ tipo: "video", id: VIDEO_MARTELO.id, titulo: VIDEO_MARTELO.titulo }]} indice={aberto} onIndice={setAberto} onFechar={() => setAberto(null)} />
    </section>
  );
}
