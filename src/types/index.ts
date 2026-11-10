export type HealthCondition = 'diabetes' | 'hipertensao' | 'obesidade' | 'saudavel';

export type TrafficLight = 'green' | 'yellow' | 'red';

export type FoodCategory = 
  | 'verduras_legumes'
  | 'frutas'
  | 'graos_cereais'
  | 'proteinas'
  | 'ultraprocessados_bebidas';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  categoryLabel: string;
  imageUrl?: string;
  iconFallback: string; // Emoji / icon identifier
  generalStatus: TrafficLight;
  statusByCondition: Record<HealthCondition, TrafficLight>;
  shortDescription: string;
  whyNotice: string;
  conditionTips: Record<HealthCondition, string>;
  healthyPreparation: string;
  healthySwapSuggestion: string;
  approximateCost: 'baixo' | 'medio' | 'alto';
  brazilianStaple: boolean;
}

export interface UserProfile {
  name: string;
  ageGroup: 'jovem' | 'adulto' | 'idoso';
  conditions: HealthCondition[];
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  autoAudio: boolean;
  budgetPriority: 'baixo' | 'moderado';
}

export interface PlateSectionItem {
  id: string;
  name: string;
  category: 'verduras' | 'proteinas' | 'carboidratos';
  emoji: string;
  caloriesApprox: number;
}

export interface SmartSwapItem {
  id: string;
  title: string;
  before: {
    name: string;
    description: string;
    trafficLight: TrafficLight;
    emoji: string;
    whyAvoid: string;
  };
  after: {
    name: string;
    description: string;
    trafficLight: TrafficLight;
    emoji: string;
    whyBetter: string;
  };
  economyNote: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  audioPrompt: string;
  options: {
    id: string;
    text: string;
    emoji: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface DictionaryTerm {
  id: string;
  term: string;
  simpleAnalogy: string;
  plainMeaning: string;
  whyItMatters: string;
  whereItIsFound: string;
  emoji: string;
}

export interface MealLogItem {
  id: string;
  mealType: 'cafe' | 'almoco' | 'lanche' | 'jantar';
  time: string;
  foodNames: string[];
  balanceRating: 'otimo' | 'bom' | 'atencao';
  note: string;
}
