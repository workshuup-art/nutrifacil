/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeHero } from './components/WelcomeHero';
import { FoodGuide } from './components/FoodGuide';
import { PlateBuilder } from './components/PlateBuilder';
import { LabelReader } from './components/LabelReader';
import { AIAssistant } from './components/AIAssistant';
import { EconomicEating } from './components/EconomicEating';
import { SmartSwaps } from './components/SmartSwaps';
import { NutritionQuiz } from './components/NutritionQuiz';
import { NutritionDictionary } from './components/NutritionDictionary';
import { MealDiary } from './components/MealDiary';
import { AccessibilityModal } from './components/AccessibilityModal';
import { UserProfile } from './types';
import { speechService } from './services/speechService';
import {
  Compass,
  UtensilsCrossed,
  ScanLine,
  Bot,
  DollarSign,
  Repeat,
  Trophy,
  BookOpen,
  CalendarDays,
  ShieldAlert,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);

  // User Profile state with localStorage persistence
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('nutrifacil_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      name: 'Visitante',
      ageGroup: 'adulto',
      conditions: ['diabetes', 'hipertensao'],
      fontSize: 'normal',
      highContrast: false,
      autoAudio: false,
      budgetPriority: 'baixo',
    };
  });

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nutrifacil_profile', JSON.stringify(profile));
    } catch {
      // ignore
    }

    // Apply font-size to html tag
    const root = document.documentElement;
    root.classList.remove('font-normal', 'font-large', 'font-xlarge');
    root.classList.add(`font-${profile.fontSize}`);

    // Apply high-contrast
    if (profile.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [profile]);

  // Clean audio speech on tab change
  useEffect(() => {
    speechService.stop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950 pb-20 lg:pb-0">
      
      {/* 1. Header (Sticky Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        setProfile={setProfile}
        onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
      />

      {/* 2. Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        
        {activeTab === 'inicio' && (
          <WelcomeHero
            profile={profile}
            setProfile={setProfile}
            onStartGuide={() => setActiveTab('guia')}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'guia' && <FoodGuide profile={profile} />}

        {activeTab === 'prato' && <PlateBuilder profile={profile} />}

        {activeTab === 'rotulo' && <LabelReader profile={profile} />}

        {activeTab === 'ia' && <AIAssistant profile={profile} />}

        {activeTab === 'economia' && <EconomicEating />}

        {activeTab === 'trocas' && <SmartSwaps profile={profile} />}

        {activeTab === 'quiz' && <NutritionQuiz />}

        {activeTab === 'dicionario' && <NutritionDictionary />}

        {activeTab === 'diario' && <MealDiary profile={profile} />}

      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('guia')}
              className="hover:text-emerald-800 cursor-pointer"
            >
              Guia de Alimentos
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('prato')}
              className="hover:text-emerald-800 cursor-pointer"
            >
              Monte seu Prato
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('rotulo')}
              className="hover:text-emerald-800 cursor-pointer"
            >
              Leitor de Rótulos
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('ia')}
              className="hover:text-emerald-800 cursor-pointer"
            >
              Assistente IA
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('economia')}
              className="hover:text-emerald-800 cursor-pointer"
            >
              Comer Barato
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('dicionario')}
              className="hover:text-emerald-800 cursor-pointer"
            >
              Dicionário Nutricional
            </button>
          </div>

          <p className="max-w-2xl mx-auto leading-relaxed text-slate-400">
            <strong>NutriFácil · Saúde que se entende. Informação para todos.</strong>
            <br />
            Conteúdo educativo fundamentado no Guia Alimentar para a População Brasileira (Ministério da Saúde) e recomendações da Organização Mundial da Saúde (OMS). Não substitui consultas individuais com nutricionistas ou médicos.
          </p>

          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} NutriFácil · Acessibilidade, saúde inclusiva e alimentação consciente.
          </p>
        </div>
      </footer>

      {/* 4. Accessibility Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        profile={profile}
        setProfile={setProfile}
      />

      {/* 5. Ergonomic Mobile Bottom Tab Bar (Hitbox >= 44px) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg"
        aria-label="Navegação inferior mobile"
      >
        {[
          { id: 'inicio', label: 'Início', icon: Compass },
          { id: 'guia', label: 'Guia', icon: UtensilsCrossed },
          { id: 'prato', label: 'Prato', icon: Trophy },
          { id: 'rotulo', label: 'Rótulo', icon: ScanLine },
          { id: 'ia', label: 'Assistente', icon: Bot },
          { id: 'economia', label: 'Economia', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[46px] min-w-[46px] flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
