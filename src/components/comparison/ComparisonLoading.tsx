import React from 'react';

interface ComparisonLoadingProps {
  query?: string;
  stage?: 'searching' | 'finding' | 'comparing';
}

export const ComparisonLoading: React.FC<ComparisonLoadingProps> = ({
  query,
  stage = 'comparing',
}) => {
  return (
    <div
      className="py-16 sm:py-24 flex flex-col items-center justify-center text-center max-w-lg mx-auto px-4"
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-6">
        <div className="w-12 h-12 border-3 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">
        {stage === 'searching' && 'Initiating Product Comparison...'}
        {stage === 'finding' && 'Gathering Product A & Product B Evidence...'}
        {stage === 'comparing' && 'Evaluating Trade-Offs & Synthesizing Verdict...'}
      </h2>

      {query && (
        <p className="text-sm font-medium text-zinc-700 mb-3 truncate max-w-md">
          "{query}"
        </p>
      )}

      <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
        Consulting public specification records and comparative testing evidence without promotional distortion.
      </p>
    </div>
  );
};
