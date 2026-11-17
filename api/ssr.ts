import fs from "fs";
import path from "path";

interface ReviewRecord {
  slug: string;
  name: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  verdict: string;
  summary: string;
  pros: string[];
  cons: string[];
  specs: Record<string, string>;
  amazonAsin: string;
  priceUSD: number;
  lastUpdated: string;
  faqList?: Array<{ question: string; answer: string }>;
}

interface PolicySsrContent {
  heading: string;
  subtitle: string;
  schemaType: "WebPage" | "AboutPage" | "ContactPage";
  sections: Array<{ title: string; body: string }>;
}

interface CompareMeta {
  slug: string;
  title: string;
  description: string;
  slugA: string;
  slugB: string;
}

const REVIEWS: ReviewRecord[] = [
  {
    slug: "apple-iphone-16-pro-max",
    name: "Apple iPhone 16 Pro Max",
    category: "Smartphones",
    brand: "Apple",
    rating: 4.8,
    reviewCount: 128,
    verdict: "Recommended overall pick. Exceptional titanium build, class-leading battery longevity, and unmatched ProRes video recording capability.",
    summary: "The definitive flagship smartphone for creators and power users. With the A18 Pro silicon, battery endurance stretches past 28 hours of mixed workloads.",
    pros: ["Longest smartphone battery life tested", "Class-leading camera control and video codec support", "Bright 2,000-nit outdoor display"],
    cons: ["Heavy in pocket compared to base model", "25W wireless charging is slower than Chinese competitors"],
    specs: {
      Display: "6.9-inch Super Retina XDR OLED",
      Processor: "Apple A18 Pro 3nm",
      Battery: "4685 mAh (Up to 33 hours video playback)",
      Storage: "256GB / 512GB / 1TB",
      Weight: "227 grams"
    },
    amazonAsin: "B0DGJ9M8L4",
    priceUSD: 1199,
    lastUpdated: "2025-03-01",
    faqList: [
      {
        question: "Is the iPhone 16 Pro Max worth upgrading from the iPhone 14 Pro?",
        answer: "Yes, the shift to USB-C 3.0, lighter titanium chassis, and substantial +4 hour real-world battery leap makes it a meaningful upgrade."
      },
      {
        question: "Does the camera capture 4K 120fps video?",
        answer: "Yes, 4K at 120 fps Dolby Vision is supported in both standard and ProRes formats directly to external SSDs."
      }
    ]
  },
  {
    slug: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Audio",
    brand: "Sony",
    rating: 4.7,
    reviewCount: 94,
    verdict: "Recommended top audio pick. Industry-leading active noise cancellation paired with refined acoustic fidelity and lightweight ergonomics.",
    summary: "Sony WH-1000XM5 remains the premier choice for travelers, commuters, and deep-focus professionals needing world-class ambient attenuation.",
    pros: ["Best-in-class high-frequency noise cancellation", "Ultra-comfortable lightweight headband", "Crystal clear 8-mic array call quality"],
    cons: ["Non-folding headband takes more bag volume", "No water resistance rating"],
    specs: {
      Type: "Over-Ear Wireless ANC",
      BatteryLife: "30 hours with ANC on",
      Drivers: "30mm carbon fiber composite",
      Bluetooth: "5.2 with LDAC, AAC, SBC",
      Weight: "250 grams"
    },
    amazonAsin: "B09XS7JWHH",
    priceUSD: 398,
    lastUpdated: "2025-02-28",
    faqList: [
      {
        question: "How does the WH-1000XM5 compare to the Bose QuietComfort Ultra?",
        answer: "Sony offers stronger parametric EQ customizability and superior microphone wind rejection, while Bose offers slightly deeper bass."
      }
    ]
  },
  {
    slug: "macbook-pro-16-m3-max",
    name: "Apple MacBook Pro 16-inch (M3 Max)",
    category: "Laptops",
    brand: "Apple",
    rating: 4.9,
    reviewCount: 162,
    verdict: "Recommended workstation pick. Unmatched power efficiency that sustains full computational throughput on battery power.",
    summary: "Engineered for 8K video timelines, 3D render pipelines, and massive local LLM fine-tuning without thermal throttling or loud fan noise.",
    pros: ["Full performance maintained on unplugged battery", "Stunning Liquid Retina XDR Mini-LED screen", "Class-topping trackpad and keyboard"],
    cons: ["Premium price point", "RAM and storage not user-upgradeable"],
    specs: {
      Display: "16.2-inch Liquid Retina XDR (3456 x 2234)",
      Processor: "Apple M3 Max 16-core CPU, 40-core GPU",
      UnifiedMemory: "48GB unified (up to 128GB)",
      Weight: "2.16 kg"
    },
    amazonAsin: "B0CM5B1W62",
    priceUSD: 3499,
    lastUpdated: "2025-03-01"
  },
  {
    slug: "dell-xps-15-oled",
    name: "Dell XPS 15 OLED Laptop",
    category: "Laptops",
    brand: "Dell",
    rating: 4.6,
    reviewCount: 88,
    verdict: "Recommended Windows creator pick. Vibrant OLED touchscreen display combined with CNC aluminum craftsmanship.",
    summary: "A sleek powerhouse designed for graphic designers and photographers who prioritize color accuracy and tactile build quality.",
    pros: ["Gorgeous 3.5K OLED touchscreen", "Slim bezels with 92.9% screen-to-body ratio", "Precision glass trackpad"],
    cons: ["Gets warm under sustained 3D gaming", "720p webcam is mediocre"],
    specs: {
      Display: "15.6-inch 3.5K OLED 400-nit",
      Processor: "Intel Core i7-13700H",
      Graphics: "NVIDIA GeForce RTX 4060 8GB",
      Weight: "1.92 kg"
    },
    amazonAsin: "B0C9X2PQ81",
    priceUSD: 1899,
    lastUpdated: "2025-01-20"
  },
  {
    slug: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    category: "Smartphones",
    brand: "Samsung",
    rating: 4.7,
    reviewCount: 145,
    verdict: "Recommended Android flagship pick. The ultimate productivity device with integrated S-Pen, anti-reflective Gorilla Armor, and 7 years of OS updates.",
    summary: "Samsung's most refined smartphone yet, featuring a flat display panel, glare-free optics, and Snapdragon 8 Gen 3 efficiency.",
    pros: ["Gorilla Armor cuts glare by 75%", "Built-in S-Pen stylus versatility", "7 years of guaranteed security patches"],
    cons: ["Squarish boxy corners can press against palms", "AI photo edits occasionally look artificial"],
    specs: {
      Display: "6.8-inch Dynamic AMOLED 2X 120Hz 2600-nit",
      Processor: "Qualcomm Snapdragon 8 Gen 3 for Galaxy",
      Battery: "5000 mAh with 45W wired charging",
      Weight: "232 grams"
    },
    amazonAsin: "B0CS57LPM7",
    priceUSD: 1299,
    lastUpdated: "2025-03-01"
  },
  {
    slug: "best-oneplus-nord-ce4-review-2026",
    name: "OnePlus Nord CE4 5G",
    category: "Smartphones",
    brand: "OnePlus",
    rating: 4.6,
    reviewCount: 312,
    verdict: "Best mid-range smartphone under Rs 25,000 / $300. Incredible 100W SuperVOOC fast charging, smooth 120Hz AMOLED display, and reliable Snapdragon 7 Gen 3 performance.",
    summary: "The definitive mid-range value champion featuring 100W fast charging (1-100% in 29 minutes), massive 5500 mAh battery, clean OxygenOS, and Sony LYT-600 OIS camera.",
    pros: ["Lightning-fast 100W SuperVOOC charging with 5500 mAh battery", "Fluid 120Hz FHD+ AMOLED display with Aqua Touch", "Dependable Snapdragon 7 Gen 3 gaming and daily efficiency"],
    cons: ["No ultra-wide video 4K recording", "Plastic frame finish"],
    specs: {
      Display: "6.7-inch Fluid AMOLED 120Hz HDR10+",
      Processor: "Qualcomm Snapdragon 7 Gen 3 (4nm)",
      Battery: "5500 mAh with 100W SuperVOOC Charger included",
      Camera: "50MP Sony LYT-600 with OIS + 8MP Ultra-Wide",
      Storage: "8GB RAM + 128GB/256GB UFS 3.1 (Expandable up to 1TB)",
      ChargingTime: "29 minutes (0 to 100%)",
      Weight: "186 grams"
    },
    amazonAsin: "B0CX22P27G",
    priceUSD: 299,
    lastUpdated: "2025-03-01",
    faqList: [
      {
        question: "Does OnePlus Nord CE4 come with the 100W charger in the box?",
        answer: "Yes, OnePlus includes the 100W SuperVOOC power adapter and signature red cable in the retail box."
      },
      {
        question: "Is OnePlus Nord CE4 good for BGMI / PUBG gaming?",
        answer: "Yes, the Snapdragon 7 Gen 3 comfortably sustains 60 FPS in BGMI and Call of Duty Mobile with low thermal throttling."
      },
      {
        question: "OnePlus Nord CE4 5G vs Nothing Phone 2a: Which is better?",
        answer: "Nord CE4 charges in 29 min (100W) with 5500 mAh battery; Nothing Phone 2a offers unique Glyph design and symmetric bezels."
      }
    ]
  },
  {
    slug: "google-pixel-8a",
    name: "Google Pixel 8a",
    category: "Smartphones",
    brand: "Google",
    rating: 4.5,
    reviewCount: 178,
    verdict: "Best compact camera phone under $500. Flagship Google Tensor G3 silicon, 7 years of Android feature drops, and unmatched computational photography.",
    summary: "The Google Pixel 8a brings flagship Pixel 8 camera magic and AI capabilities down to an accessible mid-range price point with an upgraded 120Hz Actua display.",
    pros: ["Flagship camera tuning and Best Take / Magic Editor features", "7 full years of Android OS and security updates", "Bright 120Hz OLED screen and IP67 water resistance"],
    cons: ["18W charging takes over 90 minutes to full charge", "Bezels are noticeably thicker than flagship Pixels"],
    specs: {
      Display: "6.1-inch Actua OLED 120Hz (2000 nits peak)",
      Processor: "Google Tensor G3 (4nm) with Titan M2 security",
      Camera: "64MP Main (f/1.89 OIS) + 13MP Ultra-Wide",
      Battery: "4492 mAh with 18W wired charging",
      Software: "Android 14 with 7 years of guaranteed updates",
      Weight: "188 grams"
    },
    amazonAsin: "B0CZ2Y5CFL",
    priceUSD: 499,
    lastUpdated: "2025-02-25",
    faqList: [
      {
        question: "Does Google Pixel 8a have 7 years of OS updates?",
        answer: "Yes, Google guarantees full OS upgrades, feature drops, and security patches until 2031."
      },
      {
        question: "Does Pixel 8a come with a charger in the box?",
        answer: "No, Google only includes a USB-C to USB-C cable and Quick Switch Adapter; the charging brick must be bought separately."
      }
    ]
  },
  {
    slug: "nothing-phone-2a",
    name: "Nothing Phone (2a)",
    category: "Smartphones",
    brand: "Nothing",
    rating: 4.4,
    reviewCount: 220,
    verdict: "Most distinctive design champion. Clean bloatware-free Nothing OS, functional Glyph interface, and symmetrical display bezels.",
    summary: "Nothing Phone (2a) delivers premium design aesthetic and clean software at a budget-friendly price, powered by custom MediaTek Dimensity 7200 Pro silicon.",
    pros: ["Unique transparent industrial design with LED Glyph lights", "Symmetrical slim bezels with 120Hz AMOLED", "Clean Nothing OS without third-party spam or ads"],
    cons: ["Plastic back panel attracts fine scratches without a case", "No wireless charging"],
    specs: {
      Display: "6.7-inch Flexible AMOLED 120Hz (1300 nits peak)",
      Processor: "MediaTek Dimensity 7200 Pro (4nm)",
      Battery: "5000 mAh with 45W charging",
      Camera: "50MP Main OIS + 50MP Ultra-Wide",
      Weight: "190 grams"
    },
    amazonAsin: "B0CWLK5L48",
    priceUSD: 349,
    lastUpdated: "2025-02-20",
    faqList: [
      {
        question: "Is the Nothing Phone 2a back made of glass or plastic?",
        answer: "It uses a durable transparent polycarbonate (plastic) back panel designed with 90-degree curvature."
      }
    ]
  },
  {
    slug: "bose-quietcomfort-ultra",
    name: "Bose QuietComfort Ultra Wireless Headphones",
    category: "Audio",
    brand: "Bose",
    rating: 4.8,
    reviewCount: 110,
    verdict: "Top travel pick for pure noise isolation. Superb folding design, Immersive Audio spatial sound, and plush protein leather earcups.",
    summary: "The Bose QC Ultra delivers unmatched comfort and deep bass isolation for frequent flyers, outperforming competitors in cancelling chaotic airport and cafe noise.",
    pros: ["Class-leading low-frequency noise cancellation", "Folds into a compact travel case", "Exceptionally comfortable for 8+ hour flights"],
    cons: ["Battery life maxes out at 24 hours (18 with Immersive Audio)", "Custom EQ in Bose Music app is somewhat basic"],
    specs: {
      Type: "Over-Ear Wireless ANC",
      BatteryLife: "Up to 24 hours (18 hours with Immersive Audio)",
      SpatialAudio: "Bose Immersive Audio with head tracking",
      Bluetooth: "5.3 with Snapdragon Sound (aptX Adaptive)",
      Weight: "253 grams"
    },
    amazonAsin: "B0CCZ26B5V",
    priceUSD: 429,
    lastUpdated: "2025-02-12",
    faqList: [
      {
        question: "Bose QC Ultra vs Sony WH-1000XM5: Which has better noise cancellation?",
        answer: "Bose QC Ultra slightly edges out Sony for low-frequency jet drone and folding portability; Sony XM5 has better battery life (30h vs 24h) and mic call quality."
      }
    ]
  },
  {
    slug: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2",
    category: "Wearables",
    brand: "Apple",
    rating: 4.9,
    reviewCount: 95,
    verdict: "Definitive adventure and endurance smartwatch. 3,000-nit sapphire screen, precision dual-frequency GPS, and 72-hour low power endurance.",
    summary: "Built for marathons, scuba diving, and backcountry trails with aerospace titanium chassis and rugged multi-day battery capability.",
    pros: ["Super bright 3,000-nit outdoor display", "Dual-frequency L1+L5 GPS accuracy", "S9 SiP with Double Tap gesture control"],
    cons: ["Large 49mm case can look bulky on smaller wrists", "Premium $799 price point"],
    specs: {
      Case: "49mm Aerospace-grade Titanium",
      Display: "Always-On Retina OLED (3000 nits)",
      Battery: "Up to 36 hours (72 hours Low Power Mode)",
      WaterResistance: "100m water resistant / 40m recreational dive",
      Weight: "61.4 grams"
    },
    amazonAsin: "B0CHX373Z5",
    priceUSD: 799,
    lastUpdated: "2025-03-01",
    faqList: [
      {
        question: "Can I use Apple Watch Ultra 2 with an Android phone?",
        answer: "No, Apple Watch Ultra 2 strictly requires an Apple iPhone running iOS 17 or later for initial setup and daily synchronization."
      }
    ]
  },
  {
    slug: "dyson-v15-detect",
    name: "Dyson V15 Detect Cordless Vacuum",
    category: "Smart Home",
    brand: "Dyson",
    rating: 4.7,
    reviewCount: 84,
    verdict: "Most powerful intelligent cordless cleaner. Green laser reveals invisible floor dust, and acoustic piezo sensor adjusts suction automatically.",
    summary: "Dyson V15 Detect combines 230 Air Watts of cyclone suction with microscopic particulate counting on an intelligent LCD screen.",
    pros: ["Fluffy Optic laser reveals microscopic dust invisible to naked eye", "Automatic suction boost based on dust volume", "Whole-machine HEPA filtration traps 99.99% particles"],
    cons: ["Trigger button must be held continuously", "Heavy when held overhead for ceiling dust"],
    specs: {
      SuctionPower: "230 Air Watts",
      RunTime: "Up to 60 minutes",
      BinVolume: "0.77 Liters",
      Filtration: "Whole-machine HEPA filtration",
      Weight: "3.1 kg"
    },
    amazonAsin: "B09257CST7",
    priceUSD: 749,
    lastUpdated: "2025-02-18",
    faqList: [
      {
        question: "How long does the battery last on the Dyson V15 Detect in Boost mode?",
        answer: "In maximum Boost mode it runs for approximately 10-12 minutes; in Eco and Auto modes it achieves 45 to 60 minutes."
      }
    ]
  }
];

