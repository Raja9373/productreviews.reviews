import React from 'react';
import { DecisionEngineResult, Confidence } from '../types';
import { ShieldCheck, AlertCircle, HelpCircle, CheckCircle } from 'lucide-react';

interface DecisionCardProps {
  decision: DecisionEngineResult;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision }) => {
  const getStyle = () => {
    switch (decision.decision) {
      case 'BUY': return 'border-emerald-500 bg-emerald-50 text-emerald-900';
      case 'BUY_IF': return 'border-sky-500 bg-sky-50 text-sky-900';
      case 'DON\'T_BUY': return 'border-rose-500 bg-rose-50 text-rose-900';
      default: return 'border-zinc-300 bg-zinc-50 text-zinc-900';
    }
  };

  const getIcon = () => {
    switch (decision.decision) {
      case 'BUY': return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      case 'BUY_IF': return <HelpCircle className="w-6 h-6 text-sky-600" />;
      case 'DON\'T_BUY': return <AlertCircle className="w-6 h-6 text-rose-600" />;
      default: return <ShieldCheck className="w-6 h-6 text-zinc-600" />;
    }
  };

  return (
    <div className={`border-l-4 p-6 rounded-r-lg shadow-sm ${getStyle()}`}>
      <div className="flex items-start gap-4">
        {getIcon()}
        <div>
          <h2 className="text-xl font-bold font-serif-wirecutter">{decision.headline}</h2>
          <p className="mt-2 text-sm leading-relaxed">{decision.rationale}</p>
        </div>
      </div>
      
      {decision.decision === 'BUY_IF' && decision.conditions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-current/20">
          <p className="font-semibold text-sm mb-2">Conditions to meet:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {decision.conditions.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
      
      <div className="mt-4 flex gap-4 text-xs font-mono opacity-80">
        <span>Confidence: {decision.confidence}</span>
        <span>Evidence: {decision.evidenceStrength}</span>
      </div>
    </div>
  );
};
