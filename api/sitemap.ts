import type { Request, Response } from 'express';
import { getPermanentCacheKeysAndData } from './live-prices';

interface SitemapUrlItem {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

const BASE_URL = 'https://productreviews.review';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
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

function formatDate(isoOrDate?: string): string {
  try {
    if (isoOrDate) {
      const parsed = new Date(isoOrDate);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    }
  } catch {}
  return new Date().toISOString().split('T')[0];
}

export function generateSitemapXml(): string {
  const today = formatDate();
  const urlMap = new Map<string, SitemapUrlItem>();

  // 1. Root & Core Pages
  urlMap.set(`${BASE_URL}/`, {
    loc: `${BASE_URL}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
  });

  // 2. Multilingual Homepages
  const supportedLangs = [
    'en', 'hi', 'es', 'de', 'fr', 'ja', 'ar', 'pt', 'ru', 'ko',
    'zh-CN', 'zh-TW', 'it', 'nl', 'pl', 'tr', 'vi', 'th', 'id', 'ta', 'te', 'mr', 'bn',
  ];

  for (const lang of supportedLangs) {
    const loc = `${BASE_URL}/${lang}/`;
    urlMap.set(loc, {
      loc,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.8',
    });
  }

  // 3. Informational & Legal Pages
  const staticPages = ['about', 'contact', 'privacy', 'terms', 'disclaimer'];
  for (const page of staticPages) {
    const loc = `${BASE_URL}/${page}`;
    urlMap.set(loc, {
      loc,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  // 4. Dynamic Keys from CACHED_CATEGORY_DATA + live-${q}-IN
  try {
    const { categoryKeys, entries } = getPermanentCacheKeysAndData();

    // Add CACHED_CATEGORY_DATA keys
    for (const cat of categoryKeys) {
      const catLoc = `${BASE_URL}/search?q=${encodeURIComponent(cat)}`;
      if (!urlMap.has(catLoc)) {
        urlMap.set(catLoc, {
          loc: catLoc,
          lastmod: today,
          changefreq: 'daily',
          priority: '0.9',
        });
      }

      // Add prominent category-specific canonical guides
      if (cat.toLowerCase() === 'phone') {
        const phoneSpecialLoc = `${BASE_URL}/search?q=${encodeURIComponent('phone under 30000')}`;
        if (!urlMap.has(phoneSpecialLoc)) {
          urlMap.set(phoneSpecialLoc, {
            loc: phoneSpecialLoc,
            lastmod: today,
            changefreq: 'daily',
            priority: '0.9',
          });
        }
      }
    }

    // Add live-${q}-IN cache keys
    for (const { key, data } of entries) {
      const match = key.match(/^live-(.+)-IN$/i);
      if (match && match[1]) {
        const query = match[1].trim();
        if (query) {
          const loc = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
          const lastmod = formatDate(data?.lastUpdatedISO || today);
          urlMap.set(loc, {
            loc,
            lastmod,
            changefreq: 'daily',
            priority: '0.85',
          });
        }
      }
    }
  } catch (err) {
    console.warn('[sitemap] Failed to collect dynamic cache keys:', err);
  }

  // Build standard XML
  const urlsXml = Array.from(urlMap.values())
    .map(
      (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

export default async function handleSitemap(req: Request, res: Response) {
  try {
    const xml = generateSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error('[sitemap] Error generating sitemap:', err?.message || err);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(500).send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${BASE_URL}/</loc></url>\n</urlset>`
    );
  }
}
