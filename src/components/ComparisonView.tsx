import React from 'react';
import { ComparisonItem, LanguageCode } from '../types';
import { getTranslation } from '../localization/languages';

interface ComparisonViewProps {
  comparison: ComparisonItem;
  currentLang: LanguageCode;
  onBack: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  comparison,
  currentLang,
  onBack,
}) => {
  const t = getTranslation(currentLang);
  const { entityA, entityB, factors, mainCompromise, verdictSummary } = comparison;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-6 group transition-colors"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>{t.backToHome}</span>
      </button>

      {/* Comparison Header Banner */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold mb-3">
          Direct Head-to-Head Comparison
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
          {entityA.name} <span className="text-zinc-400 font-light mx-2">VS</span> {entityB.name}
        </h1>
      </div>

      {/* Side-by-Side Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Option A */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Option A
              </span>
              {entityA.brand && (
                <span className="text-xs font-semibold text-zinc-500 uppercase">
                  {entityA.brand}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">{entityA.name}</h2>
            <p className="text-xs sm:text-sm text-zinc-600 mb-4">{entityA.explanation}</p>
          </div>
          <div className="pt-4 border-t border-zinc-100">
            <a
              id="compare-action-a"
              href={entityA.action.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center font-semibold text-sm bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl transition-colors text-center"
            >
              {entityA.action.label || t.checkPrice}
            </a>
          </div>
        </div>

        {/* Option B */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Option B
              </span>
              {entityB.brand && (
                <span className="text-xs font-semibold text-zinc-500 uppercase">
                  {entityB.brand}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">{entityB.name}</h2>
            <p className="text-xs sm:text-sm text-zinc-600 mb-4">{entityB.explanation}</p>
          </div>
          <div className="pt-4 border-t border-zinc-100">
            <a
              id="compare-action-b"
              href={entityB.action.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center font-semibold text-sm bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl transition-colors text-center"
            >
              {entityB.action.label || t.checkPrice}
            </a>
          </div>
        </div>
      </div>

      {/* Decision Factors Matrix */}
      <section className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-900" />
          {t.comparisonFactors}
        </h2>

        <div className="divide-y divide-zinc-100">
          {factors.map((factor, idx) => (
            <div key={idx} className="py-5 first:pt-0 last:pb-0 flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-bold text-zinc-900">{factor.factor}</h3>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    factor.winner === 'A'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : factor.winner === 'B'
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                  }`}
                >
                  {factor.winner === 'A'
                    ? `Advantage: ${entityA.brand || entityA.name}`
                    : factor.winner === 'B'
                    ? `Advantage: ${entityB.brand || entityB.name}`
                    : 'Tie / Equal'}
                </span>
              </div>

              {/* Assessment Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-600 bg-zinc-50 rounded-xl p-3.5">
                <div>
                  <span className="font-semibold text-zinc-800 block mb-0.5">
                    {entityA.name}:
                  </span>
                  {factor.entityAAssessment}
                </div>
                <div>
                  <span className="font-semibold text-zinc-800 block mb-0.5">
                    {entityB.name}:
                  </span>
                  {factor.entityBAssessment}
                </div>
              </div>

              {/* Why */}
              <p className="text-xs text-zinc-500 italic">
                <span className="font-medium text-zinc-700 not-italic">Verdict on this factor: </span>
                {factor.why}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Compromise & Final Verdict */}
      <div className="bg-zinc-900 text-white rounded-3xl p-6 sm:p-10">
        <h2 className="text-lg font-bold uppercase tracking-wider text-zinc-400 mb-2">
          {t.mainCompromise}
        </h2>
        <p className="text-base sm:text-lg text-zinc-200 leading-relaxed mb-6">
          {mainCompromise}
        </p>

        <div className="pt-6 border-t border-zinc-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            {t.verdict}
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">{verdictSummary}</p>
        </div>
      </div>
    </div>
  );
};
