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

import { HIGH_PRIORITY_COMPARISONS } from './comparisonData';
import { contentRepository } from '../content/store/contentRepository';
import { PILOT_PAGES } from '../ssr/pilotData';

/**
 * Compiles the list of canonical routes including core pages, verified SSR pilot pages,
 * and high-priority product comparisons.
 */
export function getCanonicalSitemapEntries(dateFormatted?: string): SitemapUrlEntry[] {
  const lastmod = dateFormatted || formatSitemapDate();
  const entries: SitemapUrlEntry[] = [];
  const seenLocs = new Set<string>();

  const addEntry = (entry: SitemapUrlEntry) => {
    const sanitized = sanitizeUrl(entry.loc);
    if (!sanitized || seenLocs.has(sanitized)) return;
    seenLocs.add(sanitized);
    entries.push({ ...entry, loc: sanitized });
  };

  // 1. Root canonical page
  addEntry({
    loc: `${BASE_CANONICAL_URL}/`,
    lastmod,
    changefreq: 'daily',
    priority: '1.0',
  });

  // 2. Core static and legal canonical pages
  for (const page of CANONICAL_STATIC_PAGES) {
    addEntry({
      loc: `${BASE_CANONICAL_URL}/${page}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  // 3. Verified SSR/SSG Pilot Pages (10 high-priority product review & comparison pages)
  for (const pilot of Object.values(PILOT_PAGES)) {
    if (pilot.canonicalUrl) {
      addEntry({
        loc: pilot.canonicalUrl,
        lastmod,
        changefreq: 'weekly',
        priority: '0.95',
      });
    }
  }

  // 4. High-priority successful product comparison pages
  for (const comp of HIGH_PRIORITY_COMPARISONS) {
    if (comp.isSuccessful && comp.slug) {
      addEntry({
        loc: `${BASE_CANONICAL_URL}/compare/${comp.slug}`,
        lastmod: comp.lastmod ? formatSitemapDate(comp.lastmod) : lastmod,
        changefreq: comp.changefreq || 'weekly',
        priority: comp.priority || '0.85',
      });
    }
  }

  // 5. Controlled Published & Indexable Content Records (excluding numbered fixture clones -\d+$)
  const publishedRecords = contentRepository.getPublishedIndexableRecords();
  for (const record of publishedRecords) {
    if (record.slug && record.canonicalUrl && !/-\d+$/.test(record.slug)) {
      addEntry({
        loc: record.canonicalUrl,
        lastmod: record.publishedAt ? formatSitemapDate(record.publishedAt) : lastmod,
        changefreq: 'weekly',
        priority: '0.9',
      });
    }
  }

  return entries;
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

/**
 * Generates clean Sitemap Index XML referencing both sitemap.xml and sitemap-main.xml
 */
export function generateCleanSitemapIndexXml(dateFormatted?: string): string {
  const lastmod = dateFormatted || formatSitemapDate();
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_CANONICAL_URL}/sitemap-main.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
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
 * Server-side utility function that generates static sitemap.xml, sitemap-main.xml,
 * and sitemap_index.xml files dynamically based on defined canonical routes.
 * Overwrites public/ and dist/ (if dist exists) and refreshes in-memory cache.
 */
export async function generateAndWriteStaticSitemap(
  customTargetPaths?: string[]
): Promise<SitemapGenerationResult> {
  const generatedAt = new Date().toISOString();
  const dateFormatted = formatSitemapDate(generatedAt);
  const xml = generateCleanSitemapXml(dateFormatted);
  const indexXml = generateCleanSitemapIndexXml(dateFormatted);

  // Update in-memory cache
  cachedXml = xml;
  lastCacheUpdate = generatedAt;

  // Determine target paths
  const rootDir = process.cwd();
  const defaultPaths = [
    path.join(rootDir, 'public', 'sitemap.xml'),
    path.join(rootDir, 'public', 'sitemap-main.xml'),
  ];
  const indexPaths = [
    path.join(rootDir, 'public', 'sitemap_index.xml'),
  ];

  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    defaultPaths.push(path.join(distDir, 'sitemap.xml'));
    defaultPaths.push(path.join(distDir, 'sitemap-main.xml'));
    indexPaths.push(path.join(distDir, 'sitemap_index.xml'));
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

  if (!customTargetPaths || customTargetPaths.length === 0) {
    for (const indexPath of indexPaths) {
      try {
        const parentDir = path.dirname(indexPath);
        if (!fs.existsSync(parentDir)) {
          fs.mkdirSync(parentDir, { recursive: true });
        }
        fs.writeFileSync(indexPath, indexXml, 'utf-8');
        writtenFiles.push(indexPath);
      } catch (err: any) {
        console.warn(`[sitemapGenerator] Failed to write sitemap index to ${indexPath}:`, err?.message || err);
      }
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
