/**
 * ProductReviews.review — Local Terminology Context
 * Provides market-specific terminology synonyms and regional phrases without altering canonical intent.
 */

export interface TerminologyMapping {
  canonicalCategory: string;
  regionalTerms: Record<string, string[]>;
}

export const REGIONAL_TERMINOLOGY: Record<string, Record<string, string>> = {
  'en-GB': {
    'cell phone': 'mobile phone',
    'cellphone': 'mobile phone',
    'smartphone': 'mobile phone',
    'flashlight': 'torch',
    'faucet': 'tap',
    'hood': 'bonnet',
    'trunk': 'boot'
  },
  'en-IN': {
    'cell phone': 'mobile phone',
    'cellphone': 'mobile phone',
    'earphones': 'earbuds',
    'power outage': 'power cut',
    'backup battery': 'inverter'
  },
  'en-US': {
    'mobile phone': 'cell phone',
    'torch': 'flashlight',
    'tap': 'faucet'
  },
  'de-DE': {
    'smartphone': 'Handy',
    'cell phone': 'Handy',
    'vacuum cleaner': 'Staubsauger',
    'headphones': 'Kopfhörer'
  },
  'fr-FR': {
    'smartphone': 'portable',
    'cell phone': 'téléphone portable',
    'earbuds': 'écouteurs sans fil',
    'vacuum cleaner': 'aspirateur'
  }
};

/**
 * Maps a generic category or feature to the localized phrasing for a target locale
 */
export function getLocalizedTerm(
  canonicalTerm: string,
  terminologyLocale: string = 'en-US'
): string {
  const dict = REGIONAL_TERMINOLOGY[terminologyLocale];
  if (!dict) return canonicalTerm;

  const lower = canonicalTerm.toLowerCase().trim();
  return dict[lower] || canonicalTerm;
}
