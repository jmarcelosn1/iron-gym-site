# Iron Gym: spec do site (versão 2, refeita do zero)

Data: 29/09/2026. Referência pedida pelo cliente: thesimplegym.com.br, nas cores da Iron Gym.
Título da abertura aprovado: "Seu limite é só o começo."

## Regras do cliente (valem para qualquer mudança)

1. **Cada assunto aparece uma vez só.** Horário, endereço e canais ficam só no Contato; a área de lutas (tatame) só aparece nas Modalidades.
2. **Fotos como fundo de seção**, com véu em degradê. Nada de fileira de fotos pequenas.
3. **Minimalista e elegante, sem "símbolos de IA":** nada de travessões no texto, setas, pontos separadores, contadores, etiquetas em caixa alta, ícones inventados, botões quadrados ou contornos.
4. Botões em pílula: vermelho em degradê (ação principal) ou vidro fosco (secundária).
5. Fotos com as cores originais. O nome da cidade não aparece no texto do site (só no endereço postal dos dados estruturados, para o Google).
6. Só informação confirmada. Sem preço, plano, avaliação ou número. Campos vazios em `src/data/site.ts` (horário de abertura, dias, horários das aulas) aparecem sozinhos quando preenchidos.

## Estrutura

| Seção | Fundo | Conteúdo |
|---|---|---|
| Abertura | vídeo "Conheça a Iron Gym" do canal, de 2:00 em diante, sem som e em loop (reserva: o vídeo gravado na academia) | "Seu limite é só o começo." e uma frase |
| A Iron | aluno na musculação | "O lugar onde a sua evolução acontece todos os dias." (acende palavra por palavra) + parágrafo |
| Modalidades | a foto inteira da área de lutas, com os 6 personagens em pé no tatame | tocar no personagem acende ele e mostra nome, descrição e "Quero conhecer" |
| Desafio Martelo do Thor | martelo (metade direita no desktop) | "Quanto tempo você aguenta?" + "Assistir ao desafio" (vídeo do canal) |
| Vídeos | preto | 3 vídeos do canal (institucional, Copa Iron Fight, Academia segura) |
| Contato | a equipe (rostos inteiros) | endereço, horário, telefone, redes, "Como chegar", mapa do Google com pino vermelho (só mexe depois de um toque) |
| Rodapé | preto | atalhos, redes, "Iron Gym" em tamanho grande, direitos |

WhatsApp num lugar só: "Fale conosco" no topo (fixo). Nas modalidades, "Quero conhecer" com a mensagem da modalidade.

No ar: https://iron-gym.joaomarcelo7730.workers.dev (`npm run deploy`).

## Visual

- Cores: ferro #070808 (fundo), grafite #111314, aço #8B9197, aço-claro #C5CACF, giz #F5F6F6, brasa #D70A1E (logo).
- Tipo: Host Grotesk 400/500/600, títulos em frase comum, peso médio, espaçamento justo, dois tons (branco + branco translúcido).
- Cantos arredondados (fotos 24px, botões em pílula), sem bordas.
- Movimento: títulos sobem palavra por palavra de trás da máscara de cada linha; parágrafos sobem linha por linha; dados e botões surgem em sequência; a frase da casa acende com a rolagem; o nome no rodapé sobe inteiro; parallax leve nos fundos (só desktop). "Reduzir movimento" desliga tudo.
- Sem brilho vermelho decorativo: o vermelho fica nos botões e aos pés do personagem escolhido.

## Vídeo da abertura

- O `<video id="video-abertura">` fica no `app.html`, fora do React, já com `autoplay muted playsinline`: começa a tocar enquanto o resto carrega. O `Hero.tsx` só cuida do som, de pausar fora da tela e do caso abaixo.
- Navegador que não deixa tocar sozinho (modo de pouca energia do iPhone, economia de bateria ou de dados, navegador do Instagram/WhatsApp): entra a foto do letreiro "Iron Gym" na parede de folhas (`letreiro`, de `2.webp`) e o botão vira "Assistir ao vídeo". Um toque faz o vídeo começar e a foto sai. A foto só é baixada nesse caso.

## Arquivos

- `src/data/site.ts`: todo o conteúdo.
- `src/components/`: Header, Hero, Sobre, Modalidades, Disciplina, Videos, Contato, Rodape, FundoFoto, Visualizador, Foto, icons.
- `npm run assets`: fotos (`build-assets`), personagens (`build-personagens`) e vídeo (`build-video`).
- QA: `npm run qa` (Chromium e WebKit, 3 larguras), `qa:responsivo` (11 tamanhos), `qa:acessibilidade` (axe + contraste real sobre foto), `qa:capturas`.
