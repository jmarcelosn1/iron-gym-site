import { FundoFoto } from "./FundoFoto";

/**
 * A Iron: a frase da casa sobre a foto do aluno na musculação. Celular: a foto é o fundo da tela
 * (rosto em cima, texto embaixo). Desktop: a foto ocupa a metade esquerda, do rosto até as mãos na
 * barra, e o texto fica à direita, no preto.
 */
export function Sobre() {
  return (
    <section id="sobre" aria-labelledby="titulo-sobre" className="relative isolate flex min-h-[100svh] items-end overflow-hidden lg:min-h-[max(100svh,48rem)] lg:items-center">
      <div aria-hidden="true" className="absolute inset-0 -z-10 lg:right-auto lg:w-[56%]">
        <FundoFoto
          foto="musculacao"
          posicao="40% 0%"
          pessoas
          sizes="(min-width: 1024px) 56vw, 100vw"
          veu="bg-gradient-to-t from-ferro via-ferro/65 to-transparent lg:bg-gradient-to-l lg:from-ferro lg:via-ferro/10 lg:to-transparent"
        />
      </div>
      <div className="margem largura py-24 lg:py-32">
        <div className="lg:ml-auto lg:max-w-[38rem]">
          <h2 id="titulo-sobre" data-acende className="text-[clamp(2.4rem,1.3rem+3.4vw,4.5rem)] leading-[1.03] font-medium tracking-[-0.042em] text-giz">
            O lugar onde a sua evolução acontece todos os dias.
          </h2>
          <p data-texto className="mt-8 max-w-[34rem] text-[1.1rem] leading-relaxed text-aco-claro lg:text-[1.2rem]">
            A Iron Gym é um espaço para quem trata o treino como compromisso. Musculação, artes marciais e balé dividem o mesmo endereço, a mesma
            energia e o mesmo padrão: fazer bem feito, todos os dias.
          </p>
        </div>
      </div>
    </section>
  );
}
