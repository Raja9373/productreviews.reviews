import React from 'react';
import { Scale } from 'lucide-react';

interface TradeoffsPanelProps {
  tradeoffs: string[];
  productA: string;
  productB: string;
}

export const TradeoffsPanel: React.FC<TradeoffsPanelProps> = ({
  tradeoffs,
  productA,
  productB,
}) => {
  if (!tradeoffs || tradeoffs.length === 0) {
    return null;
  }

  return (
    <section className="mb-10" id="tradeoffs-section" aria-labelledby="tradeoffs-heading">
      <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-1.5 rounded-lg bg-zinc-800 text-amber-400">
            <Scale className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="tradeoffs-heading" className="text-lg font-bold text-white">
              Key Trade-Offs
            </h2>
            <span className="text-xs text-zinc-400">
              Core compromises identified between {productA} and {productB}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
          Comparisons rarely offer a consequence-free winner. Choosing one product over the other entails the following concrete compromises:
        </p>

        <ul className="space-y-3">
          {tradeoffs.map((tradeoff, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-sm text-zinc-200 bg-zinc-800/60 rounded-xl p-3.5 border border-zinc-750"
            >
              <span className="text-amber-400 font-bold shrink-0 mt-0.5">⇄</span>
              <span className="leading-relaxed">{tradeoff}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
