import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { DecisionDomain } from '../types';

interface BreadcrumbProps {
  onHomeClick: () => void;
  domain: DecisionDomain;
  query: string;
}

export const Breadcrumbs: React.FC<BreadcrumbProps> = ({ onHomeClick, domain, query }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-xs text-zinc-500">
        <li>
          <button
            onClick={onHomeClick}
            className="flex items-center hover:text-zinc-900 transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1.5" />
            Home
          </button>
        </li>
        <li className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <span className="capitalize">{domain.toLowerCase()}</span>
        </li>
        <li className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <span className="font-semibold text-zinc-900 truncate max-w-[200px]" title={query}>
            {query}
          </span>
        </li>
      </ol>
    </nav>
  );
};