const COMPARES: CompareMeta[] = [
  {
    slug: "iphone-16-pro-max-vs-galaxy-s24-ultra",
    title: "iPhone 16 Pro Max vs Galaxy S24 Ultra: Tested Flagship Comparison",
    description: "Direct camera shootout, battery endurance comparison, and display benchmark analysis between Apple and Samsung top flagships on Amazon.",
    slugA: "apple-iphone-16-pro-max",
    slugB: "samsung-galaxy-s24-ultra"
  },
  {
    slug: "oneplus-nord-ce4-vs-nothing-phone-2a",
    title: "OnePlus Nord CE4 5G vs Nothing Phone 2a: Mid-Range Showdown",
    description: "100W charging vs 45W, Snapdragon 7 Gen 3 vs Dimensity 7200 Pro, camera comparison, and Amazon value verdict.",
    slugA: "best-oneplus-nord-ce4-review-2026",
    slugB: "nothing-phone-2a"
  },
  {
    slug: "sony-wh-1000xm5-vs-bose-qc-ultra",
    title: "Sony WH-1000XM5 vs Bose QC Ultra: Noise Cancelling Shootout",
    description: "Flight cabin silence test, 30h vs 24h battery, mic speech clarity, and Amazon pricing analysis.",
    slugA: "sony-wh-1000xm5",
    slugB: "bose-quietcomfort-ultra"
  },
  {
    slug: "macbook-pro-m3-vs-dell-xps-15",
    title: "MacBook Pro 16 M3 Max vs Dell XPS 15 OLED: Creator Workstation Battle",
    description: "Unplugged battery rendering benchmarks, 3.5K OLED vs Liquid Retina XDR display accuracy, and thermal throttling analysis.",
    slugA: "macbook-pro-16-m3-max",
    slugB: "dell-xps-15-oled"
  }
];

