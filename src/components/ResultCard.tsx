import React, { useState } from 'react';
import { EntityItem, LanguageCode, MarketCode } from '../types';
import { getTranslation } from '../localization/languages';
import { getMarketInfo } from '../localization/markets';

interface ResultCardProps {
  item: EntityItem;
  currentLang: LanguageCode;
  market?: MarketCode;
  onSelectEntity?: (item: EntityItem) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  item,
  currentLang,
  market,
  onSelectEntity,
}) => {
  const t = getTranslation(currentLang);
  const [showEvidence, setShowEvidence] = useState(false);
  const [imgError, setImgError] = useState(false);

  const resolvedMarketCode: MarketCode = market || item.provenance?.[0]?.market || 'US';
  const marketInfo = getMarketInfo(resolvedMarketCode);

  const getBadgeClass = (badge?: string) => {
    if (!badge) return '';
    const upper = badge.toUpperCase();
    if (upper.includes('OVERALL')) {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    if (upper.includes('VALUE')) {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
    if (upper.includes('RECOMMENDED')) {
      return 'bg-blue-50 text-blue-900 border-blue-200';
    }
    return 'bg-zinc-100 text-zinc-800 border-zinc-300';
  };

  return (
    <article
      id={`result-card-${item.id}`}
      className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-sm hover:shadow transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Badge, Market, Brand */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {item.badge && (
              <span
                className={`inline-flex items-center text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border ${getBadgeClass(
                  item.badge
                )}`}
              >
                {item.badge}
              </span>
            )}
            <span className="text-[11px] font-medium text-zinc-500 bg-zinc-50 border border-zinc-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span>{marketInfo.flag}</span>
              <span>{marketInfo.name}</span>
            </span>
          </div>

          {item.brand && (
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              {item.brand}
            </span>
          )}
        </div>

        {/* Permitted Reference Image (if available from verified public domain/CC source) */}
        {!imgError && item.image?.url && (
          <div className="mb-4 overflow-hidden rounded-xl bg-zinc-50 aspect-video max-h-48 border border-zinc-200/60 flex items-center justify-center">
            <img
              src={item.image.url}
              alt={item.image.alt || item.name}
              className="w-full h-full object-contain p-2"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        {/* Product / Entity Name */}
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mb-2.5">
          {item.name}
        </h2>

        {/* Factual Summary */}
        <p className="text-sm text-zinc-700 leading-relaxed mb-4">
          {item.explanation}
        </p>

        {/* Decision-First: Why It Is Relevant (Phase 3 Section 9) */}
        {item.evidence?.whyIncluded && (
          <div className="mb-4 bg-zinc-50 border border-zinc-200/70 rounded-xl p-3 text-xs leading-relaxed">
            <span className="font-bold text-zinc-900">Why it is relevant: </span>
            <span className="text-zinc-700">{item.evidence.whyIncluded}</span>
          </div>
        )}

        {/* Key Strengths / Documented Specs */}
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

        {/* Main Drawback / Tradeoff */}
        {item.drawback && (
          <div className="mb-5 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3">
            <div className="text-xs font-semibold text-amber-900 mb-0.5 flex items-center gap-1.5">
              <span className="text-amber-700 font-bold">!</span>
              <span>{t.drawback}</span>
            </div>
            <p className="text-xs text-amber-800 leading-normal">{item.drawback}</p>
          </div>
        )}

        {/* Documented Specifications Preview */}
        {item.specs && Object.keys(item.specs).length > 0 && (
          <div className="mb-5 bg-zinc-50 border border-zinc-100 rounded-xl p-3">
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Verified Specifications
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {Object.entries(item.specs).slice(0, 4).map(([key, val]) => (
                <div key={key} className="flex justify-between py-0.5 border-b border-zinc-200/40">
                  <span className="text-zinc-500">{key}:</span>
                  <span className="text-zinc-800 font-medium truncate max-w-[140px]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence & Provenance Drawer Toggle */}
        {item.evidence && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowEvidence(!showEvidence)}
              className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors"
            >
              <span>{showEvidence ? 'Hide Source Evidence' : 'View Source Evidence & Provenance'}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform ${showEvidence ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showEvidence && (
              <div className="mt-2.5 p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-2">
                <div>
                  <span className="font-semibold text-zinc-700">Inclusion Rationale: </span>
                  <span className="text-zinc-600">{item.evidence.whyIncluded}</span>
                </div>
                {item.evidence.uncertainties && item.evidence.uncertainties.length > 0 && (
                  <div className="text-amber-800 bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
                    <span className="font-semibold">Known Uncertainties: </span>
                    {item.evidence.uncertainties.join(' ')}
                  </div>
                )}
                <div className="text-[10px] text-zinc-400">
                  Retrieved: {new Date(item.evidence.retrievedAt).toLocaleString()}
                </div>
              </div>
            )}
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

        {/* Sources with links */}
        {item.sources && item.sources.length > 0 && (
          <div className="pt-2 flex items-center flex-wrap gap-1.5 text-[11px] text-zinc-400">
            <span>{t.sourcesLabel}:</span>
            {item.sources.map((s, idx) => (
              <a
                key={idx}
                href={s.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 px-2 py-0.5 rounded-md font-mono text-[10px] transition-colors"
              >
                {s.domain || s.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
