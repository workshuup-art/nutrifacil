import React, { useState } from 'react';
import { Volume2, VolumeX, Eye, Settings, Heart, Sparkles } from 'lucide-react';
import { HealthCondition, UserProfile } from '../types';
import { speechService } from '../services/speechService';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenAccessibility: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  setProfile,
  onOpenAccessibility,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleGlobalAudio = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else {
      const guideText = `Bem-vindo ao NutriFácil! Saúde que se entende. Informação nutricional simples e visual para todos. Navegue pelas opções: Guia de Alimentos, Monte seu Prato, Leitor de Rótulos, Assistente com Inteligência Artificial e Comer Bem Gastando Pouco.`;
      speechService.speak(
        guideText,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  const navLinks = [
    { id: 'inicio', label: 'Início' },
    { id: 'guia', label: 'Guia de Alimentos' },
    { id: 'prato', label: 'Monte seu Prato' },
    { id: 'rotulo', label: 'Leitor de Rótulos' },
    { id: 'ia', label: 'Assistente IA' },
    { id: 'economia', label: 'Comer Barato' },
    { id: 'trocas', label: 'Trocas' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'diario', label: 'Minha Comida' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single Brand Wordmark in display face */}
        <button
          onClick={() => setActiveTab('inicio')}
          className="flex items-center gap-2 group text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg p-1"
          aria-label="NutriFácil Início"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white text-xl font-bold shadow-sm shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            🥗
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-display tracking-tight leading-none">
              Nutri<span className="text-emerald-600">Fácil</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 tracking-wide uppercase">
              Saúde que se entende
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line navigation links (desktop) */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-700 overflow-x-auto py-1"
          aria-label="Navegação Principal"
        >
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-2 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer text-sm font-semibold ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-900 font-bold'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action & Accessibility trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleGlobalAudio}
            title={isSpeaking ? 'Parar leitura de áudio' : 'Ouvir explicações da página'}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              isSpeaking
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
            aria-label={isSpeaking ? 'Parar leitura de voz' : 'Ouvir áudio da página'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-5 h-5 text-white" />
                <span className="hidden sm:inline">Parar Som</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-emerald-700" />
                <span className="hidden sm:inline">Ouvir Guia</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenAccessibility}
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-2 cursor-pointer transition-colors border border-slate-200"
            title="Opções de Acessibilidade (tamanho das letras e contraste)"
            aria-label="Abrir configurações de acessibilidade"
          >
            <Eye className="w-5 h-5 text-emerald-700" />
            <span className="hidden md:inline text-xs font-bold">Acessibilidade</span>
          </button>
        </div>

      </div>

      {/* Mobile Secondary Scrollable Tab strip */}
      <div className="lg:hidden border-t border-emerald-100/70 bg-emerald-50/50 px-2 py-2 overflow-x-auto flex gap-1.5 scrollbar-none">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
