export interface EconomicRecipe {
  id: string;
  name: string;
  estimatedCostPerServing: string;
  servings: number;
  ingredients: string[];
  preparationTime: string;
  nutritionHighlight: string;
  emoji: string;
}

export const ECONOMIC_STAPLES = [
  {
    name: 'Feijão Carioca ou Preto',
    benefit: 'Rico em ferro e fibras, rende muito rendendo almoço e janta.',
    tip: 'Deixe de molho na água por 12 horas antes de cozinhar. Isso elimina os gases e reduz o tempo de fogo.',
    priceBadge: 'R$ 6 a 8 o kg (rende 15 pratos)',
    emoji: '🫘',
  },
  {
    name: 'Ovos de Galinha',
    benefit: 'Proteína completa mais acessível do Brasil, sem desperdício.',
    tip: 'Cozido ou mexido na água dura dias na geladeira e substitui carnes caras.',
    priceBadge: 'Menos de R$ 0,70 por unidade na cartela',
    emoji: '🥚',
  },
  {
    name: 'Couve Manteiga',
    benefit: 'Verdura verde-escura barata, cheia de cálcio e ferro.',
    tip: 'Pique as folhas bem fininhas e congele em saquinhos. Os talos podem ser picados e refogados junto com o feijão.',
    priceBadge: 'R$ 2,50 o maço na feira',
    emoji: '🥬',
  },
  {
    name: 'Abóbora Cabotiá',
    benefit: 'Legume que dura semanas fora da geladeira antes de abrir.',
    tip: 'Pode ser cozida com casca e tudo, sem desperdiçar nada. As sementes podem ser tostadas na frigideira com sal.',
    priceBadge: 'R$ 3 a 4 o kg',
    emoji: '🎃',
  },
  {
    name: 'Banana Prata ou Nanica',
    benefit: 'Doce da natureza, mata a vontade de açúcar e dura dias.',
    tip: 'Quando estiver ficando com pintinhas pretas, congele em rodelas para bater com aveia ou esquentar com canela.',
    priceBadge: 'R$ 5 a 6 a dúzia',
    emoji: '🍌',
  },
  {
    name: 'Aveia em Flocos Finos',
    benefit: 'Cereal que estufa e mata a fome, controlando a glicemia.',
    tip: 'Compre em lojas a granel ou sacos maiores para pagar menos da metade do preço de caixinhas finas.',
    priceBadge: 'R$ 4 o pacote de 400g',
    emoji: '🌾',
  },
];

export const ECONOMIC_RECIPES: EconomicRecipe[] = [
  {
    id: 'prato-caipira-completo',
    name: 'Prato do Campo: Arroz, Feijão, Ovo e Couve Refogada',
    estimatedCostPerServing: 'R$ 4,50',
    servings: 4,
    preparationTime: '30 min',
    nutritionHighlight: 'Combinação perfeita de aminoácidos, ferro, fibras e cálcio vegetal.',
    ingredients: [
      '2 xícaras de arroz cozido com alho',
      '2 conchas de feijão caseiro temperado',
      '4 ovos caipiras ou brancos',
      '1 maço de couve picada bem fininha',
      'Alho, cebola, louro e 1 colher de óleo',
    ],
    emoji: '🍛',
  },
  {
    id: 'sopa-legumes-frango',
    name: 'Sopa Rendeira de Frango com Legumes e Abóbora',
    estimatedCostPerServing: 'R$ 3,80',
    servings: 6,
    preparationTime: '40 min',
    nutritionHighlight: 'Hidrata, aquece, reconforta e reaproveita todos os legumes que sobraram na gaveta.',
    ingredients: [
      '300g de peito ou coxa de frango desfiado',
      '2 xícaras de abóbora em cubos com casca',
      '1 cenoura fatiada',
      '1 xícara de macarrão padre nosso ou arroz',
      'Folhas e talos verdes picados',
      'Alho, cebola e cúrcuma',
    ],
    emoji: '🍲',
  },
  {
    id: 'torta-frigideira-legumes',
    name: 'Torta de Frigideira de Ovos com Legumes Ralados',
    estimatedCostPerServing: 'R$ 3,20',
    servings: 2,
    preparationTime: '15 min',
    nutritionHighlight: 'Jantar rápido, leve para a digestão e excelente para controle de glicemia e peso.',
    ingredients: [
      '3 ovos batidos com garfo',
      '1/2 cenoura ralada',
      '1/2 abobrinha ou chuchu ralado',
      '2 colheres de aveia em flocos',
      'Orégano e pitada de sal',
    ],
    emoji: '🍳',
  },
];

export const FEIRA_TIPS = [
  {
    title: 'Aproveite a hora da xepa',
    desc: 'No final da feira livre (a partir das 12h ou 13h), os feirantes costumam fazer bacias com três vezes mais frutas e verduras por um valor simbólico.',
  },
  {
    title: 'Compre as frutas e verduras da safra',
    desc: 'O que está na época é colhido em abundância, fica muito mais gostoso, mais doce naturalmente e até 60% mais barato.',
  },
  {
    title: 'Não jogue fora talos e folhas',
    desc: 'Os talos da couve, do brócolis e as folhas da beterraba têm até mais ferro e fibras que a própria raiz. Pique e refogue no arroz ou na sopa!',
  },
  {
    title: 'Feijão e arroz sempre ganham do ultraprocessado',
    desc: 'Um almoço de verdade feito em casa com arroz, feijão, salada e ovo custa cerca de R$ 5,00 por pessoa, enquanto um pacote de biscoito e refrigerante passa de R$ 12,00 e não alimenta.',
  },
];
