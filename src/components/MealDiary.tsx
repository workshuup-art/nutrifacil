import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle, Volume2, Calendar, Sparkles } from 'lucide-react';
import { MealLogItem, UserProfile } from '../types';
import { speechService } from '../services/speechService';

interface MealDiaryProps {
  profile: UserProfile;
}

const COMMON_MEAL_ITEMS = [
  'Arroz com feijão',
  'Ovo cozido ou mexido',
  'Couve refogada',
  'Salada de alface e tomate',
  'Frango grelhado ou cozido',
  'Banana com aveia',
  'Pão com manteiga ou queijo',
  'Café com pouco açúcar ou puro',
  'Sopa de legumes caseira',
  'Fruta fresca (maçã, mamão ou laranja)',
  'Macarrão com molho de tomate',
  'Biscoito ou bolo simples',
];

export const MealDiary: React.FC<MealDiaryProps> = ({ profile }) => {
  const [logs, setLogs] = useState<MealLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('nutrifacil_meals');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'sample-1',
        mealType: 'almoco',
        time: '12:30',
        foodNames: ['Arroz com feijão', 'Couve refogada', 'Ovo cozido ou mexido'],
        balanceRating: 'otimo',
        note: 'Prato bem brasileiro com ferro, proteínas e fibras verdes!',
      },
    ];
  });

  const [selectedMealType, setSelectedMealType] = useState<'cafe' | 'almoco' | 'lanche' | 'jantar'>('almoco');
  const [customItemText, setCustomItemText] = useState('');
  const [currentFoods, setCurrentFoods] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('nutrifacil_meals', JSON.stringify(logs));
    } catch {
      // ignore
    }
  }, [logs]);

  const handleToggleFood = (food: string) => {
    setCurrentFoods((prev) =>
      prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemText.trim()) return;
    if (!currentFoods.includes(customItemText.trim())) {
      setCurrentFoods((prev) => [...prev, customItemText.trim()]);
    }
    setCustomItemText('');
  };

  const handleSaveMeal = () => {
    if (currentFoods.length === 0) return;

    // Evaluate balance simply
    const hasVegetable = currentFoods.some((f) => f.includes('Couve') || f.includes('Salada') || f.includes('legumes') || f.includes('Fruta'));
    const hasProtein = currentFoods.some((f) => f.includes('feijão') || f.includes('Ovo') || f.includes('Frango'));

    let rating: 'otimo' | 'bom' | 'atencao' = 'bom';
    let note = 'Boa refeição! Mantenha a variedade nos próximos pratos.';

    if (hasVegetable && hasProtein) {
      rating = 'otimo';
      note = 'Excelente combinação! Você colocou fontes de fibras e proteínas protetoras.';
    } else if (!hasVegetable) {
      rating = 'atencao';
      note = 'Dica da Nutri: Da próxima vez, acrescente uma folha verde ou uma cenoura para ajudar na digestão e saciedade.';
    }

    const newLog: MealLogItem = {
      id: `meal-${Date.now()}`,
      mealType: selectedMealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      foodNames: currentFoods,
      balanceRating: rating,
      note,
    };

    setLogs((prev) => [newLog, ...prev]);
    setCurrentFoods([]);

    speechService.speak(`Refeição registrada com sucesso! ${note}`);
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const mealLabels = {
    cafe: 'Café da Manhã ☕',
    almoco: 'Almoço 🍽️',
    lanche: 'Café da Tarde 🍌',
    jantar: 'Jantar 🍲',
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Minha Alimentação
          </h2>
        </div>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Marque o que você comeu hoje para acompanhar seu prato. Sem julgamentos e sem complicação!
        </p>

        {/* Meal Type Selector */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide block mb-2">
            1. Qual refeição você quer registrar?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['cafe', 'almoco', 'lanche', 'jantar'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMealType(type)}
                className={`py-3 px-4 rounded-2xl text-xs font-bold border-2 cursor-pointer transition-all ${
                  selectedMealType === type
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {mealLabels[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Food Quick Tags */}
        <div className="mt-5">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide block mb-2">
            2. Toque nos alimentos que fizeram parte da sua refeição:
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_MEAL_ITEMS.map((food) => {
              const isSelected = currentFoods.includes(food);
              return (
                <button
                  key={food}
                  onClick={() => handleToggleFood(food)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  {isSelected ? `✓ ${food}` : `+ ${food}`}
                </button>
              );
            })}
          </div>

          {/* Add custom text item */}
          <form onSubmit={handleAddCustom} className="mt-3 flex gap-2 max-w-md">
            <input
              type="text"
              value={customItemText}
              onChange={(e) => setCustomItemText(e.target.value)}
              placeholder="Outro alimento que você comeu..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-900"
            >
              Adicionar
            </button>
          </form>
        </div>

        {/* Current Items & Save button */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            {currentFoods.length === 0 ? (
              <span className="italic">Nenhum alimento selecionado ainda.</span>
            ) : (
              <span>
                <strong>Prato selecionado:</strong> {currentFoods.join(', ')}
              </span>
            )}
          </div>

          <button
            onClick={handleSaveMeal}
            disabled={currentFoods.length === 0}
            className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Salvar no Diário</span>
          </button>
        </div>
      </div>

      {/* History Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <h3 className="text-lg font-black text-slate-900 font-display mb-4">
          Refeições Registradas
        </h3>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            Nenhuma refeição registrada ainda. Comece adicionando o que você comeu acima!
          </p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                      {mealLabels[log.mealType]}
                    </span>
                    <span className="text-xs text-slate-400">às {log.time}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        log.balanceRating === 'otimo'
                          ? 'bg-emerald-600 text-white'
                          : log.balanceRating === 'bom'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {log.balanceRating === 'otimo'
                        ? '🟢 Ótimo Equilíbrio'
                        : log.balanceRating === 'bom'
                        ? '🟡 Bom Prato'
                        : '🔴 Pouco Equilibrado'}
                    </span>
                  </div>

                  <p className="text-sm font-extrabold text-slate-900">
                    {log.foodNames.join(' · ')}
                  </p>

                  <p className="text-xs text-slate-600 font-medium">
                    {log.note}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() =>
                      speechService.speak(
                        `Refeição de ${mealLabels[log.mealType]}. Alimentos: ${log.foodNames.join(
                          ', '
                        )}. ${log.note}`
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 flex items-center justify-center cursor-pointer"
                    title="Ouvir avaliação"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 flex items-center justify-center cursor-pointer"
                    title="Apagar registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
