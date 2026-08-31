import { LanguageCode } from '../types';
import { LANGUAGES } from '../data/languages';

const LOCAL_STORAGE_KEY = 'pr_user_language_v1';
const GEO_SIMULATION_KEY = 'pr_simulated_country_code';

export interface GeoLocationMock {
  countryCode: string;
  countryName: string;
  flag: string;
  suggestedLang: LanguageCode;
  ip: string;
}

export const GEO_LOCATIONS: GeoLocationMock[] = [
  { countryCode: 'ES', countryName: 'Spain', flag: '🇪🇸', suggestedLang: 'es', ip: '88.24.112.50' },
  { countryCode: 'IN', countryName: 'India', flag: '🇮🇳', suggestedLang: 'hi', ip: '103.211.200.14' },
  { countryCode: 'JP', countryName: 'Japan', flag: '🇯🇵', suggestedLang: 'ja', ip: '133.242.18.99' },
  { countryCode: 'DE', countryName: 'Germany', flag: '🇩🇪', suggestedLang: 'de', ip: '141.76.1.1' },
  { countryCode: 'FR', countryName: 'France', flag: '🇫🇷', suggestedLang: 'fr', ip: '194.214.48.150' },
  { countryCode: 'US', countryName: 'United States', flag: '🇺🇸', suggestedLang: 'en', ip: '198.51.100.24' },
  { countryCode: 'BR', countryName: 'Brazil', flag: '🇧🇷', suggestedLang: 'pt', ip: '177.18.200.12' },
  { countryCode: 'SA', countryName: 'Saudi Arabia', flag: '🇸🇦', suggestedLang: 'ar', ip: '212.118.140.2' },
  { countryCode: 'KR', countryName: 'South Korea', flag: '🇰🇷', suggestedLang: 'ko', ip: '147.46.10.1' },
  { countryCode: 'RU', countryName: 'Russia', flag: '🇷🇺', suggestedLang: 'ru', ip: '95.173.136.2' },
  { countryCode: 'CN', countryName: 'China', flag: '🇨🇳', suggestedLang: 'zh-CN', ip: '202.108.22.5' },
  { countryCode: 'IT', countryName: 'Italy', flag: '🇮🇹', suggestedLang: 'it', ip: '151.100.1.20' },
  { countryCode: 'TR', countryName: 'Turkey', flag: '🇹🇷', suggestedLang: 'tr', ip: '193.140.1.5' },
  { countryCode: 'VN', countryName: 'Vietnam', flag: '🇻🇳', suggestedLang: 'vi', ip: '113.161.0.1' },
  { countryCode: 'TH', countryName: 'Thailand', flag: '🇹🇭', suggestedLang: 'th', ip: '203.144.144.1' },
  { countryCode: 'ID', countryName: 'Indonesia', flag: '🇮🇩', suggestedLang: 'id', ip: '103.10.60.1' },
];

/**
 * 1. Detect language from query script and keywords
 */
