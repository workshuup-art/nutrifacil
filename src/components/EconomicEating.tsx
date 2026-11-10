import React, { useState } from 'react';
import { Volume2, VolumeX, DollarSign, Sparkles, ChefHat, ShoppingBag, Lightbulb, Check } from 'lucide-react';
import { ECONOMIC_STAPLES, ECONOMIC_RECIPES, FEIRA_TIPS, EconomicRecipe } from '../data/economicTipsData';
import { speechService } from '../services/speechService';

export const EconomicEating: React.FC = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<EconomicRecipe | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeakStaple = (name: string, benefit: string, tip: string) => {
    const text = `${name}. Benefício: ${benefit}. Dica de economia: ${tip}.`;
    speechService.speak(text);
  };

  const handleSpeakRecipe = (recipe: EconomicRecipe) => {
    const text = `Receita econômica: ${recipe.name}. Custo estimado por pessoa: ${recipe.estimatedCostPerServing}. Rende ${recipe.servings} porções. ${recipe.nutritionHighlight}. Ingredientes: ${recipe.ingredients.join(', ')}.`;
    speechService.speak(text);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Intro Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 sm:p-10 shadow-lg">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold mb-3">
            <span>💰</span>
            <span>Comer Bem Gastando Pouco</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white">
            Saúde e Nutrição Cabem no Bolso
          </h2>
          <p className="mt-2 text-sm sm:text-base text-emerald-100 leading-relaxed font-medium">
            Alimentação saudável de verdade não precisa de produtos caros ou importados. A comida tradicional brasileira da feira e da horta é uma das mais ricas e completas do planeta!
          </p>
        </div>
      </div>

      {/* Brazilian Staples Grid */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🇧🇷</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Os 6 Campeões da Economia e Nutrição
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Alimentos baratos, fáceis de encontrar e que formam a base da saúde brasileira:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ECONOMIC_STAPLES.map((staple) => (
            <div
              key={staple.name}
              className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 hover:bg-white transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-1 bg-white rounded-xl shadow-xs border border-slate-100">
                      {staple.emoji}
                    </span>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 font-display">
                        {staple.name}
                      </h4>
                      <span className="text-[11px] font-bold text-emerald-700 block">
                        {staple.priceBadge}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSpeakStaple(staple.name, staple.benefit, staple.tip)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-emerald-50 text-emerald-700 flex items-center justify-center cursor-pointer shadow-xs"
                    title="Ouvir dica"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 mt-3 leading-relaxed font-medium">
                  {staple.benefit}
                </p>

                <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-950 font-medium">
                  💡 <strong>Como economizar:</strong> {staple.tip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Low-Cost Balanced Meal Recipes */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🍲</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Pratos Completos por menos de R$ 5,00
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Refeições nutritivas com custo médio calculado para uma família brasileira:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ECONOMIC_RECIPES.map((recipe) => (
            <div
              key={recipe.id}
              className="rounded-3xl border border-slate-200 p-5 bg-white hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{recipe.emoji}</span>
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-700 block">
                      {recipe.estimatedCostPerServing}
                    </span>
                    <span className="text-[10px] text-slate-400 block">por pessoa</span>
                  </div>
                </div>

                <h4 className="text-lg font-black text-slate-900 font-display mt-3 leading-tight">
                  {recipe.name}
                </h4>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {recipe.nutritionHighlight}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-2">
                    Ingredientes principais:
                  </span>
                  <ul className="space-y-1">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Tempo: {recipe.preparationTime}
                </span>
                <button
                  onClick={() => handleSpeakRecipe(recipe)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-emerald-200"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Ouvir Receita</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Dicas de Ouro da Feira */}
      <section className="bg-amber-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-6 h-6 text-amber-700" />
          <h3 className="text-xl font-black text-amber-950 font-display">
            4 Dicas de Ouro para a Feira Livre e Mercado
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEIRA_TIPS.map((tip, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-amber-100 shadow-xs">
              <h4 className="text-sm font-extrabold text-slate-900 font-display flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                {tip.title}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
