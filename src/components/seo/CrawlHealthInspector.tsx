import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, ShieldCheck } from "lucide-react";

export interface CrawlHealthReport {
  hasCanonical: boolean;
  canonicalUrl: string;
  isCanonicalValid: boolean;
  hasRobotsMeta: boolean;
  robotsContent: string;
  isIndexable: boolean;
}

export const CrawlHealthInspector: React.FC = () => {
  const [report, setReport] = useState<CrawlHealthReport>({
    hasCanonical: false,
    canonicalUrl: "",
    isCanonicalValid: false,
    hasRobotsMeta: false,
    robotsContent: "index, follow",
    isIndexable: true
  });

  const inspectRoute = () => {
    if (typeof document === "undefined") return;

    const canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalUrl = canonicalEl?.getAttribute("href") || "";
    const hasCanonical = Boolean(canonicalUrl);
    const isCanonicalValid = hasCanonical && canonicalUrl.startsWith("https://productreviews.review");

    const robotsEl = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const robotsContent = robotsEl?.getAttribute("content") || "index, follow";
    const hasRobotsMeta = Boolean(robotsEl);
    const isIndexable = !robotsContent.toLowerCase().includes("noindex");

    setReport({
      hasCanonical,
      canonicalUrl,
      isCanonicalValid,
      hasRobotsMeta,
      robotsContent,
      isIndexable
    });
  };

  useEffect(() => {
    const t = setTimeout(inspectRoute, 100);
    return () => clearTimeout(t);
  }, []);

  const allGreen = report.isCanonicalValid && report.isIndexable;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h4 className="text-xs font-bold text-stone-900 tracking-tight">Crawl Health Inspector</h4>
            <p className="text-[11px] text-stone-500">Live Canonical & Indexability Verification</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
              allGreen ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
            }`}
          >
            {allGreen ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
            {allGreen ? "PASS (Fully Indexable)" : "ACTION REQUIRED"}
          </span>
          <button
            onClick={inspectRoute}
            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
            title="Re-inspect route"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Canonical Card */}
        <div className={`p-3 rounded-xl border ${report.isCanonicalValid ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50/50 border-rose-200"}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-stone-900">Canonical Tag</span>
            {report.isCanonicalValid ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
          </div>
          <p className="text-[11px] font-mono text-stone-600 truncate bg-white p-1.5 rounded border border-stone-200">
            {report.canonicalUrl || "Missing canonical link"}
          </p>
          <p className="text-[10px] text-stone-500 mt-1">
            {report.isCanonicalValid ? "Absolute URL verified. Prevents duplicate content index bottlenecks." : "Must be an absolute HTTPS URL starting with https://productreviews.review"}
          </p>
        </div>

        {/* Indexability Card */}
        <div className={`p-3 rounded-xl border ${report.isIndexable ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/50 border-amber-200"}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-stone-900">Robots Directives</span>
            {report.isIndexable ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
          </div>
          <p className="text-[11px] font-mono text-stone-600 truncate bg-white p-1.5 rounded border border-stone-200">
            {report.robotsContent}
          </p>
          <p className="text-[10px] text-stone-500 mt-1">
            {report.isIndexable ? "Directive allows Googlebot indexing and following." : "Contains noindex directive preventing search engine indexation."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrawlHealthInspector;
