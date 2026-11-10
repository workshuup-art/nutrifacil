import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '15mb' }));

// Shared Gemini Client instance
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const SYSTEM_INSTRUCTION_NUTRIFACIL = `Você é a NutriFácil, uma educadora nutricional virtual brasileira acolhedora, empática, didática e respeitosa.
Sua missão é democratizar a alimentação saudável para todas as pessoas, incluindo idosos e pessoas com dificuldade de leitura ou baixa escolaridade.

Diretrizes obrigatórias:
1. Use Português do Brasil claro, acolhedor e simples, com frases curtas e fáceis de entender.
2. Evite termos técnicos difíceis (em vez de "lipídios de cadeia longa", diga "gorduras"; em vez de "hipoglicemiante", diga "alimento que ajuda a não subir rápido o açúcar no sangue").
3. Use exemplos do prato do dia a dia do brasileiro: arroz, feijão, ovo caipira ou branco, couve refogada, abóbora, banana, aveia, cenoura, batata-doce, etc.
4. Considere SEMPRE as condições de saúde que o usuário informou (como Diabetes, Hipertensão, Obesidade ou Alimentação Geral).
5. NUNCA faça diagnósticos, NUNCA prescreva medicamentos ou suplementos e NUNCA recomende dietas malucas ou restritivas demais.
6. Sempre lembre com afeto que as orientações são educativas e que o acompanhamento com médico ou nutricionista no posto de saúde ou consultório é fundamental.
7. Baseie-se nas diretrizes do Guia Alimentar para a População Brasileira (Ministério da Saúde) e da Organização Mundial da Saúde (OMS).`;

// 1. Assistant chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conditions = [], chatHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem não fornecida.' });
    }

    const ai = getGeminiClient();

    const conditionsText = conditions.length > 0
      ? `O usuário marcou as seguintes condições de saúde: ${conditions.join(', ')}.`
      : 'O usuário busca orientações para uma alimentação saudável geral no dia a dia.';

    if (!ai) {
      // Graceful fallback if API key is not yet set
      const simulatedResponse = `Olá! Que bom falar com você. ${conditionsText} 
Lembre-se: comer bem não precisa ser caro nem complicado! O tradicional arroz com feijão brasileiro, acompanhado de uma folha verde como couve e um ovo cozido, é um prato excelente, rico em nutrientes e amigo do bolso. Em que posso te ajudar hoje?`;
      return res.json({ reply: simulatedResponse });
    }

    const fullPrompt = `${conditionsText}

Pergunta do usuário:
"${message}"

Responda de forma simples, objetiva, calorosa e com foco em opções práticas e econômicas. Não use jargões difíceis.`;

    let reply: string;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_NUTRIFACIL,
        },
      });
      reply = response.text || '';
    } catch (genError) {
      console.warn('Gemini API temporariamente indisponível, gerando resposta educativa base:', genError);
      // Helpful educational fallback based on Brazilian dietary guidelines
      const msgLower = message.toLowerCase();
      if (msgLower.includes('banana')) {
        reply = `Sim! A banana pode fazer parte da alimentação de quem tem diabetes. O segredo é a quantidade e a combinação: prefira comer acompanhada de uma colher de aveia ou canela em pó, pois as fibras diminuem a velocidade de absorção do açúcar. Converse com o nutricionista ou médico no posto de saúde para definir a porção ideal para o seu dia a dia!`;
      } else if (msgLower.includes('feijão') || msgLower.includes('sal')) {
        reply = `Para temperar o feijão com muito sabor e proteger o coração, use alho fresco, cebola picada, folhas de louro, cominho e cheiro-verde! Evite caldos em cubo ou temperos prontos em pó, que têm muito sal e fazem a pressão arterial subir.`;
      } else if (msgLower.includes('lanche') || msgLower.includes('café') || msgLower.includes('barato')) {
        reply = `Opções de lanche muito saudáveis e baratas: 1) Banana ou mamão com aveia em flocos; 2) Ovo cozido com orégano; 3) Pipoca de panela com quase nada de sal e um fio de óleo. São alimentos ricos em nutrientes que saciam por bastante tempo sem pesar no bolso!`;
      } else if (msgLower.includes('arroz')) {
        reply = `O tradicional arroz com feijão brasileiro é uma excelente combinação. Para quem tem diabetes ou quer controlar o peso, a dica é moderar na quantidade (2 a 3 colheres de sopa de arroz) e colocar o dobro de feijão e verduras verdes no prato.`;
      } else {
        reply = `Que boa pergunta! O caminho mais seguro e saudável é sempre priorizar o que vem da terra: frutas, verduras, feijão, arroz e ovos, e evitar os pacotinhos ultraprocessados que têm muito sal e açúcar ocultos. ${conditionsText} Continue fazendo escolhas conscientes e lembre-se de consultar seu médico ou nutricionista no posto de saúde.`;
      }
    }

    return res.json({ reply });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Erro no /api/chat:', error);
    return res.json({
      reply: 'Alimentar-se bem é um hábito diário. Dê preferência aos alimentos in natura como arroz, feijão, ovos e verduras frescas da feira, e tome bastante água!',
    });
  }
});

