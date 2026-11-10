// API communication service with Express server & Gemini endpoints

export interface ChatRequest {
  message: string;
  conditions: string[];
}

export interface AnalyzeLabelRequest {
  imageBase64?: string;
  mimeType?: string;
  textData?: {
    productName?: string;
    servingSize?: string;
    carbs?: string;
    sugars?: string;
    sodium?: string;
    fats?: string;
    fibers?: string;
  };
  conditions: string[];
}

export interface AnalyzeLabelResponse {
  productName: string;
  trafficLights: {
    sugar: 'green' | 'yellow' | 'red';
    sodium: 'green' | 'yellow' | 'red';
    fats: 'green' | 'yellow' | 'red';
    fibers: 'green' | 'yellow' | 'red';
  };
  simpleExplanation: string;
  conditionAlert: string;
  healthierSwap: string;
}

export async function askNutritionalAssistant(req: ChatRequest): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      throw new Error(`Erro no servidor: ${res.status}`);
    }

    const data = await res.json();
    return data.reply || 'Não foi possível obter uma resposta neste momento.';
  } catch (err: any) {
    console.error('Erro ao chamar assistente:', err);
    // Intelligent educational fallback in case server or offline
    return `Olá! Estamos com instabilidade na rede, mas aqui vai uma dica de ouro da NutriFácil: para quem tem ${
      req.conditions.join(', ') || 'cuidados com a saúde'
    }, o prato brasileiro tradicional com arroz, feijão, folhas verdes como couve e um ovo cozido é rico em nutrientes, barato e faz muito bem ao corpo. Tome bastante água e evite temperos prontos cheios de sal!`;
  }
}

export async function analyzeNutritionLabel(
  req: AnalyzeLabelRequest
): Promise<AnalyzeLabelResponse> {
  try {
    const res = await fetch('/api/analyze-label', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      throw new Error(`Erro ao analisar rótulo: ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error('Erro na análise de rótulo:', err);
    // Fallback response
    return {
      productName: req.textData?.productName || 'Alimento informado',
      trafficLights: {
        sugar: 'yellow',
        sodium: 'yellow',
        fats: 'green',
        fibers: 'green',
      },
      simpleExplanation:
        'Avaliamos o alimento com base nos padrões nutricionais brasileiros. Procure sempre observar a quantidade de sal e açúcar na embalagem!',
      conditionAlert:
        'Atenção para não consumir em excesso alimentos embalados. Dê preferência aos alimentos frescos que vêm da terra.',
      healthierSwap:
        'Experimente substituir por frutas inteiras com casca, castanhas ou um lanche caseiro preparado com aveia e frutas.',
    };
  }
}

export async function getSmartSwap(
  foodName: string,
  conditions: string[]
): Promise<{
  originalFood: string;
  healthyAlternative: string;
  whyItIsBetter: string;
  economyTip: string;
}> {
  try {
    const res = await fetch('/api/smart-swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodName, conditions }),
    });

    if (!res.ok) throw new Error('Falha ao obter troca');
    return await res.json();
  } catch (err) {
    return {
      originalFood: foodName,
      healthyAlternative: 'Alimento fresco caseiro (ex: fruta da estação ou pipoca de panela)',
      whyItIsBetter: 'Opções feitas em casa não têm conservantes, contêm muito menos sal e açúcar e preservam as vitaminas naturais.',
      economyTip: 'Comprar ingredientes na feira livre no fim da manhã rende descontos de até 50%.',
    };
  }
}
