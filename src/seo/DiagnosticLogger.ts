export interface DiagnosticLogEvent {
  id: string;
  type: "MISSING_META" | "CANONICAL_WARNING" | "SCHEMA_ERROR" | "CRAWL_WARNING" | "INFO";
  message: string;
  path: string;
  timestamp: string;
}

const STORAGE_KEY = "productreviews_seo_diagnostic_logs_v1";

export class DiagnosticLogger {
  static getLogs(): DiagnosticLogEvent[] {
    if (typeof localStorage === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static logEvent(type: DiagnosticLogEvent["type"], message: string, path: string = typeof window !== "undefined" ? window.location.pathname : "/"): void {
    if (typeof localStorage === "undefined") return;
    try {
      const logs = DiagnosticLogger.getLogs();
      const newEvent: DiagnosticLogEvent = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        message,
        path,
        timestamp: new Date().toLocaleTimeString()
      };
      // Keep last 100 logs
      const updated = [newEvent, ...logs].slice(0, 100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  static clearLogs(): void {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  static runAutomaticAudit(): void {
    if (typeof document === "undefined") return;
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
    const description = document.querySelector('meta[name="description"]')?.getAttribute("content");

    if (!canonical) {
      DiagnosticLogger.logEvent("MISSING_META", "Missing canonical link tag in document head.");
    } else if (!canonical.startsWith("https://productreviews.review")) {
      DiagnosticLogger.logEvent("CANONICAL_WARNING", `Canonical URL is not absolute: ${canonical}`);
    }

    if (!description || description.length < 30) {
      DiagnosticLogger.logEvent("MISSING_META", "Meta description is missing or excessively short.");
    }
  }
}
