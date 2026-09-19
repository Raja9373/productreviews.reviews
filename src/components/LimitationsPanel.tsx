import React from 'react';
import { NichodResult, DecisionEngineResult } from '../types';

interface LimitationsPanelProps {
  nichod: NichodResult;
  decision: DecisionEngineResult;
}

export const LimitationsPanel: React.FC<LimitationsPanelProps> = ({ nichod, decision }) => {
  const allLimitations = [...new Set([...nichod.limitations, ...decision.limitations, ...decision.uncertainty])];
  
  if (allLimitations.length === 0) return null;

  return (
    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
      <h3 className="font-serif-wirecutter text-lg text-zinc-950 mb-3">Research limitations</h3>
      <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1">
        {allLimitations.map((lim, i) => <li key={i}>{lim}</li>)}
      </ul>
    </div>
  );
};
