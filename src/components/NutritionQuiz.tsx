import React, { useState } from 'react';
import { Volume2, VolumeX, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Star } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { speechService } from '../services/speechService';

export const NutritionQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSpeakQuestion = () => {
    speechService.speak(currentQ.audioPrompt);
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optId);
    setIsAnswerSubmitted(true);

    const option = currentQ.options.find((o) => o.id === optId);
    if (option?.isCorrect) {
      setScore((s) => s + 1);
      speechService.speak(`Muito bem! Resposta correta! ${option.explanation}`);
    } else if (option) {
      speechService.speak(`Atenção! ${option.explanation}`);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      speechService.speak(
        `Parabéns! Você completou o quiz NutriFácil e acertou ${score + (currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect ? 1 : 0)} de ${QUIZ_QUESTIONS.length} perguntas!`
      );
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Quiz Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
        
        {!isQuizCompleted ? (
          <div>
            {/* Header progress */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Aprenda Brincando · Pergunta {currentIdx + 1} de {QUIZ_QUESTIONS.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{score} Estrelas</span>
              </div>
            </div>

            {/* Question Text & Audio Button */}
            <div className="mt-6 flex items-start justify-between gap-4">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display leading-snug">
                {currentQ.question}
              </h3>
              <button
                onClick={handleSpeakQuestion}
                className="w-12 h-12 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                title="Ouvir a pergunta em voz alta"
                aria-label="Ouvir a pergunta"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            {/* Options */}
            <div className="mt-8 space-y-3.5">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optStyles = 'border-slate-200 hover:border-emerald-300 bg-slate-50/60 text-slate-800';

                if (isAnswerSubmitted) {
                  if (opt.isCorrect) {
                    optStyles = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-500';
                  } else if (isSelected && !opt.isCorrect) {
                    optStyles = 'border-rose-400 bg-rose-100 text-rose-950 ring-2 ring-rose-400';
                  } else {
                    optStyles = 'opacity-50 border-slate-200 bg-slate-50';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswerSubmitted}
                    className={`w-full min-h-[64px] p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-4 ${optStyles}`}
                  >
                    <span className="text-3xl shrink-0 p-1 bg-white rounded-xl shadow-xs">
                      {opt.emoji}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold flex-1 leading-snug">
                      {opt.text}
                    </span>
                    {isAnswerSubmitted && opt.isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                      <XCircle className="w-6 h-6 text-rose-700 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswerSubmitted && (
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-fadeIn">
                <span className="text-xs font-black uppercase text-slate-800 block mb-1">
                  💡 Explicação simples:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {currentQ.options.find((o) => o.id === selectedOptionId)?.explanation ||
                    currentQ.options.find((o) => o.isCorrect)?.explanation}
                </p>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 cursor-pointer flex items-center gap-2"
                  >
                    <span>{currentIdx + 1 < QUIZ_QUESTIONS.length ? 'Próxima Pergunta' : 'Ver Resultado'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Completed Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-amber-100 mx-auto flex items-center justify-center text-5xl">
              🏆
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Parabéns, Campeão da Nutrição!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Você completou o quiz e acertou <strong>{score}</strong> de{' '}
              <strong>{QUIZ_QUESTIONS.length}</strong> perguntas! Aprender a comer bem é o maior presente para a sua saúde e da sua família.
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleRestart}
                className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Jogar Novamente</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