const POLICY_PAGES: Record<string, { title: string; description: string; policy: PolicySsrContent }> = {
  "/about": {
    title: "About Our Hardware Testing Lab | productreviews.review",
    description: "Learn how productreviews.review independently tests consumer hardware, audits Amazon price histories, and maintains 100% editorial independence.",
    policy: {
      heading: "About productreviews.review — Independent Hardware Testing Lab",
      subtitle: "Founded by technology researcher Alok Mohan Sharma (Delhi, India) with testing contributors in Bengaluru and San Francisco.",
      schemaType: "AboutPage",
      sections: [
        {
          title: "Our Mission: Truth in Consumer Technology",
          body: "The internet is saturated with sponsored influencer hype, fake marketplace ratings, and AI-generated review spam. productreviews.review provides consumers with data-backed hardware evaluations, 200-nit battery depletion tests, thermal imaging under load, and verified lowest-price discovery across 14 Amazon marketplaces."
        },
        {
          title: "Rigorous Lab Benchmarks & Retail Units",
          body: "Every smartphone, laptop, audio device, and home appliance evaluated by our team undergoes standardized battery cycles, FLIR thermal scans, acoustic decibel sweeps, and display calibration checks using retail units."
        },
        {
          title: "Contact & Publisher Ownership",
          body: "Published by Alok Mohan Sharma. For editorial inquiries, review corrections, or press verification, email alokmohansharma.delhi@gmail.com."
        }
      ]
    }
  },
  "/editorial-policy": {
    title: "Editorial Policy & Testing Methodology | productreviews.review",
    description: "Read our editorial independence guarantee, hardware acquisition standards, 200-nit battery loop protocol, and quarterly fact-checking policy.",
    policy: {
      heading: "Editorial Policy, Testing Methodology & Fact-Checking",
      subtitle: "Official Editorial Governance · Verified March 2025",
      schemaType: "WebPage",
      sections: [
        {
          title: "100% Editorial Independence Guarantee",
          body: "Manufacturers, brands, and PR agencies never receive a preview of our reviews before publication, cannot pay to alter a Flash Score, and have zero influence over head-to-head comparison verdicts."
        },
        {
          title: "How We Acquire & Test Hardware",
          body: "To ensure our test results match everyday retail ownership, our team acquires evaluation units directly from retail channels (primarily Amazon US and Amazon India). Devices are tested via standardized 200-nit Wi-Fi/5G battery loops, wall-wattage charging telemetry, FLIR surface thermals, and multi-frequency acoustic sweeps."
        },
        {
          title: "Fact-Checking & Corrections Policy",
          body: "Our editorial team audits published reviews quarterly for firmware updates, regional price changes, and silent hardware revisions. Readers can report factual discrepancies directly to alokmohansharma.delhi@gmail.com for review within 24–48 business hours."
        }
      ]
    }
  },
  "/contact": {
    title: "Contact Us & Editorial Support | productreviews.review",
    description: "Contact the productreviews.review editorial board for hardware review questions, factual corrections, privacy requests, or DMCA inquiries.",
    policy: {
      heading: "Contact productreviews.review Editorial Support",
      subtitle: "Direct Publisher Contact · Response within 24–48 business hours",
      schemaType: "ContactPage",
      sections: [
        {
          title: "Primary Editorial & Publisher Email",
          body: "Reach Publisher Alok Mohan Sharma and the editorial review team directly at alokmohansharma.delhi@gmail.com (Timezone: UTC+05:30 IST)."
        },
        {
          title: "What You Can Contact Us About",
          body: "We welcome reader feedback, regional Amazon price discrepancy reports, hardware testing methodology questions, GDPR/CCPA privacy requests, and formal correction notices."
        }
      ]
    }
  },
  "/privacy": {
    title: "Privacy Policy & Cookie Disclosure | productreviews.review",
    description: "Official Privacy Policy detailing Google AdSense cookies, Amazon Associates affiliate tracking, log files, and GDPR/CCPA user privacy rights.",
    policy: {
      heading: "Privacy Policy & Cookie Disclosure",
      subtitle: "Applicable to https://productreviews.review · GDPR, CCPA & Google AdSense Compliant",
      schemaType: "WebPage",
      sections: [
        {
          title: "Overview & Privacy Commitment",
          body: "At productreviews.review, visitor privacy is paramount. This policy explains what minimal technical data is processed, how Google AdSense advertising cookies operate, and how visitors can manage consent or request deletion."
        },
        {
          title: "Google AdSense & Third-Party Advertising Cookies",
          body: "Google serves ads on productreviews.review using advertising cookies to display relevant promotions based on prior site visits. Visitors can opt out of personalized advertising anytime via Google Ads Settings (https://www.google.com/settings/ads) or aboutads.info."
        },
        {
          title: "Amazon Associates & Affiliate Cookies",
          body: "When you click an outbound product link to Amazon (US, IN, UK, DE, FR, ES, IT, CA, JP, AU, BR, MX, NL, SG), Amazon places temporary referral cookies in accordance with Amazon's Operating Agreement without sharing personal identity with productreviews.review."
        },
        {
          title: "GDPR & CCPA Privacy Rights",
          body: "Visitors have the right to request access, correction, or erasure of personal data under GDPR and CCPA. Submit privacy requests to alokmohansharma.delhi@gmail.com."
        }
      ]
    }
  },
  "/terms": {
    title: "Terms of Service | productreviews.review",
    description: "Terms of Service governing access to hardware reviews, benchmark scores, interactive calculators, and affiliate disclosures on productreviews.review.",
    policy: {
      heading: "Terms of Service",
      subtitle: "Governing use of https://productreviews.review",
      schemaType: "WebPage",
      sections: [
        {
          title: "1. Agreement to Terms",
          body: "By accessing or using productreviews.review, you agree to comply with these Terms of Service and applicable laws."
        },
        {
          title: "2. Informational Purpose & Live Retailer Pricing",
          body: "All hardware benchmarks, Flash Scores, interactive TCO calculators, and editorial verdicts are provided for informational purchasing guidance. Retail prices, stock availability, and seller warranties fluctuate on Amazon and must be verified at checkout."
        },
        {
          title: "3. Intellectual Property & Limitation of Liability",
          body: "Original review text, score methodologies, and interactive tools are protected by copyright. productreviews.review is not liable for indirect damages arising from external retailer transactions."
        }
      ]
    }
  },
  "/affiliate-disclosure": {
    title: "Amazon Affiliate Disclosure | productreviews.review",
    description: "FTC & Amazon Associates Operating Agreement disclosure explaining how productreviews.review earns qualifying commissions with zero editorial bias.",
    policy: {
      heading: "Amazon Affiliate & Commission Disclosure",
      subtitle: "As an Amazon Associate, productreviews.review earns from qualifying purchases.",
      schemaType: "WebPage",
      sections: [
        {
          title: "Amazon Associates Operating Agreement Disclosure",
          body: "productreviews.review participates in the Amazon Services LLC Associates Program across Amazon.com, Amazon.in, Amazon.co.uk, Amazon.de, Amazon.ca, Amazon.fr, Amazon.es, Amazon.it, Amazon.co.jp, Amazon.com.au, Amazon.com.br, Amazon.com.mx, Amazon.nl, and Amazon.sg."
        },
        {
          title: "Zero Influence on Editorial Scores",
          body: "Our editorial board maintains strict separation between testing outcomes and affiliate commissions. We never accept payment to inflate scores, and clicking an Amazon link costs shoppers zero extra money."
        }
      ]
    }
  }
};

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

