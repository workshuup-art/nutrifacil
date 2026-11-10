import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { UserProfile } from '../types';
import { askNutritionalAssistant } from '../services/apiService';
import { speechService } from '../services/speechService';

interface AIAssistantProps {
  profile: UserProfile;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const FREQUENT_QUESTIONS = [
  'Tenho diabetes. Posso comer banana no café da manhã?',
  'Como temperar o feijão sem colocar muito sal?',
  'O que posso comer no lanche da tarde gastando pouco?',
  'Arroz branco faz mal para quem tem pressão alta?',
  'Qual a diferença entre comer a fruta e tomar o suco coado?',
];

export const AIAssistant: React.FC<AIAssistantProps> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Olá! Sou a NutriFácil, sua educadora alimentar virtual. Estou aqui para te ajudar a comer melhor de forma simples, sem palavras difíceis e sem gastar muito! Você pode me perguntar qualquer dúvida sobre comida ou usar o microfone para falar comigo. Em que posso te ajudar hoje?`,
      timestamp: 'Agora',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');
    setIsLoading(true);

    try {
      const conditionNames = profile.conditions.map((c) => {
        if (c === 'diabetes') return 'Diabetes (controle glicêmico)';
        if (c === 'hipertensao') return 'Hipertensão (pressão alta / sódio)';
        if (c === 'obesidade') return 'Obesidade (controle calórico e saciedade)';
        return 'Alimentação Saudável Geral';
      });

      const reply = await askNutritionalAssistant({
        message: text,
        conditions: conditionNames,
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If user has auto-audio enabled, read aloud
      if (profile.autoAudio) {
        speechService.speak(reply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    const started = speechService.startListening(
      (transcript) => {
        setInputVal(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      },
      (error) => {
        console.warn('Erro voz:', error);
        setIsListening(false);
      },
      () => setIsListening(false)
    );

    if (started) setIsListening(true);
  };

  const handleSpeakMessage = (msg: Message) => {
    if (speakingMessageId === msg.id) {
      speechService.stop();
      setSpeakingMessageId(null);
      return;
    }

    speechService.speak(
      msg.text,
      () => setSpeakingMessageId(msg.id),
      () => setSpeakingMessageId(null),
      () => setSpeakingMessageId(null)
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[750px] max-h-[85vh] animate-fadeIn">
      
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 font-display">
                Assistente NutriFácil
              </h2>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Educadora IA
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Respostas claras, carinhosas e adequadas à sua saúde
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Educação sem jargões</span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 overflow-x-auto flex gap-2 scrollbar-none">
        {FREQUENT_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 shrink-0 whitespace-nowrap cursor-pointer transition-colors"
          >
            💬 {q}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          const isCurrentlySpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] ${isAssistant ? 'self-start' : 'ml-auto flex-row-reverse'}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                  isAssistant ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-800 text-white'
                }`}
              >
                {isAssistant ? '🌱' : <User className="w-4 h-4" />}
              </div>

              <div
                className={`rounded-3xl p-4 sm:p-5 relative ${
                  isAssistant
                    ? 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm'
                    : 'bg-emerald-700 text-white rounded-tr-sm'
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.text}
                </p>

                <div
                  className={`mt-2 flex items-center justify-between text-[11px] ${
                    isAssistant ? 'text-slate-400' : 'text-emerald-200'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {isAssistant && (
                    <button
                      onClick={() => handleSpeakMessage(msg)}
                      className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                        isCurrentlySpeaking
                          ? 'bg-amber-400 text-slate-950 font-bold animate-pulse'
                          : 'hover:bg-slate-200 text-slate-600'
                      }`}
                      title={isCurrentlySpeaking ? 'Parar leitura' : 'Ouvir esta resposta'}
                    >
                      {isCurrentlySpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Pausar</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Ouvir</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] self-start animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold shrink-0">
              🌱
            </div>
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-slate-500 text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>A NutriFácil está pensando na melhor explicação para você...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field and Voice Trigger */}
      <div className="p-4 sm:p-5 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleVoiceInput}
            title={isListening ? 'Parar microfone' : 'Falar pelo microfone'}
            className={`min-h-[48px] min-w-[48px] rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Digite ou fale sua dúvida sobre comida..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="min-h-[48px] px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-sm shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-2 font-medium">
          Orientações educativas baseadas na OMS e Ministério da Saúde. Não substitui consulta médica.
        </p>
      </div>

    </div>
  );
};
