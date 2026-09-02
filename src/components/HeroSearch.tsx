import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, Sparkles, ArrowRight, CornerDownLeft, Volume2, ShieldCheck, Clock, Award } from 'lucide-react';
import { LanguageCode } from '../types';
import { LANGUAGES, TRANSLATIONS } from '../data/languages';
import { detectLanguageFromQuery } from '../utils/languageDetector';

interface HeroSearchProps {
  currentLang: LanguageCode;
  onSearchSubmit: (query: string, detectedLang?: LanguageCode) => void;
  onDetectedLanguageChange: (lang: LanguageCode) => void;
  initialQuery?: string;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  currentLang,
  onSearchSubmit,
  onDetectedLanguageChange,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  const [detectedLang, setDetectedLang] = useState<LanguageCode | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentLangDef = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const popularSearches = [
    { label: 'Sony Alpha 7 IV', query: 'Sony Alpha 7 IV', badge: 'Exact Product' },
    { label: 'Best camera for YouTube', query: 'best camera for YouTube', badge: 'Use Case' },
    { label: 'Best laptop for students', query: 'best laptop for students', badge: 'Budget Pick' },
    { label: 'Sony A7 IV vs Canon R6 II', query: 'Sony A7 IV vs Canon R6 II', badge: 'Comparison' },
    { label: 'Best SUV under ₹20 Lakh', query: 'best SUV under 20 lakh', badge: 'Automotive' },
    { label: 'Housekeeping near me', query: 'housekeeping company near me', badge: 'Local Service' },
  ];

