import React from 'react';
import { EntityItem, LanguageCode } from '../types';
import { getTranslation } from '../localization/languages';

interface ExactEntityViewProps {
  entity: EntityItem;
  currentLang: LanguageCode;
  onBack: () => void;
}

export const ExactEntityView: React.FC<ExactEntityViewProps> = ({
  entity,
  currentLang,
  onBack,
}) => {
  const t = getTranslation(currentLang);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
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

      {/* Entity Main Card */}
      <article className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-sm">
        {/* Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white px-3 py-1 rounded-full">
              {entity.domain}
            </span>
            {entity.badge && (
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full">
                {entity.badge}
              </span>
            )}
          </div>
          {entity.brand && (
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
              {entity.brand}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-4">
          {entity.name}
        </h1>

        {/* Summary Overview */}
        <p className="text-base sm:text-lg text-zinc-700 leading-relaxed mb-8">
          {entity.explanation}
        </p>

        {/* Technical Specifications Table */}
        {entity.specs && Object.keys(entity.specs).length > 0 && (
          <div className="mb-8 bg-zinc-50 rounded-2xl p-5 sm:p-6 border border-zinc-200/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              {Object.entries(entity.specs).map(([k, v]) => (
                <div key={k} className="flex flex-col py-1 border-b border-zinc-200/50">
                  <span className="text-xs font-semibold text-zinc-500">{k}</span>
                  <span className="text-sm font-medium text-zinc-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths & Weaknesses 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-emerald-950 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              {t.strengths}
            </h2>
            <ul className="space-y-2">
              {entity.pros.map((pro, i) => (
                <li key={i} className="text-xs sm:text-sm text-emerald-900 flex items-start gap-2">
                  <span className="font-bold text-emerald-600">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses / Drawback */}
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              {t.drawback}
            </h2>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              {entity.drawback || 'No major structural flaws reported in testing.'}
            </p>
          </div>
        </div>

        {/* Best For */}
        {entity.whoItIsFor && (
          <div className="mb-8 p-4 bg-zinc-100/70 rounded-xl text-sm text-zinc-700">
            <span className="font-bold text-zinc-900">{t.whoItIsFor}: </span>
            {entity.whoItIsFor}
          </div>
        )}

        {/* Primary Action Box */}
        <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-zinc-400 block uppercase">
              Retail Price Status
            </span>
            {entity.price.isVerified && entity.price.amount ? (
              <span className="text-2xl font-bold text-zinc-900">
                {entity.price.currency} {entity.price.amount.toLocaleString()}
              </span>
            ) : (
              <span className="text-xs text-zinc-500 italic">
                {entity.price.note || t.priceUnverified}
              </span>
            )}
          </div>

          <a
            id={`btn-exact-action-${entity.id}`}
            href={entity.action.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center font-bold text-sm bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3.5 rounded-xl transition-colors shadow"
          >
            {entity.action.label || t.checkPrice}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Sources */}
        {entity.sources && entity.sources.length > 0 && (
          <div className="mt-8 pt-4 border-t border-zinc-100 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span>{t.sourcesLabel}:</span>
            {entity.sources.map((s, idx) => (
              <span
                key={idx}
                className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md font-mono text-[11px]"
              >
                {s.domain || s.title}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
};
