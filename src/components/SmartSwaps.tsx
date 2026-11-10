import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowRight, Sparkles, RefreshCw, CheckCircle, XCircle, Search } from 'lucide-react';
import { UserProfile } from '../types';
import { SMART_SWAPS } from '../data/swapsData';
import { getSmartSwap } from '../services/apiService';
import { speechService } from '../services/speechService';

interface SmartSwapsProps {
  profile: UserProfile;
}

export const SmartSwaps: React.FC<SmartSwapsProps> = ({ profile }) => {
  const [customFood, setCustomFood] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customResult, setCustomResult] = useState<{
    originalFood: string;
    healthyAlternative: string;
    whyItIsBetter: string;
    economyTip: string;
  } | null>(null);

  const handleSpeakSwap = (title: string, beforeName: string, afterName: string, whyBetter: string) => {
    const speech = `Troca inteligente para ${title}. Em vez de consumir ${beforeName}, experimente trocar por ${afterName}. Por que faz bem: ${whyBetter}.`;
    speechService.speak(speech);
  };

  const handleCustomSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFood.trim() || isGenerating) return;

    setIsGenerating(true);
    setCustomResult(null);
    try {
      const res = await getSmartSwap(customFood.trim(), profile.conditions);
      setCustomResult(res);
      speechService.speak(
        `Troque ${res.originalFood} por ${res.healthyAlternative}. ${res.whyItIsBetter}. ${res.economyTip}`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔄</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Troca Inteligente de Alimentos
          </h2>
        </div>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Pequenas substituições no dia a dia fazem uma diferença gigante na sua pressão arterial, no controle do diabetes e na sua carteira!
        </p>

        {/* Custom AI Swap Generator Bar */}
        <form onSubmit={handleCustomSwap} className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={customFood}
              onChange={(e) => setCustomFood(e.target.value)}
              placeholder="Digite qualquer alimento para trocar (ex: maionese, presunto, achocolatado)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={!customFood.trim() || isGenerating}
            className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-extrabold text-sm shadow-sm cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Buscando troca com IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Pedir Troca Saudável</span>
              </>
            )}
          </button>
        </form>

        {/* Custom AI Result Box */}
        {customResult && (
          <div className="mt-5 p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 animate-fadeIn space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-800">
                Sugestão Personalizada da NutriFácil
              </span>
              <button
                onClick={() =>
                  speechService.speak(
                    `Troque ${customResult.originalFood} por ${customResult.healthyAlternative}. ${customResult.whyItIsBetter}. ${customResult.economyTip}`
                  )
                }
                className="w-8 h-8 rounded-lg bg-white border border-emerald-200 text-emerald-800 flex items-center justify-center cursor-pointer"
                title="Ouvir"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-black text-slate-900 font-display">
              Troque <span className="text-rose-600 line-through">{customResult.originalFood}</span> por{' '}
              <span className="text-emerald-700">{customResult.healthyAlternative}</span>!
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {customResult.whyItIsBetter}
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <span>💰</span>
              <span>{customResult.economyTip}</span>
            </div>
          </div>
        )}
      </div>

      {/* Visual Side-by-Side Comparison Grid */}
      <div className="space-y-5">
        {SMART_SWAPS.map((swap) => (
          <div
            key={swap.id}
            className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {swap.title}
                </span>
                <button
                  onClick={() =>
                    handleSpeakSwap(swap.title, swap.before.name, swap.after.name, swap.after.whyBetter)
                  }
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 flex items-center justify-center cursor-pointer"
                  title="Ouvir esta troca inteligente"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Side-by-Side Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* BEFORE: EVITAR */}
                <div className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/30 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                    {swap.before.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-black uppercase text-rose-700 block">
                      🔴 Em vez de comer:
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 font-display">
                      {swap.before.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {swap.before.whyAvoid}
                    </p>
                  </div>
                </div>

                {/* AFTER: PREFERIR */}
                <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-emerald-300 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                    {swap.after.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-black uppercase text-emerald-800 block">
                      🟢 Experimente trocar por:
                    </span>
                    <h4 className="text-sm font-extrabold text-emerald-950 font-display">
                      {swap.after.name}
                    </h4>
                    <p className="text-xs text-emerald-900 mt-1 leading-relaxed font-medium">
                      {swap.after.whyBetter}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Economy Badge Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl">
              <span>💡</span>
              <span>{swap.economyNote}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
