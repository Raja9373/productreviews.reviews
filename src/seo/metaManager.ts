import { useEffect } from "react";

export interface DocumentMetaOptions {
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string[];
}

export const DEFAULT_SITE_TITLE = "productreviews.review — Tested Tech & AI Shopping Verdicts";
export const DEFAULT_SITE_DESCRIPTION =
  "Prepend productreviews.review/ to any link to cut fake reviews, track real lowest Amazon prices, and view independent lab-tested hardware scores.";
export const DEFAULT_CANONICAL = "https://productreviews.review/";

function setMetaTag(name: string, content: string, isProperty: boolean = false): void {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonicalLink(href: string): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function updateDocumentMeta(options: DocumentMetaOptions): void {
  if (typeof document === "undefined") return;

  const title = options.title.trim();
  const description = options.description.trim();
  const canonical = options.canonical || DEFAULT_CANONICAL;
  const robots = options.robots || "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  document.title = title;
  setMetaTag("description", description);
  setMetaTag("robots", robots);

  if (options.keywords && options.keywords.length > 0) {
    setMetaTag("keywords", options.keywords.join(", "));
  }

  setCanonicalLink(canonical);

  setMetaTag("og:title", options.ogTitle || title, true);
  setMetaTag("og:description", options.ogDescription || description, true);
  setMetaTag("og:url", canonical, true);
  setMetaTag("og:type", options.ogType || "website", true);
  setMetaTag("og:site_name", "productreviews.review", true);
  if (options.ogImage) {
    setMetaTag("og:image", options.ogImage, true);
  }

  setMetaTag("twitter:card", "summary_large_image");
  setMetaTag("twitter:title", options.ogTitle || title);
  setMetaTag("twitter:description", options.ogDescription || description);
  setMetaTag("twitter:url", canonical);
  if (options.ogImage) {
    setMetaTag("twitter:image", options.ogImage);
  }
}

export function useDocumentMeta(options: DocumentMetaOptions, deps: any[] = []): void {
  useEffect(() => {
    updateDocumentMeta(options);
  }, [
    options.title,
    options.description,
    options.canonical,
    options.robots,
    options.ogTitle,
    options.ogDescription,
    ...deps
  ]);
}
