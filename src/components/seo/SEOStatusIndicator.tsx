import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { useSeoAudit } from './useSeoAudit';
import { SEOStatusReport } from './SEOStatusReport';

export interface SEOStatusIndicatorProps {
  /**
   * Display mode:
   * - 'floating': Unobtrusive sticky badge in bottom-right corner with live score pulse.
   * - 'inline': Full-width status banner placed directly at top or bottom of review articles.
   * - 'compact': Small chip suitable for headers or meta bars.
   */
  variant?: 'floating' | 'inline' | 'compact';
  /**
   * Optional custom title or page description.
   */
  pageTitle?: string;
}

export const SEOStatusIndicator: React.FC<SEOStatusIndicatorProps> = ({
  variant = 'floating',
  pageTitle,
}) => {
  const { summary, rescan } = useSeoAudit(3000);
  const [showModalReport, setShowModalReport] = useState(false);
  const [showInlineReport, setShowInlineReport] = useState(false);

  // Status configuration based on audit results
  const hasCriticalFailures = summary.failedCount > 0;
  const hasWarnings = summary.warningCount > 0;

  const statusConfig = hasCriticalFailures
    ? {
        bg: 'bg-rose-50',
        border: 'border-rose-300',
        text: 'text-rose-800',
        badge: 'bg-rose-600 text-white',
        pulse: 'bg-rose-500',
        icon: XCircle,
        label: `${summary.failedCount} SEO Issue${summary.failedCount > 1 ? 's' : ''}`,
      }
    : hasWarnings
    ? {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-900',
        badge: 'bg-amber-600 text-white',
        pulse: 'bg-amber-500',
        icon: AlertTriangle,
        label: `${summary.warningCount} Recommendation${summary.warningCount > 1 ? 's' : ''}`,
      }
    : {
        bg: 'bg-emerald-50',
        border: 'border-emerald-300',
        text: 'text-emerald-900',
        badge: 'bg-emerald-700 text-white',
        pulse: 'bg-emerald-500',
        icon: CheckCircle2,
        label: 'SEO 100% Valid',
      };

  const Icon = statusConfig.icon;

  // Key entities quick status
  const productItem = summary.items.find((i) => i.id === 'schema-product');
  const reviewItem = summary.items.find((i) => i.id === 'schema-review');
  const ratingItem = summary.items.find((i) => i.id === 'schema-aggregate-rating');

  // Compact Variant
  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={() => setShowModalReport(true)}
          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-medium border transition-all cursor-pointer ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} hover:shadow-xs`}
          title="Click to view complete SEO & Schema audit report"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.pulse}`}
            />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${statusConfig.pulse}`} />
          </span>
          <span className="font-bold">SEO {summary.score}%</span>
          <span className="text-[10px] opacity-75">({statusConfig.label})</span>
        </button>

        {showModalReport && (
          <SEOStatusReport
            summary={summary}
            onRescan={rescan}
            onClose={() => setShowModalReport(false)}
            isModal={true}
          />
        )}
      </>
    );
  }

  // Inline Variant (for review pages)
  if (variant === 'inline') {
    return (
      <div className="my-6">
        <div
          className={`rounded-xl border p-4 sm:p-5 transition-all shadow-xs ${statusConfig.bg} ${statusConfig.border}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white border border-zinc-200/80 shadow-2xs shrink-0">
                <Icon className={`w-5 h-5 ${statusConfig.text}`} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-zinc-900 font-sans">
                    Review Page SEO &amp; Rich Results Monitor
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${statusConfig.badge}`}
                  >
                    Score: {summary.score}/100
                  </span>
                  {hasCriticalFailures && (
                    <span className="text-[10px] font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold">
                      Action Required
                    </span>
                  )}
                </div>

                {/* Quick Entities Checklist Chips */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-zinc-700">
                  <span className="inline-flex items-center gap-1">
                    Product Schema:{' '}
                    {productItem?.status === 'passed' ? (
                      <span className="text-emerald-700 font-bold">✅ Passed</span>
                    ) : (
                      <span className="text-rose-700 font-bold">❌ Missing</span>
                    )}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    Review Schema:{' '}
                    {reviewItem?.status === 'passed' ? (
                      <span className="text-emerald-700 font-bold">✅ Passed</span>
                    ) : (
                      <span className="text-rose-700 font-bold">❌ Missing</span>
                    )}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    AggregateRating:{' '}
                    {ratingItem?.status === 'passed' ? (
                      <span className="text-emerald-700 font-bold">✅ Passed</span>
                    ) : (
                      <span className="text-amber-700 font-bold">⚠️ Optional</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <button
                onClick={() => setShowInlineReport(!showInlineReport)}
                className="px-3 py-1.5 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                <span>{showInlineReport ? 'Hide Audit Report' : 'Inspect SEO Checklist'}</span>
              </button>

              <button
                onClick={() => setShowModalReport(true)}
                className="p-1.5 bg-white hover:bg-zinc-100 text-zinc-600 rounded-lg border border-zinc-300 transition-colors cursor-pointer"
                title="Expand to full screen modal"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Inline Expanded Dashboard */}
          {showInlineReport && (
            <div className="mt-4 pt-4 border-t border-zinc-200/80">
              <SEOStatusReport summary={summary} onRescan={rescan} isModal={false} />
            </div>
          )}
        </div>

        {showModalReport && (
          <SEOStatusReport
            summary={summary}
            onRescan={rescan}
            onClose={() => setShowModalReport(false)}
            isModal={true}
          />
        )}
      </div>
    );
  }

  // Floating Variant (Default: Bottom-Right Docked Pill)
  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <button
          onClick={() => setShowModalReport(true)}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full shadow-lg border transition-all hover:scale-105 cursor-pointer backdrop-blur-md bg-white/95 ${statusConfig.border} text-zinc-900 hover:shadow-xl`}
          title="Open Live SEO & Structured Data Health Report"
          aria-label="SEO Status Monitor"
        >
          {/* Status Pulse Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.pulse}`}
            />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusConfig.pulse}`} />
          </span>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-700" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold font-mono tracking-tight text-zinc-900 leading-tight">
                SEO {summary.score}%
              </span>
              <span className="text-[9px] font-mono text-zinc-500 leading-tight">
                {statusConfig.label}
              </span>
            </div>
          </div>

          <div className="pl-1 border-l border-zinc-200">
            <span
              className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${statusConfig.badge}`}
            >
              Report
            </span>
          </div>
        </button>
      </div>

      {showModalReport && (
        <SEOStatusReport
          summary={summary}
          onRescan={rescan}
          onClose={() => setShowModalReport(false)}
          isModal={true}
        />
      )}
    </>
  );
};

export default SEOStatusIndicator;
