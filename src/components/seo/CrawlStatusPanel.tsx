import React, { useState, useEffect } from "react";
import { Globe, HelpCircle, FileText } from "lucide-react";

export const CrawlStatusPanel: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <div className="space-y-3 pt-1">
      {/* Current Path Crawl Status Card */}
      <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-stone-900">Current Path Crawl Status</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
            200 OK (Indexed)
          </span>
        </div>
        <div className="text-[11px] font-mono bg-white p-2 rounded-lg border border-stone-200 text-stone-700 truncate">
          {currentPath}
        </div>
        <p className="text-[11px] text-stone-600 leading-snug">
          Simulated Googlebot crawler inspection: Server-side pre-rendered HTML, canonical link, and JSON-LD structured data successfully delivered on initial response.
        </p>
      </div>

      {/* Internal Notes Toggle */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
        <div
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
            <HelpCircle className="w-4 h-4 text-amber-600" /> Why "Crawled - currently not indexed"?
          </div>
          <span className="text-[11px] text-amber-700 underline group-hover:text-amber-900">
            {showNotes ? "Hide Notes" : "Read Notes"}
          </span>
        </div>

        {showNotes && (
          <div className="text-[11px] text-amber-800 space-y-2 pt-1 border-t border-amber-200 leading-relaxed">
            <p>
              Google Search Console reports <strong>"Crawled - currently not indexed"</strong> when Googlebot visits a URL, reads the HTML, but chooses not to include it in the active search index immediately.
            </p>
            <p>
              <strong>Common structural causes:</strong>
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Client-side rendering (CSR) delays where crawlers timeout before JS execution completes.</li>
              <li>Generic or duplicate meta descriptions and titles across pages.</li>
              <li>Missing or mismatched Schema.org product/review markup.</li>
            </ul>
            <p className="font-semibold text-amber-900">
              How our platform resolves this: All review routes use server-side pre-rendering (SSR) with fully populated meta tags, absolute canonical URLs, and valid JSON-LD schemas.
            </p>
          </div>
        )}
      </div>

      {/* Sitemap Reference */}
      <div className="p-2.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-stone-700 font-medium">
          <FileText className="w-3.5 h-3.5 text-stone-500" /> Sitemap XML Sync
        </div>
        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600 hover:underline font-semibold text-[11px]"
        >
          View Sitemap ↗
        </a>
      </div>
    </div>
  );
};

export default CrawlStatusPanel;
