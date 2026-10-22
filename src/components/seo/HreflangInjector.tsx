import React, { useEffect } from "react";

const MARKET_HREFLANG_MAP: Record<string, string> = {
  US: "en-us",
  IN: "en-in",
  UK: "en-gb",
  DE: "de-de",
  FR: "fr-fr",
  ES: "es-es",
  IT: "it-it",
  CA: "en-ca",
  AU: "en-au",
  JP: "ja-jp",
  BR: "pt-br",
  MX: "es-mx",
  NL: "nl-nl",
  SG: "en-sg"
};

export interface HreflangInjectorProps {
  currentMarket?: string;
}

export const HreflangInjector: React.FC<HreflangInjectorProps> = ({ currentMarket = "US" }) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Remove existing alternate hreflang links to prevent duplicates
    const existing = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existing.forEach((el) => el.remove());

    const head = document.head;
    const baseUrl = "https://productreviews.review";

    // Add hreflang for each supported market
    Object.entries(MARKET_HREFLANG_MAP).forEach(([marketCode, hreflangVal]) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", hreflangVal);
      link.setAttribute("href", `${baseUrl}/?market=${marketCode}`);
      head.appendChild(link);
    });

    // Add x-default
    const defaultLink = document.createElement("link");
    defaultLink.setAttribute("rel", "alternate");
    defaultLink.setAttribute("hreflang", "x-default");
    defaultLink.setAttribute("href", `${baseUrl}/`);
    head.appendChild(defaultLink);

    return () => {
      const cleanupLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
      cleanupLinks.forEach((el) => el.remove());
    };
  }, [currentMarket]);

  return null;
};

export default HreflangInjector;
