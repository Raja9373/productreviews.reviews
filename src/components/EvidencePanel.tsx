import React, { useState } from 'react';
import { NichodResult } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EvidencePanelProps {
  nichod: NichodResult;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ nichod }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-sm shadow-sm">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left font-serif-wirecutter text-xl text-zinc-950"
      >
        Evidence ({nichod.evidenceCount})
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      
      {expanded && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-zinc-600">
            {nichod.summary}
          </p>
          <div className="border-t border-zinc-100 pt-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-2">Source Status</h4>
            <p className="text-sm text-zinc-700">
              {nichod.sourceStatus === 'STRUCTURED' ? 'Structured evidence available.' : 
               nichod.sourceStatus === 'UNSTRUCTURED' ? 'Source details unavailable in structured form.' : 
               'Source verification unavailable.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
