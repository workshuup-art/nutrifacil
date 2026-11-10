import React from 'react';
import { X, Volume2, Type, Sun, Heart, DollarSign, Check } from 'lucide-react';
import { HealthCondition, UserProfile } from '../types';
import { speechService } from '../services/speechService';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile,
}) => {
  if (!isOpen) return null;

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

  const handleTestAudio = () => {
    speechService.speak(
      'Este é um teste da voz do NutriFácil. O som está nítido e em um volume agradável para você?'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
              👁️
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-extrabold text-slate-900 font-display">
                Acessibilidade e Preferências
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Ajuste para ler e ouvir com facilidade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
            aria-label="Fechar janela de acessibilidade"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          
          {/* 1. Tamanho da Letra */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <Type className="w-4 h-4 text-emerald-600" />
              Tamanho do Texto
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'normal', label: 'Normal', preview: 'A' },
                  { id: 'large', label: 'Grande', preview: 'A+' },
                  { id: 'xlarge', label: 'Extra Grande', preview: 'A++' },
                ] as const
              ).map((size) => (
                <button
                  key={size.id}
                  onClick={() => setProfile((p) => ({ ...p, fontSize: size.id }))}
                  className={`min-h-[48px] p-3 rounded-2xl border-2 text-center font-bold cursor-pointer transition-all flex flex-col items-center justify-center ${
                    profile.fontSize === size.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-lg leading-none">{size.preview}</span>
                  <span className="text-xs mt-1">{size.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Alto Contraste */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-sm font-bold text-slate-900 block">Modo Alto Contraste</span>
                <span className="text-xs text-slate-500">Bordas mais escuras e cores bem visíveis</span>
              </div>
            </div>
            <button
              onClick={() => setProfile((p) => ({ ...p, highContrast: !p.highContrast }))}
              className={`min-w-[50px] h-8 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                profile.highContrast ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
              aria-label="Alternar alto contraste"
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* 3. Leitura por Voz & Teste de Áudio */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-700" />
                <span className="text-sm font-bold text-emerald-950">Voz e Narração</span>
              </div>
              <button
                onClick={handleTestAudio}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                Testar Voz
              </button>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              O NutriFácil lê os textos em voz alta para você não precisar forçar a vista. Basta tocar no botão com desenho de alto-falante em qualquer alimento!
            </p>
          </div>

          {/* 4. Suas Condições de Saúde */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <Heart className="w-4 h-4 text-rose-600" />
              Minhas Condições de Saúde (pode marcar mais de uma)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'diabetes' as const, label: 'Diabetes', emoji: '🩸', sub: 'Açúcar no sangue' },
                { id: 'hipertensao' as const, label: 'Hipertensão', emoji: '❤️', sub: 'Pressão alta' },
                { id: 'obesidade' as const, label: 'Obesidade / Peso', emoji: '🥗', sub: 'Controle de peso' },
                { id: 'saudavel' as const, label: 'Alimentação Geral', emoji: '🍎', sub: 'Comer bem e viver melhor' },
              ].map((item) => {
                const isSelected = profile.conditions.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleCondition(item.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-2.5 min-h-[56px] ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold truncate">{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate">{item.sub}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 cursor-pointer"
          >
            Salvar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
