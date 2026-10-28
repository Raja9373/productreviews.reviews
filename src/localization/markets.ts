export interface MarketInfo {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  flag: string;
  domain: string;
  defaultTag: string;
}

export const SUPPORTED_MARKETS: MarketInfo[] = [
  { code: "US", name: "United States", currency: "USD", symbol: "$", flag: "🇺🇸", domain: "amazon.com", defaultTag: "jaiguruji00-20" },
  { code: "IN", name: "India", currency: "INR", symbol: "₹", flag: "🇮🇳", domain: "amazon.in", defaultTag: "jaiguruji00-21" },
  { code: "UK", name: "United Kingdom", currency: "GBP", symbol: "£", flag: "🇬🇧", domain: "amazon.co.uk", defaultTag: "jaiguruji0002-21" },
  { code: "DE", name: "Germany", currency: "EUR", symbol: "€", flag: "🇩🇪", domain: "amazon.de", defaultTag: "jaiguruji0004-21" },
  { code: "FR", name: "France", currency: "EUR", symbol: "€", flag: "🇫🇷", domain: "amazon.fr", defaultTag: "jaiguruji0005-21" },
  { code: "ES", name: "Spain", currency: "EUR", symbol: "€", flag: "🇪🇸", domain: "amazon.es", defaultTag: "jaiguruji0008-21" },
  { code: "IT", name: "Italy", currency: "EUR", symbol: "€", flag: "🇮🇹", domain: "amazon.it", defaultTag: "jaiguruji0007-21" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "C$", flag: "🇨🇦", domain: "amazon.ca", defaultTag: "jaiguruji000b-20" },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "A$", flag: "🇦🇺", domain: "amazon.com.au", defaultTag: "jaiguruji00-20" },
  { code: "JP", name: "Japan", currency: "JPY", symbol: "¥", flag: "🇯🇵", domain: "amazon.co.jp", defaultTag: "jaiguruji00-22" },
  { code: "BR", name: "Brazil", currency: "BRL", symbol: "R$", flag: "🇧🇷", domain: "amazon.com.br", defaultTag: "jaiguruji00-20" },
  { code: "MX", name: "Mexico", currency: "MXN", symbol: "Mex$", flag: "🇲🇽", domain: "amazon.com.mx", defaultTag: "jaiguruji00-20" },
  { code: "NL", name: "Netherlands", currency: "EUR", symbol: "€", flag: "🇳🇱", domain: "amazon.nl", defaultTag: "jaiguruji0004-21" },
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "S$", flag: "🇸🇬", domain: "amazon.sg", defaultTag: "jaiguruji00-20" }
];

export function resolveTargetMarket(geoCode?: string, acceptLang?: string): MarketInfo {
  if (geoCode) {
    const found = SUPPORTED_MARKETS.find((m) => m.code === geoCode.toUpperCase());
    if (found) return found;
  }
  if (acceptLang) {
    const l = acceptLang.toLowerCase();
    if (l.includes("hi") || l.includes("en-in")) return SUPPORTED_MARKETS.find((m) => m.code === "IN")!;
    if (l.includes("en-gb")) return SUPPORTED_MARKETS.find((m) => m.code === "UK")!;
    if (l.includes("ja")) return SUPPORTED_MARKETS.find((m) => m.code === "JP")!;
    if (l.includes("de")) return SUPPORTED_MARKETS.find((m) => m.code === "DE")!;
    if (l.includes("fr")) return SUPPORTED_MARKETS.find((m) => m.code === "FR")!;
    if (l.includes("es")) return SUPPORTED_MARKETS.find((m) => m.code === "ES")!;
    if (l.includes("it")) return SUPPORTED_MARKETS.find((m) => m.code === "IT")!;
    if (l.includes("ca")) return SUPPORTED_MARKETS.find((m) => m.code === "CA")!;
  }
  return SUPPORTED_MARKETS[0]; // Default US
}
