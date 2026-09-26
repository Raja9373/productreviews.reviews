/**
 * SEO & Metadata Management with Strict Validation & Dynamic Search Protection
 * 
 * Enforces strict SEO compliance:
 * 1. Automatically injects `noindex, follow` into the document head if the URL path contains
 *    '/search?', '#/search', or any dynamic search parameter.
 * 2. Normalizes canonical URLs exclusively to absolute, verified canonical URLs:
 *    ('https://productreviews.review/', 'https://productreviews.review/about', etc.).
 * 3. Strips dynamic script tags, browser-extension artifacts, HTML tags, and unapproved query parameters.
 * 4. Ensures only approved canonical pages are indexable by search engines.
 */

export const BASE_CANONICAL_URL = 'https://productreviews.review';

/**
 * Approved static canonical routes
 */
export const APPROVED_CANONICAL_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
] as const;

export type ApprovedCanonicalRoute = (typeof APPROVED_CANONICAL_ROUTES)[number];

/**
 * Supported localized canonical root paths
 */
export const APPROVED_LANGUAGE_CODES = [
  'en', 'hi', 'es', 'de', 'fr', 'ja', 'ar', 'pt', 'ru', 'ko',
  'zh-CN', 'zh-TW', 'it', 'nl', 'pl', 'tr', 'vi', 'th', 'id', 'ta', 'te', 'mr', 'bn',
] as const;

