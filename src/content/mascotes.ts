export type MascoteImage = {
  file: string;
  alt: string;
  title?: string;
  notes?: string;
};

export type Mascote = {
  id: "boris" | "laya" | "irina";
  nome: string;
  funcao: string;
  ativo: string;
  imagens: MascoteImage[];
};

export const MASCOTES_BANNER = "/mascotes/conjunta/crset_mascotes_conjunta.png";

export const MASCOTES: Mascote[] = [
  {
    id: "boris",
    nome: "Boris",
    funcao: "Operações & Segurança",
    ativo: "/mascotes/boris/boris_seguranca.png",
    imagens: [
      {
        file: "/mascotes/boris/boris_seguranca.png",
        title: "Boris — Segurança",
        alt: "Boris com fato tático, braços cruzados."
      },
      {
        file: "/mascotes/boris/boris_automacao.png",
        title: "Boris — Automação",
        alt: "Boris em ambiente de fábrica automatizada."
      },
      {
        file: "/mascotes/boris/boris_variacao_2.png",
        title: "Boris — Executivo",
        alt: "Boris de fato escuro corporativo."
      }
    ]
  },
  {
    id: "laya",
    nome: "Laya",
    funcao: "Comunicação & Suporte",
    ativo: "/mascotes/laya/laya_apoio_cliente.png",
    imagens: [
      {
        file: "/mascotes/laya/laya_apoio_cliente.png",
        title: "Laya — Apoio ao Cliente",
        alt: "Laya com headset em balcão de suporte."
      },
      {
        file: "/mascotes/laya/laya_comunicacao.png",
        title: "Laya — Comunicação",
        alt: "Laya a apresentar num estúdio."
      },
      {
        file: "/mascotes/laya/laya_acolhimento.png",
        title: "Laya — Acolhimento",
        alt: "Laya a receber visitantes num lobby."
      }
    ]
  },
  {
    id: "irina",
    nome: "Irina",
    funcao: "Análise & Inteligência",
    ativo: "/mascotes/irina/irina_inteligencia.png",
    imagens: [
      {
        file: "/mascotes/irina/irina_inteligencia.png",
        title: "Irina — Inteligência",
        alt: "Irina com óculos e gráficos ao fundo."
      },
      {
        file: "/mascotes/irina/irina_analise.png",
        title: "Irina — Análise",
        alt: "Irina a analisar dados com lupa."
      },
      {
        file: "/mascotes/irina/irina_insights_dados.png",
        title: "Irina — Insights",
        alt: "Irina a apontar para dashboards de dados."
      }
    ]
  }
];
export const MASCOTES_CONJUNTA: MascoteImage[] = [
  { file: "/mascotes/conjunta/trio_apresentacao_equipa.png",            title: "Apresentação da Equipa",        alt: "Boris, Laya e Irina apresentados como equipa." },
  { file: "/mascotes/conjunta/trio_apresentacao_roupas_profissionais.png", title: "Roupas Profissionais",         alt: "Mascotes com roupas profissionais alinhadas." },
  { file: "/mascotes/conjunta/trio_apresentando_funcoes.png",           title: "Apresentando Funções",           alt: "Mascotes a apresentar as funções de cada um." },
  { file: "/mascotes/conjunta/trio_trabalhando_em_conjunto.png",        title: "Trabalho em Conjunto",           alt: "Mascotes a trabalhar em conjunto." },
  { file: "/mascotes/conjunta/trio_trabalhando_tech.png",               title: "Tech em Equipa",                 alt: "Mascotes em ambiente tecnológico colaborativo." },
  { file: "/mascotes/conjunta/trio_crise_management.png",               title: "Gestão de Crise",                alt: "Mascotes a gerir um cenário de crise." },
  { file: "/mascotes/conjunta/trio_action_scene.png",                   title: "Action Scene",                   alt: "Cenário de ação dinâmico com as três mascotes." }
];
