import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';

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

const CANONICAL_CATEGORY_KEYS = [
  'phone',
  'laptop',
  'tv',
  'ac',
  'earbuds',
  'juicer',
  'water purifier',
  'washing machine',
  'curtain',
  'universal remote',
  'music system',
];

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

  // 2. Multilingual Homepages (23 languages)
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

  // 4. Dynamic Category Keys
  for (const cat of CANONICAL_CATEGORY_KEYS) {
    const catLoc = `${BASE_URL}/search?q=${encodeURIComponent(cat)}`;
    if (!urlMap.has(catLoc)) {
      urlMap.set(catLoc, {
        loc: catLoc,
        lastmod: today,
        changefreq: 'daily',
        priority: '0.9',
      });
    }

    if (cat.toLowerCase() === 'phone') {
      const phoneSpecialLoc = `${BASE_URL}/search?q=${encodeURIComponent('phone under 30000')}`;
      if (!urlMap.has(phoneSpecialLoc)) {
        urlMap.set(phoneSpecialLoc, {
          loc: phoneSpecialLoc,
          lastmod: today,
          changefreq: 'daily',
          priority: '0.85',
        });
      }
    }
  }

  // Optional: Read disk cache safely if present
  try {
    const cachePath = path.join(process.cwd(), 'data', 'permanent-products-cache.json');
    if (fs.existsSync(cachePath)) {
      const content = fs.readFileSync(cachePath, 'utf-8');
      if (content.trim()) {
        const parsed = JSON.parse(content);
        for (const [key, val] of Object.entries(parsed)) {
          const match = key.match(/^live-(.+)-IN$/i);
          if (match && match[1]) {
            const query = match[1].trim();
            if (query && !CANONICAL_CATEGORY_KEYS.includes(query.toLowerCase())) {
              const loc = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
              const lastmod = formatDate((val as any)?.lastUpdatedISO || today);
              urlMap.set(loc, {
                loc,
                lastmod,
                changefreq: 'daily',
                priority: '0.85',
              });
            }
          }
        }
      }
    }
  } catch {
    // Non-blocking fallback
  }

  // Build standard clean XML - ONLY <url> tags inside <urlset>, absolutely NO <script>, <style>, HTML, or non-sitemap markup
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
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error('[sitemap] Error generating sitemap:', err?.message || err);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${BASE_URL}/</loc>\n    <lastmod>${formatDate()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`
    );
  }
}

