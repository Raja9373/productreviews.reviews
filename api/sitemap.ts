/**
 * Cleanest possible Sitemap handler for Vercel.
 * No external imports. No Express-specific methods.
 * Guaranteed to run in any Node.js serverless context.
 */
export default function (req: any, res: any) {
  const today = new Date().toISOString().split("T")[0];
  const baseUrl = "https://productreviews.review";

  const paths = [
    "/",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/affiliate-disclosure",
    "/review/apple-iphone-16-pro-max",
    "/review/sony-wh-1000xm5",
    "/review/macbook-pro-16-m3-max",
    "/review/dell-xps-15-oled",
    "/review/samsung-galaxy-s24-ultra",
    "/compare/iphone-16-pro-max-vs-galaxy-s24-ultra"
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  paths.forEach(p => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${p === '/' ? '' : p}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${p === '/' ? 'daily' : 'weekly'}</changefreq>\n`;
    xml += `    <priority>${p === '/' ? '1.0' : '0.8'}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
  res.end(xml);
}
