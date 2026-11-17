import fs from "fs";
import path from "path";
import { getPilotPage, renderPilotHtml, render404Html } from "../src/ssr/pilotRenderer";

let cachedRemoteIndexHtml: string | null = null;

async function loadBaseHtml(req: any): Promise<string> {
  const distPath = path.join(process.cwd(), "dist", "index.html");
  if (fs.existsSync(distPath)) {
    return fs.readFileSync(distPath, "utf-8");
  }

  const rootIndexPath = path.join(process.cwd(), "index.html");
  if (fs.existsSync(rootIndexPath)) {
    return fs.readFileSync(rootIndexPath, "utf-8");
  }

  if (cachedRemoteIndexHtml) {
    return cachedRemoteIndexHtml;
  }

  try {
    const host = String(req.headers?.host || "productreviews.review");
    const proto = String(req.headers?.["x-forwarded-proto"] || "https");
    const resp = await fetch(`${proto}://${host}/index.html`, { signal: AbortSignal.timeout(3000) });
    if (resp.ok) {
      const text = await resp.text();
      if (text.includes("<div id=\"root\">")) {
        cachedRemoteIndexHtml = text;
        return text;
      }
    }
  } catch {}

  return `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>productreviews.review — Tested Tech & AI Shopping Verdicts</title>
    <meta name="description" content="Independent hardware testing, benchmark evidence, and verified lowest Amazon prices." />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://productreviews.review/" />
    <meta property="og:title" content="productreviews.review" />
    <meta property="og:description" content="Independent hardware testing, benchmark evidence, and verified lowest Amazon prices." />
    <meta property="og:url" content="https://productreviews.review/" />
    <meta name="twitter:title" content="productreviews.review" />
    <meta name="twitter:description" content="Independent hardware testing, benchmark evidence, and verified lowest Amazon prices." />
    <meta name="twitter:url" content="https://productreviews.review/" />
  </head>
  <body class="bg-[#09090b] text-zinc-100 min-h-screen">
    <div id="root"></div>
  </body>
</html>`;
}

export default async function handler(req: any, res: any) {
  try {
    const rawQueryPath = req.query?.path;
    let targetPath = Array.isArray(rawQueryPath) ? rawQueryPath[0] : rawQueryPath;
    if (!targetPath) {
      targetPath = (req.url || "/").split("?")[0];
    }
    if (!targetPath.startsWith("/")) {
      targetPath = `/${targetPath}`;
    }

    const baseHtml = await loadBaseHtml(req);
    const pilotPage = getPilotPage(targetPath);

    if (pilotPage) {
      const html = renderPilotHtml(pilotPage, baseHtml);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.end(html);
      return;
    }

    const notFoundHtml = render404Html(baseHtml, targetPath);
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("X-Robots-Tag", "noindex, follow");
    res.end(notFoundHtml);
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(`SSR Error: ${err?.message || String(err)}`);
  }
}
