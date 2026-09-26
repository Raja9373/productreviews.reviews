import fs from 'node:fs';
import path from 'node:path';

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export interface SitemapGenerationResult {
  success: boolean;
  generatedAt: string;
  urlCount: number;
  urls: string[];
  writtenFiles: string[];
  xml: string;
  validation: {
    hasXmlDeclaration: boolean;
    rootElement: string;
    scriptElementsCount: number;
    searchUrlsCount: number;
    isValidProtocol: boolean;
  };
}

export const BASE_CANONICAL_URL = 'https://productreviews.review';

export const CANONICAL_LANGUAGES = [
  'en', 'hi', 'es', 'de', 'fr', 'ja', 'ar', 'pt', 'ru', 'ko',
  'zh-CN', 'zh-TW', 'it', 'nl', 'pl', 'tr', 'vi', 'th', 'id', 'ta', 'te', 'mr', 'bn',
] as const;

export const CANONICAL_STATIC_PAGES = [
  'about',
  'contact',
  'privacy',
  'terms',
  'disclaimer',
] as const;

/**
 * Escapes characters that are special in XML
 */
export function escapeXmlText(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

/**
 * Formats a Date or ISO string to standard YYYY-MM-DD format
 */
export function formatSitemapDate(date?: Date | string | number): string {
  try {
    const d = date ? new Date(date) : new Date();
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch {}
  return new Date().toISOString().split('T')[0];
}

/**
 * Strips script tags, HTML tags, or illegal search query paths
 */
export function sanitizeUrl(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();

  // Explicitly reject any query-string search URLs or search routes
  if (
    trimmed.includes('/search') ||
    trimmed.includes('?q=') ||
    trimmed.includes('&q=') ||
    trimmed.includes('?query=') ||
    trimmed.includes('/api/') ||
    trimmed.includes('localhost') ||
    trimmed.includes('127.0.0.1')
  ) {
    return null;
  }

  // Reject anything containing script tags or html tags
  if (/<script|<\/script|<[a-z/][\s\S]*>/i.test(trimmed)) {
    return null;
  }

  // Ensure absolute HTTPS URL on productreviews.review
  if (!trimmed.startsWith(BASE_CANONICAL_URL)) {
    return null;
  }

  return trimmed;
}

/**
 * Compiles the list of canonical routes
 */
export function getCanonicalSitemapEntries(dateFormatted?: string): SitemapUrlEntry[] {
  const lastmod = dateFormatted || formatSitemapDate();
  const entries: SitemapUrlEntry[] = [];

  // 1. Root canonical page
  entries.push({
    loc: `${BASE_CANONICAL_URL}/`,
    lastmod,
    changefreq: 'daily',
    priority: '1.0',
  });

  // 2. Multilingual canonical root routes (23 languages)
  for (const lang of CANONICAL_LANGUAGES) {
    entries.push({
      loc: `${BASE_CANONICAL_URL}/${lang}/`,
      lastmod,
      changefreq: 'daily',
      priority: '0.8',
    });
  }

  // 3. Static info and legal canonical pages
  for (const page of CANONICAL_STATIC_PAGES) {
    entries.push({
      loc: `${BASE_CANONICAL_URL}/${page}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  // Strictly filter and sanitize all entries
  return entries.filter((item) => {
    const sanitized = sanitizeUrl(item.loc);
    return sanitized !== null;
  });
}

/**
 * Generates the clean XML sitemap string conforming to the Sitemap 0.9 protocol.
 * Strictly guarantees ZERO <script> tags, ZERO HTML markup, and ZERO search URLs.
 */
export function generateCleanSitemapXml(dateFormatted?: string): string {
  const entries = getCanonicalSitemapEntries(dateFormatted);

  const urlElements = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXmlText(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

// In-memory cache for ultra-fast server response
let cachedXml: string | null = null;
let lastCacheUpdate: string | null = null;

export function getCachedSitemapXml(): string {
  if (!cachedXml) {
    cachedXml = generateCleanSitemapXml();
    lastCacheUpdate = new Date().toISOString();
  }
  return cachedXml;
}

export function invalidateSitemapCache(): void {
  cachedXml = null;
  lastCacheUpdate = null;
}

/**
 * Server-side utility function that generates a static sitemap.xml file dynamically
 * based on defined canonical routes, excluding all search-result pages and tracking scripts.
 * Overwrites public/sitemap.xml and dist/sitemap.xml (if dist exists) and refreshes in-memory cache.
 */
export async function generateAndWriteStaticSitemap(
  customTargetPaths?: string[]
): Promise<SitemapGenerationResult> {
  const generatedAt = new Date().toISOString();
  const dateFormatted = formatSitemapDate(generatedAt);
  const xml = generateCleanSitemapXml(dateFormatted);

  // Update in-memory cache
  cachedXml = xml;
  lastCacheUpdate = generatedAt;

  // Determine target paths
  const rootDir = process.cwd();
  const defaultPaths = [
    path.join(rootDir, 'public', 'sitemap.xml'),
  ];

  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    defaultPaths.push(path.join(distDir, 'sitemap.xml'));
  }

  const targets = customTargetPaths && customTargetPaths.length > 0 ? customTargetPaths : defaultPaths;
  const writtenFiles: string[] = [];

  for (const targetPath of targets) {
    try {
      const parentDir = path.dirname(targetPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(targetPath, xml, 'utf-8');
      writtenFiles.push(targetPath);
    } catch (err: any) {
      console.warn(`[sitemapGenerator] Failed to write sitemap to ${targetPath}:`, err?.message || err);
    }
  }

  // Protocol & Content Validation
  const scriptElementsCount = (xml.match(/<script/gi) || []).length;
  const searchUrlsCount = (xml.match(/\/search/gi) || []).length + (xml.match(/\?q=/gi) || []).length;
  const entries = getCanonicalSitemapEntries(dateFormatted);

  const result: SitemapGenerationResult = {
    success: true,
    generatedAt,
    urlCount: entries.length,
    urls: entries.map((e) => e.loc),
    writtenFiles,
    xml,
    validation: {
      hasXmlDeclaration: xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'),
      rootElement: '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      scriptElementsCount,
      searchUrlsCount,
      isValidProtocol:
        scriptElementsCount === 0 &&
        searchUrlsCount === 0 &&
        xml.includes('<urlset') &&
        xml.includes('</urlset>'),
    },
  };

  return result;
}
