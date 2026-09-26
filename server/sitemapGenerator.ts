import fs from 'node:fs';
import path from 'node:path';

/**
 * Base canonical domain for productreviews.review
 */
export const BASE_CANONICAL_URL = 'https://productreviews.review';

/**
 * Canonical URL strings list
 */
export const CANONICAL_ROUTES: string[] = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
];

/**
 * Formats date into standard Sitemap YYYY-MM-DD format
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
 * Escapes characters for XML safety
 */
export function escapeXml(str: string): string {
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
 * Constructs a clean XML sitemap string wrapped in the <urlset> tag.
 * Strictly guarantees that no scripts or search-result query parameters are included.
 */
export function generateCanonicalSitemapXml(
  routes: string[] = CANONICAL_ROUTES,
  baseUrl: string = BASE_CANONICAL_URL,
  lastmodDate?: string
): string {
  const lastmod = lastmodDate || formatSitemapDate();

  // Filter and sanitize routes: exclude any route with search queries or script injections
  const sanitizedRoutes = routes.filter((route) => {
    if (typeof route !== 'string') return false;
    const trimmed = route.trim();
    // Exclude search-result query parameters and search paths
    if (
      trimmed.includes('?') ||
      trimmed.includes('&') ||
      trimmed.includes('/search') ||
      trimmed.includes('q=')
    ) {
      return false;
    }
    // Exclude browser extension artifacts, scripts, and injection strings
    if (
      trimmed.includes('chrome-extension://') ||
      trimmed.includes('moz-extension://') ||
      trimmed.includes('safari-extension://') ||
      trimmed.includes('javascript:') ||
      trimmed.includes('data:') ||
      trimmed.includes('eval(') ||
      /<script|<\/script|<[^>]+>/i.test(trimmed)
    ) {
      return false;
    }
    return true;
  });

  const urlEntries = sanitizedRoutes.map((route) => {
    const cleanRoute = route.startsWith('/') ? route : `/${route}`;
    const loc = cleanRoute === '/' ? `${baseUrl}/` : `${baseUrl}${cleanRoute}`;
    const priority = cleanRoute === '/' ? '1.0' : '0.8';
    const changefreq = cleanRoute === '/' ? 'daily' : 'monthly';

    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

  // Final sanity assertion: strictly zero script tags and zero search queries
  if (
    /<script/i.test(xmlString) ||
    /<\/script>/i.test(xmlString) ||
    /\/search/i.test(xmlString) ||
    /\?q=/i.test(xmlString)
  ) {
    throw new Error('Sitemap validation error: disallowed script or search query tags detected.');
  }

  return xmlString;
}

/**
 * Helper function to save the generated sitemap XML string to /public/sitemap.xml
 * (and /dist/sitemap.xml if the dist directory exists).
 */
export function saveSitemapToFile(
  xmlContent?: string,
  targetFilePath?: string
): string {
  const rootDir = process.cwd();
  const xml = xmlContent || generateCanonicalSitemapXml();
  const destinationPath = targetFilePath || path.join(rootDir, 'public', 'sitemap.xml');

  const dir = path.dirname(destinationPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(destinationPath, xml, 'utf-8');

  // Also sync to dist/sitemap.xml if dist folder exists in production builds
  const distPath = path.join(rootDir, 'dist', 'sitemap.xml');
  if (!targetFilePath && fs.existsSync(path.join(rootDir, 'dist'))) {
    try {
      fs.writeFileSync(distPath, xml, 'utf-8');
    } catch {}
  }

  return destinationPath;
}

export default {
  BASE_CANONICAL_URL,
  CANONICAL_ROUTES,
  generateCanonicalSitemapXml,
  saveSitemapToFile,
  formatSitemapDate,
  escapeXml,
};
