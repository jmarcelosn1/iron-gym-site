import type { CSSProperties } from "react";
import { ASSETS, type AssetKey } from "@/data/assets.generated";
import { assetSrcSet, assetUrl } from "@/lib/asset-url";
import { cn } from "@/lib/utils";

type Props = {
  foto: AssetKey;
  alt: string;
  /** largura em que a foto aparece (atributo sizes): o navegador baixa só o tamanho necessário */
  sizes: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  /** "agora": primeira tela; "cedo": carrega logo com prioridade baixa; "perto": quando chega perto */
  carregar?: "agora" | "cedo" | "perto";
  /** avisa quando a foto terminou de carregar (para só então mostrar, sem "piscar") */
  aoCarregar?: () => void;
};

/** Foto responsiva: AVIF, WebP ou JPG, com largura e altura reais (sem pulo de layout). */
export function Foto({ foto, alt, sizes, className, imgClassName, style, carregar = "perto", aoCarregar }: Props) {
  const a = ASSETS[foto];
  return (
    <picture className={cn("block", className)}>
      <source type="image/avif" srcSet={assetSrcSet(a.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={assetSrcSet(a.webp)} sizes={sizes} />
      <img
        src={assetUrl(a.src)}
        width={a.width}
        height={a.height}
        alt={alt}
        loading={carregar === "perto" ? "lazy" : "eager"}
        decoding={carregar === "agora" ? "sync" : "async"}
        fetchPriority={carregar === "agora" ? "high" : carregar === "cedo" ? "low" : undefined}
        className={imgClassName}
        style={style}
        onLoad={aoCarregar}
      />
    </picture>
  );
}
