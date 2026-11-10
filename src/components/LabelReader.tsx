import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { UserProfile } from '../types';
import { analyzeNutritionLabel, AnalyzeLabelResponse } from '../services/apiService';
import { speechService } from '../services/speechService';

interface LabelReaderProps {
  profile: UserProfile;
}

// Demo presets for immediate testing
const SAMPLE_PRESETS = [
  {
    name: 'Biscoito Recheado Tradicional',
    icon: '🍪',
    servingSize: '30g (3 biscoitos)',
    carbs: '22',
    sugars: '12',
    sodium: '95',
    fats: '6',
    fibers: '0.6',
  },
  {
    name: 'Refrigerante sabor Cola',
    icon: '🥤',
    servingSize: '200ml (1 copo)',
    carbs: '21',
    sugars: '21',
    sodium: '18',
    fats: '0',
    fibers: '0',
  },
  {
    name: 'Aveia em Flocos Finos Integral',
    icon: '🌾',
    servingSize: '30g (2 colheres)',
    carbs: '17',
    sugars: '0',
    sodium: '0',
    fats: '2.2',
    fibers: '3.3',
  },
  {
    name: 'Macarrão Instantâneo de Galinha',
    icon: '🍜',
    servingSize: '85g (1 pacote)',
    carbs: '54',
    sugars: '2',
    sodium: '1480',
    fats: '14',
    fibers: '2',
  },
];

export const LabelReader: React.FC<LabelReaderProps> = ({ profile }) => {
  const [activeInputMode, setActiveInputMode] = useState<'sample' | 'photo' | 'manual'>('sample');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [servingSize, setServingSize] = useState('1 porção (30g)');
  const [sugars, setSugars] = useState('12');
  const [sodium, setSodium] = useState('140');
  const [fats, setFats] = useState('5');
  const [fibers, setFibers] = useState('1.5');
  const [carbs, setCarbs] = useState('20');

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeLabelResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setProductName(preset.name);
    setServingSize(preset.servingSize);
    setCarbs(preset.carbs);
    setSugars(preset.sugars);
    setSodium(preset.sodium);
    setFats(preset.fats);
    setFibers(preset.fibers);
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      let reqPayload: any = {
        conditions: profile.conditions,
      };

      if (selectedImage) {
        reqPayload.imageBase64 = selectedImage;
        reqPayload.mimeType = 'image/jpeg';
      } else {
        reqPayload.textData = {
          productName: productName || 'Alimento informado',
          servingSize,
          sugars,
          sodium,
          fats,
          fibers,
          carbs,
        };
      }

      const result = await analyzeNutritionLabel(reqPayload);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakAnalysis = () => {
    if (!analysisResult) return;

    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
      return;
    }

    const text = `Análise do rótulo para ${analysisResult.productName}. ${analysisResult.simpleExplanation} ${analysisResult.conditionAlert} Sugestão de troca: ${analysisResult.healthierSwap}`;
    speechService.speak(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const renderLightBadge = (color: 'green' | 'yellow' | 'red', label: string) => {
    if (color === 'green') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
          <span>🟢</span> {label}: Quantidade Boa
        </span>
      );
    }
    if (color === 'yellow') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
          <span>🟡</span> {label}: Atenção / Moderado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300">
        <span>🔴</span> {label}: Muito Alto / Limitar
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏷️</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                Leitor de Rótulos com IA
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Descubra se o alimento tem <strong>muito sal, muito açúcar ou gordura ruim</strong>. A IA traduz a tabela nutricional para a linguagem do dia a dia.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveInputMode('sample')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeInputMode === 'sample'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Exemplos Prontos
            </button>
            <button
              onClick={() => setActiveInputMode('photo')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeInputMode === 'photo'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Enviar Foto
            </button>
            <button
              onClick={() => setActiveInputMode('manual')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeInputMode === 'manual'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Digitar Valores
            </button>
          </div>
        </div>

        {/* Input Mode 1: Sample presets */}
        {activeInputMode === 'sample' && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide block mb-3">
              Escolha um produto comum do supermercado para testar agora:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                    productName === preset.name
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <span className="text-3xl shrink-0">{preset.icon}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold block truncate">{preset.name}</span>
                    <span className="text-[11px] text-slate-500 block truncate">{preset.servingSize}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Mode 2: Photo upload */}
        {activeInputMode === 'photo' && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-5 h-5 text-emerald-700" />
                <span>Fotografar ou Escolher Imagem do Rótulo</span>
              </button>

              <button
                onClick={() => {
                  setSelectedImage('/src/assets/images/nutrition_label_inspection_1794224364471.jpg');
                  setAnalysisResult(null);
                }}
                className="text-xs font-bold text-slate-600 hover:text-emerald-700 underline cursor-pointer"
              >
                Usar foto de exemplo (Granola Integral)
              </button>
            </div>

            {selectedImage && (
              <div className="mt-4 flex items-center gap-4 p-3 rounded-2xl bg-slate-100 border border-slate-200 max-w-md">
                <img
                  src={selectedImage}
                  alt="Rótulo selecionado"
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    Foto pronta para análise com IA
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Toque em "Analisar Rótulo" abaixo
                  </span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  Remover
                </button>
              </div>
            )}
          </div>
        )}

        {/* Input Mode 3: Manual Values */}
        {activeInputMode === 'manual' && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">
                  Nome do Alimento
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Suco de uva, Pão de forma..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">
                  Tamanho da Porção
                </label>
                <input
                  type="text"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  placeholder="Ex: 1 copo (200ml), 2 fatias..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Açúcar (g)
                </label>
                <input
                  type="number"
                  value={sugars}
                  onChange={(e) => setSugars(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Sódio / Sal (mg)
                </label>
                <input
                  type="number"
                  value={sodium}
                  onChange={(e) => setSodium(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Gorduras Totais (g)
                </label>
                <input
                  type="number"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Fibras (g)
                </label>
                <input
                  type="number"
                  value={fibers}
                  onChange={(e) => setFibers(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analisando rótulo com IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Analisar este Rótulo Agora</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Result Display */}
      {analysisResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-md animate-fadeIn space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-700 block">
                Resultado da Análise
              </span>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                {analysisResult.productName}
              </h3>
            </div>

            <button
              onClick={handleSpeakAnalysis}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'Pausar Áudio' : 'Ouvir Explicação em Voz Alta'}</span>
            </button>
          </div>

          {/* Traffic Light Nutrient Badges */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Semáforo dos Nutrientes
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {renderLightBadge(analysisResult.trafficLights.sugar, 'Açúcar')}
              {renderLightBadge(analysisResult.trafficLights.sodium, 'Sódio (Sal)')}
              {renderLightBadge(analysisResult.trafficLights.fats, 'Gorduras')}
              {renderLightBadge(analysisResult.trafficLights.fibers, 'Fibras')}
            </div>
          </div>

          {/* Plain Explanation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
              O que isso quer dizer na prática?
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {analysisResult.simpleExplanation}
            </p>
          </div>

          {/* Condition Alert */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Alerta para a sua saúde ({profile.conditions.join(', ')}):
            </h4>
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              {analysisResult.conditionAlert}
            </p>
          </div>

          {/* Healthier Swap */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-1 flex items-center gap-1.5">
              <span>💡</span> Sugestão de troca mais saudável e econômica:
            </h4>
            <p className="text-sm text-emerald-900 leading-relaxed font-medium">
              {analysisResult.healthierSwap}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
