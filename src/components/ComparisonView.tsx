import React from 'react';
import { ComparisonItem, ComparisonResult, LanguageCode } from '../types';
import { ComparisonHeader } from './comparison/ComparisonHeader';
import { AspectComparison } from './comparison/AspectComparison';
import { StrengthsWeaknesses } from './comparison/StrengthsWeaknesses';
import { TradeoffsPanel } from './comparison/TradeoffsPanel';
import { ContradictionsPanel } from './comparison/ContradictionsPanel';
import { MissingInfoPanel } from './comparison/MissingInfoPanel';
import { EvidenceTransparencyPanel } from './comparison/EvidenceTransparencyPanel';
import { ComparisonLoading } from './comparison/ComparisonLoading';
import { ComparisonError } from './comparison/ComparisonError';
import { AlertCircle, ArrowLeft, Scale } from 'lucide-react';

export interface ComparisonViewProps {
  comparison?: ComparisonItem; // legacy support
  comparisonResult?: ComparisonResult; // Phase 6.3 production authoritative result
  currentLang?: LanguageCode;
  onBack: () => void;
  onRetry?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  comparison,
  comparisonResult,
  currentLang = 'en',
  onBack,
  onRetry,
  isLoading = false,
  errorMessage,
}) => {
  // 1. Loading State
  if (isLoading) {
    return <ComparisonLoading query={comparisonResult?.query} stage="comparing" />;
  }

  // 2. Error State
  if (errorMessage) {
    return (
      <ComparisonError
        message={errorMessage}
        onRetry={onRetry}
        onBack={onBack}
      />
    );
  }

  // 3. Phase 6.3 Production Comparison Result Flow
  if (comparisonResult) {
    const {
      productA = '',
      productB = '',
      aspects = [],
      productAStrengths = [],
      productBStrengths = [],
      productAWeaknesses = [],
      productBWeaknesses = [],
      tradeoffs = [],
      contradictions = [],
      missingInformation = [],
      overallAssessment = '',
      confidence = 'MEDIUM',
      evidenceStrength = 'MODERATE',
      sourceStatus,
      decision = 'INSUFFICIENT_EVIDENCE',
    } = comparisonResult;

    // Guard: Identical Products (Requirement 16)
    const isIdentical =
      productA.trim().length > 0 &&
      productB.trim().length > 0 &&
      productA.trim().toLowerCase() === productB.trim().toLowerCase();

    if (isIdentical) {
      return (
        <div className="max-w-3xl mx-auto py-12 px-4" role="alert">
          <div className="bg-zinc-50 border border-zinc-300 rounded-2xl p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">
              Identical Products Specified
            </h2>
            <p className="text-sm text-zinc-600 mb-6 max-w-md mx-auto leading-relaxed">
              Both comparison targets refer to the same product (<strong>{productA}</strong>). An objective comparison requires two distinct products or variants.
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to Search</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 antialiased" id="production-comparison-view">
        {/* Decision-First Header */}
        <ComparisonHeader
          productA={productA || 'Product A'}
          productB={productB || 'Product B'}
          decision={decision}
          overallAssessment={overallAssessment}
          confidence={confidence}
          evidenceStrength={evidenceStrength}
          onBack={onBack}
        />

        {/* State-specific Explanatory Notice */}
        {decision === 'CONDITIONAL' && (
          <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
            <span className="text-amber-600 font-bold shrink-0 mt-0.5">ℹ</span>
            <div className="leading-relaxed">
              <strong>Conditional Outcome:</strong> Neither product is universally superior for every buyer. Your optimal choice depends heavily on which specific trade-offs (e.g. price vs features, portability vs capability) matter most to your workflow.
            </div>
          </div>
        )}

        {decision === 'NEITHER' && (
          <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
            <span className="text-rose-600 font-bold shrink-0 mt-0.5">✕</span>
            <div className="leading-relaxed">
              <strong>Neither Product Recommended:</strong> Based on verified evidence, significant drawbacks or limitations were identified on both options for this query. Review the established weaknesses below before committing.
            </div>
          </div>
        )}

        {decision === 'INSUFFICIENT_EVIDENCE' && (
          <div className="mb-8 p-4 rounded-xl bg-zinc-100 border border-zinc-300 text-zinc-800 text-sm flex items-start gap-3">
            <span className="text-zinc-500 font-bold shrink-0 mt-0.5">?</span>
            <div className="leading-relaxed">
              <strong>Evidence Incomplete:</strong> We could not establish enough corroborated facts or comparative specifications to responsibly declare a verdict. Key missing data points are cataloged below.
            </div>
          </div>
        )}

        {/* Key Trade-offs */}
        <TradeoffsPanel
          tradeoffs={tradeoffs}
          productA={productA}
          productB={productB}
        />

        {/* Aspect-by-Aspect Breakdown */}
        <AspectComparison
          aspects={aspects}
          productA={productA}
          productB={productB}
        />

        {/* Strengths & Weaknesses */}
        <StrengthsWeaknesses
          productA={productA}
          productB={productB}
          productAStrengths={productAStrengths}
          productAWeaknesses={productAWeaknesses}
          productBStrengths={productBStrengths}
          productBWeaknesses={productBWeaknesses}
        />

        {/* Contradictions / Conflicting Evidence */}
        <ContradictionsPanel
          contradictions={contradictions}
        />

        {/* Missing Information */}
        <MissingInfoPanel
          missingInformation={missingInformation}
        />

        {/* Evidence Transparency & Methodology */}
        <EvidenceTransparencyPanel
          confidence={confidence}
          evidenceStrength={evidenceStrength}
          sourceStatus={sourceStatus}
          aspectsCount={aspects.length}
        />
      </div>
    );
  }

  // 4. Legacy ComparisonItem Fallback (maintains backwards compatibility)
  if (comparison) {
    const { entityA, entityB, factors = [], mainCompromise, verdictSummary } = comparison;

    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6" id="legacy-comparison-view">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Search</span>
        </button>

        <div className="border-b border-zinc-200 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Head-to-Head Comparison
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
            {entityA.name} <span className="text-zinc-400 font-normal">vs</span> {entityB.name}
          </h1>
        </div>

        {/* Main Compromise & Final Verdict */}
        <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Main Compromise
          </h2>
          <p className="text-base sm:text-lg text-zinc-200 leading-relaxed mb-6">
            {mainCompromise}
          </p>
          <div className="pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              Verdict Summary
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{verdictSummary}</p>
          </div>
        </div>

        {/* Factors */}
        <section className="space-y-4 mb-8">
          <h2 className="text-lg font-bold text-zinc-900">Comparison Factors</h2>
          {factors.map((factor, idx) => (
            <div key={idx} className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs">
              <h3 className="text-base font-bold text-zinc-900 capitalize mb-2">{factor.factor}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                <div className="bg-zinc-50 p-3 rounded-lg">
                  <div className="font-semibold text-zinc-700 text-xs mb-1">{entityA.name}</div>
                  <div className="text-zinc-900">{factor.entityAAssessment}</div>
                </div>
                <div className="bg-zinc-50 p-3 rounded-lg">
                  <div className="font-semibold text-zinc-700 text-xs mb-1">{entityB.name}</div>
                  <div className="text-zinc-900">{factor.entityBAssessment}</div>
                </div>
              </div>
              <p className="text-xs text-zinc-500 italic">
                <span className="font-medium text-zinc-700 not-italic">Assessment: </span>
                {factor.why}
              </p>
            </div>
          ))}
        </section>
      </div>
    );
  }

  // 5. Empty / Missing State
  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
      <h2 className="text-lg font-bold text-zinc-900 mb-2">No Comparison Data Available</h2>
      <p className="text-sm text-zinc-600 mb-6">
        We could not locate comparison data for the requested items.
      </p>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 bg-zinc-900 text-white text-xs font-semibold px-4 py-2 rounded-xl"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </button>
    </div>
  );
};
