# Iron Gym: site da academia

Site de uma página da **Iron Gym**, academia de musculação, lutas (MMA, Muay Thai, Jiu-Jitsu e Judô) e balé no Parque Vitória.

**[Ver no ar](https://iron-gym.joaomarcelo7730.workers.dev)**

## O que tem no site

| Seção | Conteúdo |
|---|---|
| Abertura | Trecho do vídeo "Conheça a Iron Gym" tocando sozinho, com botão para ligar o som |
| A Iron | A frase da casa sobre a foto do aluno na musculação |
| Modalidades | A área de lutas com os seis personagens em pé no tatame; tocar em um mostra a modalidade |
| Desafio Martelo do Thor | O desafio da casa, com o vídeo do canal |
| Vídeos | Três vídeos do canal da academia no YouTube |
| Contato | Endereço, horário, telefone, redes e mapa |

Cada assunto aparece uma vez só. O WhatsApp fica no "Fale conosco" do topo e no "Quero conhecer" de cada modalidade.

Quando o navegador não deixa o vídeo da abertura tocar sozinho (modo de pouca energia do iPhone, economia de bateria ou de dados), entra a foto do letreiro da academia no lugar, com o botão "Assistir ao vídeo".

## Tecnologias

- React 19, TypeScript e Vite 8
- Tailwind CSS 4
- GSAP (ScrollTrigger e SplitText) nas animações de texto e rolagem
- `vite-plugin-singlefile`: o JavaScript e o CSS vão embutidos no `index.html` final
- sharp e ffmpeg para preparar fotos e vídeo
- Cloudflare Workers (arquivos estáticos) na hospedagem

## Como rodar

```bash
npm install
```

Copie `.env.example` para `.env` (o endereço público do site, usado nas tags de compartilhamento).

```bash
npm run dev
```

O servidor de desenvolvimento abre em `http://localhost:5181/app.html`.

```bash
npm run build
```

Gera `dist/index.html`, que abre com dois cliques ou em qualquer hospedagem.

## Onde mexer

- `src/data/site.ts`: todo o conteúdo (contato, endereço, horário, modalidades, vídeos). Campos vazios, como o horário de abertura e os horários das aulas, aparecem no site quando forem preenchidos.
- `src/components/`: uma seção por arquivo.
- `src/lib/animacoes.ts`: as animações de rolagem.
- `app.html`: a página, com o vídeo da abertura e os dados para o Google.
- `source-assets/originais/`: fotos originais. `npm run assets` gera as versões do site em `public/assets`.
- `docs/specs/`: as regras de conteúdo e de visual combinadas com o cliente.

O vídeo-fonte da abertura (`source-assets/originais/conheca-iron-gym.mp4`, 87 MB) fica fora do repositório. Os trechos já prontos estão em `public/assets/video`. Para gerar de novo, coloque o vídeo na pasta e rode `npm run abertura`.

## Testes

```bash
npm run qa
```

```bash
npm run qa:responsivo
```

```bash
npm run qa:acessibilidade
```

Os testes abrem o site no Chromium e no WebKit com o Playwright. Eles esperam o build servido em `http://localhost:4184/` (`node scripts/serve-dist.mjs`); `npm run qa` aceita o endereço como argumento.

## Publicar

```bash
npm run deploy
```

Faz o build e envia a pasta `dist` para o Cloudflare Workers (`wrangler.jsonc`).

## Desenvolvimento com agentes de IA

O site foi construído com um agente de código (Claude Code) guiado por especificação. As regras combinadas com o cliente ficam em `docs/specs/2026-09-29-iron-gym-design.md` (cada assunto aparece uma vez só, só informação confirmada, direção visual, estrutura seção por seção) e valem para qualquer mudança futura. O fluxo é: registrar a regra na spec, deixar o agente implementar, e conferir com `npm run build` e no navegador antes de publicar.
