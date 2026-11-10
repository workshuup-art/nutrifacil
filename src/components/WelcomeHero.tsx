import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowRight, Heart, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import { HealthCondition, UserProfile } from '../types';
import { speechService } from '../services/speechService';
import { FOODS_DATA } from '../data/foodsData';

interface WelcomeHeroProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onStartGuide: () => void;
  onSelectTab: (tab: string) => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  profile,
  setProfile,
  onStartGuide,
  onSelectTab,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Alimento do Dia: dynamic selection based on the day of the month
  const dayIndex = new Date().getDate() % FOODS_DATA.length;
  const foodOfDay = FOODS_DATA[dayIndex] || FOODS_DATA[0];

  const handlePlayHeroAudio = () => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else {
      const audioSpeech = `Olá! Seja bem-vindo ao NutriFácil! Comer melhor ficou mais fácil. Aqui você aprende de forma simples e visual quais alimentos priorizar no prato verde, quais precisam de atenção no amarelo e quais evitar no vermelho. Toque em qualquer cartão para ver os detalhes. Para começar, toque no botão verde Começar Agora!`;
      speechService.speak(
        audioSpeech,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleToggleCondition = (cond: HealthCondition) => {
    setProfile((prev) => {
      const exists = prev.conditions.includes(cond);
      let updated: HealthCondition[];
      if (exists) {
        updated = prev.conditions.filter((c) => c !== cond);
        if (updated.length === 0) updated = ['saudavel'];
      } else {
        updated = [...prev.conditions.filter((c) => c !== 'saudavel'), cond];
      }
      return { ...prev, conditions: updated };
    });
  };

  const conditionCards = [
    {
      id: 'diabetes' as const,
      title: 'Diabetes',
      subtitle: 'Controle de açúcar no sangue',
      emoji: '🩸',
      color: 'hover:border-rose-300 hover:bg-rose-50/50',
      activeColor: 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-400',
    },
    {
      id: 'hipertensao' as const,
      title: 'Hipertensão',
      subtitle: 'Coração e pressão alta',
      emoji: '❤️',
      color: 'hover:border-red-300 hover:bg-red-50/50',
      activeColor: 'border-red-500 bg-red-50 text-red-950 ring-2 ring-red-400',
    },
    {
      id: 'obesidade' as const,
      title: 'Obesidade',
      subtitle: 'Prato equilibrado e saciedade',
      emoji: '🥗',
      color: 'hover:border-amber-300 hover:bg-amber-50/50',
      activeColor: 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-400',
    },
    {
      id: 'saudavel' as const,
      title: 'Alimentação Saudável',
      subtitle: 'Frutas, legumes e vitalidade',
      emoji: '🥦',
      color: 'hover:border-emerald-300 hover:bg-emerald-50/50',
      activeColor: 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-800 text-white shadow-xl shadow-emerald-950/15">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <img
            src="/src/assets/images/hero_brazilian_fresh_food_1794224362973.jpg"
            alt="Mesa farta de alimentos frescos brasileiros"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 sm:py-14 sm:px-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs sm:text-sm font-semibold mb-4 border border-white/20">
            <span>🇧🇷</span>
            <span>Saúde que se entende · Informação para todos</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Comer melhor ficou mais fácil!
          </h1>

          <p className="mt-4 text-base sm:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed font-medium">
            Entenda sua alimentação sem palavras difíceis. Use o semáforo verde, amarelo e vermelho para fazer as melhores escolhas para a sua saúde e para o seu bolso.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartGuide}
              className="w-full sm:w-auto min-h-[56px] px-8 py-4 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-lg shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <span>Começar Agora</span>
              <ArrowRight className="w-6 h-6 text-emerald-700" />
            </button>

            <button
              onClick={handlePlayHeroAudio}
              className={`w-full sm:w-auto min-h-[56px] px-6 py-4 rounded-2xl font-bold text-base transition-all cursor-pointer flex items-center justify-center gap-2.5 border-2 ${
                isPlayingAudio
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-emerald-900/60 hover:bg-emerald-900/80 text-white border-white/30 backdrop-blur-md'
              }`}
              aria-label="Ouvir orientações em áudio"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-5 h-5 text-slate-950" />
                  <span>Pausar Áudio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 text-amber-300" />
                  <span>Ouvir em Voz Alta</span>
                </>
              )}
            </button>
          </div>

        </div>
      </section>

      {/* Condições de Saúde - Seleção Rápida */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🩺</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Escolha sua Condição de Saúde
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Toque nos cartões abaixo para personalizar as cores e os alertas dos alimentos para você:
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Baseado no Guia do Ministério da Saúde</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {conditionCards.map((card) => {
            const isSelected = profile.conditions.includes(card.id);
            return (
              <button
                key={card.id}
                onClick={() => handleToggleCondition(card.id)}
                className={`min-h-[96px] p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-4 ${
                  isSelected
                    ? card.activeColor
                    : `border-slate-200 bg-slate-50/50 ${card.color} text-slate-800`
                }`}
                aria-pressed={isSelected}
              >
                <div className="text-4xl shrink-0 p-1 bg-white rounded-2xl shadow-xs border border-slate-100">
                  {card.emoji}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold block truncate">
                      {card.title}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                        Ativo
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 block leading-tight">
                    {card.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Safety Disclaimer */}
        <div className="mt-5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
          <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            <strong>Importante:</strong> As orientações do NutriFácil são puramente educativas e preventivas. Elas <strong>não substituem</strong> consultas com nutricionistas, médicos ou a equipe do posto de saúde (SUS).
          </p>
        </div>
      </section>

      {/* Alimento do Dia & Destaques de Acesso Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alimento do Dia */}
        <div className="lg:col-span-1 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl p-6 border border-emerald-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Alimento do Dia
              </span>
              <button
                onClick={() => speechService.speak(`Alimento do dia: ${foodOfDay.name}. ${foodOfDay.shortDescription} ${foodOfDay.whyNotice}`)}
                className="w-9 h-9 rounded-xl bg-white shadow-xs border border-emerald-200 flex items-center justify-center text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                title="Ouvir sobre o alimento do dia"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-emerald-100 flex items-center justify-center text-3xl">
                {foodOfDay.iconFallback}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  {foodOfDay.name}
                </h3>
                <span className="text-xs font-bold text-emerald-700">
                  {foodOfDay.generalStatus === 'green' ? '🟢 Pode Priorizar' : foodOfDay.generalStatus === 'yellow' ? '🟡 Atenção à Porção' : '🔴 Limitar'}
                </span>
              </div>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {foodOfDay.shortDescription}
            </p>

            <div className="mt-3 p-3 rounded-xl bg-white/80 border border-emerald-100 text-xs text-emerald-950 font-semibold">
              💡 <strong>Dica de preparo:</strong> {foodOfDay.healthyPreparation}
            </div>
          </div>

          <button
            onClick={() => onSelectTab('guia')}
            className="mt-4 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Ver no Guia de Alimentos
          </button>
        </div>

        {/* 4 Blocos de Ações Visuais */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <button
            onClick={() => onSelectTab('prato')}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🍽️
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Interativo
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Monte seu Prato
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Descubra a divisão certa: 50% de verduras e legumes, 25% de proteínas e 25% de carboidratos.
              </p>
            </div>
            <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span>Montar agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onSelectTab('rotulo')}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🏷️
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                Com Inteligência Artificial
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Leitor de Rótulos
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Envie a foto do pacotinho ou informe o sal e açúcar para traduzirmos no semáforo nutricional.
              </p>
            </div>
            <div className="mt-3 text-xs font-bold text-amber-700 flex items-center gap-1">
              <span>Ler rótulo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onSelectTab('economia')}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                💰
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Econômico
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Comer Bem Gastando Pouco
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pratos completos por menos de R$ 5,00: arroz, feijão, ovos, abóbora e dicas da xepa da feira.
              </p>
            </div>
            <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span>Economizar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onSelectTab('ia')}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🤖
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                Por Voz ou Texto
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Assistente NutriFácil
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pergunte em áudio ou texto se pode comer banana com diabetes ou como temperar sem sal.
              </p>
            </div>
            <div className="mt-3 text-xs font-bold text-indigo-700 flex items-center gap-1">
              <span>Tirar dúvidas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

        </div>

      </div>

    </div>
  );
};