  // Auto-detect language while user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    const detected = detectLanguageFromQuery(val);
    if (detected && detected !== currentLang) {
      setDetectedLang(detected);
      onDetectedLanguageChange(detected);
    } else {
      setDetectedLang(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearchSubmit(query.trim(), detectedLang || undefined);
  };

  // Voice Search with Web Speech API
  const toggleVoiceSearch = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setMicError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError('Speech recognition is not supported in this browser. Please type your product.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'ja' ? 'ja-JP' : currentLang === 'es' ? 'es-ES' : 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        const detected = detectLanguageFromQuery(transcript);
        if (detected) {
          onDetectedLanguageChange(detected);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setMicError('Microphone permission required or speech not recognized.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-12 sm:pt-20 pb-16 flex flex-col items-center text-center">
      {/* Brand Eyebrow Badge */}
      <div
        id="hero-engine-badge"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F8F2] border border-[#00B67A]/30 text-[#005128] text-xs font-semibold tracking-wide mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#00B67A]" />
        <span>productreviews.review</span>
        <span className="w-1 h-1 rounded-full bg-[#00B67A]/40" />
        <span className="text-[#005128] font-medium text-[11px]">AI-Powered Decision Engine</span>
      </div>

      {/* Hero Headline & Prompt */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-zinc-900 tracking-tight max-w-3xl leading-[1.12]">
        {currentLang === 'hi' ? (
          <>
            सर्च करें. तुलना करें. <span className="text-[#00B67A]">सही निर्णय लें</span>
          </>
        ) : currentLang === 'ja' ? (
          <>
            検索して、比較して、<span className="text-[#00B67A]">最適な決断を</span>
          </>
        ) : currentLang === 'es' ? (
          <>
            Busca. Compara. <span className="text-[#00B67A]">Decide con certeza</span>.
          </>
        ) : currentLang === 'ar' ? (
          <>
            ابحث. قارن. <span className="text-[#00B67A]">اتخذ القرار الأفضل</span>
          </>
        ) : (
          <>
            Search. Compare. <span className="text-[#00B67A]">Decide with Confidence</span>.
          </>
        )}
      </h1>

      <p className="mt-4 text-sm sm:text-base text-zinc-600 max-w-2xl font-normal leading-relaxed">
        Enter any product, category, budget, or comparison. Get an instant evidence-based verdict, key trade-offs, and verified buying options.
      </p>

      {/* Main Search Input Box */}
      <form
        id="hero-search-form"
        onSubmit={handleFormSubmit}
        className="w-full max-w-2xl mt-8 relative"
      >
        <div
          className={`group relative flex items-center w-full bg-white rounded-2xl border transition-all duration-200 shadow-xs ${
            isListening
              ? 'border-red-500 ring-2 ring-red-100'
              : 'border-zinc-300 hover:border-zinc-400 focus-within:border-[#00B67A] focus-within:ring-2 focus-within:ring-[#00B67A]/20'
          }`}
        >
          {/* Left Search Icon */}
          <div className="pl-4 sm:pl-5 text-zinc-400 group-focus-within:text-[#00B67A] transition-colors">
            <Search className="w-5 h-5" />
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            id="main-product-search-input"
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={t.searchPlaceholder}
            className="w-full py-4 sm:py-4.5 pl-3 sm:pl-4 pr-24 sm:pr-32 bg-transparent text-base sm:text-lg font-normal text-zinc-900 placeholder:text-zinc-400 outline-none"
          />

          {/* Right Action Icons (Mic + Submit Button) */}
          <div className="absolute right-2 sm:right-2.5 flex items-center gap-1.5 sm:gap-2">
            {/* Mic Button */}
            <button
              id="voice-search-mic-btn"
              type="button"
              onClick={toggleVoiceSearch}
              title={isListening ? 'Stop listening' : 'Search by voice'}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Submit Button */}
            <button
              id="submit-search-btn"
              type="submit"
              disabled={!query.trim()}
              className="px-4.5 py-2.5 bg-[#00B67A] hover:bg-[#008254] disabled:opacity-40 disabled:hover:bg-[#00B67A] text-white rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Detected Script Language Tag Badge */}
        {detectedLang && (
          <div className="absolute -bottom-7 left-3 flex items-center gap-1.5 text-xs text-zinc-700 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-full animate-in fade-in">
            <span>✨ Detected script:</span>
            <span className="font-bold">
              {LANGUAGES.find((l) => l.code === detectedLang)?.nativeName} (
              {detectedLang.toUpperCase()})
            </span>
          </div>
        )}
      </form>

      {/* Voice Listening Wave Status */}
      {isListening && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-700 animate-in fade-in">
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-4 bg-red-500 rounded-full animate-bounce" />
            <span className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:0.3s]" />
          </div>
          <span className="font-semibold">{t.micListening}</span>
          <span className="text-red-500">({t.micPrompt})</span>
        </div>
      )}

      {micError && (
        <div className="mt-3 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
          {micError}
        </div>
      )}

      {/* Trending / Direct Model Search Chips */}
      <div className="w-full max-w-2xl mt-12 text-left">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-zinc-400" />
            {t.popularLabel}
          </span>
          <span className="text-[11px] text-zinc-400 hidden sm:inline">
            Click to auto-identify models &amp; generate report
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {popularSearches.map((item) => (
            <button
              key={item.query}
              id={`popular-query-${item.query.replace(/\s+/g, '-')}`}
              onClick={() => {
                setQuery(item.query);
                onSearchSubmit(item.query);
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all text-left group"
            >
              <div className="truncate">
                <div className="font-medium text-xs sm:text-sm text-zinc-900 group-hover:text-zinc-600 transition-colors">
                  {item.label}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  {item.badge}
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Trust & Architecture Badges */}
      <div className="mt-12 pt-8 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left w-full max-w-2xl text-xs text-zinc-600">
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-zinc-100 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-zinc-900">Multi-Source Verification</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Amazon, Reddit, YouTube cross-verified</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-zinc-100 shadow-xs">
          <Clock className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-zinc-900">5-7s Deep AI Report</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Multi-point scan with honest AI recommendation verdict</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-zinc-100 shadow-xs">
          <Sparkles className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-zinc-900">40 Language Engine</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Native translations &amp; live active coupon finder</div>
          </div>
        </div>
      </div>
    </div>
  );
};
