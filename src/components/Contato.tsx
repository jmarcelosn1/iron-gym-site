import { useState } from "react";
import { CONTATO, ENDERECO, HORARIO, LINKS, horarioTexto } from "@/data/site";
import { Foto } from "./Foto";
import { FundoFoto } from "./FundoFoto";
import { IconInstagram, IconYouTube } from "./icons";

/**
 * Contato: a equipe em cima (todos os rostos à vista), depois endereço, horário, canais e o mapa.
 * Único lugar com essas informações. O WhatsApp em si fica no "Fale conosco" do topo.
 */
export function Contato() {
  const [mapaAtivo, setMapaAtivo] = useState(false);
  const item = "text-[0.95rem] text-aco";
  const valor = "mt-1.5 text-[1.15rem] leading-relaxed text-giz";

  const titulo = (
    <h2 id="titulo-contato" data-titulo className="titulo-2 max-w-[18ch]">
      Venha treinar com a gente. <span className="tom-2">Estamos no Parque Vitória.</span>
    </h2>
  );

  return (
    <section id="contato" aria-labelledby="titulo-contato" className="pb-24 lg:pb-40">
      {/* celular: a foto inteira da equipe (ninguém cortado) e o título logo abaixo */}
      <div className="lg:hidden">
        <div className="relative">
          <Foto
            foto="equipe"
            alt="Equipe da Iron Gym de uniforme preto, em frente à parede verde com o letreiro da academia"
            sizes="100vw"
            imgClassName="block h-auto w-full"
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ferro to-transparent" />
        </div>
        <div className="margem -mt-6">{titulo}</div>
      </div>

      {/* desktop: a equipe como fundo, com os rostos no alto e o título por cima dos uniformes */}
      <div className="relative isolate hidden min-h-[max(82svh,40rem)] items-end overflow-hidden lg:flex">
        <FundoFoto foto="equipe" posicao="50% 0%" pessoas veu="bg-gradient-to-t from-ferro via-ferro/30 to-transparent" />
        <div className="margem largura pb-6">{titulo}</div>
      </div>

      <div className="margem largura mt-10 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <dl className="grid gap-7 sm:grid-cols-2">
            <div data-surge>
              <dt className={item}>Endereço</dt>
              <dd className={valor}>
                {ENDERECO.rua}
                <br />
                {ENDERECO.bairro}
                <br />
                <span className="text-aco-claro">CEP {ENDERECO.cep}</span>
              </dd>
            </div>
            <div data-surge>
              <dt className={item}>Horário</dt>
              <dd className={valor}>
                {horarioTexto()}
                {HORARIO.dias && <span className="block text-aco-claro">{HORARIO.dias}</span>}
              </dd>
            </div>
            <div data-surge>
              <dt className={item}>Telefone e WhatsApp</dt>
              <dd className={valor}>
                <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center transition-colors hover:text-aco-claro">
                  {CONTATO.telefone}
                  <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
                </a>
              </dd>
            </div>
            <div data-surge>
              <dt className={item}>Redes</dt>
              <dd className="mt-1.5 flex gap-2">
                <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${CONTATO.instagram} (abre em nova aba)`} className="botao-icone">
                  <IconInstagram className="size-5" />
                </a>
                <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label={`YouTube ${CONTATO.youtube} (abre em nova aba)`} className="botao-icone">
                  <IconYouTube className="size-5" />
                </a>
              </dd>
            </div>
          </dl>

          <div data-surge className="mt-10">
            <a href={LINKS.rota} target="_blank" rel="noopener noreferrer" className="botao botao-suave">
              Como chegar
              <span className="sr-only"> (abre o Google Maps em nova aba)</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div data-foto className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-grafite sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[28rem]">
            <iframe
              title="Mapa com a localização da Iron Gym na Via Coletora, Parque Vitória"
              src={LINKS.mapaEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
              style={{ pointerEvents: mapaAtivo ? "auto" : "none" }}
            />
            {/* o mapa só mexe depois de um toque de propósito: rolar a página por cima dele não dá zoom */}
            {!mapaAtivo && (
              <button type="button" onClick={() => setMapaAtivo(true)} className="absolute inset-0 flex cursor-pointer items-end justify-center p-4">
                <span className="etiqueta">Toque para mexer no mapa</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
