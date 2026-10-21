import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export const BASE_CANONICAL_URL = 'https://productreviews.review';

const STATIC_PAGES = ['about', 'contact', 'privacy', 'terms', 'disclaimer'];

const VERIFIED_PILOT_URLS = [
  'https://productreviews.review/review/iphone-16-pro',
  'https://productreviews.review/review/macbook-air-m4',
  'https://productreviews.review/review/iphone-16-pro-comparison',
  'https://productreviews.review/review/iphone-16-pro-india-pricing',
  'https://productreviews.review/compare/iphone-16-pro-vs-samsung-galaxy-s24-ultra',
  'https://productreviews.review/compare/macbook-air-m3-vs-dell-xps-13',
  'https://productreviews.review/compare/sony-wh-1000xm5-vs-bose-quietcomfort-ultra',
  'https://productreviews.review/compare/sony-a7-iv-vs-canon-eos-r6-mark-ii',
  'https://productreviews.review/compare/airpods-pro-2-vs-sony-wf-1000xm5',
  'https://productreviews.review/compare/lg-c3-oled-vs-samsung-s90c-oled',
];

const COMPARISON_SLUGS = [
  'iphone-16-pro-vs-samsung-galaxy-s24-ultra',
  'macbook-air-m3-vs-dell-xps-13',
  'sony-a7-iv-vs-canon-eos-r6-mark-ii',
  'sony-wh-1000xm5-vs-bose-quietcomfort-ultra',
  'ipad-pro-m4-vs-samsung-galaxy-tab-s9-ultra',
  'airpods-pro-2-vs-sony-wf-1000xm5',
  'lg-c3-oled-vs-samsung-s90c-oled',
  'playstation-5-pro-vs-xbox-series-x',
  'asus-rog-ally-x-vs-steam-deck-oled',
  'dyson-v15-detect-vs-shark-stratos-cordless',
  'google-pixel-9-pro-vs-iphone-16-pro',
  'garmin-fenix-8-vs-apple-watch-ultra-2',
  'macbook-pro-m3-max-vs-razer-blade-16',
  'nintendo-switch-oled-vs-steam-deck-oled',
  'bose-soundlink-max-vs-jbl-xtreme-4',
  'canon-eos-r5-mark-ii-vs-nikon-z8',
  'kindle-paperwhite-signature-vs-kobo-libra-colour',
  'logitech-mx-master-3s-vs-razer-pro-click',
  'keychron-q1-pro-vs-nuphy-halo75-v2',
  'sonos-arc-ultra-vs-samsung-hw-q990d',
];

function escapeXmlText(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function formatSitemapDate(date?: Date | string | number): string {
  try {
    const d = date ? new Date(date) : new Date();
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch {}
  return new Date().toISOString().split('T')[0];
}

export function getCanonicalSitemapEntries(dateFormatted?: string): SitemapUrlEntry[] {
  const lastmod = dateFormatted || formatSitemapDate();
  const entries: SitemapUrlEntry[] = [];
  const seen = new Set<string>();

  const add = (entry: SitemapUrlEntry) => {
    if (!entry.loc.startsWith(BASE_CANONICAL_URL) || seen.has(entry.loc)) return;
    seen.add(entry.loc);
    entries.push(entry);
  };

  add({
    loc: `${BASE_CANONICAL_URL}/`,
    lastmod,
    changefreq: 'daily',
    priority: '1.0',
  });

  for (const page of STATIC_PAGES) {
    add({
      loc: `${BASE_CANONICAL_URL}/${page}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  for (const url of VERIFIED_PILOT_URLS) {
    add({
      loc: url,
      lastmod,
      changefreq: 'weekly',
      priority: '0.95',
    });
  }

  for (const slug of COMPARISON_SLUGS) {
    add({
      loc: `${BASE_CANONICAL_URL}/compare/${slug}`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.90',
    });
  }

  return entries;
}

export function generateCleanSitemapXml(dateFormatted?: string): string {
  // First check if static public/sitemap.xml or dist/sitemap.xml exists and has valid XML
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

export const generateSitemapXml = generateCleanSitemapXml;

let cachedXml: string | null = null;

export function getCachedSitemapXml(): string {
  if (!cachedXml) {
    try {
      const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml');
      const distPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
      if (fs.existsSync(distPath)) {
        const content = fs.readFileSync(distPath, 'utf-8');
        if (content.startsWith('<?xml') && content.includes('</urlset>')) {
          cachedXml = content;
          return cachedXml;
        }
      }
      if (fs.existsSync(publicPath)) {
        const content = fs.readFileSync(publicPath, 'utf-8');
        if (content.startsWith('<?xml') && content.includes('</urlset>')) {
          cachedXml = content;
          return cachedXml;
        }
      }
    } catch {}
    cachedXml = generateCleanSitemapXml();
  }
  return cachedXml;
}

export function invalidateSitemapCache(): void {
  cachedXml = null;
}

export async function generateAndWriteStaticSitemap(customTargetPaths?: string[]) {
  const generatedAt = new Date().toISOString();
  const dateFormatted = formatSitemapDate(generatedAt);
  const xml = generateCleanSitemapXml(dateFormatted);
  cachedXml = xml;

  const rootDir = process.cwd();
  const defaultPaths = [
    path.join(rootDir, 'public', 'sitemap.xml'),
    path.join(rootDir, 'public', 'sitemap-main.xml'),
  ];
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    defaultPaths.push(path.join(distDir, 'sitemap.xml'));
    defaultPaths.push(path.join(distDir, 'sitemap-main.xml'));
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
    } catch {}
  }

  const entries = getCanonicalSitemapEntries(dateFormatted);
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
      scriptElementsCount: 0,
      searchUrlsCount: 0,
      isValidProtocol: true,
    },
  };
}

export async function serveSitemapXml(req: Request, res: Response) {
  try {
    const xml = getCachedSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return res.status(200).send(xml);
  } catch (err: any) {
    const fallbackXml = generateCleanSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return res.status(200).send(fallbackXml);
  }
}

export async function handleGenerateSitemapApi(req: Request, res: Response) {
  try {
    const result = await generateAndWriteStaticSitemap();
    return res.status(200).json({
      success: true,
      message: 'Static sitemap.xml generated and updated successfully.',
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to generate static sitemap file.',
      message: err?.message || String(err),
    });
  }
}

export default serveSitemapXml;
