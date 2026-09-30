import { useEffect, useRef, useState } from "react";
import { LINKS, NAV } from "@/data/site";
import { LOGO } from "@/data/assets.generated";
import { assetUrl } from "@/lib/asset-url";
import { cn } from "@/lib/utils";
import { IconFechar, IconMenu, IconWhatsApp } from "./icons";

function Logo({ className }: { className?: string }) {
  return (
    <img
      src={assetUrl("/assets/marca/logo-160.webp")}
      srcSet={`${assetUrl("/assets/marca/logo-160.webp")} 160w, ${assetUrl("/assets/marca/logo-320.webp")} 320w`}
      sizes="64px"
      width={LOGO.width}
      height={LOGO.height}
      alt=""
      className={className}
    />
  );
}

/** Topo fixo: transparente sobre o vídeo, fundo escuro com desfoque depois que a página rola. */
export function Header() {
  const [rolou, setRolou] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const abrir = () => {
    menu.current?.showModal();
    document.body.classList.add("travado");
  };
  const fechar = () => menu.current?.close();

  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter] duration-500", rolou && "bg-ferro/92 lg:bg-ferro/75 lg:backdrop-blur-xl")}>
      <div className="margem largura flex h-16 items-center justify-between gap-4 lg:h-20">
        <a href="#inicio" className="flex shrink-0 items-center rounded-xl" aria-label="Iron Gym, voltar ao início">
          <Logo className="h-11 w-auto lg:h-12" />
        </a>

        <nav aria-label="Seções" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] text-aco-claro transition-colors hover:text-giz">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="botao botao-brasa min-h-11 px-5 text-[0.95rem]">
            <IconWhatsApp className="size-[1.05rem]" />
            Fale conosco
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
          <button type="button" onClick={abrir} aria-haspopup="dialog" aria-controls="menu" className="botao-icone lg:hidden">
            <IconMenu className="size-6" />
            <span className="sr-only">Abrir menu</span>
          </button>
        </div>
      </div>

      <dialog ref={menu} id="menu" aria-label="Menu" onClose={() => document.body.classList.remove("travado")} className="visualizador">
        <div className="margem flex min-h-full flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="flex h-16 items-center justify-between gap-2">
            <Logo className="h-11 w-auto" />
            <div className="flex items-center gap-2">
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="botao botao-brasa min-h-11 px-5 text-[0.95rem]">
                <IconWhatsApp className="size-[1.05rem]" />
                Fale conosco
                <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
              </a>
              <button type="button" onClick={fechar} className="botao-icone" autoFocus>
                <IconFechar className="size-6" />
                <span className="sr-only">Fechar menu</span>
              </button>
            </div>
          </div>
          <nav aria-label="Seções" className="flex flex-1 items-center">
            <ul className="flex flex-col gap-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} onClick={fechar} className="inline-flex min-h-14 items-center text-[2.75rem] leading-none font-medium tracking-[-0.04em] text-giz">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </header>
  );
}
