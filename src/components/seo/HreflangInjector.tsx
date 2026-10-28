import React, { useEffect } from "react";
import { SUPPORTED_MARKETS } from "../../localization/markets";

interface HreflangInjectorProps {
  currentMarket: string;
}

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

export const HreflangInjector: React.FC<HreflangInjectorProps> = ({ currentMarket }) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Clean existing hreflang tags
    document.querySelectorAll("link[data-hreflang-managed]").forEach((el) => el.remove());

    const pathname = window.location.pathname;
    const baseOrigin = "https://productreviews.review";

    Object.entries(MARKET_HREFLANG_MAP).forEach(([market, lang]) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      link.href = `${baseOrigin}${pathname}?market=${market}`;
      link.setAttribute("data-hreflang-managed", "true");
      document.head.appendChild(link);
    });

    const xDefault = document.createElement("link");
    xDefault.rel = "alternate";
    xDefault.hreflang = "x-default";
    xDefault.href = `${baseOrigin}${pathname}`;
    xDefault.setAttribute("data-hreflang-managed", "true");
    document.head.appendChild(xDefault);
  }, [currentMarket]);

  return null;
};
