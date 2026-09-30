import { useRef } from "react";
import { Contato } from "./components/Contato";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Martelo } from "./components/Martelo";
import { Modalidades } from "./components/Modalidades";
import { Rodape } from "./components/Rodape";
import { Sobre } from "./components/Sobre";
import { Videos } from "./components/Videos";
import { useAnimacoesDeRolagem } from "./lib/animacoes";

/**
 * Uma seção por assunto, sem repetir informação:
 * abertura (vídeo), a Iron, modalidades, desafio do martelo, vídeos, contato.
 * O WhatsApp fica num lugar só: o "Fale conosco" do topo (fixo). Nas modalidades, "Quero conhecer".
 */
export default function App() {
  const ref = useRef<HTMLDivElement>(null);
  useAnimacoesDeRolagem(ref);

  return (
    <div ref={ref}>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-giz focus:px-5 focus:py-3 focus:font-medium focus:text-ferro"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Sobre />
        <Modalidades />
        <Martelo />
        <Videos />
        <Contato />
      </main>
      <Rodape />
    </div>
  );
}