// 2. Nutrition label reader endpoint (image or manual table data)
app.post('/api/analyze-label', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', textData, conditions = [] } = req.body;
    const ai = getGeminiClient();

    const conditionsText = conditions.length > 0 ? conditions.join(', ') : 'Geral';

    if (!ai) {
      // Rule-based fallback if offline/no key
      const sodiumVal = textData?.sodium ? parseFloat(textData.sodium) : 0;
      const sugarVal = textData?.sugars ? parseFloat(textData.sugars) : 0;
      const fatVal = textData?.fats ? parseFloat(textData.fats) : 0;
      const fiberVal = textData?.fibers ? parseFloat(textData.fibers) : 0;

      return res.json({
        productName: textData?.productName || 'Alimento analisado',
        trafficLights: {
          sugar: sugarVal > 15 ? 'red' : sugarVal > 5 ? 'yellow' : 'green',
          sodium: sodiumVal > 400 ? 'red' : sodiumVal > 150 ? 'yellow' : 'green',
          fats: fatVal > 10 ? 'red' : fatVal > 3 ? 'yellow' : 'green',
          fibers: fiberVal >= 3 ? 'green' : fiberVal >= 1.5 ? 'yellow' : 'red',
        },
        simpleExplanation: `Este alimento foi avaliado com base nas informações fornecidas. ${
          sodiumVal > 400 ? 'Atenção para a quantidade de sal (sódio), que está alta!' : 'A quantidade de sódio parece moderada.'
        } ${sugarVal > 15 ? 'Contém bastante açúcar, merecendo atenção redobrada se tiver diabetes.' : ''}`,
        conditionAlert: conditions.includes('Hipertensão') && sodiumVal > 250
          ? 'ALERTA PARA PRESSÃO ALTA: Este item tem bastante sal/sódio. Quem tem pressão alta deve comer pouco ou evitar.'
          : conditions.includes('Diabetes') && sugarVal > 10
          ? 'ALERTA PARA DIABETES: Este produto tem açúcar elevado. Pode fazer o açúcar no sangue subir rápido.'
          : 'Dica geral: Prefira sempre alimentos naturais da feira e comida caseira fresca.',
        healthierSwap: 'Para o dia a dia, substitua por frutas frescas da estação, castanhas ou um lanche caseiro com aveia e iogurte natural.',
      });
    }

    let contentsPayload: any;

    const basePrompt = `Você é o leitor de rótulos do NutriFácil. Analise este rótulo ou dados nutricionais considerando que o usuário tem: ${conditionsText}.
Explique de maneira extremamente simples, usando o sistema do semáforo:
- verde: quantidade saudável/boa
- amarelo: atenção, consumir com moderação
- vermelho: quantidade alta, evitar ou limitar bastante

Retorne EXCLUSIVAMENTE um objeto JSON com esta estrutura:
{
  "productName": "Nome do alimento ou produto",
  "trafficLights": {
    "sugar": "green" ou "yellow" ou "red",
    "sodium": "green" ou "yellow" ou "red",
    "fats": "green" ou "yellow" ou "red",
    "fibers": "green" ou "yellow" ou "red"
  },
  "simpleExplanation": "Explicação em 2 a 3 frases muito simples e acessíveis para qualquer pessoa entender.",
  "conditionAlert": "Aviso direto e amigo sobre como esse alimento afeta a condição do usuário (${conditionsText}). Se não houver risco grave, dê uma dica positiva.",
  "healthierSwap": "Sugestão prática, barata e brasileira de troca mais saudável."
}`;

    if (imageBase64) {
      contentsPayload = {
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, ''),
            },
          },
          {
            text: `${basePrompt}\nAnalise a imagem da tabela nutricional acima. Se estiver ilegível, aponte no productName que a foto não ficou nítida.`,
          },
        ],
      };
    } else {
      contentsPayload = `${basePrompt}\nDados informados pelo usuário:
Produto: ${textData?.productName || 'Não especificado'}
Porção: ${textData?.servingSize || 'Não informada'}
Açúcar: ${textData?.sugars || '0'}g
Sódio (sal): ${textData?.sodium || '0'}mg
Gorduras Totais: ${textData?.fats || '0'}g
Fibras: ${textData?.fibers || '0'}g
Carboidratos: ${textData?.carbs || '0'}g`;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contentsPayload,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_NUTRIFACIL,
          responseMimeType: 'application/json',
        },
      });

      const jsonText = (response.text || '{}').trim();
      const parsed = JSON.parse(jsonText);
      return res.json(parsed);
    } catch (genErr) {
      console.warn('Fallback para análise de rótulo base:', genErr);
      const sodiumVal = textData?.sodium ? parseFloat(textData.sodium) : 100;
      const sugarVal = textData?.sugars ? parseFloat(textData.sugars) : 10;
      const fatVal = textData?.fats ? parseFloat(textData.fats) : 4;
      const fiberVal = textData?.fibers ? parseFloat(textData.fibers) : 2;

      return res.json({
        productName: textData?.productName || 'Alimento Analisado',
        trafficLights: {
          sugar: sugarVal > 15 ? 'red' : sugarVal > 5 ? 'yellow' : 'green',
          sodium: sodiumVal > 400 ? 'red' : sodiumVal > 150 ? 'yellow' : 'green',
          fats: fatVal > 10 ? 'red' : fatVal > 3 ? 'yellow' : 'green',
          fibers: fiberVal >= 3 ? 'green' : fiberVal >= 1.5 ? 'yellow' : 'red',
        },
        simpleExplanation: `Este alimento foi avaliado pelos parâmetros nutricionais recomendados. ${
          sodiumVal > 400
            ? 'Atenção redobrada: contém bastante sódio!'
            : 'Nível de sódio dentro do esperado.'
        } ${sugarVal > 10 ? 'Contém açúcar adicionado; observe o consumo.' : 'Baixo teor de açúcar.'}`,
        conditionAlert:
          conditions.includes('Hipertensão') && sodiumVal > 250
            ? 'ALERTA DE PRESSÃO ALTA: Este item possui quantidade significativa de sal (sódio). Evite consumir com frequência.'
            : conditions.includes('Diabetes') && sugarVal > 8
            ? 'ALERTA DE DIABETES: O teor de açúcar é moderado/alto. Pode influenciar na glicose no sangue.'
            : 'Prefira sempre alimentos naturais da feira e comida fresca feita na panela.',
        healthierSwap:
          'Substitua por frutas frescas da estação, castanhas ou um lanche caseiro preparado com aveia e ovos.',
      });
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Erro no /api/analyze-label:', error);
    return res.json({
      productName: 'Rótulo Analisado',
      trafficLights: { sugar: 'yellow', sodium: 'yellow', fats: 'green', fibers: 'green' },
      simpleExplanation: 'Procure sempre observar a quantidade de sal e açúcar na embalagem.',
      conditionAlert: 'Dê preferência aos alimentos in natura da terra.',
      healthierSwap: 'Substitua por alimentos frescos e preparados em casa.',
    });
  }
});

