import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ContradictionsPanelProps {
  contradictions: string[];
}

export const ContradictionsPanel: React.FC<ContradictionsPanelProps> = ({
  contradictions,
}) => {
  if (!contradictions || contradictions.length === 0) {
    return null;
  }

  return (
    <section className="mb-10" id="conflicting-evidence-section" aria-labelledby="conflicting-evidence-heading">
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
          <h2 id="conflicting-evidence-heading" className="text-base font-bold text-amber-900">
            Conflicting Evidence Identified
          </h2>
        </div>

        <p className="text-xs text-amber-800 mb-4 leading-relaxed">
          The following dimensions contain conflicting claims across sources or testing evaluations. We do not resolve contradictions arbitrarily; both perspectives are preserved below:
        </p>

        <ul className="space-y-2.5">
          {contradictions.map((contra, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-sm text-amber-950 bg-white/80 rounded-xl p-3 border border-amber-200/80"
            >
              <span className="text-amber-600 font-bold shrink-0 mt-0.5">!</span>
              <span className="leading-relaxed">{contra}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
