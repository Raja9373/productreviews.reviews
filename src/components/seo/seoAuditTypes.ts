export type SEOStatusLevel = 'passed' | 'warning' | 'failed';

export type SEOCategory = 'STRUCTURED_DATA' | 'META_TAGS' | 'CONTENT_SIGNALS';

export interface ActionableFix {
  title: string;
  description: string;
  codeSnippet: string;
  codeType: 'json' | 'html';
  location: string;
}

export interface SEOAuditItem {
  id: string;
  name: string;
  category: SEOCategory;
  status: SEOStatusLevel;
  isRequired: boolean;
  value: string | null;
  message: string;
  details?: string;
  fix?: ActionableFix;
}

export interface SEOAuditSummary {
  score: number; // 0 - 100
  totalChecks: number;
  passedCount: number;
  warningCount: number;
  failedCount: number;
  timestamp: string;
  pageUrl: string;
  items: SEOAuditItem[];
  detectedSchemas: string[];
}
