import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface StrengthsWeaknessesProps {
  productA: string;
  productB: string;
  productAStrengths: string[];
  productAWeaknesses: string[];
  productBStrengths: string[];
  productBWeaknesses: string[];
}

export const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({
  productA,
  productB,
  productAStrengths,
  productAWeaknesses,
  productBStrengths,
  productBWeaknesses,
}) => {
  return (
    <section className="mb-10" id="strengths-weaknesses-section" aria-labelledby="strengths-weaknesses-heading">
      <h2 id="strengths-weaknesses-heading" className="text-xl font-bold text-zinc-900 mb-4">
        Strengths &amp; Weaknesses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product A Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs">
          <div className="border-b border-zinc-150 pb-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
              Product Overview
            </span>
            <h3 className="text-lg font-bold text-zinc-900 truncate">
              {productA}
            </h3>
          </div>

          {/* Strengths */}
          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Established Strengths</span>
            </h4>
            {productAStrengths && productAStrengths.length > 0 ? (
              <ul className="space-y-2 text-sm text-zinc-800">
                {productAStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span className="leading-snug">{str}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-500 italic">
                No specific strengths established from available evidence.
              </p>
            )}
          </div>

          {/* Weaknesses */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-2.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              <span>Established Weaknesses &amp; Drawbacks</span>
            </h4>
            {productAWeaknesses && productAWeaknesses.length > 0 ? (
              <ul className="space-y-2 text-sm text-zinc-800">
                {productAWeaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold shrink-0">✕</span>
                    <span className="leading-snug">{weak}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-500 italic">
                No specific weaknesses established from available evidence.
              </p>
            )}
          </div>
        </div>

        {/* Product B Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xs">
          <div className="border-b border-zinc-150 pb-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
              Product Overview
            </span>
            <h3 className="text-lg font-bold text-zinc-900 truncate">
              {productB}
            </h3>
          </div>

          {/* Strengths */}
          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Established Strengths</span>
            </h4>
            {productBStrengths && productBStrengths.length > 0 ? (
              <ul className="space-y-2 text-sm text-zinc-800">
                {productBStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span className="leading-snug">{str}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-500 italic">
                No specific strengths established from available evidence.
              </p>
            )}
          </div>

          {/* Weaknesses */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-2.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              <span>Established Weaknesses &amp; Drawbacks</span>
            </h4>
            {productBWeaknesses && productBWeaknesses.length > 0 ? (
              <ul className="space-y-2 text-sm text-zinc-800">
                {productBWeaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold shrink-0">✕</span>
                    <span className="leading-snug">{weak}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-500 italic">
                No specific weaknesses established from available evidence.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
