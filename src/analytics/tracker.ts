/**
 * Clean, privacy-conscious event tracker.
 * Collects zero PII. Ready for future GA4 / Search Console / Server telemetry.
 */

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  // Development logger
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[Analytics Event]', event.name, event.params);
  }

  // Future Google Analytics (gtag) hook
  if (typeof (window as any).gtag === 'function') {
    try {
      (window as any).gtag('event', event.name, event.params);
    } catch {
      // ignore
    }
  }
}