let cachedRemoteIndexHtml: string | null = null;

async function loadBaseHtml(req: any): Promise<string> {
  const distPath = path.join(process.cwd(), "dist", "index.html");
  if (fs.existsSync(distPath)) {
    return fs.readFileSync(distPath, "utf-8");
  }

  const rootIndexPath = path.join(process.cwd(), "index.html");
  if (fs.existsSync(rootIndexPath)) {
    return fs.readFileSync(rootIndexPath, "utf-8");
  }

  if (cachedRemoteIndexHtml) {
    return cachedRemoteIndexHtml;
  }

  try {
    const host = String(req.headers?.host || "productreviews.review").split(",")[0].trim();
    const rawProto = String(req.headers?.["x-forwarded-proto"] || "https").split(",")[0].trim();
    const proto = rawProto === "http" ? "http" : "https";
    const resp = await fetch(`${proto}://${host}/index.html`, { signal: AbortSignal.timeout(3000) });
    if (resp.ok) {
      const text = await resp.text();
      if (text.includes("<div id=\"root\">")) {
        cachedRemoteIndexHtml = text;
        return text;
      }
    }
  } catch {}

  return `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>productreviews.review — Tested Tech & AI Shopping Verdicts</title>
    <meta name="description" content="Independent hardware testing, benchmark evidence, and verified lowest Amazon prices." />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://productreviews.review/" />
    <meta property="og:title" content="productreviews.review" />
    <meta property="og:description" content="Independent hardware testing, benchmark evidence, and verified lowest Amazon prices." />
    <meta property="og:url" content="https://productreviews.review/" />
    <meta name="twitter:title" content="productreviews.review" />
    <meta name="twitter:description" content="Independent hardware testing, benchmark evidence, and verified lowest Amazon prices." />
    <meta name="twitter:url" content="https://productreviews.review/" />
  </head>
  <body class="bg-[#09090b] text-zinc-100 min-h-screen">
    <div id="root"></div>
  </body>
</html>`;
}