export function detectLanguageFromQuery(text: string): LanguageCode | null {
  const q = text.trim().toLowerCase();
  if (!q) return null;

  // Devanagari script -> Hindi or Marathi
  if (/[\u0900-\u097F]/.test(q)) {
    if (/काय|आहे|कसे|चांगले/.test(q)) return 'mr';
    return 'hi';
  }

  // Japanese Hiragana & Katakana
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(q)) {
    return 'ja';
  }

  // Hangul (Korean)
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(q)) {
    return 'ko';
  }

  // Arabic / Urdu / Persian script
  if (/[\u0600-\u06FF]/.test(q)) {
    if (/کیسا|کونسا|چاہیے|ریویو/.test(q)) return 'ur';
    if (/چگونه|بهترین|بررسی|قیمت/.test(q)) return 'fa';
    return 'ar';
  }

  // Cyrillic (Russian / Ukrainian)
  if (/[\u0400-\u04FF]/.test(q)) {
    if (/[\u0454\u0456\u0457\u0490\u0491]|як|який|відгук|купити/.test(q)) return 'uk';
    return 'ru';
  }

  // Greek
  if (/[\u0370-\u03FF]/.test(q)) {
    return 'el';
  }

  // Thai
  if (/[\u0E00-\u0E7F]/.test(q)) {
    return 'th';
  }

  // Bengali
  if (/[\u0980-\u09FF]/.test(q)) {
    return 'bn';
  }

  // Tamil
  if (/[\u0B80-\u0BFF]/.test(q)) {
    return 'ta';
  }

  // Telugu
  if (/[\u0C00-\u0C7F]/.test(q)) {
    return 'te';
  }

  // Hebrew
  if (/[\u0590-\u05FF]/.test(q)) {
    return 'he';
  }

  // Chinese ideographs (without kana)
  if (/[\u4E00-\u9FFF]/.test(q) && !/[\u3040-\u309F\u30A0-\u30FF]/.test(q)) {
    if (/評價|購買|比較|松下|這款/.test(q)) return 'zh-TW';
    return 'zh-CN';
  }

  // Romanized Hindi / Hinglish ("kis product ka review chahiye", "kaisa hai", "kareedna chahiye kya")
  if (/(kis|kaisa|kaunsa|chahiye|review|kharidna|batao|kya|accha|hai)/i.test(q)) {
    if (/\b(kis|chahiye|kaunsa|kaisa|kya|batao)\b/i.test(q)) {
      return 'hi';
    }
  }

  // Spanish keywords ("resena", "opiniones", "comprar", "mejor")
  if (/\b(resena|reseña|opiniones|comprar|cual|que tal|vale la pena)\b/i.test(q)) {
    return 'es';
  }

  // German keywords ("testbericht|erfahrungen|kaufen|bewertung")
  if (/\b(testbericht|erfahrungen|kaufen|bewertung|lohnt sich)\b/i.test(q)) {
    return 'de';
  }

  // French keywords ("avis|test|meilleur|acheter")
  if (/\b(avis|meilleur|acheter|comparatif|prix)\b/i.test(q)) {
    return 'fr';
  }

  // Portuguese keywords ("avaliacao|opiniao|comprar|melhor")
  if (/\b(avaliacao|avaliação|opinião|comprar|vale a pena)\b/i.test(q)) {
    return 'pt';
  }

  // Italian keywords ("recensione|opinioni|comprare|migliore")
  if (/\b(recensione|opinioni|comprare|migliore|prezzo)\b/i.test(q)) {
    return 'it';
  }

  return null;
}

/**
 * 2. Browser Accept-Language detection
 */
export function detectBrowserLanguage(): LanguageCode {
  try {
    const navLangs = navigator.languages || [navigator.language];
    for (const l of navLangs) {
      const clean = l.toLowerCase();
      if (clean.startsWith('zh-tw') || clean.startsWith('zh-hk')) return 'zh-TW';
      if (clean.startsWith('zh')) return 'zh-CN';
      
      const lang2 = clean.slice(0, 2);
      const match = LANGUAGES.find(lang => lang.code.toLowerCase() === lang2);
      if (match) return match.code;
    }
  } catch {
    // Ignore in SSR
  }
  return 'en';
}

/**
 * 3. Simulated IP Geo fallback
 */
export function getSimulatedGeoLocation(): GeoLocationMock {
  try {
    const savedCode = localStorage.getItem(GEO_SIMULATION_KEY);
    if (savedCode) {
      const match = GEO_LOCATIONS.find(g => g.countryCode === savedCode);
      if (match) return match;
    }
  } catch {
    // ignore
  }
  // Default to Spain to demonstrate the specific Spanish IP prompt requirement if not explicitly set, or US
  return GEO_LOCATIONS[0]; // Spain by default for clear prompt demo, or configurable!
}

export function setSimulatedGeoLocation(countryCode: string) {
  try {
    localStorage.setItem(GEO_SIMULATION_KEY, countryCode);
  } catch {
    // ignore
  }
}

/**
 * Master Language Initializer
 * Priority:
 * 1. Saved localStorage preference
 * 2. Simulated IP Geo (e.g. Spain IP -> Spanish)
 * 3. Browser Accept-Language
 * 4. English fallback
 */
export function getInitialLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as LanguageCode | null;
    if (saved && LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }
  } catch {
    // ignore
  }

  // Check IP Geo fallback
  const geo = getSimulatedGeoLocation();
  if (geo && geo.suggestedLang) {
    return geo.suggestedLang;
  }

  // Check Browser Accept-Language
  const browserLang = detectBrowserLanguage();
  if (browserLang) return browserLang;

  return 'en';
}

export function saveLanguagePreference(lang: LanguageCode) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}
