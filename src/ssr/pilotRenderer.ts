import { contentRepository, ReviewRecord } from "../content/store/contentRepository";

export interface PilotPage {
  path: string;
  slug: string;
  type: "review" | "compare";
  title: string;
  description: string;
  record?: ReviewRecord;
  compareRecords?: [ReviewRecord, ReviewRecord];
}

export const PILOT_PAGES: PilotPage[] = [
  {
    path: "/review/apple-iphone-16-pro-max",
    slug: "apple-iphone-16-pro-max",
    type: "review",
    title: "Apple iPhone 16 Pro Max Review: Tested Verdict",
    description: "In-depth hardware review, benchmark evidence, battery runtime, and Amazon price tracking for the Apple iPhone 16 Pro Max."
  },
  {
    path: "/review/sony-wh-1000xm5",
    slug: "sony-wh-1000xm5",
    type: "review",
    title: "Sony WH-1000XM5 Review: Noise Cancelling Verdict",
    description: "Lab-tested acoustic fidelity, 30-hour battery verification, and ANC isolation benchmarks for Sony WH-1000XM5 headphones."
  },
  {
    path: "/compare/iphone-16-pro-max-vs-galaxy-s24-ultra",
    slug: "iphone-16-pro-max-vs-galaxy-s24-ultra",
    type: "compare",
    title: "iPhone 16 Pro Max vs Galaxy S24 Ultra: Tested Comparison",
    description: "Direct camera shootout, battery endurance comparison, and display benchmark analysis between Apple and Samsung flagships."
  }
];

export function getPilotPage(requestPath: string): PilotPage | undefined {
  const cleanPath = requestPath.split("?")[0].replace(/\/+$/, "");
  return PILOT_PAGES.find((p) => p.path === cleanPath);
}

export function renderPilotHtml(pilotPage: PilotPage, baseHtml: string): string {
  const canonicalUrl = `https://productreviews.review${pilotPage.path}`;
  
  let html = baseHtml
    .replace(/<title>.*?<\/title>/i, `<title>${pilotPage.title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${pilotPage.description}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${pilotPage.title}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${pilotPage.description}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);

  return html;
}

export function render404Html(baseHtml: string, requestPath: string): string {
  const notFoundTitle = "Page Not Found | productreviews.review";
  const notFoundDesc = "The requested product review or gear guide could not be located in our verified hardware repository.";
  return baseHtml
    .replace(/<title>.*?<\/title>/i, `<title>${notFoundTitle}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${notFoundDesc}" />`)
    .replace(/<meta name="robots" content=".*?"\s*\/?>/i, `<meta name="robots" content="noindex, follow" />`);
}
