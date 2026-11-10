import { SmartSwapItem } from '../types';

export const SMART_SWAPS: SmartSwapItem[] = [
  {
    id: 'swap-refrigerante',
    title: 'Bebida do almoço',
    before: {
      name: 'Refrigerante ou Suco de Caixinha',
      description: 'Cheio de açúcar ou adoçante e corantes artificiais.',
      trafficLight: 'red',
      emoji: '🥤',
      whyAvoid: 'Dispara a glicemia e aumenta a pressão com sódio oculto.',
    },
    after: {
      name: 'Água com Limão e Folhas de Hortelã',
      description: 'Refrescante, hidrata de verdade e tem vitamina C natural.',
      trafficLight: 'green',
      emoji: '🍋',
      whyBetter: 'Sem açúcar, sem calorias vazias e limpa o paladar.',
    },
    economyNote: 'Economia média de R$ 120,00 por mês por família ao trocar refrigerante por água e limão da feira.',
  },
  {
    id: 'swap-tempero-pronto',
    title: 'Tempero da panela',
    before: {
      name: 'Caldos em Cubo e Sachês Prontos',
      description: 'Mistura industrial de gordura, sódio puro e corantes químicos.',
      trafficLight: 'red',
      emoji: '🧂',
      whyAvoid: 'Um só cubinho tem quase todo o sal do dia, subindo a pressão na hora.',
    },
    after: {
      name: 'Alho, Cebola, Cúrcuma e Louro',
      description: 'O verdadeiro tempero caseiro brasileiro com ervas naturais.',
      trafficLight: 'green',
      emoji: '🧄',
      whyBetter: 'Anti-inflamatório natural, perfuma a casa e protege o coração.',
    },
    economyNote: 'Uma cabeça de alho e um ramo de cheiro-verde duram a semana toda por menos de R$ 4,00.',
  },
  {
    id: 'swap-lanche-tarde',
    title: 'Lanche da tarde',
    before: {
      name: 'Biscoito Recheado ou Salgadinho de Pacote',
      description: 'Farinha branca refinada, gordura vegetal e sal em excesso.',
      trafficLight: 'red',
      emoji: '🍪',
      whyAvoid: 'Gera pico de fome logo depois, vicia o paladar e engorda o fígado.',
    },
    after: {
      name: 'Banana com Aveia em Flocos e Canela',
      description: 'Doçura natural que enche o estômago e acalma a ansiedade.',
      trafficLight: 'green',
      emoji: '🍌',
      whyBetter: 'Rica em fibras betaglucanas que ajudam o coração e o intestino.',
    },
    economyNote: 'Uma dúzia de bananas e um pacote de aveia rendem lanches para 7 dias por menos de R$ 12,00.',
  },
  {
    id: 'swap-petisco',
    title: 'Petisco da noite',
    before: {
      name: 'Salgadinho de Milho Industrializado',
      description: 'Frito em óleo velho, cheio de glutamato e sódio nas alturas.',
      trafficLight: 'red',
      emoji: '🥨',
      whyAvoid: 'Retém líquidos nas pernas e eleva a pressão arterial.',
    },
    after: {
      name: 'Pipoca Caseira de Panela com Pitada de Sal e Ervas',
      description: 'Grão integral de verdade feito com 1 fiozinho de óleo e orégano.',
      trafficLight: 'green',
      emoji: '🍿',
      whyBetter: 'Tem muitas fibras naturais e antioxidantes sem conservantes químicos.',
    },
    economyNote: 'Um pacote de milho de pipoca custa R$ 5,00 e rende dezenas de porções saudáveis.',
  },
  {
    id: 'swap-embutido',
    title: 'Recheio do pão ou tapioca',
    before: {
      name: 'Mortadela, Salsicha ou Presunto',
      description: 'Embutidos com nitritos, nitratos e muita gordura saturada.',
      trafficLight: 'red',
      emoji: '🌭',
      whyAvoid: 'Aumenta risco de câncer no intestino e sobrecarrega os rins.',
    },
    after: {
      name: 'Ovo Mexido ou Frango Desfiado com Tomate',
      description: 'Proteína pura, saborosa e que mata a fome por muito tempo.',
      trafficLight: 'green',
      emoji: '🍳',
      whyBetter: 'Constrói massa muscular saudável e não tem sal oculto nem aditivos.',
    },
    economyNote: 'Uma cartela com 30 ovos é uma das fontes de proteína mais baratas e nutritivas do Brasil.',
  },
];
