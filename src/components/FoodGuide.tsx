import React, { useState, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Search,
  Mic,
  MicOff,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Info,
  DollarSign,
  X,
} from 'lucide-react';
import { FoodCategory, FoodItem, HealthCondition, TrafficLight, UserProfile } from '../types';
import { FOODS_DATA } from '../data/foodsData';
import { speechService } from '../services/speechService';

interface FoodGuideProps {
  profile: UserProfile;
}

export const FoodGuide: React.FC<FoodGuideProps> = ({ profile }) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | TrafficLight>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeFoodModal, setActiveFoodModal] = useState<FoodItem | null>(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  // Active primary condition for dynamic color evaluation
  const activeCondition: HealthCondition = profile.conditions[0] || 'saudavel';

  // Voice Search handler
  const handleVoiceSearch = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    const started = speechService.startListening(
      (transcript) => {
        setSearchQuery(transcript);
        setIsListening(false);
      },
      (error) => {
        console.warn('Erro voz:', error);
        setIsListening(false);
      },
      () => setIsListening(false)
    );
    if (started) setIsListening(true);
  };

  // Speak food description
  const handleSpeakFood = (food: FoodItem, e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (currentlySpeakingId === food.id) {
      speechService.stop();
      setCurrentlySpeakingId(null);
      return;
    }

    const statusText =
      food.statusByCondition[activeCondition] === 'green'
        ? 'Pode priorizar no seu prato!'
        : food.statusByCondition[activeCondition] === 'yellow'
        ? 'Atenção com a quantidade!'
        : 'Evite ou limite no dia a dia!';

    const textToRead = `${food.name}. Classificação: ${statusText}. ${food.shortDescription}. ${food.whyNotice}. Sugestão de preparo: ${food.healthyPreparation}.`;

    speechService.speak(
      textToRead,
      () => setCurrentlySpeakingId(food.id),
      () => setCurrentlySpeakingId(null),
      () => setCurrentlySpeakingId(null)
    );
  };

  // Filter foods
  const filteredFoods = useMemo(() => {
    return FOODS_DATA.filter((food) => {
      const conditionStatus = food.statusByCondition[activeCondition];

      // Traffic light filter
      if (selectedStatusFilter !== 'all' && conditionStatus !== selectedStatusFilter) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && food.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = food.name.toLowerCase().includes(query);
        const matchDesc = food.shortDescription.toLowerCase().includes(query);
        const matchCat = food.categoryLabel.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      return true;
    });
  }, [selectedStatusFilter, selectedCategory, searchQuery, activeCondition]);

  const conditionLabels: Record<HealthCondition, string> = {
    diabetes: 'Diabetes 🩸',
    hipertensao: 'Hipertensão ❤️',
    obesidade: 'Obesidade 🥗',
    saudavel: 'Alimentação Geral 🥦',
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header and Condition Badge */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚦</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                Guia Visual de Alimentos
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Descubra quais alimentos colocar com fartura no prato, quais ter atenção na quantidade e quais limitar.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Avaliando para:
            </span>
            <span className="text-sm font-extrabold text-emerald-900">
              {conditionLabels[activeCondition]}
            </span>
          </div>
        </div>

        {/* Traffic Light Explanation Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
          
          <button
            onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'green' ? 'all' : 'green')}
            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
              selectedStatusFilter === 'green'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-1 ring-emerald-500'
                : 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 text-slate-800'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              🟢
            </div>
            <div>
              <span className="text-xs font-black uppercase text-emerald-800 block">
                Pode Priorizar
              </span>
              <span className="text-xs text-slate-600">Coma com abundância</span>
            </div>
          </button>

          <button
            onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'yellow' ? 'all' : 'yellow')}
            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
              selectedStatusFilter === 'yellow'
                ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs ring-1 ring-amber-400'
                : 'border-amber-200 bg-amber-50/40 hover:bg-amber-50 text-slate-800'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
              🟡
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-800 block">
                Atenção
              </span>
              <span className="text-xs text-slate-600">Observe porção e preparo</span>
            </div>
          </button>

          <button
            onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'red' ? 'all' : 'red')}
            className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
              selectedStatusFilter === 'red'
                ? 'border-rose-600 bg-rose-50 text-rose-950 shadow-xs ring-1 ring-rose-500'
                : 'border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-slate-800'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              🔴
            </div>
            <div>
              <span className="text-xs font-black uppercase text-rose-800 block">
                Evite ou Limite
              </span>
              <span className="text-xs text-slate-600">Pode prejudicar a saúde</span>
            </div>
          </button>

        </div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por alimento (ex: feijão, couve, banana, salgadinho)..."
              className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
            />
            <button
              onClick={handleVoiceSearch}
              title={isListening ? 'Parar de ouvir' : 'Buscar falando pelo microfone'}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Category Selector Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all' as const, label: 'Todos' },
              { id: 'verduras_legumes' as const, label: '🥗 Verduras' },
              { id: 'frutas' as const, label: '🍎 Frutas' },
              { id: 'graos_cereais' as const, label: '🌾 Grãos' },
              { id: 'proteinas' as const, label: '🥚 Proteínas' },
              { id: 'ultraprocessados_bebidas' as const, label: '🥤 Industrializados' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFoods.map((food) => {
          const conditionStatus = food.statusByCondition[activeCondition];
          const isGreen = conditionStatus === 'green';
          const isYellow = conditionStatus === 'yellow';
          const isRed = conditionStatus === 'red';

          const cardBorderColor = isGreen
            ? 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/20'
            : isYellow
            ? 'border-amber-300 hover:border-amber-500 bg-amber-50/20'
            : 'border-rose-300 hover:border-rose-500 bg-rose-50/20';

          const badgeColor = isGreen
            ? 'bg-emerald-600 text-white'
            : isYellow
            ? 'bg-amber-500 text-slate-950 font-bold'
            : 'bg-rose-600 text-white';

          const statusTitle = isGreen
            ? '🟢 PODE PRIORIZAR'
            : isYellow
            ? '🟡 ATENÇÃO'
            : '🔴 EVITE OU LIMITE';

          return (
            <div
              key={food.id}
              onClick={() => setActiveFoodModal(food)}
              className={`rounded-3xl border-2 ${cardBorderColor} bg-white p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
            >
              <div>
                {/* Header with Photo/Icon and Traffic light badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {food.imageUrl ? (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl shrink-0">
                        {food.iconFallback}
                      </div>
                    )}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block">
                        {food.categoryLabel}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 font-display leading-tight">
                        {food.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleSpeakFood(food, e)}
                    title="Ouvir explicação deste alimento"
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      currentlySpeakingId === food.id
                        ? 'bg-amber-400 text-slate-950 animate-pulse'
                        : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'
                    }`}
                    aria-label={`Ouvir sobre ${food.name}`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-xs px-3 py-1 rounded-full font-black ${badgeColor}`}>
                    {statusTitle}
                  </span>
                  {food.brazilianStaple && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      🇧🇷 Básico do Brasil
                    </span>
                  )}
                </div>

                {/* Short accessible explanation */}
                <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {food.shortDescription}
                </p>

                {/* Condition-specific tip */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  <span className="font-extrabold text-slate-900 block mb-0.5">
                    Para você ({conditionLabels[activeCondition]}):
                  </span>
                  <p className="text-slate-600 leading-normal">
                    {food.conditionTips[activeCondition]}
                  </p>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Ver modo de preparo e trocas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <span className="text-4xl block mb-2">🔍</span>
          <h3 className="text-lg font-bold text-slate-800 font-display">
            Nenhum alimento encontrado
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tente pesquisar com outro nome ou remova os filtros de categoria e semáforo acima.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatusFilter('all');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* Modal Detailed View */}
      {activeFoodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 max-h-[92vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl shadow-xs border border-slate-200 shrink-0">
                  {activeFoodModal.iconFallback}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block uppercase">
                    {activeFoodModal.categoryLabel}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 font-display">
                    {activeFoodModal.name}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setActiveFoodModal(null)}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
                aria-label="Fechar detalhes"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Audio Button for the modal */}
            <div className="mt-4">
              <button
                onClick={() => handleSpeakFood(activeFoodModal)}
                className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>Ouvir explicação completa deste alimento</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              
              {/* Motivo de Atenção / Benefício */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  Por que prestar atenção ou priorizar?
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {activeFoodModal.whyNotice}
                </p>
              </div>

              {/* Como Preparar de Forma Saudável */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🍳</span> Como preparar de forma saudável:
                </h4>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                  {activeFoodModal.healthyPreparation}
                </p>
              </div>

              {/* Sugestão de Substituição mais Saudável */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🔄</span> Sugestão de troca inteligente:
                </h4>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                  {activeFoodModal.healthySwapSuggestion}
                </p>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveFoodModal(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Entendi, Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
