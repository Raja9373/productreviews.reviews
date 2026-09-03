import React from 'react';
import { EntityItem, LanguageCode } from '../types';
import { getTranslation } from '../localization/languages';

interface ResultCardProps {
  item: EntityItem;
  currentLang: LanguageCode;
  onSelectEntity?: (item: EntityItem) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  item,
  currentLang,
  onSelectEntity,
}) => {
  const t = getTranslation(currentLang);

  const getBadgeClass = (badge?: string) => {
    if (!badge) return '';
    const upper = badge.toUpperCase();
    if (upper.includes('OVERALL') || upper.includes('BENCHMARK')) {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    if (upper.includes('VALUE')) {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
    if (upper.includes('PREMIUM')) {
      return 'bg-purple-100 text-purple-900 border-purple-300';
    }
    return 'bg-zinc-100 text-zinc-800 border-zinc-300';
  };

  return (
    <article
      id={`result-card-${item.id}`}
      className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-sm hover:shadow transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Badge & Brand */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          {item.badge ? (
            <span
              className={`inline-flex items-center text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border ${getBadgeClass(
                item.badge
              )}`}
            >
              {item.badge}
            </span>
          ) : (
            <span className="text-xs text-zinc-400 font-medium">{item.domain}</span>
          )}

          {item.brand && (
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              {item.brand}
            </span>
          )}
        </div>

        {/* Product / Entity Name */}
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mb-2.5">
          {item.name}
        </h2>

        {/* Short Explanation: Why this is recommended */}
        <p className="text-sm text-zinc-700 leading-relaxed mb-5">
          {item.explanation}
        </p>

        {/* Key Strengths (Pros) */}
        {item.pros && item.pros.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.strengths}
            </h3>
            <ul className="space-y-1.5">
              {item.pros.map((pro, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-zinc-600 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Drawback */}
        {item.drawback && (
          <div className="mb-5 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3">
            <div className="text-xs font-semibold text-amber-900 mb-0.5 flex items-center gap-1.5">
              <span className="text-amber-700 font-bold">!</span>
              <span>{t.drawback}</span>
            </div>
            <p className="text-xs text-amber-800 leading-normal">{item.drawback}</p>
          </div>
        )}

        {/* Who it is for */}
        {item.whoItIsFor && (
          <div className="text-xs text-zinc-500 mb-5">
            <span className="font-semibold text-zinc-700">{t.whoItIsFor}: </span>
            {item.whoItIsFor}
          </div>
        )}
      </div>

      {/* Card Footer: Price & Primary Action & Sources */}
      <div className="pt-4 border-t border-zinc-100 flex flex-col gap-3">
        {/* Price row */}
        <div className="flex items-baseline justify-between gap-2">
          {item.price.isVerified && item.price.amount ? (
            <div>
              <span className="text-xl font-bold text-zinc-900">
                {item.price.currency} {item.price.amount.toLocaleString()}
              </span>
            </div>
          ) : (
            <div className="text-xs text-zinc-500 italic">
              {item.price.note || t.priceUnverified}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <a
            id={`btn-action-${item.id}`}
            href={item.action.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center font-semibold text-sm bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white px-5 py-2.5 rounded-xl transition-colors text-center"
          >
            {item.action.label || t.checkPrice}
            <svg
              className="w-4 h-4 ml-1.5 opacity-70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          {onSelectEntity && (
            <button
              onClick={() => onSelectEntity(item)}
              type="button"
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-2 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
            >
              {t.viewDetails}
            </button>
          )}
        </div>

        {/* Sources */}
        {item.sources && item.sources.length > 0 && (
          <div className="pt-2 flex items-center flex-wrap gap-1.5 text-[11px] text-zinc-400">
            <span>{t.sourcesLabel}:</span>
            {item.sources.map((s, idx) => (
              <span
                key={idx}
                className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md font-mono text-[10px]"
              >
                {s.domain || s.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
