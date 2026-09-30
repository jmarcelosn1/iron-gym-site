/**
 * Todo o conteúdo do site num lugar só.
 *
 * Regras: só informação confirmada pela academia; cada informação aparece em uma única seção.
 * O que ainda não foi informado fica como campo vazio ("") e o site esconde até ser preenchido.
 */
import type { PersonagemKey } from "./personagens.generated";

export const CONTATO = {
  telefone: "(98) 98160-4258",
  whatsappNumero: "5598981604258",
  instagram: "@irongymslz",
  youtube: "@IronGymslz",
} as const;

/** Endereço como aparece no site (o nome da cidade fica de fora, a pedido do cliente). */
export const ENDERECO = {
  rua: "Via Coletora, 7000, Quadra 209, nº 4",
  bairro: "Parque Vitória",
  cep: "65110-000",
} as const;

export const HORARIO = {
  fechamento: "22h30",
  /** ex.: "5h30". Preenchido, vira "Aberto das 5h30 às 22h30" */
  abertura: "",
  /** ex.: "Segunda a sábado", quando confirmado */
  dias: "",
};

export const horarioTexto = () =>
  HORARIO.abertura ? `Aberto das ${HORARIO.abertura} às ${HORARIO.fechamento}` : `Aberto até ${HORARIO.fechamento}`;

const COORDENADAS = "-2.5144153,-44.2098404";

/** Link do WhatsApp com a mensagem já escrita (a academia sabe que o contato veio do site). */
export const whatsapp = (mensagem = "Olá! Vim pelo site e quero conhecer a Iron Gym.") =>
  `https://wa.me/${CONTATO.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;

export const LINKS = {
  whatsapp: whatsapp(),
  visita: whatsapp("Olá! Vim pelo site e quero agendar uma visita à Iron Gym."),
  comecar: whatsapp("Olá! Vim pelo site e quero começar a treinar na Iron Gym."),
  instagram: "https://www.instagram.com/irongymslz/",
  youtube: "https://www.youtube.com/@IronGymslz",
  // ficha da academia no Google Maps (IronGymslz) e rota até ela
  mapa: "https://maps.google.com/?cid=18259818040780579456",
  rota: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(COORDENADAS)}`,
  // mapa marcado pela coordenada: pino vermelho, sem a ficha do Google (que mostra nota e cidade)
  mapaEmbed: `https://maps.google.com/maps?q=${COORDENADAS}&z=16&hl=pt-BR&output=embed`,
} as const;

export const NAV = [
  { href: "#sobre", label: "A Iron" },
  { href: "#modalidades", label: "Modalidades" },
  { href: "#videos", label: "Vídeos" },
  { href: "#contato", label: "Contato" },
] as const;

export type Modalidade = {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  /** ilustração enviada pelo cliente, em pé sobre o tatame */
  personagem: PersonagemKey;
  alt: string;
  /** ex.: "Seg., qua. e sex. às 19h". Aparece quando preenchido */
  horarios: string;
  mensagem: string;
};

export const MODALIDADES: Modalidade[] = [
  {
    id: "musculacao",
    nome: "Musculação",
    categoria: "Força e condicionamento",
    descricao: "Força, condicionamento e evolução física construídos com constância, entre peso livre e máquinas.",
    personagem: "musculacao",
    alt: "Ilustração de uma menina de top e shorts pretos e vermelhos segurando um halter e mostrando o bíceps",
    horarios: "",
    mensagem: "Olá! Vim pelo site e quero conhecer a musculação da Iron Gym.",
  },
  {
    id: "mma",
    nome: "MMA",
    categoria: "Artes marciais mistas",
    descricao: "Trocação, quedas e chão no mesmo treino. Técnica, resistência e estratégia para quem quer o pacote completo.",
    personagem: "mma",
    alt: "Ilustração de um menino de luvas de MMA e shorts pretos e vermelhos em posição de luta",
    horarios: "",
    mensagem: "Olá! Vim pelo site e quero conhecer as aulas de MMA da Iron Gym.",
  },
  {
    id: "muay-thai",
    nome: "Muay Thai",
    categoria: "Boxe tailandês",
    descricao: "A arte das oito armas: socos, chutes, joelhadas e cotoveladas. Condicionamento, agilidade e confiança a cada round.",
    personagem: "muay-thai",
    alt: "Ilustração de um menino de luvas e shorts de Muay Thai com o joelho levantado",
    horarios: "",
    mensagem: "Olá! Vim pelo site e quero conhecer as aulas de Muay Thai da Iron Gym.",
  },
  {
    id: "jiu-jitsu",
    nome: "Jiu-Jitsu",
    categoria: "Arte suave",
    descricao: "Alavanca, controle e paciência. A arte suave ensina a vencer pela técnica, dentro e fora do tatame.",
    personagem: "jiu-jitsu",
    alt: "Ilustração de uma menina de quimono preto e faixa branca em base de Jiu-Jitsu",
    horarios: "",
    mensagem: "Olá! Vim pelo site e quero conhecer as aulas de Jiu-Jitsu da Iron Gym.",
  },
  {
    id: "judo",
    nome: "Judô",
    categoria: "Caminho suave",
    descricao: "Projeções, equilíbrio e respeito. Uma escola de disciplina que desenvolve corpo e mente ao mesmo tempo.",
    personagem: "judo",
    alt: "Ilustração de um menino de judogi branco e faixa azul em posição de pegada",
    horarios: "",
    mensagem: "Olá! Vim pelo site e quero conhecer as aulas de Judô da Iron Gym.",
  },
  {
    id: "bale",
    nome: "Balé",
    categoria: "Dança clássica",
    descricao: "Postura, leveza e musicalidade. A dança clássica constrói força, flexibilidade e disciplina a cada aula.",
    personagem: "bale",
    alt: "Ilustração de uma bailarina de collant e tutu rosa na ponta dos pés, com um laço no cabelo",
    horarios: "",
    mensagem: "Olá! Vim pelo site e quero conhecer as aulas de Balé da Iron Gym.",
  },
];

export type Video = { id: string; titulo: string; duracao: string };

/** Vídeos do canal da academia no YouTube (o primeiro é o institucional). */
export const VIDEOS: Video[] = [
  { id: "XkE-C3cUgrs", titulo: "O lugar onde a sua evolução acontece todos os dias", duracao: "5:45" },
  { id: "GpAwhBC8oDc", titulo: "Copa Iron Fight", duracao: "1:43:48" },
  { id: "dGbcjDB6RHY", titulo: "A importância de uma academia segura", duracao: "1:40" },
];

/** O desafio da casa (seção própria, com a foto do martelo). */
export const VIDEO_MARTELO: Video = { id: "j-ovz_Ps374", titulo: "Desafio Martelo do Thor", duracao: "13:34" };
