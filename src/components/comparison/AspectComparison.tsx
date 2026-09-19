import React from 'react';
import { ComparisonAspect } from '../../types';
import { HelpCircle, Check, ArrowRight, Minus } from 'lucide-react';

interface AspectComparisonProps {
  aspects: ComparisonAspect[];
  productA: string;
  productB: string;
}

export const AspectComparison: React.FC<AspectComparisonProps> = ({
  aspects,
  productA,
  productB,
}) => {
  if (!aspects || aspects.length === 0) {
    return (
      <section className="mb-10" id="aspects-section">
        <h2 className="text-lg font-bold text-zinc-900 mb-3">
          Aspect-by-Aspect Breakdown
        </h2>
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-sm text-zinc-600 italic">
          No specific aspect-by-aspect evidence points were established from available records.
        </div>
      </section>
    );
  }

  const getStatusBadge = (status: ComparisonAspect['status']) => {
    switch (status) {
      case 'A_STRONGER':
        return {
          label: `Advantage: ${productA}`,
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
        };
      case 'B_STRONGER':
        return {
          label: `Advantage: ${productB}`,
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
        };
      case 'SIMILAR':
        return {
          label: 'Comparable Based on Evidence',
          classes: 'bg-zinc-100 text-zinc-800 border-zinc-300',
          dot: 'bg-zinc-400',
        };
      case 'INCONCLUSIVE':
      default:
        return {
          label: 'Inconclusive from Evidence',
          classes: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-400',
        };
    }
  };

  return (
    <section className="mb-10" id="aspects-section" aria-labelledby="aspects-heading">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-4">
        <h2 id="aspects-heading" className="text-xl font-bold text-zinc-900">
          Aspect-by-Aspect Evidence
        </h2>
        <span className="text-xs text-zinc-500">
          Comparing {aspects.length} evaluated dimensions
        </span>
      </div>

      <div className="space-y-4">
        {aspects.map((aspectItem, index) => {
          const statusInfo = getStatusBadge(aspectItem.status);
          const hasEvidenceA = aspectItem.evidenceA && aspectItem.evidenceA.length > 0;
          const hasEvidenceB = aspectItem.evidenceB && aspectItem.evidenceB.length > 0;

          return (
            <article
              key={`${aspectItem.aspect}-${index}`}
              id={`aspect-card-${index}`}
              className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs hover:border-zinc-300 transition-colors"
            >
              {/* Aspect Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-100">
                <h3 className="text-base font-bold text-zinc-900 capitalize flex items-center gap-2">
                  <span>{aspectItem.aspect}</span>
                </h3>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.classes}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} aria-hidden="true" />
                  {statusInfo.label}
                </span>
              </div>

              {/* Side-by-side Evidence Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product A Column */}
                <div className="bg-zinc-50/60 rounded-xl p-3.5 border border-zinc-150">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center justify-between">
                    <span className="truncate">{productA}</span>
                    {aspectItem.status === 'A_STRONGER' && (
                      <span className="text-emerald-700 text-[11px] font-semibold">Lead</span>
                    )}
                  </div>

                  {hasEvidenceA ? (
                    <ul className="space-y-2 text-sm text-zinc-800">
                      {aspectItem.evidenceA.map((ev, evIdx) => (
                        <li key={ev.id || evIdx} className="flex items-start gap-2">
                          <span className="text-zinc-400 mt-1 shrink-0">•</span>
                          <span className="leading-snug">{ev.claim}</span>
                        </li>
                      ))}
                    </ul>
                  ) : aspectItem.productA ? (
                    <p className="text-sm text-zinc-800 leading-snug">{aspectItem.productA}</p>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">
                      Not established from available evidence.
                    </p>
                  )}
                </div>

                {/* Product B Column */}
                <div className="bg-zinc-50/60 rounded-xl p-3.5 border border-zinc-150">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center justify-between">
                    <span className="truncate">{productB}</span>
                    {aspectItem.status === 'B_STRONGER' && (
                      <span className="text-emerald-700 text-[11px] font-semibold">Lead</span>
                    )}
                  </div>

                  {hasEvidenceB ? (
                    <ul className="space-y-2 text-sm text-zinc-800">
                      {aspectItem.evidenceB.map((ev, evIdx) => (
                        <li key={ev.id || evIdx} className="flex items-start gap-2">
                          <span className="text-zinc-400 mt-1 shrink-0">•</span>
                          <span className="leading-snug">{ev.claim}</span>
                        </li>
                      ))}
                    </ul>
                  ) : aspectItem.productB ? (
                    <p className="text-sm text-zinc-800 leading-snug">{aspectItem.productB}</p>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">
                      Not established from available evidence.
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
