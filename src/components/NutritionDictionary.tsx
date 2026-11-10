import React, { useState } from 'react';
import { Volume2, VolumeX, BookOpen, Search } from 'lucide-react';
import { DICTIONARY_TERMS } from '../data/dictionaryData';
import { speechService } from '../services/speechService';
import { DictionaryTerm } from '../types';

export const NutritionDictionary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  const handleSpeakTerm = (term: DictionaryTerm) => {
    if (activeSpeakingId === term.id) {
      speechService.stop();
      setActiveSpeakingId(null);
      return;
    }

    const speech = `${term.term}. O que é: ${term.plainMeaning}. Pense assim: ${term.simpleAnalogy}. Por que importa: ${term.whyItMatters}. Onde é encontrado: ${term.whereItIsFound}.`;
    speechService.speak(
      speech,
      () => setActiveSpeakingId(term.id),
      () => setActiveSpeakingId(null),
      () => setActiveSpeakingId(null)
    );
  };

  const filteredTerms = DICTIONARY_TERMS.filter((term) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      term.term.toLowerCase().includes(q) ||
      term.plainMeaning.toLowerCase().includes(q) ||
      term.simpleAnalogy.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                Dicionário Nutricional Simples
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Palavras difíceis que aparecem nos exames e na televisão explicadas com comparações do dia a dia para qualquer pessoa entender.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar termo (ex: sal, fibra, açúcar)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
          />
        </div>
      </div>

      {/* Terms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                    {term.emoji}
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-display">
                      {term.term}
                    </h3>
                    <span className="text-xs text-emerald-800 font-bold block">
                      Explicação do dia a dia
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeakTerm(term)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                    activeSpeakingId === term.id
                      ? 'bg-amber-400 text-slate-950 animate-pulse'
                      : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'
                  }`}
                  title="Ouvir explicação deste termo"
                  aria-label={`Ouvir explicação de ${term.term}`}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Analogy Box */}
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs sm:text-sm font-semibold">
                💭 <strong>Como imaginar:</strong> {term.simpleAnalogy}
              </div>

              {/* Plain Meaning */}
              <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <strong>O que é de verdade:</strong> {term.plainMeaning}
              </p>

              {/* Why it Matters */}
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>Por que importa para você:</strong> {term.whyItMatters}
              </p>
            </div>

            {/* Where is it found */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
              📍 <strong>Onde se encontra:</strong> {term.whereItIsFound}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
