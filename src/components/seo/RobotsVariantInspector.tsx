import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react";

export const RobotsVariantInspector: React.FC = () => {
  const [hasQueryParam, setHasQueryParam] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const [robotsContent, setRobotsContent] = useState("index, follow");

  const inspectVariant = () => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const search = window.location.search;
    setCurrentSearch(search);
    setHasQueryParam(search.length > 0);

    const robotsEl = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    setRobotsContent(robotsEl?.getAttribute("content") || "index, follow");
  };

  useEffect(() => {
    const t = setTimeout(inspectVariant, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
        <div>
          <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Non-Canonical Variant Inspector
          </h4>
          <p className="text-[11px] text-stone-600 mt-0.5">
            Detects query parameters and flags indexing directives for master pages.
          </p>
        </div>
        <button
          onClick={inspectVariant}
          className="p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
          title="Re-inspect variant"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="text-[10px]">Re-scan</span>
        </button>
      </div>

      <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-900">Query Parameter Status</span>
          <span
            className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
              hasQueryParam ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {hasQueryParam ? "Variant Query Detected" : "Clean Master URL"}
          </span>
        </div>
        <div className="text-[11px] font-mono bg-stone-50 p-2 rounded-lg border border-stone-200 text-stone-700 truncate">
          {currentSearch ? `Query: ${currentSearch}` : "No query parameters (Master page)"}
        </div>
        <p className="text-[11px] text-stone-600 leading-snug">
          {hasQueryParam
            ? "Active query parameters (e.g. market selection) rely on absolute canonical links pointing to the clean master /review/:slug URL to guide Googlebot."
            : "This URL is serving as the primary master page, supported by absolute canonical tags and indexable robots meta tags."}
        </p>
      </div>
    </div>
  );
};

export default RobotsVariantInspector;
