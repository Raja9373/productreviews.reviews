/**
 * Category-Based Smart Affiliate Routing
 * Multi-vertical affiliate engine supporting Amazon (14 Geo tags), CarDekho, BikeDekho, and others.
 */

const getEnvTag = (countryCode) => {
  if (typeof process !== 'undefined' && process.env) {
    const envKey = `AMAZON_TAG_${(countryCode || 'IN').toUpperCase()}`;
    if (process.env[envKey]) return process.env[envKey];
    if (process.env.AMAZON_PARTNER_TAG) return process.env.AMAZON_PARTNER_TAG;
  }
  return '';
};

export const AFFILIATE_ROUTING = {
  // Amazon Categories
  "Camera Category": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Cameras & Photography": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Electronics": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Mobile": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Mobile & Communication": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Laptop": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Computers & IT": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Audio & Sound": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "TV & Home Entertainment": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Large Appliances": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Small Kitchen Appliances": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Home Comfort & Climate": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Kitchen, Dining & Cookware": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Home Decor & Furniture": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Security & Smart Home": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Health & Wellness": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Personal Care & Grooming": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Beauty & Cosmetics": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Sports & Fitness": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Baby & Maternity": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Toys": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Toys & Baby": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Pet Products": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Tools & Home Improvement": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Office & Business Products": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Musical Instruments & DJ": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Grocery & Gourmet Food": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Automotive Accessories": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Fashion & Apparel (Men)": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Fashion & Apparel (Women)": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Footwear & Shoes": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Watches & Luxury Timepieces": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Travel Luggage & Bags": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },
  "Gifts & Party Occasions": { site: "amazon", tag: getEnvTag('IN'), search: true, cta: "Have a Look" },

  // Auto Categories - NOT Amazon
  "Car": { site: "cardekho", affiliate: "cardekho_affiliate_link", info: true, accessories_fallback: "amazon", cta: "Check On-Road Price" },
  "Cars": { site: "cardekho", affiliate: "cardekho_affiliate_link", info: true, accessories_fallback: "amazon", cta: "Check On-Road Price" },
  "SUV": { site: "cardekho", affiliate: "cardekho_affiliate_link", info: true, accessories_fallback: "amazon", cta: "Check On-Road Price" },
  "SUVs": { site: "cardekho", affiliate: "cardekho_affiliate_link", info: true, accessories_fallback: "amazon", cta: "Check On-Road Price" },
  "Automobile": { site: "cardekho", affiliate: "cardekho_affiliate_link", info: true, accessories_fallback: "amazon", cta: "Check On-Road Price" },
  "Bike": { site: "bikedekho", affiliate: "bikedekho_affiliate_link", info: true, accessories_fallback: "amazon", cta: "Check On-Road Price" },
  "Bikes": { site: "bikedekho", affiliate: "bikedekho_affiliate_link", info: true, accessories_fallback: "amazon", cta: "Check On-Road Price" },
  "Motorcycle": { site: "bikedekho", affiliate: "bikedekho_affiliate_link", info: true, accessories_fallback: "amazon", cta: "Check On-Road Price" },
  "Scooter": { site: "bikedekho", affiliate: "bikedekho_affiliate_link", info: true, accessories_fallback: "amazon", cta: "Check On-Road Price" },

  // Travel / Hospitality
  "Hotels": { site: "booking", affiliate: "booking_affiliate", info: true, cta: "Check Availability" },
  "Resorts": { site: "booking", affiliate: "booking_affiliate", info: true, cta: "Check Availability" },
  "Flights": { site: "skyscanner", affiliate: "skyscanner_affiliate", info: true, cta: "Check Flight Prices" },
  "Restaurants": { site: "zomato", affiliate: "zomato_link", info: true, cta: "View Menu & Reserve" },
  "Real Estate": { site: "99acres", affiliate: "99acres_link", info: true, cta: "Explore Listings" },
  "Finance": { site: "bankbazaar", affiliate: "bankbazaar_link", info: true, cta: "Compare Offers" },
  "Healthcare": { site: "practo", affiliate: "practo_link", info: true, cta: "View Hospital Info" },
};

/**
 * Check if a product or category is an Auto (Car/SUV/Bike) vehicle
 */
export function isAutoCategory(categoryOrQuery = '') {
  const norm = (categoryOrQuery || '').toLowerCase();
  return (
    norm.includes('car') ||
    norm.includes('suv') ||
    norm.includes('bike') ||
    norm.includes('motorcycle') ||
    norm.includes('scooter') ||
    norm.includes('creta') ||
    norm.includes('scorpio') ||
    norm.includes('thar') ||
    norm.includes('fortuner') ||
    norm.includes('brezza') ||
    norm.includes('nexon') ||
    norm.includes('seltos') ||
    norm.includes('hycross') ||
    norm.includes('innova') ||
    norm.includes('bullet') ||
    norm.includes('splendor') ||
    norm.includes('activa') ||
    norm.includes('pulsar') ||
    norm.includes('apache') ||
    norm.includes('duke')
  ) && !norm.includes('card') && !norm.includes('care') && !norm.includes('cables') && !norm.includes('carpet');
}

/**
 * Get direct model URL for CarDekho / BikeDekho
 */
export function getAutoVehicleUrl(productName = '') {
  const q = productName.toLowerCase();
  if (q.includes('scorpio')) return 'https://www.cardekho.com/mahindra/scorpio-n';
  if (q.includes('thar')) return 'https://www.cardekho.com/mahindra/thar-roxx';
  if (q.includes('creta')) return 'https://www.cardekho.com/hyundai/creta';
  if (q.includes('fortuner')) return 'https://www.cardekho.com/toyota/fortuner';
  if (q.includes('brezza')) return 'https://www.cardekho.com/maruti/brezza';
  if (q.includes('nexon')) return 'https://www.cardekho.com/tata/nexon';
  if (q.includes('grand vitara')) return 'https://www.cardekho.com/maruti/grand-vitara';
  if (q.includes('innova') || q.includes('hycross')) return 'https://www.cardekho.com/toyota/innova-hycross';
  if (q.includes('seltos')) return 'https://www.cardekho.com/kia/seltos';
  if (q.includes('activa')) return 'https://www.bikedekho.com/honda/activa-6g';
  if (q.includes('bullet') || q.includes('classic 350')) return 'https://www.bikedekho.com/royal-enfield/classic-350';
  if (q.includes('pulsar')) return 'https://www.bikedekho.com/bajaj/pulsar-150';
  if (q.includes('splendor')) return 'https://www.bikedekho.com/hero/splendor-plus';
  if (q.includes('duke')) return 'https://www.bikedekho.com/ktm/200-duke';

  if (q.includes('bike') || q.includes('motorcycle') || q.includes('scooter')) {
    return `https://www.bikedekho.com/search?q=${encodeURIComponent(productName)}`;
  }
  return `https://www.cardekho.com/search?query=${encodeURIComponent(productName)}`;
}

/**
 * Get Amazon accessories search URL for a given vehicle
 */
export function getAutoAccessoriesAmazonUrl(vehicleName = '', countryCode = 'IN') {
  const cc = (countryCode || 'IN').toUpperCase();
  const tag = getEnvTag(cc);
  const query = `${vehicleName} accessories`;
  const domain = cc === 'US' ? 'https://www.amazon.com/s?k=' : 'https://www.amazon.in/s?k=';
  return tag ? `${domain}${encodeURIComponent(query)}&tag=${tag}&linkCode=ll2&ref=as_li_ss_tl` : `${domain}${encodeURIComponent(query)}`;
}