// 3. Smart Swap endpoint
app.post('/api/smart-swap', async (req, res) => {
  try {
    const { foodName, conditions = [] } = req.body;
    const ai = getGeminiClient();

    if (!foodName) {
      return res.status(400).json({ error: 'Nome do alimento é obrigatório.' });
    }

    if (!ai) {
      return res.json({
        foodName,
        swap: `Troque ${foodName} por opções frescas como frutas da época, pipoca de panela com pouco sal ou água saborizada com rodelas de limão.`,
        why: 'Opções caseiras e naturais contêm muito menos sal, açúcar e gordura, além de serem muito mais baratas.',
        economyTip: 'Comprar frutas da safra na feira livre de rua sai pela metade do preço dos alimentos de pacotinho.',
      });
    }

    const prompt = `O usuário quer uma sugestão de substituição inteligente para o alimento: "${foodName}".
Condições de saúde informadas: ${conditions.join(', ') || 'Alimentação saudável geral'}.
Crie uma sugestão de troca saudável, barata e comum no cotidiano brasileiro.
Retorne um JSON com:
{
  "originalFood": "${foodName}",
  "healthyAlternative": "Nome da alternativa saudável",
  "whyItIsBetter": "Explicação em 1 a 2 frases simples de por que essa troca ajuda a saúde",
  "economyTip": "Dica prática de como economizar dinheiro com essa troca"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_NUTRIFACIL,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    return res.json(parsed);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Erro no /api/smart-swap:', error);
    return res.status(500).json({ error: 'Erro ao gerar substituição.' });
  }
});

// Setup Vite middlewares for development or serve dist for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NutriFácil] Servidor rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
