import React from 'react';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';

interface ComparisonErrorProps {
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export const ComparisonError: React.FC<ComparisonErrorProps> = ({
  message,
  onRetry,
  onBack,
}) => {
  return (
    <div
      className="py-12 px-4 max-w-lg mx-auto text-center"
      role="alert"
      id="comparison-error-view"
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>

      <h2 className="text-xl font-bold text-zinc-900 mb-2">
        Unable to Complete Comparison
      </h2>

      <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
        {message ||
          'We encountered an issue while retrieving or synthesizing evidence for these products. Please try again or check your query.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Retry Comparison</span>
          </button>
        )}

        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Home</span>
          </button>
        )}
      </div>
    </div>
  );
};
