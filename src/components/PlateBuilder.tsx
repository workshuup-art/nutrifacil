import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, RefreshCw, CheckCircle2, AlertCircle, Info, Heart } from 'lucide-react';
import { HealthCondition, UserProfile } from '../types';
import { speechService } from '../services/speechService';

interface PlateBuilderProps {
  profile: UserProfile;
}

interface PlateItem {
  id: string;
  name: string;
  category: 'verduras' | 'proteinas' | 'carboidratos';
  emoji: string;
  portionLabel: string;
}

const AVAILABLE_FOODS: PlateItem[] = [
  // Verduras e Legumes (50%)
  { id: 'couve', name: 'Couve Refogada', category: 'verduras', emoji: '🥬', portionLabel: '1 pegador' },
  { id: 'cenoura', name: 'Cenoura Ralada', category: 'verduras', emoji: '🥕', portionLabel: '2 colheres de sopa' },
  { id: 'tomate', name: 'Tomate em Rodelas', category: 'verduras', emoji: '🍅', portionLabel: '3 rodelas' },
  { id: 'abobora', name: 'Abóbora Cozida', category: 'verduras', emoji: '🎃', portionLabel: '2 pedaços médios' },
  { id: 'alface', name: 'Alface Crespa', category: 'verduras', emoji: '🥗', portionLabel: '4 folhas' },
  { id: 'chuchu', name: 'Chuchu Refogado', category: 'verduras', emoji: '🥒', portionLabel: '2 colheres de sopa' },

  // Proteínas (25%)
  { id: 'feijao', name: 'Feijão Caseiro', category: 'proteinas', emoji: '🫘', portionLabel: '1 concha' },
  { id: 'ovo', name: 'Ovo Cozido ou Pochê', category: 'proteinas', emoji: '🥚', portionLabel: '1 a 2 unidades' },
  { id: 'frango', name: 'Frango Grelhado', category: 'proteinas', emoji: '🍗', portionLabel: '1 filé médio' },
  { id: 'sardinha', name: 'Sardinha Fresca', category: 'proteinas', emoji: '🐟', portionLabel: '1 porção média' },
  { id: 'carne-moida', name: 'Carne Moída Magra', category: 'proteinas', emoji: '🥩', portionLabel: '3 colheres de sopa' },

  // Carboidratos (25%)
  { id: 'arroz', name: 'Arroz Branco ou Integral', category: 'carboidratos', emoji: '🍚', portionLabel: '2 a 3 colheres de sopa' },
  { id: 'batata-doce', name: 'Batata-Doce Cozida', category: 'carboidratos', emoji: '🍠', portionLabel: '1 pedaço médio' },
  { id: 'mandioca', name: 'Mandioca Cozida', category: 'carboidratos', emoji: '🥔', portionLabel: '1 pedaço pequeno' },
  { id: 'macarrao', name: 'Macarrão com Molho Caseiro', category: 'carboidratos', emoji: '🍝', portionLabel: '1 pegador raso' },
];

