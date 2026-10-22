import React, { useState } from "react";
import { useSeoAudit } from "./useSeoAudit";
import { CheckCircle2, AlertTriangle, XCircle, Search, RefreshCw, ChevronUp, ChevronDown, ShieldCheck } from "lucide-react";

export const SEOStatusIndicator: React.FC = () => {
  const { result, reevaluate } = useSeoAudit();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "Schema" | "Meta" | "Content">("all");

  const filteredChecks = activeTab === "all" ? result.checks : result.checks.filter((c) => c.category === activeTab);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-emerald-600 text-white";
    if (score >= 70) return "bg-amber-600 text-white";
    return "bg-rose-600 text-white";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Minimized Pill */}
      {!isOpen && (
        <button
          onClick={() => {
            reevaluate();
            setIsOpen(true);
          }}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-stone-900 text-white rounded-full shadow-2xl border border-stone-700 hover:bg-stone-800 transition-all cursor-pointer group"
          title="Click to inspect deep SEO audit status"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold tracking-wide uppercase text-stone-300">SEO Health</span>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreBadgeColor(result.score)}`}>
            {result.score}/100
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
        </button>
      )}

      {/* Expanded Modal / Panel */}
      {isOpen && (
        <div className="w-[440px] max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold tracking-tight">Deep SEO Audit Suite</h3>
                <p className="text-[11px] text-stone-400">12 Verification Signals & Schema Validation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={reevaluate}
                className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Re-run audit"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Re-audit</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Score Summary Banner */}
          <div className="bg-stone-50 p-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-stone-900 tracking-tight flex items-baseline gap-1">
                <span>{result.score}</span>
                <span className="text-sm font-normal text-stone-500">/100</span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                {result.score === 100
                  ? "Flawless: Ready for Search Crawlers"
                  : `${result.passedCount} passed, ${result.warningCount} warnings, ${result.failedCount} failed`}
              </p>
            </div>
            <div className="flex gap-1.5">
              <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {result.passedCount}
              </span>
              {result.warningCount > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {result.warningCount}
                </span>
              )}
              {result.failedCount > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-semibold bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" /> {result.failedCount}
                </span>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-stone-200 bg-stone-100 text-xs px-2 pt-1.5 gap-1">
            {(["all", "Schema", "Meta", "Content"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 font-medium rounded-t-lg transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-stone-900 border-t border-x border-stone-200 shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {tab === "all" ? "All Checks (12)" : tab}
              </button>
            ))}
          </div>

          {/* Check List */}
          <div className="p-3 overflow-y-auto space-y-2 flex-1 divide-y divide-stone-100">
            {filteredChecks.map((check) => (
              <div key={check.id} className="pt-2 first:pt-0 flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  {check.status === "pass" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {check.status === "warn" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  {check.status === "fail" && <XCircle className="w-4 h-4 text-rose-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900 truncate">{check.name}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                      {check.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">{check.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer with Actions */}
          <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline flex items-center gap-1 font-medium text-[11px]"
            >
              <Search className="w-3 h-3" /> View sitemap.xml
            </a>
            <button
              onClick={reevaluate}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
            >
              Do Deep SEO Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOStatusIndicator;
