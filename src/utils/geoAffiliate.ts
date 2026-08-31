// Jai Guruji - Global Geo-Affiliate System for productreviews.review
// Auto converts all Amazon links on the site to smart geo-links earning from both India and USA.

export const AFFILIATE_TAG_INDIA = 'jaiguruji00-21';
export const AFFILIATE_TAG_USA = 'jaiguruji00-20'; // Covers USA, Canada, UK, Germany, etc. via Amazon Global Earning

/**
 * 1. Detect if visitor is from India using Intl.DateTimeFormat().resolvedOptions().timeZone
 * checks "Asia/Kolkata" or "Asia/Calcutta"
 */
export function isIndianVisitor(): boolean {
  try {
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta' || tz.includes('Kolkata') || tz.includes('Calcutta')) {
        return true;
      }
    }
  } catch (e) {
    // fallback
  }

  // Also check browser navigator language as supplementary hint
  try {
    if (typeof navigator !== 'undefined') {
      const lang = (navigator.language || '').toLowerCase();
      if (lang === 'hi' || lang.startsWith('hi-') || lang.endsWith('-in')) {
        return true;
      }
    }
  } catch (e) {}

  return false;
}

/**
 * 2 & 3. Returns the correct Amazon affiliate link based on visitor geography:
 * India -> https://www.amazon.in/dp/{ASIN}?tag=jaiguruji00-21
 * Worldwide (USA, UK, Canada etc) -> https://www.amazon.com/dp/{ASIN}?tag=jaiguruji00-20
 */
export function getAffiliateLink(asin: string): string {
  const cleanAsin = (asin || '').trim();
  if (isIndianVisitor()) {
    return `https://www.amazon.in/dp/${cleanAsin}?tag=${AFFILIATE_TAG_INDIA}`;
  } else {
    return `https://www.amazon.com/dp/${cleanAsin}?tag=${AFFILIATE_TAG_USA}`;
  }
}

/**
 * Extract 10-character Amazon ASIN from any standard Amazon URL or string
 */
export function extractAsinFromUrl(url: string): string | null {
  if (!url) return null;
  // Match /dp/ASIN, /gp/product/ASIN, /d/ASIN, or ?asin=ASIN (10 alphanumeric chars)
  const dpMatch = url.match(/(?:\/dp\/|\/gp\/product\/|\/d\/|\/product\/)([A-Z0-9]{10})(?:[/?&#]|$)/i);
  if (dpMatch && dpMatch[1]) {
    return dpMatch[1].toUpperCase();
  }

  const queryMatch = url.match(/[?&]asin=([A-Z0-9]{10})(?:[&]|$)/i);
  if (queryMatch && queryMatch[1]) {
    return queryMatch[1].toUpperCase();
  }

  return null;
}

/**
 * 4 & 5. Find all existing <a> tags that contain amazon.com or amazon.in,
 * extract the 10-character ASIN from the URL (/dp/ASIN), rewrite the href with correct geo tag,
 * and ensure target="_blank" rel="noopener noreferrer".
 */
export function rewriteAmazonLinksOnPage(): number {
  if (typeof document === 'undefined') return 0;

  const isIndia = isIndianVisitor();
  const targetDomain = isIndia ? 'www.amazon.in' : 'www.amazon.com';
  const targetTag = isIndia ? AFFILIATE_TAG_INDIA : AFFILIATE_TAG_USA;

  let rewrittenCount = 0;
  const links = document.querySelectorAll<HTMLAnchorElement>('a[href*="amazon."]');

  links.forEach((anchor) => {
    try {
      const currentHref = anchor.getAttribute('href') || '';
      if (!currentHref) return;

      const asin = extractAsinFromUrl(currentHref);

      if (asin) {
        // Direct /dp/{ASIN} format
        const newHref = `https://${targetDomain}/dp/${asin}?tag=${targetTag}`;
        if (anchor.href !== newHref) {
          anchor.href = newHref;
          rewrittenCount++;
        }
      } else if (currentHref.includes('/s?') || currentHref.includes('/s/')) {
        // Search query URL: preserve query parameters while replacing domain & tag
        try {
          const parsed = new URL(currentHref, window.location.origin);
          parsed.hostname = targetDomain;
          parsed.searchParams.set('tag', targetTag);
          if (anchor.href !== parsed.toString()) {
            anchor.href = parsed.toString();
            rewrittenCount++;
          }
        } catch (e) {
          // fallback string replace
        }
      }

      // Ensure open in new tab and compliant affiliate rel attributes
      if (anchor.getAttribute('target') !== '_blank') {
        anchor.setAttribute('target', '_blank');
      }
      anchor.setAttribute('rel', 'nofollow sponsored noopener noreferrer');
    } catch (err) {
      // ignore parsing error on malformed link
    }
  });

  return rewrittenCount;
}

declare global {
  interface Window {
    __jaiGurujiGeoLogged?: boolean;
    __jaiGurujiGeoInitialized?: boolean;
  }
}

export function initJaiGurujiGeoAffiliate(): void {
  if (typeof window === 'undefined') return;

  // 6. Console log "Jai Guruji Geo Active" - SINGLE TIME ONLY
  if (!window.__jaiGurujiGeoLogged) {
    window.__jaiGurujiGeoLogged = true;
    console.log('Jai Guruji Geo Active');
  }

  // Initial rewrite
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      rewriteAmazonLinksOnPage();
    });
  } else {
    rewriteAmazonLinksOnPage();
  }

  // Keep active across React view transitions and DOM changes via MutationObserver
  if (!window.__jaiGurujiGeoInitialized && typeof MutationObserver !== 'undefined') {
    window.__jaiGurujiGeoInitialized = true;
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver(() => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        rewriteAmazonLinksOnPage();
        throttleTimer = null;
      }, 150);
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href'],
      });
    }
  }
}
