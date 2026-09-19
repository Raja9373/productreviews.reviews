import React from 'react';
import { NichodResult } from '../types';

interface NichodSummaryProps {
  nichod: NichodResult;
}

export const NichodSummary: React.FC<NichodSummaryProps> = ({ nichod }) => {
  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-sm shadow-sm">
      <h3 className="text-lg font-serif-wirecutter text-zinc-950 mb-2">{nichod.headline}</h3>
      <p className="text-sm text-zinc-700 leading-relaxed mb-4">{nichod.summary}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nichod.keyPositives.length > 0 && (
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 mb-2">Key Positives</h4>
            <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1">
              {nichod.keyPositives.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        )}
        {nichod.keyNegatives.length > 0 && (
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-rose-800 mb-2">Key Concerns</h4>
            <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1">
              {nichod.keyNegatives.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
