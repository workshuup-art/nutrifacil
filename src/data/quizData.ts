import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Qual destes alimentos tem MAIS sal (sódio) escondido?',
    audioPrompt: 'Pergunta um: Qual destes alimentos tem mais sal escondido? Macarrão de pacotinho ou cenoura fresca?',
    options: [
      {
        id: 'opt1-a',
        text: 'Macarrão instantâneo com sachê',
        emoji: '🍜',
        isCorrect: true,
        explanation: 'Muito bem! O sachê de tempero do macarrão instantâneo pode ter mais sal do que o limite recomendado para o dia inteiro!',
      },
      {
        id: 'opt1-b',
        text: 'Cenoura fresca ralada',
        emoji: '🥕',
        isCorrect: false,
        explanation: 'A cenoura é um vegetal natural praticamente sem sódio e cheia de água e vitaminas boas.',
      },
      {
        id: 'opt1-c',
        text: 'Ovo cozido',
        emoji: '🥚',
        isCorrect: false,
        explanation: 'O ovo cozido natural não tem sal adicionado e é uma excelente fonte de proteína.',
      },
    ],
  },
  {
    id: 'q2',
    question: 'Quem tem DIABETES deve preferir qual dessas opções no lanche?',
    audioPrompt: 'Pergunta dois: Quem tem diabetes deve preferir qual dessas opções? Banana com aveia ou refrigerante?',
    options: [
      {
        id: 'opt2-a',
        text: 'Refrigerante gelado',
        emoji: '🥤',
        isCorrect: false,
        explanation: 'O refrigerante é absorvido como uma bomba de açúcar líquido na corrente sanguínea.',
      },
      {
        id: 'opt2-b',
        text: 'Banana pequena com 1 colher de aveia',
        emoji: '🍌',
        isCorrect: true,
        explanation: 'Correto! A aveia ajuda a segurar o açúcar da fruta, fazendo a glicemia subir de forma suave e tranquila.',
      },
      {
        id: 'opt2-c',
        text: 'Biscoito recheado de morango',
        emoji: '🍪',
        isCorrect: false,
        explanation: 'Biscoitos recheados contêm açúcar e gordura que desregulam a glicemia.',
      },
    ],
  },
  {
    id: 'q3',
    question: 'Qual a melhor proporção de VERDURAS e LEGUMES no seu prato?',
    audioPrompt: 'Pergunta três: Qual a melhor proporção de verduras e legumes no seu prato no almoço?',
    options: [
      {
        id: 'opt3-a',
        text: 'Metade do prato (50%)',
        emoji: '🥗',
        isCorrect: true,
        explanation: 'Perfeito! Metade do prato cheia de folhas verdes e legumes coloridos traz fibras, vitaminas e muita saciedade.',
      },
      {
        id: 'opt3-b',
        text: 'Apenas uma folhinha no canto',
        emoji: '🌿',
        isCorrect: false,
        explanation: 'Uma folhinha só não é suficiente para proteger o intestino e ajudar na digestão dos outros alimentos.',
      },
      {
        id: 'opt3-c',
        text: 'Nada de salada, só fritura',
        emoji: '🍟',
        isCorrect: false,
        explanation: 'Sem verduras o corpo fica sem vitaminas essenciais e o intestino fica preguiçoso.',
      },
    ],
  },
  {
    id: 'q4',
    question: 'Para quem tem PRESSÃO ALTA, qual é o melhor tempero?',
    audioPrompt: 'Pergunta quatro: Para quem tem pressão alta, qual é o melhor tempero para a comida?',
    options: [
      {
        id: 'opt4-a',
        text: 'Cubinho de caldo industrializado',
        emoji: '🧂',
        isCorrect: false,
        explanation: 'O caldo em cubo é quase puro sal e gordura, perigoso para as artérias.',
      },
      {
        id: 'opt4-b',
        text: 'Alho, cebola, limão e orégano',
        emoji: '🧄',
        isCorrect: true,
        explanation: 'Excelente! Ervas naturais dão um sabor delicioso à comida sem precisar abusar do saleiro.',
      },
      {
        id: 'opt4-c',
        text: 'Molho shoyu em excesso',
        emoji: '🥢',
        isCorrect: false,
        explanation: 'O shoyu comum tem uma concentração altíssima de sódio concentrado.',
      },
    ],
  },
];
