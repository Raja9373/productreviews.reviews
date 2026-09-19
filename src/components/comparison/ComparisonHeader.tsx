import React from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, HelpCircle, XCircle, ShieldCheck } from 'lucide-react';

interface ComparisonHeaderProps {
  productA: string;
  productB: string;
  decision: 'A' | 'B' | 'NEITHER' | 'CONDITIONAL' | 'INSUFFICIENT_EVIDENCE';
  overallAssessment?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  evidenceStrength: 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT';
  onBack?: () => void;
}

export const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({
  productA,
  productB,
  decision,
  overallAssessment,
  confidence,
  evidenceStrength,
  onBack,
}) => {
  // Qualitative decision mapping per strict Phase 6.3 mandates (NO numerical scores)
  const getDecisionConfig = () => {
    switch (decision) {
      case 'A':
        return {
          title: `Evidence Favors ${productA}`,
          subtitle: `Product A (${productA}) has the stronger evidence for the stated comparison and use case.`,
          badge: 'FAVORS PRODUCT A',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          containerBg: 'bg-emerald-50/50 border-emerald-200',
          icon: CheckCircle,
          iconColor: 'text-emerald-600',
        };
      case 'B':
        return {
          title: `Evidence Favors ${productB}`,
          subtitle: `Product B (${productB}) has the stronger evidence for the stated comparison and use case.`,
          badge: 'FAVORS PRODUCT B',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          containerBg: 'bg-emerald-50/50 border-emerald-200',
          icon: CheckCircle,
          iconColor: 'text-emerald-600',
        };
      case 'CONDITIONAL':
        return {
          title: 'Conditional — Depends on Your Priorities',
          subtitle: "The better choice depends materially on the user's specific priorities, requirements, or trade-offs.",
          badge: 'CONDITIONAL CHOICE',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          containerBg: 'bg-amber-50/50 border-amber-200',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
        };
      case 'NEITHER':
        return {
          title: 'Neither Product Recommended',
          subtitle: 'Neither product currently satisfies the relevant requirements sufficiently based on available evidence.',
          badge: 'NEITHER SATISFIES',
          badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
          containerBg: 'bg-rose-50/50 border-rose-200',
          icon: XCircle,
          iconColor: 'text-rose-600',
        };
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return {
          title: 'Insufficient Evidence for a Verdict',
          subtitle: 'Available evidence is not sufficient to make a reliable or defensible comparison between these products.',
          badge: 'INSUFFICIENT EVIDENCE',
          badgeBg: 'bg-zinc-100 text-zinc-800 border-zinc-300',
          containerBg: 'bg-zinc-50 border-zinc-300',
          icon: HelpCircle,
          iconColor: 'text-zinc-600',
        };
    }
  };

  const config = getDecisionConfig();
  const IconComponent = config.icon;

  return (
    <header className="mb-8" id="comparison-header">
      {/* Navigation Back */}
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Return to previous search results or home"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors mb-4 px-3 py-1.5 rounded-lg hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Search</span>
        </button>
      )}

      {/* Main Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-200 pb-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">
            Head-to-Head Comparison
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            <span className="text-zinc-900">{productA}</span>
            <span className="text-zinc-400 font-normal mx-2.5">vs</span>
            <span className="text-zinc-900">{productB}</span>
          </h1>
        </div>

        {/* Evidence Strength & Confidence Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200"
            title={`Evidence strength assessed as ${evidenceStrength}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
            <span>Evidence: <strong>{evidenceStrength}</strong></span>
          </span>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200"
            title={`Analysis confidence assessed as ${confidence}`}
          >
            <span>Confidence: <strong>{confidence}</strong></span>
          </span>
        </div>
      </div>

      {/* Decision-First Verdict Card */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-all ${config.containerBg}`}
        id="decision-verdict-card"
        role="region"
        aria-label="Comparison Decision Result"
      >
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-xl bg-white border border-zinc-200/80 shadow-xs shrink-0 ${config.iconColor}`}>
            <IconComponent className="w-6 h-6" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${config.badgeBg}`}
              >
                {config.badge}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-1">
              {config.title}
            </h2>

            <p className="text-sm text-zinc-700 leading-relaxed mb-3">
              {config.subtitle}
            </p>

            {overallAssessment && (
              <div className="pt-3 border-t border-zinc-200/60 mt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Overall Synthesis
                </h3>
                <p className="text-sm text-zinc-800 leading-relaxed">
                  {overallAssessment}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
