import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';

export const BASE_CANONICAL_URL = 'https://productreviews.review';

// Core canonical routes as specified
export const CANONICAL_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
] as const;

/**
 * Formats a Date or timestamp to standard sitemap YYYY-MM-DD format
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
 * Constructs a clean XML sitemap string including only the canonical routes.
 * Ensures zero script tags, zero search tags, and strict XML formatting.
 */
export function generateCanonicalSitemapXml(dateFormatted?: string): string {
  const lastmod = dateFormatted || formatSitemapDate();

  const urlEntries = CANONICAL_ROUTES.map((route) => {
    const loc = route === '/' ? `${BASE_CANONICAL_URL}/` : `${BASE_CANONICAL_URL}${route}`;
    const priority = route === '/' ? '1.0' : '0.8';
    const changefreq = route === '/' ? 'daily' : 'monthly';

    return `  <url>
    <loc>${escapeXmlText(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const rawXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

  // Sanitization check: ensure absolutely NO script tags or search query patterns
  if (
    /<script/i.test(rawXml) ||
    /<\/script>/i.test(rawXml) ||
    /\/search\?/i.test(rawXml) ||
    /\?q=/i.test(rawXml)
  ) {
    throw new Error('Sitemap validation error: Disallowed tags or search patterns detected.');
  }

  return rawXml;
}

/**
 * Saves the generated XML string to /public/sitemap.xml (and /dist/sitemap.xml if dist exists)
 */
export function writeSitemapToDisk(xml: string): string[] {
  const rootDir = process.cwd();
  const targetPaths = [
    path.join(rootDir, 'public', 'sitemap.xml'),
  ];

  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    targetPaths.push(path.join(distDir, 'sitemap.xml'));
  }

  const writtenFiles: string[] = [];

  for (const targetPath of targetPaths) {
    const parentDir = path.dirname(targetPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(targetPath, xml, 'utf-8');
    writtenFiles.push(targetPath);
  }

  return writtenFiles;
}

/**
 * Express handler for /api/generate-sitemap (GET and POST supported)
 */
export async function generateSitemapHandler(req: Request, res: Response) {
  try {
    const currentDate = formatSitemapDate();
    const xml = generateCanonicalSitemapXml(currentDate);
    const writtenFiles = writeSitemapToDisk(xml);

    // If client requested XML format directly
    if (req.headers.accept?.includes('application/xml') || req.query.format === 'xml') {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'");
      return res.status(200).send(xml);
    }

    return res.status(200).json({
      success: true,
      message: 'Clean canonical sitemap.xml generated and saved to /public/sitemap.xml successfully.',
      data: {
        canonicalRoutes: CANONICAL_ROUTES,
        urlCount: CANONICAL_ROUTES.length,
        writtenFiles,
        lastmod: currentDate,
        xmlLength: xml.length,
        validation: {
          hasXmlDeclaration: xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'),
          hasUrlset: xml.includes('<urlset') && xml.includes('</urlset>'),
          scriptTagsPresent: false,
          searchTagsPresent: false,
        },
      },
    });
  } catch (err: any) {
    console.error('[generate-sitemap] Error generating sitemap:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate canonical sitemap.',
      message: err?.message || String(err),
    });
  }
}

export default generateSitemapHandler;
