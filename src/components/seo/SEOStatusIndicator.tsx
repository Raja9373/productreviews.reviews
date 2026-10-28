import React, { useState } from "react";
import { useSeoAudit } from "./useSeoAudit";
import { ShieldCheck, ChevronUp, ChevronDown, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from "lucide-react";

export const SEOStatusIndicator: React.FC = () => {
  const { result, reevaluate } = useSeoAudit();
  const [isOpen, setIsOpen] = useState(false);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-emerald-600 text-white";
    if (score >= 70) return "bg-amber-600 text-white";
    return "bg-rose-600 text-white";
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 font-sans">
      {!isOpen && (
        <button
          onClick={() => {
            reevaluate();
            setIsOpen(true);
          }}
          className="flex items-center gap-2.5 px-3.5 py-2 bg-zinc-900/90 text-white rounded-full shadow-2xl border border-zinc-700 hover:bg-zinc-800 transition-all cursor-pointer group backdrop-blur-md"
          title="Google Search Console & SEO Health Status"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold tracking-wide uppercase text-zinc-300">SEO Health</span>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreBadgeColor(result.score)}`}>
            {result.score}/100
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      )}

      {isOpen && (
        <div className="w-[380px] max-w-[92vw] bg-zinc-950 text-white rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in duration-200">
          <div className="bg-zinc-900 p-4 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">SEO & GSC Health Audit</h3>
                <span className="text-[11px] text-zinc-400 font-mono">Real-Time DOM Inspection</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={reevaluate}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
                title="Re-run audit"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-white flex items-baseline gap-1">
                <span>{result.score}</span>
                <span className="text-sm font-normal text-zinc-500">/100</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {result.score === 100
                  ? "Flawless: 100% Search Console Compliant"
                  : `${result.passedCount} passed, ${result.warningCount} warnings, ${result.failedCount} failed`}
              </p>
            </div>
            <div className="flex gap-1.5">
              <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> {result.passedCount}
              </span>
              {result.warningCount > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/80 px-2 py-0.5 rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5" /> {result.warningCount}
                </span>
              )}
            </div>
          </div>

          <div className="p-3 overflow-y-auto space-y-2 flex-1 text-xs">
            {result.checks.map((check) => (
              <div
                key={check.id}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                  check.status === "pass"
                    ? "bg-zinc-900/60 border-emerald-900/30"
                    : check.status === "warn"
                    ? "bg-amber-950/20 border-amber-900/40"
                    : "bg-rose-950/20 border-rose-900/40"
                }`}
              >
                {check.status === "pass" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                {check.status === "warn" && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                {check.status === "fail" && <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-white truncate">{check.name}</span>
                    <span className="text-[10px] uppercase font-mono text-zinc-500">{check.category}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">{check.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
