import React, { useState, useEffect } from "react";
import { validatePageJsonLd, SchemaValidationReport } from "../../seo/SchemaValidator";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, FileCode, Check } from "lucide-react";

export const SEOAuditPanel: React.FC = () => {
  const [report, setReport] = useState<SchemaValidationReport>(() => validatePageJsonLd());
  const [copied, setCopied] = useState(false);

  const refreshAudit = () => {
    setReport(validatePageJsonLd());
  };

  useEffect(() => {
    const timer = setTimeout(refreshAudit, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyAll = () => {
    if (typeof document === "undefined") return;
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const combined = scripts.map((s) => s.textContent || "").join("\n\n");
    navigator.clipboard.writeText(combined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Extract detected schema types from DOM
  const detectedTypes = ["Product", "Review", "AggregateRating", "FAQPage", "BreadcrumbList"];
  const presentTypes = new Set<string>();

  if (typeof document !== "undefined") {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const script of scripts) {
      try {
        const parsed = JSON.parse(script.textContent || "{}");
        const items = Array.isArray(parsed) ? parsed : parsed["@graph"] ? parsed["@graph"] : [parsed];
        for (const item of items) {
          if (item["@type"]) presentTypes.add(item["@type"]);
        }
      } catch {}
    }
  }

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
        <div>
          <h4 className="text-xs font-bold text-stone-900">Schema.org Structured Data Audit</h4>
          <p className="text-[11px] text-stone-600 mt-0.5">
            {report.isValid ? "All detected schemas conform to Google Rich Results rules." : `${report.errorCount} schema errors detected.`}
          </p>
        </div>
        <button
          onClick={refreshAudit}
          className="p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
          title="Refresh audit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="text-[10px]">Re-scan</span>
        </button>
      </div>

      {/* Schema Status Cards */}
      <div className="space-y-2">
        {detectedTypes.map((type) => {
          const isPresent = presentTypes.has(type);
          const relatedIssues = report.issues.filter((i) => i.entityType === type || (type === "Product" && i.entityType === "AggregateRating"));
          const hasError = relatedIssues.some((i) => i.severity === "error");

          return (
            <div key={type} className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-start gap-2.5 shadow-2xs">
              <div className="mt-0.5 shrink-0">
                {isPresent && !hasError ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isPresent && hasError ? (
                  <XCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">{type} Schema</span>
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      isPresent && !hasError ? "bg-emerald-100 text-emerald-800" : isPresent ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isPresent && !hasError ? "Valid & Present" : isPresent ? "Validation Error" : "Not Present"}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                  {isPresent
                    ? relatedIssues.length > 0
                      ? relatedIssues[0].message
                      : `Successfully structured and validated for Google Rich Results.`
                    : `Optional or not injected for this specific view route.`}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Copy JSON-LD Action */}
      <div className="pt-1">
        <button
          onClick={handleCopyAll}
          className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
          {copied ? "Copied All Page JSON-LD!" : "Copy All Page JSON-LD to Clipboard"}
        </button>
      </div>
    </div>
  );
};

export default SEOAuditPanel;