function getReview(slug: string): ReviewRecord | undefined {
  if (slug === "oneplus-nord-ce4") return REVIEWS.find((r) => r.slug === "best-oneplus-nord-ce4-review-2026");
  return REVIEWS.find((r) => r.slug === slug);
}

function applyHeadMeta(baseHtml: string, title: string, description: string, canonicalUrl: string): string {
  return baseHtml
    .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`)
    .replace(/<meta name="twitter:url" content=".*?"\s*\/?>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`)
    .replace(/<!-- Schema\.org JSON-LD structured data -->[\s\S]*?<script type="application\/ld\+json">[\s\S]*?<\/script>/i, "");
}

function appendHreflang(html: string, routePath: string): string {
  const hreflangTags = Object.entries(MARKET_HREFLANG_MAP).map(([market, lang]) => {
    const href = `https://productreviews.review${routePath}?market=${market}`;
    return `<link rel="alternate" hreflang="${lang}" href="${href}" />`;
  }).join("\n    ");
  const xDefaultTag = `<link rel="alternate" hreflang="x-default" href="https://productreviews.review${routePath}" />`;
  return html.replace(/<\/head>/i, `    ${hreflangTags}\n    ${xDefaultTag}\n</head>`);
}

function renderReviewHtml(r: ReviewRecord, routePath: string, baseHtml: string): string {
  const canonicalUrl = `https://productreviews.review${routePath}`;
  const title = r.slug === "best-oneplus-nord-ce4-review-2026"
    ? "OnePlus Nord CE4 5G Review: Tested Verdict & Flash Score (2026)"
    : `${r.name} Review: Tested Verdict & Lab Benchmarks`;
  const description = `${r.summary} Read our lab-tested verdict, specs, pros/cons, and verified Amazon pricing.`.slice(0, 160);
  const categorySlug = r.category.toLowerCase().replace(/\s+/g, "-");
  const flashScore = Math.round(r.rating * 20);

  let html = applyHeadMeta(baseHtml, title, description, canonicalUrl);
  html = appendHreflang(html, routePath);

  const jsonLdScript = `
    <script type="application/ld+json">
    ${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://productreviews.review/" },
            { "@type": "ListItem", position: 2, name: r.category, item: `https://productreviews.review/?category=${categorySlug}` },
            { "@type": "ListItem", position: 3, name: r.name, item: canonicalUrl }
          ]
        },
        {
          "@type": "Product",
          name: r.name,
          category: r.category,
          brand: { "@type": "Brand", name: r.brand },
          review: {
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: String(r.rating), bestRating: "5" },
            author: { "@type": "Organization", name: "productreviews.review Editorial Testing Lab" },
            reviewBody: r.verdict,
            positiveNotes: { "@type": "ItemList", itemListElement: r.pros },
            negativeNotes: { "@type": "ItemList", itemListElement: r.cons }
          },
          aggregateRating: { "@type": "AggregateRating", ratingValue: String(r.rating), reviewCount: String(r.reviewCount) },
          offers: { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: String(r.priceUSD), availability: "https://schema.org/InStock" }
        },
        {
          "@type": "WebPage",
          name: title,
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "article p"] },
          url: canonicalUrl
        },
        ...(r.faqList && r.faqList.length > 0
          ? [{
              "@type": "FAQPage",
              mainEntity: r.faqList.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer }
              }))
            }]
          : [])
      ]
    })}
    </script>`;

  html = html.replace(/<\/head>/i, `${jsonLdScript}\n</head>`);

  const ssrBody = `
    <div id="root">
      <main style="max-width: 900px; margin: 0 auto; padding: 24px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7; background-color: #09090b; line-height: 1.6;">
        <nav aria-label="Breadcrumb" style="font-size: 13px; color: #a1a1aa; margin-bottom: 16px;">
          <a href="/" style="color: #FFE600; text-decoration: none;">Home</a> &gt; <span>${r.category}</span> &gt; <span>${r.name}</span>
        </nav>
        <article>
          <header style="border-bottom: 1px solid #27272a; padding-bottom: 24px; margin-bottom: 24px;">
            <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #FFE600; margin-bottom: 8px;">${r.brand} · ${r.category} · Verified ${r.lastUpdated}</div>
            <h1 style="font-size: 32px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0;">${r.name} Review & Tested Verdict</h1>
            <p style="font-size: 16px; color: #d4d4d8; margin-bottom: 16px;">${r.summary}</p>
            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px;">
              <strong style="color: #FFE600;">Flash Score: ${flashScore}/100</strong> — ${r.verdict}
            </div>
          </header>
          <section style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; color: #ffffff;">Verified Pros & Cons</h2>
            <ul>${r.pros.map((p) => `<li>${p}</li>`).join("")}</ul>
            <ul>${r.cons.map((c) => `<li>${c}</li>`).join("")}</ul>
          </section>
          <section style="margin-bottom: 24px;">
            <h2 style="font-size: 20px; color: #ffffff;">Hardware Specifications</h2>
            <ul>${Object.entries(r.specs).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("")}</ul>
          </section>
          <section>
            <a href="/api/affiliate/redirect?market=US&asin=${r.amazonAsin}&q=${encodeURIComponent(r.name)}" rel="nofollow sponsored noopener noreferrer" style="display: inline-block; background: #FFE600; color: #000000; font-weight: 800; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Check Lowest Price on Amazon →</a>
          </section>
        </article>
      </main>
    </div>`;

  return html.replace(/<div id="root">\s*<\/div>/i, ssrBody);
}

function renderCompareHtml(comp: CompareMeta, baseHtml: string): string {
  const r1 = getReview(comp.slugA);
  const r2 = getReview(comp.slugB);
  const routePath = `/compare/${comp.slug}`;
  const canonicalUrl = `https://productreviews.review${routePath}`;

  let html = applyHeadMeta(baseHtml, comp.title, comp.description, canonicalUrl);
  html = appendHreflang(html, routePath);

  if (r1 && r2) {
    const jsonLdScript = `
    <script type="application/ld+json">
    ${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://productreviews.review/" },
            { "@type": "ListItem", position: 2, name: "Comparisons", item: "https://productreviews.review/#comparison-shootouts" },
            { "@type": "ListItem", position: 3, name: comp.title, item: canonicalUrl }
          ]
        },
        {
          "@type": "ItemList",
          name: comp.title,
          description: comp.description,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: r1.name, url: `https://productreviews.review/review/${r1.slug}` },
            { "@type": "ListItem", position: 2, name: r2.name, url: `https://productreviews.review/review/${r2.slug}` }
          ]
        }
      ]
    })}
    </script>`;
    html = html.replace(/<\/head>/i, `${jsonLdScript}\n</head>`);

    const ssrCompare = `
    <div id="root">
      <main style="max-width: 900px; margin: 0 auto; padding: 24px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7; background-color: #09090b; line-height: 1.6;">
        <nav aria-label="Breadcrumb" style="font-size: 13px; color: #a1a1aa; margin-bottom: 16px;">
          <a href="/" style="color: #FFE600; text-decoration: none;">Home</a> &gt; <span>Comparisons</span> &gt; <span>${r1.name} vs ${r2.name}</span>
        </nav>
        <article>
          <h1 style="font-size: 32px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0;">${comp.title}</h1>
          <p style="font-size: 16px; color: #d4d4d8; margin-bottom: 24px;">${comp.description}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px;">
              <h2><a href="/review/${r1.slug}" style="color: #FFE600;">${r1.name}</a></h2>
              <p>${r1.verdict}</p>
              <p><strong>Score: ${Math.round(r1.rating * 20)}/100 · $${r1.priceUSD}</strong></p>
            </div>
            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px;">
              <h2><a href="/review/${r2.slug}" style="color: #FFE600;">${r2.name}</a></h2>
              <p>${r2.verdict}</p>
              <p><strong>Score: ${Math.round(r2.rating * 20)}/100 · $${r2.priceUSD}</strong></p>
            </div>
          </div>
        </article>
      </main>
    </div>`;
    html = html.replace(/<div id="root">\s*<\/div>/i, ssrCompare);
  }

  return html;
}

function renderPolicyHtml(routePath: string, data: { title: string; description: string; policy: PolicySsrContent }, baseHtml: string): string {
  const canonicalUrl = `https://productreviews.review${routePath}`;
  let html = applyHeadMeta(baseHtml, data.title, data.description, canonicalUrl);
  const p = data.policy;

  const jsonLdScript = `
    <script type="application/ld+json">
    ${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://productreviews.review/" },
            { "@type": "ListItem", position: 2, name: p.heading, item: canonicalUrl }
          ]
        },
        {
          "@type": p.schemaType,
          name: data.title,
          description: data.description,
          url: canonicalUrl,
          publisher: {
            "@type": "Organization",
            name: "productreviews.review Editorial Board",
            url: "https://productreviews.review/"
          }
        }
      ]
    })}
    </script>`;
  html = html.replace(/<\/head>/i, `${jsonLdScript}\n</head>`);

  const ssrPolicy = `
    <div id="root">
      <main style="max-width: 860px; margin: 0 auto; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7; background-color: #09090b; line-height: 1.7;">
        <nav aria-label="Breadcrumb" style="font-size: 13px; color: #a1a1aa; margin-bottom: 20px;">
          <a href="/" style="color: #FFE600; text-decoration: none;">Home</a> &gt; <span>${p.heading}</span>
        </nav>
        <article style="background: #121214; border: 1px solid #27272a; border-radius: 16px; padding: 28px;">
          <header style="border-bottom: 1px solid #27272a; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="font-size: 30px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0;">${p.heading}</h1>
            <p style="font-size: 14px; color: #a1a1aa; margin: 0;">${p.subtitle}</p>
          </header>
          ${p.sections.map((sec) => `
            <section style="margin-bottom: 22px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #FFE600; margin: 0 0 8px 0;">${sec.title}</h2>
              <p style="font-size: 14px; color: #d4d4d8; margin: 0;">${sec.body}</p>
            </section>
          `).join("")}
          <footer style="border-top: 1px solid #27272a; padding-top: 16px; margin-top: 24px; font-size: 13px; color: #a1a1aa;">
            <a href="/" style="color: #FFE600; text-decoration: none; font-weight: bold;">← Back to productreviews.review Hardware Directory</a>
          </footer>
        </article>
      </main>
    </div>`;

  return html.replace(/<div id="root">\s*<\/div>/i, ssrPolicy);
}

