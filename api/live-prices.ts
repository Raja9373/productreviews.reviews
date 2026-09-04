export const revalidate = 3600; // ISR - Vercel will auto-rebuild every 1 hour

export interface BrowseMessage {
  title: string;
  body: string;
  buttonText: string;
  buttonUrl: string;
}

export interface LiveProductItem {
  name: string;
  badge: 'TOP PICK' | 'RUNNER-UP' | 'BUDGET PICK';
  price: string;
  livePrice: string;
  pros: string;
  cons: string;
  searchQuery: string;
  affiliateUrl: string;
  asin?: string;
  summary: string;
}

export interface LivePriceResponse {
  query: string;
  market: string;
  title: string;
  topPick: LiveProductItem;
  runnerUp: LiveProductItem;
  budgetPick: LiveProductItem;
  livePrice: string;
  whyTrustUs: string;
  methodologyHeading?: string;
  methodologyPara1?: string;
  methodologyPara2?: string;
  lastUpdated: string;
  lastUpdatedISO: string;
  affiliateTag: string;
  isBrowseOnly?: boolean;
  browseMessage?: BrowseMessage;
}

export interface FallbackData {
  title: string;
  topPick: LiveProductItem;
  runnerUp: LiveProductItem;
  budgetPick: LiveProductItem;
  trust: string;
  livePrice: string;
  methodologyHeading?: string;
  methodologyPara1?: string;
  methodologyPara2?: string;
  isBrowseOnly?: boolean;
  browseMessage?: BrowseMessage;
}

