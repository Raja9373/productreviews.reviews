import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  FileCode,
  ShieldCheck,
  Tag,
  FileText,
  SlidersHorizontal,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SEOAuditItem, SEOAuditSummary, SEOCategory, SEOStatusLevel } from './seoAuditTypes';

interface SEOStatusReportProps {
  summary: SEOAuditSummary;
  onRescan: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const SEOStatusReport: React.FC<SEOStatusReportProps> = ({
  summary,
  onRescan,
  onClose,
  isModal = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | SEOCategory>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SEOStatusLevel>('ALL');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [isRescanning, setIsRescanning] = useState(false);

  const handleManualRescan = () => {
    setIsRescanning(true);
    onRescan();
    setTimeout(() => setIsRescanning(false), 500);
  };

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const copyFullReportMarkdown = () => {
    const lines = [
      `# ProductReviews.review — SEO & Structured Data Audit Report`,
      `**URL:** ${summary.pageUrl || window.location.href}`,
      `**Score:** ${summary.score}/100`,
      `**Passed:** ${summary.passedCount} | **Warnings:** ${summary.warningCount} | **Failed:** ${summary.failedCount}`,
      `**Timestamp:** ${summary.timestamp}`,
      `\n## Audit Checklist Results:\n`,
    ];

    summary.items.forEach((item) => {
      const emoji = item.status === 'passed' ? '✅' : item.status === 'warning' ? '⚠️' : '❌';
      lines.push(`### ${emoji} [${item.status.toUpperCase()}] ${item.name}`);
      lines.push(`- **Value:** ${item.value || 'None'}`);
      lines.push(`- **Message:** ${item.message}`);
      if (item.fix) {
        lines.push(`- **Suggested Fix:** ${item.fix.title} (${item.fix.location})`);
        lines.push(`\`\`\`${item.fix.codeType}\n${item.fix.codeSnippet}\n\`\`\``);
      }
      lines.push('');
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Filter items
  const filteredItems = summary.items.filter((item) => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 70) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const content = (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden font-sans text-zinc-900">
      {/* Header Bar */}
      <div className="bg-zinc-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-zinc-950 text-xs font-bold font-mono px-2 py-0.5 rounded">
              SEO AUDITOR
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Live Schema &amp; Meta Tag Inspector
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-wirecutter mt-1 text-white tracking-tight">
            SEO &amp; Structured Data Health Dashboard
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time verification for Product, Review, AggregateRating schemas and indexing directives.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleManualRescan}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isRescanning ? 'opacity-75' : ''
            }`}
            title="Re-scan live DOM"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRescanning ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Re-scan DOM</span>
          </button>

          <button
            onClick={copyFullReportMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Copy audit results as Markdown"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </>
            )}
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer ml-1"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Summary Score Bar */}
      <div className="bg-zinc-50 border-b border-zinc-200 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-lg border border-zinc-200 shadow-2xs">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center font-serif-wirecutter text-xl font-bold border ${getScoreColor(
              summary.score
            )}`}
          >
            {summary.score}
          </div>
          <div>
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              SEO Health Score
            </div>
            <div className="text-sm font-bold text-zinc-900">
              {summary.score >= 90
                ? 'Rich Results Ready'
                : summary.score >= 70
                ? 'Action Needed'
                : 'Critical Gaps'}
            </div>
          </div>
        </div>

        {/* Passed */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-lg border border-zinc-200 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Passed Checks
            </div>
            <div className="text-sm font-bold text-emerald-700">
              {summary.passedCount} / {summary.totalChecks}
            </div>
          </div>
        </div>

        {/* Warnings */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-lg border border-zinc-200 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Warnings
            </div>
            <div className="text-sm font-bold text-amber-700">
              {summary.warningCount} recommendations
            </div>
          </div>
        </div>

        {/* Failed */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-lg border border-zinc-200 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Failed
            </div>
            <div className="text-sm font-bold text-rose-700">
              {summary.failedCount} critical
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 sm:p-5 border-b border-zinc-200 bg-white flex flex-wrap items-center justify-between gap-3">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeCategory === 'ALL'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            All Checks ({summary.items.length})
          </button>
          <button
            onClick={() => setActiveCategory('STRUCTURED_DATA')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeCategory === 'STRUCTURED_DATA'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Structured Data (5)</span>
          </button>
          <button
            onClick={() => setActiveCategory('META_TAGS')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeCategory === 'META_TAGS'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Meta Tags (5)</span>
          </button>
          <button
            onClick={() => setActiveCategory('CONTENT_SIGNALS')}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeCategory === 'CONTENT_SIGNALS'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Content Signals (2)</span>
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-zinc-400 font-mono text-[11px] mr-1 hidden sm:inline">Status:</span>
          {(['ALL', 'failed', 'warning', 'passed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Items List */}
      <div className="p-4 sm:p-6 space-y-3 max-h-[62vh] overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm">
            No audit items match the selected filters.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedItemId === item.id;
            const statusConfig = {
              passed: {
                icon: CheckCircle2,
                color: 'text-emerald-700',
                border: 'border-emerald-200',
                bg: 'bg-emerald-50/50',
                badgeBg: 'bg-emerald-100 text-emerald-800',
                label: 'PASSED',
              },
              warning: {
                icon: AlertTriangle,
                color: 'text-amber-700',
                border: 'border-amber-200',
                bg: 'bg-amber-50/40',
                badgeBg: 'bg-amber-100 text-amber-800',
                label: 'RECOMMENDATION',
              },
              failed: {
                icon: XCircle,
                color: 'text-rose-700',
                border: 'border-rose-200',
                bg: 'bg-rose-50/40',
                badgeBg: 'bg-rose-100 text-rose-800',
                label: 'ACTION REQUIRED',
              },
            }[item.status];

            const Icon = statusConfig.icon;

            return (
              <div
                key={item.id}
                className={`border rounded-lg transition-all ${statusConfig.border} ${
                  isExpanded ? 'bg-white shadow-md' : statusConfig.bg
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${statusConfig.color}`} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-zinc-900 text-sm">{item.name}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${statusConfig.badgeBg}`}
                        >
                          {statusConfig.label}
                        </span>
                        {item.isRequired ? (
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                            REQUIRED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-400">
                            OPTIONAL
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{item.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 sm:pl-4">
                    {item.value && (
                      <span className="text-xs font-mono text-zinc-700 bg-white border border-zinc-200 px-2 py-1 rounded max-w-[200px] truncate">
                        {item.value}
                      </span>
                    )}
                    <button className="text-zinc-400 hover:text-zinc-600 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details & Actionable Fix */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-zinc-100 text-xs text-zinc-700 space-y-3">
                    {item.details && (
                      <div className="text-zinc-500 font-mono text-[11px] bg-zinc-50 p-2.5 rounded border border-zinc-200">
                        {item.details}
                      </div>
                    )}

                    {/* Actionable Fix Box if Available */}
                    {item.fix ? (
                      <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg border border-zinc-800 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Actionable Fix: {item.fix.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {item.fix.location}
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-300 leading-relaxed">
                          {item.fix.description}
                        </p>

                        <div className="relative mt-2">
                          <pre className="bg-zinc-950 p-3 rounded text-[11px] font-mono overflow-x-auto text-emerald-300 border border-zinc-800">
                            {item.fix.codeSnippet}
                          </pre>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyCode(item.id, item.fix!.codeSnippet);
                            }}
                            className="absolute right-2 top-2 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedSnippetId === item.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Snippet</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-emerald-700 bg-emerald-50 p-2.5 rounded border border-emerald-200 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>All Google search and structured data requirements for this item are met.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-zinc-50 border-t border-zinc-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
        <div>
          <span>Audited Schemas Detected: </span>
          <strong className="text-zinc-800">
            {summary.detectedSchemas.length > 0 ? summary.detectedSchemas.join(', ') : 'None'}
          </strong>
        </div>
        <div className="flex items-center gap-3">
          <span>Standards: Google Search Central • Schema.org v26.0</span>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-xl shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
