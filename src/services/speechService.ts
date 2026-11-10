// Audio Text-to-Speech & Speech-to-Text service for NutriFácil

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private ptVoice: SpeechSynthesisVoice | null = null;
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize natural Portuguese voices
    this.ptVoice =
      voices.find((v) => v.lang === 'pt-BR' && (v.name.includes('Google') || v.name.includes('Luciana') || v.name.includes('Francisca'))) ||
      voices.find((v) => v.lang === 'pt-BR') ||
      voices.find((v) => v.lang.startsWith('pt')) ||
      null;
  }

  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void
  ) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      onError?.();
      return;
    }

    this.stop();

    // Clean markdown stars, hashtags or code brackets for smooth reading
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/([0-9]+)\s*g\b/gi, '$1 gramas')
      .replace(/([0-9]+)\s*mg\b/gi, '$1 miligramas')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95; // Slightly calmer rate for older adults & clarity
    utterance.pitch = 1.0;

    if (this.ptVoice) {
      utterance.voice = this.ptVoice;
    }

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => {
      onEnd?.();
      onError?.();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth?.speaking);
  }

  public startListening(
    onResult: (transcript: string) => void,
    onError?: (errorMsg: string) => void,
    onEnd?: () => void
  ): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError?.('O reconhecimento de voz não é suportado pelo seu navegador.');
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'pt-BR';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        onError?.(event.error || 'Erro ao ouvir voz.');
      };

      this.recognition.onend = () => {
        onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      onError?.(e.message || 'Erro ao inicializar microfone.');
      return false;
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
  }
}

export const speechService = new SpeechService();