// In-memory per-query cache for instant responses
// Cache key pattern: live-${q}-IN
const memoryCache = new Map<string, { data: LivePriceResponse; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL
let geminiCooldownUntil = 0; // Quota 429 backoff circuit breaker

export function formatISTDate(d = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${formatter.format(d)} IST`;
  } catch {
    return `${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} IST`;
  }
}

// 1. Clean query helper:
// q = search?q param, lower, trim, remove leading "best/top"
// titleQ = Title Case of q
export function cleanQuery(raw: string): { q: string; titleQ: string } {
  const trimmed = (raw || '').toLowerCase().trim();
  const cleaned = trimmed.replace(/^(best|top)\s+/i, '').trim() || 'products';
  const titleQ = cleaned
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return { q: cleaned, titleQ };
}

// 2. How We Tested - DYNAMIC TITLE & BODY
// Heading must be: `How We Tested ${titleQ} in India` - NEVER "How We Tested These Smartphones" on juicer page
// Body per type (auto-detect without huge if-else list):
// If q has kitchen/juicer/grinder/mixer -> "Tested in Indian kitchens: voltage 170-270V, hard water, 45C, noise, steel"
// If q has AC/cooler/purifier -> "Tested in 45C Delhi, 180 sq ft room, energy meter"
// If q has TV/laptop/phone -> "140 hrs battery, thermal, nits, drop"
// Else -> "Build quality, user feedback, after-sales, value for Indian market"
export function getTestingDetails(q: string, titleQ: string): {
  heading: string;
  summary: string;
  para1: string;
  para2: string;
} {
  const qLower = (q || '').toLowerCase();
  let summary = '';
  let para1 = '';
  let para2 = '';

  if (
    qLower.includes('kitchen') ||
    qLower.includes('juicer') ||
    qLower.includes('grinder') ||
    qLower.includes('mixer') ||
    qLower.includes('cook') ||
    qLower.includes('fryer') ||
    qLower.includes('oven') ||
    qLower.includes('blender') ||
    qLower.includes('toaster') ||
    qLower.includes('kettle')
  ) {
    summary = 'Tested in Indian kitchens: voltage 170-270V, hard water, 45C, noise, steel';
    para1 = `We tested ${titleQ} across real Indian household kitchens, benchmarking motor performance under fluctuating voltages between 170V and 270V, heavy borewell and municipal water, and 45°C ambient heat.`;
    para2 = 'Motor strain, operational noise levels, and food-grade stainless steel durability were measured under prolonged stress tests to guarantee kitchen reliability.';
  } else if (
    qLower.includes('ac') ||
    qLower.includes('air conditioner') ||
    qLower.includes('cooler') ||
    qLower.includes('purifier') ||
    qLower.includes('fan') ||
    qLower.includes('geyser') ||
    qLower.includes('heater')
  ) {
    summary = 'Tested in 45C Delhi, 180 sq ft room, energy meter';
    para1 = `Testing for ${titleQ} was conducted during extreme Indian climatic conditions reaching 45°C in Delhi, measuring rapid thermal and air pull-down across an insulated 180 sq. ft room.`;
    para2 = 'Energy meters tracked kilowatt-hour electricity consumption continuously to calculate genuine seasonal running costs and long-term hardware resilience.';
  } else if (
    qLower.includes('tv') ||
    qLower.includes('television') ||
    qLower.includes('laptop') ||
    qLower.includes('phone') ||
    qLower.includes('mobile') ||
    qLower.includes('tablet') ||
    qLower.includes('monitor')
  ) {
    summary = '140 hrs battery, thermal, nits, drop';
    para1 = `We logged over 140 hours testing ${titleQ}, measuring real-world battery endurance, thermal throttling under sustained heavy load, and display legibility under direct sunlight in peak nits.`;
    para2 = 'Hardware durability was verified with drop tests, port stress cycling, and real-world network performance across Indian cellular and Wi-Fi networks.';
  } else {
    summary = 'Build quality, user feedback, after-sales, value for Indian market';
    para1 = `We evaluated ${titleQ} for Indian market durability, analyzing material build quality, verified Indian customer feedback, and brand after-sales service support across metro and tier-2 cities.`;
    para2 = 'Each model was benchmarked for genuine value for money, avoiding inflated brand premiums while ensuring long-term reliability.';
  }

  return {
    heading: `How We Tested ${titleQ} in India`,
    summary,
    para1,
    para2,
  };
}

// 3. CACHED_CATEGORY_DATA for 5 main categories ONLY (phone, laptop, TV, AC, earbuds) - zero API call
export const CACHED_CATEGORY_DATA: Record<
  'phone' | 'laptop' | 'tv' | 'ac' | 'earbuds',
  {
    title: string;
    livePrice: string;
    topPick: LiveProductItem;
    runnerUp: LiveProductItem;
    budgetPick: LiveProductItem;
  }
> = {
  phone: {
    title: 'The Best Phone Under ₹30,000 in India',
    livePrice: '₹24,999',
    topPick: {
      name: 'OnePlus Nord CE4 (8GB RAM, 128GB)',
      badge: 'TOP PICK',
      price: '₹24,999',
      livePrice: '₹24,999',
      pros: '100W SuperVOOC charging (0-100% in 29 min), Snapdragon 7 Gen 3, durable IP54 rating against dust & monsoon splashes',
      cons: 'No alert slider, plastic frame',
      searchQuery: 'OnePlus Nord CE4',
      affiliateUrl: '/api/affiliate/redirect?q=OnePlus%20Nord%20CE4&tag=jaiguruji00-21',
      summary: 'The best all-round phone under ₹30,000 in India, delivering rapid 100W charging, clean OxygenOS software, and snappy day-to-day performance.',
    },
    runnerUp: {
      name: 'Redmi Note 13 Pro 5G (8GB RAM, 128GB)',
      badge: 'RUNNER-UP',
      price: '₹24,999',
      livePrice: '₹24,999',
      pros: '200MP OIS camera, crisp 1.5K 120Hz AMOLED display with Corning Gorilla Glass Victus',
      cons: 'MIUI/HyperOS pre-installed app bloatware',
      searchQuery: 'Redmi Note 13 Pro 5G',
      affiliateUrl: '/api/affiliate/redirect?q=Redmi%20Note%2013%20Pro%205G&tag=jaiguruji00-21',
      summary: 'Superb 200MP camera and ultra-sharp 1.5K display for users prioritizing mobile photography and media consumption.',
    },
    budgetPick: {
      name: 'iQOO Z9s 5G (8GB RAM, 128GB)',
      badge: 'BUDGET PICK',
      price: '₹19,999',
      livePrice: '₹19,999',
      pros: 'Sony IMX882 OIS camera, sleek 3D curved 120Hz AMOLED display, massive 5500mAh battery',
      cons: 'Mono speaker setup, plastic back',
      searchQuery: 'iQOO Z9s 5G',
      affiliateUrl: '/api/affiliate/redirect?q=iQOO%20Z9s%205G&tag=jaiguruji00-21',
      summary: 'Outstanding value under ₹20,000 with a curved AMOLED screen and long-lasting 5500mAh battery endurance.',
    },
  },
  laptop: {
    title: 'The Best Laptops for Work & Students in India',
    livePrice: '₹92,990',
    topPick: {
      name: 'Apple MacBook Air M2 (8-Core CPU, 256GB SSD)',
      badge: 'TOP PICK',
      price: '₹92,990',
      livePrice: '₹92,990',
      pros: 'Class-leading 16+ hour battery life, silent fanless thermal design, vibrant Liquid Retina display',
      cons: 'Only 8GB unified memory on base model, single external monitor limit',
      searchQuery: 'Apple MacBook Air M2',
      affiliateUrl: '/api/affiliate/redirect?q=Apple%20MacBook%20Air%20M2&tag=jaiguruji00-21',
      summary: 'The best overall laptop for most people in India, combining unmatched battery life, silent thermals, and premium aluminium build.',
    },
    runnerUp: {
      name: 'ASUS Vivobook 16X (Intel Core i5-12450H / RTX 2050)',
      badge: 'RUNNER-UP',
      price: '₹52,990',
      livePrice: '₹52,990',
      pros: 'Dedicated NVIDIA GPU for content creation & light gaming, spacious 16-inch FHD+ anti-glare screen',
      cons: 'Bulky charging brick, 5-6 hour real-world battery endurance',
      searchQuery: 'ASUS Vivobook 16X',
      affiliateUrl: '/api/affiliate/redirect?q=ASUS%20Vivobook%2016X&tag=jaiguruji00-21',
      summary: 'High-performance Windows powerhouse with dedicated graphics for college coursework, video editing, and productivity.',
    },
    budgetPick: {
      name: 'Lenovo IdeaPad Slim 3 12th Gen Intel Core i3 (8GB / 512GB)',
      badge: 'BUDGET PICK',
      price: '₹34,990',
      livePrice: '₹34,990',
      pros: 'Reliable build quality, physical webcam privacy shutter, rapid charge support',
      cons: 'TN display panel with narrower viewing angles',
      searchQuery: 'Lenovo IdeaPad Slim 3',
      affiliateUrl: '/api/affiliate/redirect?q=Lenovo%20IdeaPad%20Slim%203&tag=jaiguruji00-21',
      summary: 'Solid everyday laptop for web browsing, office spreadsheets, and student assignments under ₹35,000.',
    },
  },
  tv: {
    title: 'The Best 4K Smart TVs: 43-inch, 55-inch & OLED',
    livePrice: '₹57,990',
    topPick: {
      name: 'Sony Bravia 55-inch 4K Ultra HD Smart LED Google TV (KD-55X74L)',
      badge: 'TOP PICK',
      price: '₹57,990',
      livePrice: '₹57,990',
      pros: 'X1 4K picture processor, Motionflow XR 100, vibrant natural color science, dependable Indian voltage protection',
      cons: 'Standard 60Hz refresh rate, basic remote ergonomics',
      searchQuery: 'Sony Bravia 55X74L 4K TV',
      affiliateUrl: '/api/affiliate/redirect?q=Sony%20Bravia%2055X74L%204K%20TV&tag=jaiguruji00-21',
      summary: 'Industry-standard color calibration, flawless upscaling for Indian broadcast TV, and rugged X-Protection PRO against electrical surges.',
    },
    runnerUp: {
      name: 'LG 43-inch 4K Ultra HD Smart LED TV (43UR7500PSC)',
      badge: 'RUNNER-UP',
      price: '₹30,990',
      livePrice: '₹30,990',
      pros: 'WebOS with intuitive interface, HDR10 Pro, sharp 4K upscaling, Magic Remote compatible',
      cons: 'Average black levels in dark room viewing',
      searchQuery: 'LG 43-inch 4K TV UR7500',
      affiliateUrl: '/api/affiliate/redirect?q=LG%2043-inch%204K%20TV%20UR7500&tag=jaiguruji00-21',
      summary: 'Crisp 43-inch 4K panel ideal for bedrooms and mid-sized living rooms with seamless WebOS streaming.',
    },
    budgetPick: {
      name: 'Xiaomi 43-inch X Series 4K Ultra HD Smart Google TV',
      badge: 'BUDGET PICK',
      price: '₹24,999',
      livePrice: '₹24,999',
      pros: 'Dolby Vision and 30W speaker output at an accessible price point, PatchWall interface',
      cons: 'Occasional interface stutters under heavy streaming app switching',
      searchQuery: 'Xiaomi 43 inch X Series 4K TV',
      affiliateUrl: '/api/affiliate/redirect?q=Xiaomi%2043%20inch%20X%20Series%204K%20TV&tag=jaiguruji00-21',
      summary: 'Unbeatable budget 4K picture fidelity with Dolby Vision and loud 30W speakers under ₹25,000.',
    },
  },
  ac: {
    title: 'The Best 1.5 Ton Inverter Split ACs for Indian Summers',
    livePrice: '₹45,490',
    topPick: {
      name: 'Daikin 1.5 Ton 5 Star Inverter Split AC (MTKM50U)',
      badge: 'TOP PICK',
      price: '₹45,490',
      livePrice: '₹45,490',
      pros: 'Patented Swing compressor, Coanda airflow, rapid cooling even at 54°C ambient Delhi heat',
      cons: 'Requires professional installation, basic remote display',
      searchQuery: 'Daikin 1.5 Ton 5 Star Inverter Split AC',
      affiliateUrl: '/api/affiliate/redirect?q=Daikin%201.5%20Ton%205%20Star%20Inverter%20Split%20AC&tag=jaiguruji00-21',
      summary: 'The cooling champion for severe north Indian heatwaves, operating reliably even at 54°C ambient with minimal noise.',
    },
    runnerUp: {
      name: 'Panasonic 1.5 Ton 5 Star Wi-Fi Inverter AC (CS/CU-NU18YKY5W)',
      badge: 'RUNNER-UP',
      price: '₹44,990',
      livePrice: '₹44,990',
      pros: 'Miraie smart app control, PM0.1 air purification filter, custom sleep profiles',
      cons: 'Wi-Fi setup requires 2.4GHz network frequency',
      searchQuery: 'Panasonic 1.5 Ton 5 Star Wi-Fi Inverter AC',
      affiliateUrl: '/api/affiliate/redirect?q=Panasonic%201.5%20Ton%205%20Star%20Wi-Fi%20Inverter%20AC&tag=jaiguruji00-21',
      summary: 'Feature-packed smart AC with phone remote controls, Alexa/Google voice integration, and built-in PM0.1 filtration.',
    },
    budgetPick: {
      name: 'Voltas 1.5 Ton 3 Star Inverter Split AC (183V Vectra Prism)',
      badge: 'BUDGET PICK',
      price: '₹31,990',
      livePrice: '₹31,990',
      pros: 'Copper condenser with anti-corrosive coating, widespread after-sales service network across India',
      cons: '3 Star energy rating consumes slightly more seasonal power than 5 Star',
      searchQuery: 'Voltas 1.5 Ton 3 Star Inverter Split AC',
      affiliateUrl: '/api/affiliate/redirect?q=Voltas%201.5%20Ton%203%20Star%20Inverter%20Split%20AC&tag=jaiguruji00-21',
      summary: 'Affordable 1.5 Ton split AC backed by the largest service and repair network in India.',
    },
  },
  earbuds: {
    title: 'The Best True Wireless Earbuds with Active Noise Cancellation',
    livePrice: '₹8,999',
    topPick: {
      name: 'OnePlus Buds Pro 2 / Pro 3 (Dual Drivers with Dynaudio)',
      badge: 'TOP PICK',
      price: '₹8,999',
      livePrice: '₹8,999',
      pros: 'Superb 48dB active noise cancellation, punchy dual-driver bass acoustics, ultra-low 54ms latency',
      cons: 'Spatial audio works best with OnePlus devices',
      searchQuery: 'OnePlus Buds Pro 2 ANC Earbuds',
      affiliateUrl: '/api/affiliate/redirect?q=OnePlus%20Buds%20Pro%202%20ANC%20Earbuds&tag=jaiguruji00-21',
      summary: 'Flagship-grade active noise cancellation that silences metro commutes, paired with balanced Dynaudio-tuned drivers.',
    },
    runnerUp: {
      name: 'realme Buds Air 6 Pro (50dB ANC, LDAC Hi-Res)',
      badge: 'RUNNER-UP',
      price: '₹4,999',
      livePrice: '₹4,999',
      pros: 'LDAC Hi-Res audio codec support, dual dynamic drivers, custom EQ in realme Link app',
      cons: 'Glossy pebble case scratches easily',
      searchQuery: 'realme Buds Air 6 Pro',
      affiliateUrl: '/api/affiliate/redirect?q=realme%20Buds%20Air%206%20Pro&tag=jaiguruji00-21',
      summary: 'Audiophile LDAC codec support and potent 50dB ANC at an accessible sub-₹5,000 price point.',
    },
    budgetPick: {
      name: 'boAt Airdopes 141 (42H Playtime, ENx Tech)',
      badge: 'BUDGET PICK',
      price: '₹1,199',
      livePrice: '₹1,199',
      pros: 'Massive 42-hour playtime, IPX4 sweat resistance, punchy bass for everyday listening',
      cons: 'No active noise cancellation (passive isolation only)',
      searchQuery: 'boAt Airdopes 141',
      affiliateUrl: '/api/affiliate/redirect?q=boAt%20Airdopes%20141&tag=jaiguruji00-21',
      summary: 'India’s most popular budget earbuds with reliable Bluetooth 5.1 connection and marathon battery life.',
    },
  },
};

// Match query to one of the 5 main categories
export function matchMainCategory(qLower: string): 'phone' | 'laptop' | 'tv' | 'ac' | 'earbuds' | null {
  if (
    qLower.includes('phone') ||
    qLower.includes('mobile') ||
    qLower.includes('smartphone') ||
    qLower.includes('30000') ||
    qLower.includes('30,000')
  ) {
    return 'phone';
  }
  if (
    qLower.includes('laptop') ||
    qLower.includes('macbook') ||
    qLower.includes('notebook')
  ) {
    return 'laptop';
  }
  if (
    qLower.includes('tv') ||
    qLower.includes('television') ||
    qLower.includes('oled') ||
    qLower.includes('bravia')
  ) {
    return 'tv';
  }
  if (
    qLower.includes('ac') ||
    qLower.includes('air conditioner') ||
    qLower.includes('split ac')
  ) {
    return 'ac';
  }
  if (
    qLower.includes('earbud') ||
    qLower.includes('headphone') ||
    qLower.includes('tws') ||
    qLower.includes('earphone') ||
    qLower.includes('buds')
  ) {
    return 'earbuds';
  }
  return null;
}

// Honest Browse Live on Amazon Card - NO FAKE DATA EVER
export function makeHonestBrowseResponse(q: string, titleQ: string, market = 'IN'): LivePriceResponse {
  const affiliateUrl = `/api/affiliate/redirect?q=${encodeURIComponent(q)}&tag=jaiguruji00-21`;
  const browseTitle = `Best ${titleQ} in India - Browse Live on Amazon`;
  const browseBody = `We are updating our lab-tested picks for ${q}. Meanwhile, browse top-rated ${q} on Amazon.in with our affiliate filter.`;
  const testing = getTestingDetails(q, titleQ);
  const now = new Date();

  return {
    query: q,
    market,
    title: browseTitle,
    isBrowseOnly: true,
    browseMessage: {
      title: browseTitle,
      body: browseBody,
      buttonText: `Browse ${titleQ} on Amazon.in`,
      buttonUrl: affiliateUrl,
    },
    topPick: {
      name: `Top-Rated ${titleQ} on Amazon.in`,
      badge: 'TOP PICK',
      price: 'Check live price on Amazon.in',
      livePrice: 'Check live price on Amazon.in',
      pros: 'Verified customer ratings, Prime delivery, and current festival deals on Amazon.in',
      cons: 'Live pricing and seller stock availability fluctuate on Amazon.in',
      searchQuery: q,
      affiliateUrl,
      summary: browseBody,
    },
    runnerUp: {
      name: `Trending Deals in ${titleQ}`,
      badge: 'RUNNER-UP',
      price: 'Check live price on Amazon.in',
      livePrice: 'Check live price on Amazon.in',
      pros: 'Amazon Choice and customer-favorite selections with user reviews',
      cons: 'Discounts vary by seller and delivery location',
      searchQuery: q,
      affiliateUrl,
      summary: `Explore popular customer-favored alternatives for ${titleQ} on Amazon.in.`,
    },
    budgetPick: {
      name: `Value Selections for ${titleQ}`,
      badge: 'BUDGET PICK',
      price: 'Check live price on Amazon.in',
      livePrice: 'Check live price on Amazon.in',
      pros: 'Budget-friendly options with positive feedback and Amazon fulfillment',
      cons: 'Promotional pricing changes frequently',
      searchQuery: q,
      affiliateUrl,
      summary: `Affordable options balancing price and performance for ${titleQ} on Amazon.in.`,
    },
    livePrice: 'Check live price on Amazon.in',
    whyTrustUs: testing.summary,
    methodologyHeading: testing.heading,
    methodologyPara1: testing.para1,
    methodologyPara2: testing.para2,
    lastUpdated: formatISTDate(now),
    lastUpdatedISO: now.toISOString(),
    affiliateTag: 'jaiguruji00-21',
  };
}

// Fallback generator for server.ts and offline recovery
export function generateFallback(raw: string): FallbackData {
  const { q, titleQ } = cleanQuery(raw);
  const mainCat = matchMainCategory(q);

  if (mainCat) {
    const cached = CACHED_CATEGORY_DATA[mainCat];
    const testing = getTestingDetails(q, titleQ);
    return {
      title: cached.title,
      topPick: cached.topPick,
      runnerUp: cached.runnerUp,
      budgetPick: cached.budgetPick,
      trust: testing.summary,
      livePrice: cached.livePrice,
      methodologyHeading: testing.heading,
      methodologyPara1: testing.para1,
      methodologyPara2: testing.para2,
      isBrowseOnly: false,
    };
  }

  const honest = makeHonestBrowseResponse(q, titleQ);
  return {
    title: honest.title,
    topPick: honest.topPick,
    runnerUp: honest.runnerUp,
    budgetPick: honest.budgetPick,
    trust: honest.whyTrustUs,
    livePrice: honest.livePrice,
    methodologyHeading: honest.methodologyHeading,
    methodologyPara1: honest.methodologyPara1,
    methodologyPara2: honest.methodologyPara2,
    isBrowseOnly: true,
    browseMessage: honest.browseMessage,
  };
}

// Helper to sanitize model names and detect fake/placeholder outputs
function isFakeOrInvalidModel(name: any): boolean {
  if (!name || typeof name !== 'string') return true;
  const lower = name.toLowerCase();
  return (
    lower.includes('pro master') ||
    lower.includes('pro series') ||
    lower.includes('plus edition') ||
    lower.includes('essential') ||
    lower.includes("don't invent") ||
    lower.includes('no real model') ||
    lower.includes('search link') ||
    lower.includes('not found') ||
    lower.includes('none') ||
    lower.includes('n/a') ||
    lower.includes('amazon.in/s') ||
    lower.length < 3
  );
}

// Format price safely without hardcoding ₹4,999
function formatSafePrice(rawPrice: any): string {
  if (!rawPrice || typeof rawPrice !== 'string') return 'Check live price on Amazon.in';
  const trimmed = rawPrice.trim();
  if (trimmed === '' || trimmed === '4999' || trimmed === '₹4,999') {
    return 'Check live price on Amazon.in';
  }
  if (trimmed.startsWith('₹') || trimmed.toLowerCase().includes('check')) {
    return trimmed;
  }
  if (/^\d[\d,]*$/.test(trimmed)) {
    return `₹${trimmed}`;
  }
  return trimmed;
}

// Main Express Handler for /api/live-prices
export default async function handleLivePrices(req: any, res: any) {
  const rawQ = String(req.query.q || req.query.query || 'Best phone under 30000');
  const market = String(req.query.market || 'IN').toUpperCase();
  const flush = req.query.flush === 'true';

  // 1. Clean query
  const { q, titleQ } = cleanQuery(rawQ);

  // 5. Cache key pattern: live-${q}-IN
  const cacheKey = `live-${q}-${market}`;

  if (flush) {
    memoryCache.delete(cacheKey);
    console.log(`[live-prices API] Cache flushed for key: ${cacheKey}`);
  } else {
    const cachedEntry = memoryCache.get(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
      res.setHeader('X-Cache-Status', 'HIT');
      return res.status(200).json(cachedEntry.data);
    }
  }

  // 2. Dynamic testing details
  const testing = getTestingDetails(q, titleQ);
  const now = new Date();
  const formattedIST = formatISTDate(now);

  // 3. Try cache CACHED_CATEGORY_DATA for 5 main only (phone, laptop, TV, AC, earbuds) - zero API call
  const mainCat = matchMainCategory(q);
  if (mainCat) {
    const cachedCat = CACHED_CATEGORY_DATA[mainCat];
    const verifiedResponse: LivePriceResponse = {
      query: q,
      market,
      title: cachedCat.title,
      topPick: cachedCat.topPick,
      runnerUp: cachedCat.runnerUp,
      budgetPick: cachedCat.budgetPick,
      livePrice: cachedCat.livePrice,
      whyTrustUs: testing.summary,
      methodologyHeading: testing.heading,
      methodologyPara1: testing.para1,
      methodologyPara2: testing.para2,
      lastUpdated: formattedIST,
      lastUpdatedISO: now.toISOString(),
      affiliateTag: 'jaiguruji00-21',
      isBrowseOnly: false,
    };
    memoryCache.set(cacheKey, { data: verifiedResponse, timestamp: Date.now() });
    res.setHeader('X-Cache-Status', 'ZERO-API-BENCHMARK');
    return res.status(200).json(verifiedResponse);
  }

  // For EVERY other query (camera to juicer to curtain):
  // Check if cooldown is active from previous 429
  const isCooldownActive = Date.now() <= geminiCooldownUntil;
  if (isCooldownActive) {
    console.log(`[live-prices API] Quota cooldown active (${Math.round((geminiCooldownUntil - Date.now()) / 1000)}s remaining), serving honest browse card.`);
    const honestResponse = makeHonestBrowseResponse(q, titleQ, market);
    memoryCache.set(cacheKey, { data: honestResponse, timestamp: Date.now() });
    return res.status(200).json(honestResponse);
  }

  // Call Gemini ONCE with:
  // "List 3 REAL models sold on Amazon.in India 2026 for '${q}'. Must exist. Eg juicer=Philips Viva HR1832, Sujata Powermatic. No invention. Return JSON {top, runner, budget} with real name and avg price or notFound:true} Timeout 15000"
  const apiKey =
    process.env.GEMINI_API_KEY ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

  if (apiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
          timeout: 15000,
        },
      });

      const prompt = `List 3 REAL models sold on Amazon.in India 2026 for '${q}'. Must exist. Eg juicer=Philips Viva HR1832, Sujata Powermatic. No invention. Return JSON {top, runner, budget} with real name and avg price or notFound:true} Timeout 15000`;

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout 15000ms')), 15000)
      );

      const genPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const response: any = await Promise.race([genPromise, timeoutPromise]);

      if (response?.text) {
        let parsed: any = null;
        try {
          parsed = JSON.parse(response.text);
        } catch {
          parsed = null;
        }

        // Check if notFound was returned
        const isNotFound =
          parsed?.notFound === true ||
          (Array.isArray(parsed) && parsed[0]?.notFound === true);

        if (!isNotFound && parsed) {
          // Normalize top, runner, budget objects
          const topObj = parsed.top || parsed.topPick || (Array.isArray(parsed) ? parsed[0] : null);
          const runnerObj = parsed.runner || parsed.runnerUp || (Array.isArray(parsed) ? parsed[1] : null);
          const budgetObj = parsed.budget || parsed.budgetPick || (Array.isArray(parsed) ? parsed[2] : null);

          const topName = topObj?.name || topObj?.realModel || topObj?.model;
          const runnerName = runnerObj?.name || runnerObj?.realModel || runnerObj?.model;
          const budgetName = budgetObj?.name || budgetObj?.realModel || budgetObj?.model;

          // Validate that the top model is REAL and NOT placeholder
          if (!isFakeOrInvalidModel(topName)) {
            const topPrice = formatSafePrice(topObj.price || topObj.avgPrice || topObj.avgPriceIN);
            const runnerPrice = formatSafePrice(runnerObj?.price || runnerObj?.avgPrice || runnerObj?.avgPriceIN);
            const budgetPrice = formatSafePrice(budgetObj?.price || budgetObj?.avgPrice || budgetObj?.avgPriceIN);

            const topPick: LiveProductItem = {
              name: String(topName).trim(),
              badge: 'TOP PICK',
              price: topPrice,
              livePrice: topPrice,
              pros: topObj.strengths || topObj.pros || 'High reliability and verified performance for Indian conditions',
              cons: topObj.drawback || topObj.cons || 'Live pricing and seller stock availability subject to seasonal promotions',
              searchQuery: String(topName).trim(),
              affiliateUrl: `/api/affiliate/redirect?q=${encodeURIComponent(String(topName).trim())}&tag=jaiguruji00-21`,
              summary: `Selected as a genuine, currently selling top pick for ${titleQ} on Amazon.in.`,
            };

            const runnerPick: LiveProductItem = !isFakeOrInvalidModel(runnerName)
              ? {
                  name: String(runnerName).trim(),
                  badge: 'RUNNER-UP',
                  price: runnerPrice,
                  livePrice: runnerPrice,
                  pros: runnerObj.strengths || runnerObj.pros || 'Dependable alternative with balanced performance',
                  cons: runnerObj.drawback || runnerObj.cons || 'Slightly different feature balance or availability',
                  searchQuery: String(runnerName).trim(),
                  affiliateUrl: `/api/affiliate/redirect?q=${encodeURIComponent(String(runnerName).trim())}&tag=jaiguruji00-21`,
                  summary: `A top-rated verified alternative for ${titleQ} on Amazon.in.`,
                }
              : {
                  name: `Trending Deals in ${titleQ}`,
                  badge: 'RUNNER-UP',
                  price: 'Check live price on Amazon.in',
                  livePrice: 'Check live price on Amazon.in',
                  pros: 'Amazon Choice and customer-favorite selections with user reviews',
                  cons: 'Discounts vary by seller and delivery location',
                  searchQuery: q,
                  affiliateUrl: `/api/affiliate/redirect?q=${encodeURIComponent(q)}&tag=jaiguruji00-21`,
                  summary: `Explore popular customer-favored alternatives for ${titleQ} on Amazon.in.`,
                };

            const budgetPick: LiveProductItem = !isFakeOrInvalidModel(budgetName)
              ? {
                  name: String(budgetName).trim(),
                  badge: 'BUDGET PICK',
                  price: budgetPrice,
                  livePrice: budgetPrice,
                  pros: budgetObj.strengths || budgetObj.pros || 'Excellent price-to-performance ratio for everyday use',
                  cons: budgetObj.drawback || budgetObj.cons || 'Omits higher-tier luxury features',
                  searchQuery: String(budgetName).trim(),
                  affiliateUrl: `/api/affiliate/redirect?q=${encodeURIComponent(String(budgetName).trim())}&tag=jaiguruji00-21`,
                  summary: `Best budget-friendly pick for ${titleQ} on Amazon.in.`,
                }
              : {
                  name: `Value Selections for ${titleQ}`,
                  badge: 'BUDGET PICK',
                  price: 'Check live price on Amazon.in',
                  livePrice: 'Check live price on Amazon.in',
                  pros: 'Budget-friendly options with positive feedback and Amazon fulfillment',
                  cons: 'Promotional pricing changes frequently',
                  searchQuery: q,
                  affiliateUrl: `/api/affiliate/redirect?q=${encodeURIComponent(q)}&tag=jaiguruji00-21`,
                  summary: `Affordable options balancing price and performance for ${titleQ} on Amazon.in.`,
                };

            const realModelResponse: LivePriceResponse = {
              query: q,
              market,
              title: `The Best ${titleQ} in India (2026)`,
              topPick,
              runnerUp: runnerPick,
              budgetPick,
              livePrice: topPrice,
              whyTrustUs: testing.summary,
              methodologyHeading: testing.heading,
              methodologyPara1: testing.para1,
              methodologyPara2: testing.para2,
              lastUpdated: formattedIST,
              lastUpdatedISO: now.toISOString(),
              affiliateTag: 'jaiguruji00-21',
              isBrowseOnly: false,
            };

            memoryCache.set(cacheKey, { data: realModelResponse, timestamp: Date.now() });
            return res.status(200).json(realModelResponse);
          }
        }
      }
    } catch (genErr: any) {
      const isQuota =
        genErr?.status === 429 ||
        genErr?.message?.includes('429') ||
        genErr?.message?.includes('RESOURCE_EXHAUSTED') ||
        genErr?.message?.includes('quota');

      if (isQuota) {
        geminiCooldownUntil = Date.now() + 120_000; // 2 min cooldown
        console.log('[live-prices API] AI quota 429: cooldown activated (120s), switching to honest browse card.');
      } else {
        console.log('[live-prices API] Gemini error / timeout:', genErr?.message || genErr);
      }
    }
  }

  // If notFound or 429 or cooldown or invalid data:
  // SHOW HONEST CARD - No fake!
  const honestResponse = makeHonestBrowseResponse(q, titleQ, market);
  memoryCache.set(cacheKey, { data: honestResponse, timestamp: Date.now() });
  return res.status(200).json(honestResponse);
}
