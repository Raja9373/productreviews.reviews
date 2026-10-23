import type { Request, Response } from "express";

/**
 * Diagnostic utility to fetch and inspect the production sitemap.
 * Usage: GET /api/diagnostic-sitemap-fetch
 */
export async function handleSitemapDiagnostic(req: Request, res: Response) {
  const targetUrl = "https://productreviews.review/sitemap.xml";
  console.log(`[Diagnostic] Fetching ${targetUrl}...`);

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "SEO-Diagnostic-Tool/1.0",
      },
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const body = await response.text();
    
    // Simple XML structure validation check
    const isValidXml = body.startsWith('<?xml') && body.includes('<urlset');
    const urlCount = (body.match(/<url>/g) || []).length;

    const report = {
      targetUrl,
      status: response.status,
      statusText: response.statusText,
      headers,
      xmlStructureValid: isValidXml,
      urlCount: urlCount,
      bodyPreview: body.substring(0, 300) + "..."
    };

    console.log(`[Diagnostic] Result for ${targetUrl}:`, JSON.stringify(report, null, 2));

    return res.status(200).json({
      success: true,
      report
    });
  } catch (err: any) {
    console.error(`[Diagnostic] Failed to fetch ${targetUrl}:`, err);
    return res.status(500).json({
      success: false,
      error: err.message || String(err)
    });
  }
}
