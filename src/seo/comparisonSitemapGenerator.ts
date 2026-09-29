import fs from 'node:fs';
import path from 'node:path';
import {
  BASE_CANONICAL_URL,
  CANONICAL_STATIC_PAGES,
  SitemapUrlEntry,
  SitemapGenerationResult,
  formatSitemapDate,
  escapeXmlText,
  sanitizeUrl,
} from './sitemapGenerator';
import {
  HIGH_PRIORITY_COMPARISONS,
  ComparisonProductEntry,
} from './comparisonData';

// Dynamic runtime memory registry of extra successful product comparisons
const dynamicComparisonRegistry: ComparisonProductEntry[] = [];

/**
 * Normalizes two product names into a clean canonical comparison URL slug
 * e.g., ("iPhone 16 Pro", "Samsung S24 Ultra") -> "iphone-16-pro-vs-samsung-s24-ultra"
 */
export function createComparisonSlug(productA: string, productB: string): string {
  const clean = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const slugA = clean(productA);
  const slugB = clean(productB);

  return `${slugA}-vs-${slugB}`;
}

/**
 * Registers a new successful product comparison page dynamically at runtime,
 * ensuring it gets injected into the sitemap.xml file with proper priority.
 */
export function registerSuccessfulComparison(
  productA: string,
  productB: string,
  category: ComparisonProductEntry['category'] = 'Smartphones',
  verdictSummary?: string
): ComparisonProductEntry | null {
  if (!productA || !productB) return null;

  const slug = createComparisonSlug(productA, productB);

  // Check if already present in static or dynamic list
  const existsInStatic = HIGH_PRIORITY_COMPARISONS.some((c) => c.slug === slug);
  const existsInDynamic = dynamicComparisonRegistry.some((c) => c.slug === slug);

  if (existsInStatic || existsInDynamic) {
    return (
      HIGH_PRIORITY_COMPARISONS.find((c) => c.slug === slug) ||
      dynamicComparisonRegistry.find((c) => c.slug === slug) ||
      null
    );
  }

  const newEntry: ComparisonProductEntry = {
    slug,
    productA: productA.trim(),
    productB: productB.trim(),
    category,
    priority: '0.85',
    changefreq: 'weekly',
    lastmod: formatSitemapDate(),
    isSuccessful: true,
    verdictSummary,
  };

  dynamicComparisonRegistry.push(newEntry);
  return newEntry;
}

/**
 * Returns all active comparison entries (static high-priority + dynamically registered)
 */
export function getActiveComparisonEntries(): ComparisonProductEntry[] {
  return [...HIGH_PRIORITY_COMPARISONS, ...dynamicComparisonRegistry];
}

/**
 * Formats all active high-priority product comparison pages into clean SitemapUrlEntries.
 */
export function getComparisonSitemapEntries(
  dateFormatted?: string
): SitemapUrlEntry[] {
  const defaultLastmod = dateFormatted || formatSitemapDate();
  const comparisons = getActiveComparisonEntries();

  return comparisons
    .filter((comp) => comp.isSuccessful && comp.slug)
    .map((comp) => {
      const loc = `${BASE_CANONICAL_URL}/compare/${comp.slug}`;
      return {
        loc,
        lastmod: comp.lastmod ? formatSitemapDate(comp.lastmod) : defaultLastmod,
        changefreq: comp.changefreq || 'weekly',
        priority: comp.priority || '0.85',
      };
    })
    .filter((item) => sanitizeUrl(item.loc) !== null);
}

/**
 * Combines root canonical routes, core static pages, and all high-priority comparison pages into a unified list.
 */
export function getAllSitemapEntries(dateFormatted?: string): SitemapUrlEntry[] {
  const lastmod = dateFormatted || formatSitemapDate();
  const entries: SitemapUrlEntry[] = [];

  // 1. Root canonical domain
  entries.push({
    loc: `${BASE_CANONICAL_URL}/`,
    lastmod,
    changefreq: 'daily',
    priority: '1.0',
  });

  // 2. Core static canonical legal & informative pages
  for (const page of CANONICAL_STATIC_PAGES) {
    entries.push({
      loc: `${BASE_CANONICAL_URL}/${page}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  // 3. High-priority successful product comparison pages
  const comparisonEntries = getComparisonSitemapEntries(lastmod);
  entries.push(...comparisonEntries);

  // Filter out any invalid, script-containing, or search query URLs
  return entries.filter((item) => sanitizeUrl(item.loc) !== null);
}

/**
 * Constructs a clean XML string wrapped in the <urlset> tag including core pages AND comparison pages.
 * Strictly guarantees ZERO <script> tags, ZERO HTML markup, and ZERO search query parameters.
 */
export function generateComparisonSitemapXml(dateFormatted?: string): string {
  const entries = getAllSitemapEntries(dateFormatted);

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

  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

  // Final sanity assertion
  if (
    /<script/i.test(xmlString) ||
    /<\/script>/i.test(xmlString) ||
    /\/search/i.test(xmlString) ||
    /\?q=/i.test(xmlString)
  ) {
    throw new Error('Sitemap validation error: disallowed elements or dynamic query parameters detected.');
  }

  return xmlString;
}

/**
 * Generates and saves the enhanced comparison sitemap.xml to /public/sitemap.xml (and /dist/sitemap.xml).
 */
export async function generateAndSaveComparisonSitemap(
  customTargetPaths?: string[]
): Promise<SitemapGenerationResult> {
  const generatedAt = new Date().toISOString();
  const dateFormatted = formatSitemapDate(generatedAt);
  const xml = generateComparisonSitemapXml(dateFormatted);

  const rootDir = process.cwd();
  const defaultPaths = [path.join(rootDir, 'public', 'sitemap.xml')];

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
      console.warn(`[comparisonSitemapGenerator] Failed to write sitemap to ${targetPath}:`, err?.message || err);
    }
  }

  const entries = getAllSitemapEntries(dateFormatted);
  const scriptElementsCount = (xml.match(/<script/gi) || []).length;
  const searchUrlsCount = (xml.match(/\/search/gi) || []).length + (xml.match(/\?q=/gi) || []).length;

  return {
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
}

export default {
  createComparisonSlug,
  registerSuccessfulComparison,
  getActiveComparisonEntries,
  getComparisonSitemapEntries,
  getAllSitemapEntries,
  generateComparisonSitemapXml,
  generateAndSaveComparisonSitemap,
};