export interface MetaParams {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

export interface ValidatedMetaData {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  isCanonical: boolean;
  isSearchOrDynamic: boolean;
}

/**
 * Strips HTML, script injections, extension schemes, and control characters from text.
 */
export function cleanMetaText(input?: string, maxLength: number = 200): string {
  if (!input || typeof input !== 'string') return '';

  return input
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove all HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove URL-encoded scripts
    .replace(/%3Cscript/gi, '')
    // Remove browser extension signatures
    .replace(/(chrome|moz|safari)-extension:\/\/[^\s]+/gi, '')
    // Normalize spaces and line breaks
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Checks whether a given path is an approved static canonical route.
 */
export function isApprovedStaticRoute(path: string): boolean {
  const normalized = normalizePath(path);
  return (APPROVED_CANONICAL_ROUTES as readonly string[]).includes(normalized);
}

/**
 * Checks whether a path is an approved language root route (e.g., /hi/, /es/).
 */
export function isApprovedLanguageRoute(path: string): boolean {
  const clean = normalizePath(path).replace(/^\/|\/$/g, '');
  return (APPROVED_LANGUAGE_CODES as readonly string[]).includes(clean);
}

/**
 * Normalizes a URL path:
 * - Strips protocol, hostname, query parameters, and hashes
 * - Ensures leading slash and removes trailing slashes on non-root paths
 */
export function normalizePath(rawPath?: string): string {
  if (!rawPath || typeof rawPath !== 'string') return '/';

  let p = rawPath.trim();

  // Strip protocol and domain if full URL is passed
  if (p.startsWith('http://') || p.startsWith('https://')) {
    try {
      const parsed = new URL(p);
      p = parsed.pathname;
    } catch {
      p = '/';
    }
  }

  // Strip query strings and hash fragments
  const queryIdx = p.indexOf('?');
  if (queryIdx !== -1) p = p.substring(0, queryIdx);
  const hashIdx = p.indexOf('#');
  if (hashIdx !== -1) p = p.substring(0, hashIdx);

  // Strip browser extension artifacts
  if (p.includes('extension://') || p.includes('javascript:') || p.includes('data:')) {
    return '/';
  }

  // Ensure leading slash
  if (!p.startsWith('/')) p = `/${p}`;

  // Remove trailing slash for non-root paths
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }

  return p || '/';
}

/**
 * Checks if a given URL, path, or query string represents a dynamic search page or contains search parameters.
 * Automatically catches '/search?', '#/search', '?q=', '&q=', 'market=', etc.
 */
export function isDynamicOrSearchPath(rawPathOrUrl?: string): boolean {
  if (!rawPathOrUrl || typeof rawPathOrUrl !== 'string') return false;
  const raw = rawPathOrUrl.toLowerCase();

  return (
    raw.includes('/search?') ||
    raw.includes('/search') ||
    raw.includes('#/search') ||
    raw.includes('?q=') ||
    raw.includes('&q=') ||
    raw.includes('?query=') ||
    raw.includes('&query=') ||
    raw.includes('market=') ||
    raw.includes('utm_') ||
    raw.includes('fbclid') ||
    raw.includes('gclid') ||
    raw.includes('/api/') ||
    raw.includes('localhost') ||
    raw.includes('127.0.0.1')
  );
}

/**
 * Checks the live browser environment URL for any dynamic search parameter or '/search?' path.
 */
export function isCurrentLocationDynamicSearch(): boolean {
  if (typeof window === 'undefined') return false;

  const loc = window.location;
  const fullHref = loc.href || '';
  const pathname = loc.pathname || '';
  const search = loc.search || '';
  const hash = loc.hash || '';

  return (
    isDynamicOrSearchPath(fullHref) ||
    isDynamicOrSearchPath(pathname) ||
    isDynamicOrSearchPath(search) ||
    isDynamicOrSearchPath(hash)
  );
}

/**
 * Strictly sanitizes and validates the canonical URL.
 * 
 * Rules:
 * - Guarantees the output is an absolute URL on BASE_CANONICAL_URL.
 * - Strips all dynamic query strings, search parameters, and unapproved routes.
 * - If the input is dynamic (e.g., search results), it resolves back to the canonical root ('https://productreviews.review/')
 *   and flags isCanonical = false to ensure indexing is prevented.
 */
export function sanitizeCanonicalUrl(rawPathOrUrl?: string): {
  url: string;
  isCanonical: boolean;
  isSearchOrDynamic: boolean;
} {
  const defaultRootUrl = `${BASE_CANONICAL_URL}/`;

  if (!rawPathOrUrl) {
    const isLiveSearch = isCurrentLocationDynamicSearch();
    return { url: defaultRootUrl, isCanonical: !isLiveSearch, isSearchOrDynamic: isLiveSearch };
  }

  const raw = String(rawPathOrUrl).trim();
  const isDynamic = isDynamicOrSearchPath(raw) || isCurrentLocationDynamicSearch();

  if (isDynamic) {
    // Dynamic search result or query-bearing path: point canonical to root and mark non-canonical
    return { url: defaultRootUrl, isCanonical: false, isSearchOrDynamic: true };
  }

  const cleanPath = normalizePath(raw);

  // Match approved static canonical routes
  if (isApprovedStaticRoute(cleanPath)) {
    const fullUrl = cleanPath === '/' ? `${BASE_CANONICAL_URL}/` : `${BASE_CANONICAL_URL}${cleanPath}`;
    return { url: fullUrl, isCanonical: true, isSearchOrDynamic: false };
  }

  // Match approved language roots
  if (isApprovedLanguageRoute(cleanPath)) {
    return { url: `${BASE_CANONICAL_URL}${cleanPath}/`, isCanonical: true, isSearchOrDynamic: false };
  }

  // Unapproved or unrecognized path: fallback to root canonical and mark non-canonical
  return { url: defaultRootUrl, isCanonical: false, isSearchOrDynamic: false };
}

/**
 * Validation layer that produces clean, sanitized, and index-safe metadata.
 * Automatically injects 'noindex' if '/search?' or any dynamic search parameter is present.
 */
export function validateMetaParams(params: MetaParams = {}): ValidatedMetaData {
  const baseTitle = 'ProductReviews.review — Universal Search & Decision Engine';
  const defaultDesc =
    'Find the right products, services, brands, software, places and more — based on what actually matters to you. Unbiased evidence synthesis with zero merchant bias.';

  // 1. Sanitize text
  const cleanTitlePart = cleanMetaText(params.title, 80);
  const cleanDesc = cleanMetaText(params.description, 160) || defaultDesc;
  const fullTitle = cleanTitlePart ? `${cleanTitlePart} | ProductReviews.review` : baseTitle;

  // 2. Validate & sanitize canonical URL
  const { url: canonicalUrl, isCanonical, isSearchOrDynamic } = sanitizeCanonicalUrl(params.canonicalPath);

  // 3. Strict Robots / 'noindex' Enforcement:
  // Automatically injects 'noindex, follow' if:
  // - URL path contains '/search?' or any dynamic search parameter
  // - Current browser location contains dynamic search query
  // - Explicit noIndex flag is passed
  // - Page is not a verified static canonical route
  const isDynamic =
    isSearchOrDynamic ||
    (params.canonicalPath && isDynamicOrSearchPath(params.canonicalPath)) ||
    isCurrentLocationDynamicSearch();

  const shouldNoIndex = Boolean(params.noIndex || !isCanonical || isDynamic);
  const robots = shouldNoIndex ? 'noindex, follow' : 'index, follow';

  // 4. Clean OpenGraph & Twitter tags
  const ogType = params.ogType || 'website';
  const ogTitle = fullTitle;
  const ogDescription = cleanDesc;
  const ogUrl = canonicalUrl;

  return {
    title: fullTitle,
    description: cleanDesc,
    canonicalUrl,
    robots,
    ogType,
    ogTitle,
    ogDescription,
    ogUrl,
    isCanonical: isCanonical && !shouldNoIndex,
    isSearchOrDynamic: Boolean(isDynamic),
  };
}

/**
 * Helper to update or create a <meta> tag
 */
function setMetaTag(selector: string, attrName: string, attrVal: string, content: string): void {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrVal);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or create a <link> tag
 */
function setLinkTag(selector: string, rel: string, href: string): void {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Applies sanitized, validated metadata to the DOM document head.
 * Injects `<meta name="robots" content="noindex, follow">` when searching or on dynamic parameters.
 */
export function updateDocumentMeta(params: MetaParams = {}): ValidatedMetaData {
  const validated = validateMetaParams(params);

  if (typeof document === 'undefined') {
    return validated;
  }

  // 1. Title
  document.title = validated.title;

  // 2. Meta Description
  setMetaTag('meta[name="description"]', 'name', 'description', validated.description);

  // 3. Robots Meta Tag (Enforces noindex on /search? and dynamic parameters)
  setMetaTag('meta[name="robots"]', 'name', 'robots', validated.robots);

  // 4. OpenGraph Tags
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', validated.ogTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', validated.ogDescription);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', validated.ogUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', validated.ogType);
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'ProductReviews.review');

  // 5. Twitter Card Tags
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', validated.ogTitle);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', validated.ogDescription);

  // 6. Absolute Clean Canonical Link Tag
  setLinkTag('link[rel="canonical"]', 'canonical', validated.canonicalUrl);

  return validated;
}

export default {
  updateDocumentMeta,
  validateMetaParams,
  sanitizeCanonicalUrl,
  cleanMetaText,
  normalizePath,
  isApprovedStaticRoute,
  isApprovedLanguageRoute,
  isDynamicOrSearchPath,
  isCurrentLocationDynamicSearch,
  APPROVED_CANONICAL_ROUTES,
  BASE_CANONICAL_URL,
};
