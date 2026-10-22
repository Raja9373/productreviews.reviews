import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, ShieldCheck } from "lucide-react";

export interface CrawlHealthStatus {
  hasCanonical: boolean;
  canonicalHref: string;
  isCanonicalAbsolute: boolean;
  hasRobots: boolean;
  robotsContent: string;
  isRobotsIndexable: boolean;
}

export const CrawlHealthPanel: React.FC = () => {
  const [status, setStatus] = useState<CrawlHealthStatus>({
    hasCanonical: false,
    canonicalHref: "",
    isCanonicalAbsolute: false,
    hasRobots: false,
    robotsContent: "",
    isRobotsIndexable: true
  });

  const inspectCrawlHealth = () => {
    if (typeof document === "undefined") return;

    const canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalHref = canonicalEl?.getAttribute("href") || "";
    const hasCanonical = Boolean(canonicalHref);
    const isCanonicalAbsolute = canonicalHref.startsWith("https://productreviews.review");

    const robotsEl = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const robotsContent = robotsEl?.getAttribute("content") || "index, follow";
    const hasRobots = Boolean(robotsEl);
    const isRobotsIndexable = !robotsContent.toLowerCase().includes("noindex");

    setStatus({
      hasCanonical,
      canonicalHref,
      isCanonicalAbsolute,
      hasRobots,
      robotsContent,
      isRobotsIndexable
    });
  };

  useEffect(() => {
    const t = setTimeout(inspectCrawlHealth, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
        <div>
          <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Meta Tags & Crawl Health
          </h4>
          <p className="text-[11px] text-stone-600 mt-0.5">
            Real-time DOM inspection for canonical & robots meta tag rendering.
          </p>
        </div>
        <button
          onClick={inspectCrawlHealth}
          className="p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
          title="Re-inspect DOM"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="text-[10px]">Re-scan</span>
        </button>
      </div>

      {/* Canonical Status Card */}
      <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-900">Canonical Link Tag</span>
          <span
            className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
              status.hasCanonical && status.isCanonicalAbsolute ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
            }`}
          >
            {status.hasCanonical && status.isCanonicalAbsolute ? "Optimal & Absolute" : "Missing / Malformed"}
          </span>
        </div>
        <div className="text-[11px] font-mono bg-stone-50 p-2 rounded-lg border border-stone-200 text-stone-700 truncate">
          {status.canonicalHref || "No canonical tag found in document head"}
        </div>
        <p className="text-[11px] text-stone-600 leading-snug">
          {status.isCanonicalAbsolute
            ? "Correctly points to the original non-parameterized URL to prevent duplicate content indexing."
            : "Warning: Canonical URL is missing or does not start with https://productreviews.review."}
        </p>
      </div>

      {/* Robots Directives Status Card */}
      <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-900">Robots Meta Directives</span>
          <span
            className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
              status.hasRobots && status.isRobotsIndexable ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            {status.hasRobots ? status.robotsContent : "Default (index, follow)"}
          </span>
        </div>
        <div className="text-[11px] font-mono bg-stone-50 p-2 rounded-lg border border-stone-200 text-stone-700 truncate">
          &lt;meta name="robots" content="{status.robotsContent}" /&gt;
        </div>
        <p className="text-[11px] text-stone-600 leading-snug">
          {status.isRobotsIndexable
            ? "Page is fully indexable and followable by Googlebot search crawlers."
            : "Notice: Contains noindex directive (used for 404/utility pages)."}
        </p>
      </div>
    </div>
  );
};

export default CrawlHealthPanel;
