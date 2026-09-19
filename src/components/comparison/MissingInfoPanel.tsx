import React from 'react';
import { HelpCircle } from 'lucide-react';

interface MissingInfoPanelProps {
  missingInformation: string[];
}

export const MissingInfoPanel: React.FC<MissingInfoPanelProps> = ({
  missingInformation,
}) => {
  if (!missingInformation || missingInformation.length === 0) {
    return null;
  }

  return (
    <section className="mb-10" id="missing-information-section" aria-labelledby="missing-info-heading">
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-2">
          <HelpCircle className="w-5 h-5 text-zinc-500 shrink-0" aria-hidden="true" />
          <h2 id="missing-info-heading" className="text-base font-bold text-zinc-900">
            What We Could Not Establish
          </h2>
        </div>

        <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
          The following parameters were either missing or insufficiently substantiated in current verified public records at the time of evaluation:
        </p>

        <ul className="space-y-2">
          {missingInformation.map((info, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-sm text-zinc-800 bg-white rounded-xl p-3 border border-zinc-200/80"
            >
              <span className="text-zinc-400 font-bold shrink-0 mt-0.5">•</span>
              <span className="leading-relaxed">{info}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
