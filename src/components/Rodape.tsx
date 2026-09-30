import { LINKS, NAV } from "@/data/site";
import { LOGO } from "@/data/assets.generated";
import { assetUrl } from "@/lib/asset-url";
import { IconInstagram, IconYouTube } from "./icons";

/** Rodapé: marca, atalhos, redes e o nome da academia em tamanho grande (como na referência).
 *  Sem botão de WhatsApp: ele fica só no "Fale conosco" do topo. */
export function Rodape() {
  const redes = [
    { href: LINKS.instagram, rotulo: "Instagram", Icone: IconInstagram },
    { href: LINKS.youtube, rotulo: "YouTube", Icone: IconYouTube },
  ];
  return (
    <footer id="rodape" className="overflow-hidden pt-16 lg:pt-24">
      <div className="margem largura flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <img src={assetUrl("/assets/marca/logo-320.webp")} width={LOGO.width} height={LOGO.height} alt="Iron Gym" loading="lazy" data-surge className="h-16 w-auto self-start lg:self-auto" />
        <nav data-surge aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-2 gap-y-1 lg:gap-x-4">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="inline-flex min-h-11 items-center pr-2 text-aco-claro transition-colors hover:text-giz">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul data-surge className="flex gap-2" aria-label="Redes e contato">
          {redes.map(({ href, rotulo, Icone }) => (
            <li key={rotulo}>
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${rotulo} (abre em nova aba)`} className="botao-icone">
                <Icone className="size-5" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p
        aria-hidden="true"
        data-marca
        className="margem largura mt-14 bg-gradient-to-b from-[#3d4245] via-[#1c1f21] to-ferro bg-clip-text pb-[0.12em] text-[clamp(5rem,0.5rem+21vw,21rem)] leading-[0.9] font-semibold tracking-[-0.065em] whitespace-nowrap text-transparent select-none lg:mt-20"
      >
        Iron Gym
      </p>

      <div className="margem largura flex flex-col gap-1 py-6 text-[0.9rem] text-aco sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Iron Gym. Todos os direitos reservados.</p>
        <a href="#inicio" className="inline-flex min-h-11 items-center self-start transition-colors hover:text-giz sm:self-auto">
          Voltar ao topo
        </a>
      </div>
    </footer>
  );
}
