import React from 'react';
import { SourceStatus } from '../../types';
import { ShieldCheck, Info } from 'lucide-react';

interface EvidenceTransparencyPanelProps {
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  evidenceStrength: 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT';
  sourceStatus: SourceStatus;
  aspectsCount?: number;
}

export const EvidenceTransparencyPanel: React.FC<EvidenceTransparencyPanelProps> = ({
  confidence,
  evidenceStrength,
  sourceStatus,
  aspectsCount = 0,
}) => {
  const getSourceStatusDetails = () => {
    switch (sourceStatus) {
      case SourceStatus.STRUCTURED:
        return {
          label: 'STRUCTURED RECORDS',
          desc: 'Primary specification records and verified source citations are mapped to evidence points.',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case SourceStatus.UNSTRUCTURED:
        return {
          label: 'UNSTRUCTURED RESEARCH',
          desc: 'Evaluation is based on published editorial records and comparative research without direct structured database fields.',
          classes: 'bg-zinc-100 text-zinc-800 border-zinc-300',
        };
      case SourceStatus.UNAVAILABLE:
      default:
        return {
          label: 'SOURCES UNAVAILABLE',
          desc: 'Primary citations were unavailable or restricted at retrieval time. Conclusions are strictly bounded.',
          classes: 'bg-amber-50 text-amber-800 border-amber-200',
        };
    }
  };

  const statusInfo = getSourceStatusDetails();

  return (
    <section className="mb-10" id="transparency-section" aria-labelledby="transparency-heading">
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-zinc-100">
          <ShieldCheck className="w-4 h-4 text-zinc-600" aria-hidden="true" />
          <h2 id="transparency-heading" className="text-sm font-bold uppercase tracking-wider text-zinc-800">
            Evidence Transparency &amp; Rigor
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
              Evidence Strength
            </span>
            <span className="text-sm font-bold text-zinc-900 block mb-1">
              {evidenceStrength}
            </span>
            <p className="text-xs text-zinc-600 leading-snug">
              {evidenceStrength === 'STRONG'
                ? 'Multiple corroborating factual records established.'
                : evidenceStrength === 'MODERATE'
                ? 'Sufficient evidence for key comparison dimensions.'
                : 'Limited comparative data available across sources.'}
            </p>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
              Engine Confidence
            </span>
            <span className="text-sm font-bold text-zinc-900 block mb-1">
              {confidence}
            </span>
            <p className="text-xs text-zinc-600 leading-snug">
              {confidence === 'HIGH'
                ? 'Strong confidence in decision boundaries.'
                : confidence === 'MEDIUM'
                ? 'Moderate confidence; minor gaps remain.'
                : 'Low confidence; significant parameters unresolved.'}
            </p>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
              Source Record Status
            </span>
            <span className="text-sm font-bold text-zinc-900 block mb-1">
              {statusInfo.label}
            </span>
            <p className="text-xs text-zinc-600 leading-snug">
              {statusInfo.desc}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-zinc-500 bg-zinc-50/70 rounded-xl p-3 border border-zinc-150">
          <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            ProductReviews.review comparison engine operates independently. We do not accept manufacturer sponsorship, affiliate placement bonuses, or advertising incentives to bias comparison verdicts. We never invent specifications, prices, or performance claims. Where evidence is incomplete, we state it transparently.
          </p>
        </div>
      </div>
    </section>
  );
};
