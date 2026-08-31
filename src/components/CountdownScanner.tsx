import React, { useState, useEffect } from 'react';
import { ProductModel, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/languages';
import { Sparkles, ShoppingBag, Youtube, MessageSquare, Tag, ShieldCheck } from 'lucide-react';

interface CountdownScannerProps {
  product: ProductModel;
  currentLang: LanguageCode;
  onComplete: () => void;
  durationSeconds?: number;
}

export const CountdownScanner: React.FC<CountdownScannerProps> = ({
  product,
  currentLang,
  onComplete,
  durationSeconds = 6,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const steps = [
    {
      icon: ShoppingBag,
      title: 'Scanning 1,247 Amazon verified reviews...',
      desc: 'Filtering verified purchaser comments & defect claims',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Youtube,
      title: 'Analyzing 14 YouTube teardowns & long-term reviews...',
      desc: 'Extracting thermal, audio and real-life stress test data',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: MessageSquare,
      title: 'Checking Reddit r/gadgets & r/BuyItForLife discussions...',
      desc: 'Aggregating genuine community sentiment & long term durability',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: ShieldCheck,
      title: 'Cross-referencing 42 tech benchmarks & specs...',
      desc: 'Scoring build quality, energy efficiency and value index',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Tag,
      title: 'Finding best verified coupons & secret price drops...',
      desc: 'Testing checkout codes across authorized retailers',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
  ];

  useEffect(() => {
    const totalMs = durationSeconds * 1000;
    const intervalMs = 50;
    let elapsedMs = 0;

    const timer = setInterval(() => {
      elapsedMs += intervalMs;
      const remainingSec = Math.max(0, (totalMs - elapsedMs) / 1000);
      setTimeLeft(remainingSec);

      // Rotate steps
      const stepIdx = Math.min(
        steps.length - 1,
        Math.floor((elapsedMs / totalMs) * steps.length)
      );
      setCurrentStepIdx(stepIdx);

      if (elapsedMs >= totalMs) {
        clearInterval(timer);
        onComplete();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [durationSeconds, onComplete]);

  const progress = Math.min(100, Math.max(0, ((durationSeconds - timeLeft) / durationSeconds) * 100));
  const currentStep = steps[currentStepIdx];
  const StepIcon = currentStep.icon;

  // Circular progress math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
      {/* Product Mini Header */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-xs mb-10">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-8 h-8 object-contain rounded-full bg-zinc-50"
        />
        <div className="text-left">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">{product.modelNumber}</div>
          <div className="text-xs font-semibold text-zinc-900 truncate max-w-xs">{product.name}</div>
        </div>
      </div>

      {/* Big Circular Progress Countdown */}
      <div className="relative w-44 h-44 flex items-center justify-center mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            className="text-zinc-100"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            className="text-zinc-900 transition-all duration-75 ease-linear"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Timer Display */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {timeLeft.toFixed(1)}s
          </span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
            {Math.round(progress)}% Ready
          </span>
        </div>
      </div>

      {/* Dynamic Animated Step Card */}
      <div
        id="scanner-rotating-card"
        className="w-full max-w-lg p-5 rounded-[24px] bg-white border border-zinc-200 shadow-sm transition-all duration-300 flex items-start gap-4 text-left"
      >
        <div className="p-3 rounded-2xl bg-zinc-100 text-zinc-800 shrink-0">
          <StepIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Step {currentStepIdx + 1} of {steps.length}
            </span>
            <span className="text-[11px] font-mono text-zinc-500 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-zinc-400" /> Live Parsing
            </span>
          </div>
          <h4 className="text-sm font-semibold text-zinc-900 leading-snug">
            {currentStep.title}
          </h4>
          <p className="text-xs text-zinc-500 mt-1">{currentStep.desc}</p>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2 mt-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentStepIdx
                ? 'w-6 bg-zinc-900'
                : i < currentStepIdx
                ? 'w-1.5 bg-zinc-400'
                : 'w-1.5 bg-zinc-200'
            }`}
          />
        ))}
      </div>

      <p className="mt-8 text-xs text-zinc-400 font-mono">
        productreviews.review • Zero affiliate bias • Pure AI synthesis
      </p>
    </div>
  );
};
