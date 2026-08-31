/**
 * Global Affiliate Map and Routing Matrix
 * Maps product and service categories to appropriate high-intent affiliate partners
 * with country-aware dynamic resolution (IN, US, UK, Global).
 */

import {
  getAmazonUrl,
  getCarUrl,
  getHotelUrl,
  getFlightUrl,
  getRestaurantUrl,
  getRealEstateUrl,
  getFinanceUrl,
  getHealthcareUrl,
} from '../lib/amazonGlobal';

export interface AffiliatePartnerConfig {
  name: string;
  button: string;
  secondaryButton?: string;
  categories?: string[];
  keywords?: string[];
  url: (query: string, country?: string) => string | null;
  globalFallbackNote?: string;
  infoOnly?: boolean;
  disclaimer?: string;
}

export const AFFILIATE_MAP: Record<string, AffiliatePartnerConfig> = {
  amazon: {
    name: 'Amazon',
    categories: [
      'Mobile',
      'Computers',
      'TV',
      'Appliances',
      'Fashion',
      'Beauty',
      'Baby',
      'Toys',
      'Sports',
      'Grocery Packaged',
      'Luggage Bags',
      'Security Cameras',
      'Gifts',
      'Tools',
      'Books',
      'Pet Products',
      'Cycles',
    ],
    button: 'Have a Look',
    secondaryButton: 'Explore on Amazon',
    url: (q: string, country = 'IN') => getAmazonUrl(q, country),
    globalFallbackNote: '9 Countries supported: IN (jaiguruji00-21), US (jaiguruji00-20), UK (jaiguruji0002-21), JP (jaiguruji00-22), DE, FR, ES, IT, CA',
  },

  cardekho: {
    name: 'Car Deals & Comparison',
    keywords: [
      'suv',
      'car',
      'cars',
      'thar',
      'creta',
      'fortuner',
      'scorpio',
      'scorpio n',
      'brezza',
      'seltos',
      'nexon',
      'grand vitara',
      'innova',
      'xuv700',
      'safari',
      'harrier',
      'bike',
      'bikes',
      'activa',
      'royal enfield',
      'bullet',
      'under 20 lakh',
      'under 15 lakh',
      'under 10 lakh',
      'on road price',
    ],
    button: 'Check On-Road Price',
    secondaryButton: 'View Ownership Reviews',
    url: (q: string, country = 'IN') => getCarUrl(q, country).url,
    globalFallbackNote: 'IN=CarDekho, US=CarGurus, UK=AutoTrader, CA=AutoTrader CA, EU=AutoScout24',
  },

  flights: {
    name: 'Skyscanner',
    keywords: ['flight', 'air ticket', 'airlines', 'mumbai to delhi', 'delhi to goa', 'cheap flight', 'airline tickets'],
    button: 'Check Flight Prices',
    secondaryButton: 'Compare Airlines',
    url: (q: string, country = 'IN') => getFlightUrl(q, country).url,
    globalFallbackNote: 'Global: Skyscanner',
  },

  hotels: {
    name: 'Booking.com',
    keywords: ['hotel', 'oyo', '5 star hotel', 'hotel in goa', 'hotel in delhi', 'luxury hotel', 'taj hotel', 'marriott', 'hyatt'],
    button: 'Check Availability',
    secondaryButton: 'View Guest Reviews',
    url: (q: string) => getHotelUrl(q).url,
    globalFallbackNote: 'Global: Booking.com (aid=304142)',
  },

  resorts: {
    name: 'Booking.com Resorts',
    keywords: ['resort', 'beach resort', 'hill resort', 'luxury resort', 'resort in goa', 'weekend getaway resort'],
    button: 'Check Availability',
    secondaryButton: 'Check Room Deals',
    url: (q: string) => getHotelUrl(q).url,
    globalFallbackNote: 'Global: Booking.com Resorts',
  },

  restaurants: {
    name: 'Dining & Restaurants',
    keywords: ['restaurant', 'biryani', 'cafe', 'food near me', 'best food', 'fine dining', 'biryani in delhi', 'buffet', 'dhaba'],
    button: 'View Menu & Reserve',
    secondaryButton: 'Check Ratings',
    url: (q: string, country = 'IN') => getRestaurantUrl(q, country).url,
    infoOnly: false,
    globalFallbackNote: 'IN: Zomato, US/CA: Yelp, UK/EU: TripAdvisor',
  },

  villas: {
    name: 'Airbnb',
    keywords: ['villa', 'homestay', 'airbnb', 'farmhouse', 'private pool villa', 'staycation villa'],
    button: 'Check Availability',
    secondaryButton: 'View Villa Photos',
    url: (q: string) => `https://www.airbnb.com/s/${encodeURIComponent(q)}/homes`,
    globalFallbackNote: 'Global: Airbnb',
  },

  cafes: {
    name: 'Cafes & Roasteries',
    keywords: ['cafe', 'cafes', 'coffee shop', 'bakery', 'pub', 'brewery', 'bar'],
    button: 'View Menu',
    secondaryButton: 'Explore Ambience',
    url: (q: string, country = 'IN') => getRestaurantUrl(q, country).url,
    infoOnly: false,
    globalFallbackNote: 'IN: Zomato, US/CA: Yelp, UK/EU: TripAdvisor',
  },

  banquets: {
    name: 'VenueLook',
    keywords: ['banquet hall', 'wedding venue', 'marriage hall', 'party hall', 'banquet in delhi', 'wedding lawn'],
    button: 'Check Prices & Availability',
    secondaryButton: 'Request Callback',
    url: (q: string) => `https://www.venuelook.com/search?q=${encodeURIComponent(q)}`,
    globalFallbackNote: 'IN: VenueLook / Weddingz.in',
  },

  finance: {
    name: 'Finance & Cards',
    keywords: ['best bank', 'credit card', 'insurance', 'loan', 'mutual fund', 'fixed deposit', 'demat account', 'home loan', 'personal loan'],
    button: 'Compare Offers',
    secondaryButton: 'Check Eligibility',
    url: (q: string, country = 'IN') => getFinanceUrl(q, country).url,
    globalFallbackNote: 'IN: BankBazaar, US: NerdWallet, UK: MoneySavingExpert',
  },

  healthcare: {
    name: 'Healthcare & Hospitals',
    keywords: ['best hospital', 'hospital in delhi', 'doctor', 'clinic', 'hospital in mumbai', 'aiims', 'max hospital', 'apollo hospital', 'fortis'],
    button: 'View Hospital Info',
    secondaryButton: 'Doctor Specialities',
    url: (q: string, country = 'IN') => getHealthcareUrl(q, country).url,
    infoOnly: true,
    disclaimer: 'Healthcare Information Only. Please consult a licensed medical professional for urgent diagnoses or prescriptions.',
  },

  realestate: {
    name: 'Real Estate & Properties',
    keywords: ['flat', 'property', '2bhk', '3bhk', 'house for sale', 'villa for sale', 'flat in delhi', 'apartment', 'builder floor'],
    button: 'Explore Listings',
    secondaryButton: 'Floor Plans & Price',
    url: (q: string, country = 'IN') => getRealEstateUrl(q, country).url,
    globalFallbackNote: 'IN: 99acres, US: Zillow, UK: Rightmove',
  },

  education: {
    name: 'Shiksha & Higher Education',
    keywords: ['mba college', 'engineering college', 'coaching', 'online course', 'upsc coaching', 'neet coaching', 'study abroad'],
    button: 'Explore Courses',
    secondaryButton: 'Fee Structure & Placements',
    url: (q: string) => `https://www.shiksha.com/search?q=${encodeURIComponent(q)}`,
    globalFallbackNote: 'IN: Shiksha, Global: Coursera',
  },
};
