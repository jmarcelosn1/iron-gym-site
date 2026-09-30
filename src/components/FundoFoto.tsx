import type { AssetKey } from "@/data/assets.generated";
import { cn } from "@/lib/utils";
import { Foto } from "./Foto";

type Props = {
  foto: AssetKey;
  /** enquadramento (object-position), ex.: "50% 0%" para manter os rostos */
  posicao?: string;
  /** "cheio": a seção inteira; "direita": no desktop ocupa só a metade direita e se funde no preto */
  lado?: "cheio" | "direita";
  /** véu em degradê por cima da foto (classes Tailwind), para o texto ficar legível */
  veu: string;
  /** fotos com gente: a foto começa abaixo da barra do topo e o escurecido de cima é bem leve */
  pessoas?: boolean;
  sizes?: string;
};

/**
 * Foto como fundo de seção: preenche o espaço, com véu em degradê e um parallax discreto
 * (a foto anda um pouco mais devagar que a página). A seção precisa de "relative isolate".
 */
export function FundoFoto({ foto, posicao = "50% 50%", lado = "cheio", veu, pessoas = false, sizes }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 -z-10 overflow-hidden", lado === "direita" && "lg:left-auto lg:w-[58%]", pessoas && "top-16 lg:top-20")}
    >
      {/* com gente, sem parallax: o movimento poderia cortar a cabeça de alguém */}
      <div data-parallax={pessoas ? undefined : ""} className={cn("absolute inset-x-0", pessoas ? "inset-y-0" : "-top-[6%] h-[112%]")}>
        <Foto
          foto={foto}
          alt=""
          sizes={sizes ?? (lado === "direita" ? "(min-width: 1024px) 58vw, 100vw" : "100vw")}
          className="h-full"
          imgClassName="h-full w-full object-cover"
          style={{ objectPosition: posicao }}
        />
      </div>
      <div className={cn("absolute inset-0", veu)} />
      {/* bordas fundidas no preto (sem "corte" entre seções); em cima, leve quando há rostos */}
      <div className={cn("absolute inset-x-0 top-0 bg-gradient-to-b from-ferro to-transparent", pessoas ? "h-20 via-ferro/30" : "h-32")} />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ferro to-transparent" />
    </div>
  );
}
