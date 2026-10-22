import React, { useState, useEffect } from "react";
import { DiagnosticLogger, DiagnosticLogEvent } from "../../seo/DiagnosticLogger";
import { Trash2, RefreshCw, Activity, ShieldAlert, AlertTriangle } from "lucide-react";

export const DiagnosticLogsPanel: React.FC = () => {
  const [logs, setLogs] = useState<DiagnosticLogEvent[]>([]);

  const refreshLogs = () => {
    DiagnosticLogger.runAutomaticAudit();
    setLogs(DiagnosticLogger.getLogs());
  };

  useEffect(() => {
    refreshLogs();
    const t = setInterval(refreshLogs, 3000);
    return () => clearInterval(t);
  }, []);

  const handleClear = () => {
    DiagnosticLogger.clearLogs();
    setLogs([]);
  };

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
        <div>
          <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-600" /> Local Diagnostic Store
          </h4>
          <p className="text-[11px] text-stone-600 mt-0.5">
            Recording page load events & missing meta warnings locally.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={refreshLogs}
            className="p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-2 max-h-[260px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <ShieldAlert className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
            No diagnostic warnings or errors recorded. Page is fully healthy!
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 flex items-center gap-1 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> {log.type}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">{log.timestamp}</span>
              </div>
              <p className="text-[11px] text-stone-700 leading-snug">{log.message}</p>
              <div className="text-[10px] font-mono bg-stone-50 px-2 py-0.5 rounded text-stone-500 truncate">
                Path: {log.path}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiagnosticLogsPanel;
