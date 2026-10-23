import React, { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, Activity, AlertCircle, CheckCircle2 } from "lucide-react";

export const SitemapDebugTool: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [bodyPreview, setBodyPreview] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValidXml, setIsValidXml] = useState<boolean | null>(null);

  const checkSitemap = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);
    setHeaders({});
    setBodyPreview("");
    setIsValidXml(null);

    try {
      const response = await fetch("/sitemap.xml", { cache: "no-cache" });
      setStatus(response.status);
      
      const headerObj: Record<string, string> = {};
      response.headers.forEach((v, k) => {
        headerObj[k] = v;
      });
      setHeaders(headerObj);

      const text = await response.text();
      setBodyPreview(text.substring(0, 1000));
      
      // Basic XML validation
      const isXml = text.trim().startsWith("<?xml") && text.includes("<urlset");
      setIsValidXml(isXml);
    } catch (err: any) {
      setError(err.message || "Network request failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSitemap();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-lg space-y-4 font-sans max-w-2xl mx-auto my-8">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-indigo-600" />
          <div>
            <h3 className="text-sm font-bold text-stone-900 tracking-tight">Sitemap Diagnostic Tool</h3>
            <p className="text-[11px] text-stone-500 uppercase font-semibold tracking-wider">Live Production Verification</p>
          </div>
        </div>
        <button
          onClick={checkSitemap}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-all disabled:opacity-50 cursor-pointer shadow-md active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Inspecting..." : "Re-Scan Sitemap"}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-700">
            <p className="font-bold">Connection Error</p>
            <p className="mt-0.5 opacity-90">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Card */}
        <div className={`p-4 rounded-xl border transition-colors ${status === 200 ? "bg-emerald-50 border-emerald-100" : "bg-stone-50 border-stone-100"}`}>
          <p className="text-[10px] text-stone-500 font-bold uppercase mb-1">HTTP Response</p>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-black ${status === 200 ? "text-emerald-700" : "text-rose-600"}`}>
              {status || "---"}
            </span>
            {status === 200 ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (status ? <AlertCircle className="w-6 h-6 text-rose-500" /> : null)}
          </div>
          <p className="text-[11px] text-stone-600 mt-2 font-medium">
            {status === 200 ? "Valid OK response received." : (status ? `Server returned ${status} error.` : "Awaiting response...")}
          </p>
        </div>

        {/* Format Card */}
        <div className={`p-4 rounded-xl border transition-colors ${isValidXml ? "bg-blue-50 border-blue-100" : "bg-stone-50 border-stone-100"}`}>
          <p className="text-[10px] text-stone-500 font-bold uppercase mb-1">Content Format</p>
          <div className="flex items-center justify-between">
            <span className={`text-xl font-black ${isValidXml ? "text-blue-700" : "text-stone-700"}`}>
              {isValidXml ? "VALID XML" : (status ? "INVALID / HTML" : "---")}
            </span>
            {isValidXml ? (
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            ) : (status ? <AlertCircle className="w-6 h-6 text-amber-500" /> : null)}
          </div>
          <p className="text-[11px] text-stone-600 mt-2 font-medium">
            {isValidXml ? "Sitemap structure is correct." : (status ? "Response body is not a valid sitemap." : "Awaiting response...")}
          </p>
        </div>
      </div>

      {/* Headers Panel */}
      <div className="space-y-2">
        <p className="text-[10px] text-stone-500 font-bold uppercase">Response Headers</p>
        <div className="bg-stone-900 rounded-xl p-4 overflow-hidden shadow-inner">
          <div className="text-[11px] font-mono text-emerald-400 space-y-1">
            {Object.keys(headers).length > 0 ? Object.entries(headers).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-stone-500 shrink-0">{k}:</span>
                <span className="truncate">{v}</span>
              </div>
            )) : <p className="text-stone-600 italic">No headers captured yet...</p>}
          </div>
        </div>
      </div>

      {/* Body Preview */}
      <div className="space-y-2">
        <p className="text-[10px] text-stone-500 font-bold uppercase">Response Body Preview</p>
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 shadow-inner">
          <pre className="text-[10px] font-mono text-stone-700 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[300px]">
            {bodyPreview || "Waiting for data..."}
            {bodyPreview.length >= 1000 && <span className="text-indigo-600 block mt-2 font-bold">[truncated...]</span>}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SitemapDebugTool;