function renderNotFoundHtml(baseHtml: string, requestPath: string): string {
  const safePath = requestPath.replace(/[<>"'&]/g, "");
  const notFoundBody = `
    <div id="root">
      <main style="max-width: 720px; margin: 64px auto; padding: 32px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7; background-color: #09090b; text-align: center;">
        <h1 style="font-size: 32px; font-weight: 800; color: #ffffff; margin-bottom: 12px;">404 — Page Not Found</h1>
        <p style="font-size: 15px; color: #a1a1aa; margin-bottom: 24px;">The requested path (${safePath}) does not correspond to a published product review, comparison, or editorial page.</p>
        <a href="/" style="display: inline-block; background: #FFE600; color: #000000; font-weight: 800; padding: 12px 24px; border-radius: 10px; text-decoration: none;">Return to Homepage</a>
      </main>
    </div>`;

  return baseHtml
    .replace(/<title>.*?<\/title>/i, "<title>404 Page Not Found | productreviews.review</title>")
    .replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="The requested page could not be located on productreviews.review." />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/i, "")
    .replace(/<meta name="robots" content=".*?"\s*\/?>/i, `<meta name="robots" content="noindex, follow" />`)
    .replace(/<!-- Schema\.org JSON-LD structured data -->[\s\S]*?<script type="application\/ld\+json">[\s\S]*?<\/script>/i, "")
    .replace(/<div id="root">\s*<\/div>/i, notFoundBody);
}

export default async function handler(req: any, res: any) {
  try {
    const rawQueryPath = req.query?.path;
    let targetPath = Array.isArray(rawQueryPath) ? rawQueryPath[0] : rawQueryPath;
    if (!targetPath) {
      targetPath = (req.url || "/").split("?")[0];
    }
    if (!targetPath.startsWith("/")) {
      targetPath = `/${targetPath}`;
    }
    const cleanPath = (targetPath.split("?")[0].replace(/\/+$/, "")) || "/";

    const baseHtml = await loadBaseHtml(req);

    if (POLICY_PAGES[cleanPath]) {
      const html = renderPolicyHtml(cleanPath, POLICY_PAGES[cleanPath], baseHtml);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.end(html);
      return;
    }

    if (cleanPath.startsWith("/review/")) {
      const slug = cleanPath.replace("/review/", "");
      const record = getReview(slug);
      if (record) {
        const html = renderReviewHtml(record, cleanPath, baseHtml);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.end(html);
        return;
      }
    }

    if (cleanPath.startsWith("/compare/")) {
      const slug = cleanPath.replace("/compare/", "");
      const comp = COMPARES.find((c) => c.slug === slug);
      if (comp) {
        const html = renderCompareHtml(comp, baseHtml);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.end(html);
        return;
      }
    }

    const notFoundHtml = renderNotFoundHtml(baseHtml, cleanPath);
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("X-Robots-Tag", "noindex, follow");
    res.end(notFoundHtml);
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(`SSR Error: ${err?.message || String(err)}`);
  }
}