export const PlateBuilder: React.FC<PlateBuilderProps> = ({ profile }) => {
  // Initial balanced state
  const [selectedItems, setSelectedItems] = useState<PlateItem[]>([
    AVAILABLE_FOODS.find((f) => f.id === 'couve')!,
    AVAILABLE_FOODS.find((f) => f.id === 'cenoura')!,
    AVAILABLE_FOODS.find((f) => f.id === 'feijao')!,
    AVAILABLE_FOODS.find((f) => f.id === 'arroz')!,
    AVAILABLE_FOODS.find((f) => f.id === 'ovo')!,
  ]);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const activeCondition: HealthCondition = profile.conditions[0] || 'saudavel';

  // Toggle item selection
  const handleToggleItem = (item: PlateItem) => {
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const clearPlate = () => setSelectedItems([]);

  const loadPresetBalanced = () => {
    setSelectedItems([
      AVAILABLE_FOODS.find((f) => f.id === 'couve')!,
      AVAILABLE_FOODS.find((f) => f.id === 'tomate')!,
      AVAILABLE_FOODS.find((f) => f.id === 'cenoura')!,
      AVAILABLE_FOODS.find((f) => f.id === 'feijao')!,
      AVAILABLE_FOODS.find((f) => f.id === 'ovo')!,
      AVAILABLE_FOODS.find((f) => f.id === 'arroz')!,
    ]);
  };

  // Group counts
  const verdurasCount = selectedItems.filter((i) => i.category === 'verduras').length;
  const proteinasCount = selectedItems.filter((i) => i.category === 'proteinas').length;
  const carbosCount = selectedItems.filter((i) => i.category === 'carboidratos').length;
  const totalCount = selectedItems.length;

  // Percentage calculations
  const verdurasPercent = totalCount ? Math.round((verdurasCount / totalCount) * 100) : 0;
  const proteinasPercent = totalCount ? Math.round((proteinasCount / totalCount) * 100) : 0;
  const carbosPercent = totalCount ? Math.round((carbosCount / totalCount) * 100) : 0;

  // Evaluation status
  const isBalanced = verdurasPercent >= 40 && proteinasPercent >= 20 && carbosPercent <= 35;

  const handleAudioEvaluation = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
      return;
    }

    let speech = '';
    if (totalCount === 0) {
      speech = 'Seu prato está vazio. Toque nos alimentos abaixo para preencher o prato!';
    } else {
      speech = `Avaliação do seu prato: Você escolheu ${verdurasCount} porções de verduras e legumes, ${proteinasCount} porções de proteínas e ${carbosCount} porções de carboidratos. `;
      if (isBalanced) {
        speech +=
          'Parabéns! O seu prato está equilibrado, colorido e muito saudável! Metade do prato com verduras protege o coração e ajuda a manter a glicemia e a pressão bem reguladas.';
      } else if (verdurasPercent < 40) {
        speech +=
          'Dica importante: Coloque mais verduras e legumes coloridos, como couve ou cenoura. Eles devem ocupar metade de todo o seu prato para trazer saciedade e fibras.';
      } else if (carbosPercent > 35) {
        speech +=
          'Atenção aos carboidratos: Tente diminuir a quantidade de arroz ou batata para não sobrecarregar o açúcar no sangue.';
      }
    }

    speechService.speak(
      speech,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Introduction Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                Monte seu Prato Equilibrado
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              A regra de ouro da saúde: <strong>50% do prato</strong> com verduras e legumes, <strong>25%</strong> com proteínas e <strong>25%</strong> com carboidratos.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleAudioEvaluation}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'Parar Áudio' : 'Ouvir Avaliação do Prato'}</span>
            </button>

            <button
              onClick={loadPresetBalanced}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer flex items-center gap-1.5 border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Prato Padrão</span>
            </button>
          </div>
        </div>

        {/* Visual Balance Bar */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-extrabold mb-2">
            <span className="text-emerald-800">Verduras/Legumes: {verdurasPercent}% (Ideal: 50%)</span>
            <span className="text-indigo-800">Proteínas: {proteinasPercent}% (Ideal: 25%)</span>
            <span className="text-amber-800">Carboidratos: {carbosPercent}% (Ideal: 25%)</span>
          </div>

          <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-200">
            <div
              style={{ width: `${verdurasPercent}%` }}
              className="bg-emerald-500 transition-all duration-300"
              title="Verduras e Legumes"
            />
            <div
              style={{ width: `${proteinasPercent}%` }}
              className="bg-indigo-500 transition-all duration-300"
              title="Proteínas"
            />
            <div
              style={{ width: `${carbosPercent}%` }}
              className="bg-amber-500 transition-all duration-300"
              title="Carboidratos"
            />
          </div>

          {/* Feedback pill */}
          <div className="mt-3 flex items-center gap-2">
            {isBalanced ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Prato Perfeito e Harmonioso! Muito bom para a sua saúde.</span>
              </div>
            ) : totalCount === 0 ? (
              <span className="text-xs text-slate-500 font-medium">Toque nos alimentos abaixo para montar seu prato.</span>
            ) : verdurasPercent < 40 ? (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Faltam verduras e legumes! Preencha metade do prato com verde e cores.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-200 px-3 py-1.5 rounded-xl">
                <Info className="w-4 h-4 text-slate-600" />
                <span>Bom prato! Ajuste os carboidratos e proteínas para equilibrar.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plate Visual Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* The Plate Visual Container */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
          
          <div className="w-full max-w-[340px] aspect-square rounded-full border-8 border-slate-100 bg-gradient-to-b from-slate-50 to-white shadow-inner relative flex flex-col overflow-hidden p-3">
            
            {/* Top Half: 50% Verduras & Legumes */}
            <div className="h-1/2 w-full border-b-2 border-dashed border-emerald-400 bg-emerald-50/50 rounded-t-full flex flex-col items-center justify-center p-3 relative group">
              <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mb-1">
                50% Verduras e Legumes
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-h-24 overflow-y-auto">
                {selectedItems.filter((i) => i.category === 'verduras').length === 0 ? (
                  <span className="text-[11px] text-emerald-700/60 font-medium italic">
                    Toque nos vegetais abaixo para adicionar
                  </span>
                ) : (
                  selectedItems
                    .filter((i) => i.category === 'verduras')
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleToggleItem(item)}
                        className="px-2 py-1 bg-white rounded-lg border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center gap-1 shadow-xs cursor-pointer hover:bg-rose-50 hover:border-rose-300"
                        title="Toque para remover"
                      >
                        <span>{item.emoji}</span>
                        <span className="truncate max-w-[90px]">{item.name}</span>
                        <span className="text-rose-500 text-[10px]">✕</span>
                      </button>
                    ))
                )}
              </div>
            </div>

            {/* Bottom Half: Split into 25% Proteínas and 25% Carboidratos */}
            <div className="h-1/2 w-full flex">
              
              {/* Bottom Left: 25% Proteínas */}
              <div className="w-1/2 h-full border-r-2 border-dashed border-indigo-300 bg-indigo-50/40 rounded-bl-full flex flex-col items-center justify-center p-2">
                <span className="text-[10px] font-black uppercase text-indigo-800 bg-indigo-100 px-1.5 py-0.5 rounded-full mb-1">
                  25% Proteínas
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1 max-h-20 overflow-y-auto">
                  {selectedItems.filter((i) => i.category === 'proteinas').length === 0 ? (
                    <span className="text-[10px] text-indigo-600/60 italic text-center">
                      Adicione feijão, ovos ou frango
                    </span>
                  ) : (
                    selectedItems
                      .filter((i) => i.category === 'proteinas')
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleToggleItem(item)}
                          className="px-1.5 py-0.5 bg-white rounded-md border border-indigo-200 text-[11px] font-bold text-indigo-950 flex items-center gap-1 shadow-xs cursor-pointer hover:bg-rose-50"
                          title="Toque para remover"
                        >
                          <span>{item.emoji}</span>
                          <span className="truncate max-w-[70px]">{item.name}</span>
                          <span className="text-rose-500 text-[9px]">✕</span>
                        </button>
                      ))
                  )}
                </div>
              </div>

              {/* Bottom Right: 25% Carboidratos */}
              <div className="w-1/2 h-full bg-amber-50/40 rounded-br-full flex flex-col items-center justify-center p-2">
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full mb-1">
                  25% Carboidratos
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1 max-h-20 overflow-y-auto">
                  {selectedItems.filter((i) => i.category === 'carboidratos').length === 0 ? (
                    <span className="text-[10px] text-amber-600/60 italic text-center">
                      Adicione arroz ou raiz
                    </span>
                  ) : (
                    selectedItems
                      .filter((i) => i.category === 'carboidratos')
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleToggleItem(item)}
                          className="px-1.5 py-0.5 bg-white rounded-md border border-amber-200 text-[11px] font-bold text-amber-950 flex items-center gap-1 shadow-xs cursor-pointer hover:bg-rose-50"
                          title="Toque para remover"
                        >
                          <span>{item.emoji}</span>
                          <span className="truncate max-w-[70px]">{item.name}</span>
                          <span className="text-rose-500 text-[9px]">✕</span>
                        </button>
                      ))
                  )}
                </div>
              </div>

            </div>

          </div>

          <div className="mt-4 flex items-center justify-between w-full max-w-[340px]">
            <span className="text-xs text-slate-500 font-bold">
              {totalCount} itens no prato
            </span>
            {totalCount > 0 && (
              <button
                onClick={clearPlate}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Limpar Prato
              </button>
            )}
          </div>

        </div>

        {/* Selection Columns */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Section 1: Verduras e Legumes */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥗</span>
                <h3 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wide">
                  1. Escolha suas Verduras e Legumes (Metade do Prato)
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                50% do prato
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_FOODS.filter((f) => f.category === 'verduras').map((item) => {
                const isSelected = selectedItems.some((i) => i.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleItem(item)}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                        : 'border-slate-200 hover:border-emerald-300 text-slate-700 bg-slate-50/50'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{item.emoji}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">{item.name}</span>
                      <span className="text-[10px] text-slate-500 truncate block">{item.portionLabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Proteínas */}
          <div className="bg-white rounded-3xl p-5 border border-indigo-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥚</span>
                <h3 className="text-sm font-extrabold text-indigo-950 uppercase tracking-wide">
                  2. Escolha suas Proteínas (1/4 do Prato)
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                25% do prato
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_FOODS.filter((f) => f.category === 'proteinas').map((item) => {
                const isSelected = selectedItems.some((i) => i.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleItem(item)}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-xs'
                        : 'border-slate-200 hover:border-indigo-300 text-slate-700 bg-slate-50/50'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{item.emoji}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">{item.name}</span>
                      <span className="text-[10px] text-slate-500 truncate block">{item.portionLabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Carboidratos */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍚</span>
                <h3 className="text-sm font-extrabold text-amber-950 uppercase tracking-wide">
                  3. Escolha seus Carboidratos e Grãos (1/4 do Prato)
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                25% do prato
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_FOODS.filter((f) => f.category === 'carboidratos').map((item) => {
                const isSelected = selectedItems.some((i) => i.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleItem(item)}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-xs'
                        : 'border-slate-200 hover:border-amber-300 text-slate-700 bg-slate-50/50'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{item.emoji}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">{item.name}</span>
                      <span className="text-[10px] text-slate-500 truncate block">{item.portionLabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
