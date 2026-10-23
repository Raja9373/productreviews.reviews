import React, { useState } from "react";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

export const SitemapDebugTool: React.FC = () => {
  const [status, setStatus] = useState<{
    loading: boolean;
    httpStatus?: number;
    contentType?: string;
    bodyPreview?: string;
    error?: string;
  }>({ loading: false });

  const runDiagnostic = async () => {
    setStatus({ loading: true });
    try {
      const response = await fetch("/sitemap.xml", { method: "GET" });
      const contentType = response.headers.get("content-type") || "";
      const body = await response.text();
      
      setStatus({
        loading: false,
        httpStatus: response.status,
        contentType,
        bodyPreview: body.substring(0, 200),
      });
    } catch (err: any) {
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-stone-900">Sitemap Diagnostic Tool</h3>
        <button
          onClick={runDiagnostic}
          disabled={status.loading}
          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${status.loading ? "animate-spin" : ""}`} />
          Check Sitemap
        </button>
      </div>

      {status.error && (
        <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" /> {status.error}
        </div>
      )}

      {status.httpStatus && (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-stone-600">Status:</span>
            <span className={`font-mono font-bold ${status.httpStatus === 200 ? "text-emerald-600" : "text-rose-600"}`}>
              {status.httpStatus}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-stone-600">Content-Type:</span>
            <span className="font-mono text-stone-900">{status.contentType}</span>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-stone-600">Body Preview:</span>
            <div className="font-mono text-[10px] bg-stone-100 p-2 rounded-lg text-stone-700 overflow-x-auto">
              {status.bodyPreview}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
