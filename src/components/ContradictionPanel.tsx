import React, { useState } from 'react';
import { NichodResult } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ContradictionPanelProps {
  nichod: NichodResult;
}

export const ContradictionPanel: React.FC<ContradictionPanelProps> = ({ nichod }) => {
  const [expanded, setExpanded] = useState(false);
  if (nichod.contradictions.length === 0) return null;

  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-sm shadow-sm">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left font-serif-wirecutter text-xl text-zinc-950"
      >
        Conflicting Evidence ({nichod.contradictions.length})
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      
      {expanded && (
        <div className="mt-4 space-y-4">
          {nichod.contradictions.map((c, i) => (
            <div key={i} className="border-l-2 border-zinc-200 pl-4 py-2">
              <p className="font-semibold text-sm mb-1">{c.aspect}</p>
              <div className="text-sm text-zinc-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><span className="font-bold">View A:</span> {c.viewA} ({c.sourceA})</div>
                <div><span className="font-bold">View B:</span> {c.viewB} ({c.sourceB})</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
