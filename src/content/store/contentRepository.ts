export interface ReviewRecord {
  slug: string;
  name: string;
  category: string;
  brand: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  rating: number;
  reviewCount: number;
  verdict: string;
  summary: string;
  pros: string[];
  cons: string[];
  specs: Record<string, string>;
  amazonAsin: string;
  priceUSD: number;
  publishedDate: string;
  lastUpdated: string;
  faqList?: Array<{ question: string; answer: string }>;
}

export const INITIAL_PRODUCTS: ReviewRecord[] = [
  {
    slug: "apple-iphone-16-pro-max",
    name: "Apple iPhone 16 Pro Max",
    category: "Smartphones",
    brand: "Apple",
    status: "PUBLISHED",
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
    publishedDate: "2024-09-20",
    lastUpdated: "2026-03-15",
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
    status: "PUBLISHED",
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
    publishedDate: "2024-06-10",
    lastUpdated: "2026-02-28",
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
    status: "PUBLISHED",
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
    publishedDate: "2024-01-15",
    lastUpdated: "2026-03-01"
  },
  {
    slug: "dell-xps-15-oled",
    name: "Dell XPS 15 OLED Laptop",
    category: "Laptops",
    brand: "Dell",
    status: "PUBLISHED",
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
    publishedDate: "2024-04-18",
    lastUpdated: "2026-01-20"
  },
  {
    slug: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    category: "Smartphones",
    brand: "Samsung",
    status: "PUBLISHED",
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
    publishedDate: "2024-02-01",
    lastUpdated: "2026-03-10"
  },
  {
    slug: "best-oneplus-nord-ce4-review-2026",
    name: "OnePlus Nord CE4 5G",
    category: "Smartphones",
    brand: "OnePlus",
    status: "PUBLISHED",
    rating: 4.6,
    reviewCount: 312,
    verdict: "Best mid-range smartphone under ₹25,000 / $300. Incredible 100W SuperVOOC fast charging, smooth 120Hz AMOLED display, and reliable Snapdragon 7 Gen 3 performance.",
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
    publishedDate: "2024-04-01",
    lastUpdated: "2026-04-10",
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
    status: "PUBLISHED",
    rating: 4.5,
    reviewCount: 178,
    verdict: "Best compact camera phone under $500. Flagship Google Tensor G3 silicon, 7 years of Android feature drops, and unmatched computational photography.",
    summary: "The Google Pixel 8a brings flagship Pixel 8 camera magic and AI capabilities down to an accessible mid-range price point with an upgraded 120Hz Actua display.",
    pros: ["Flagship camera tuning and Best Take / Magic Editor features", "7 full years of Android OS and security updates", "Bright 120Hz OLED screen and IP67 water resistance"],
    cons: ["18W charging takes over 90 minutes to full charge", "Bezels are noticeably thicker than flagship Pixels"],
    specs: {
      Display: "6.1-inch Actua OLED 120Hz (2000 nits peak)",
      Processor: "Google Tensor G3 (4nm) with Titan M2 security",
      Camera: "64MP Main (f/1.89 OIS) + 13MP Ultra-Wide (120° FOV)",
      Battery: "4492 mAh with 18W wired charging",
      Software: "Android 14 with 7 years of guaranteed updates",
      Weight: "188 grams"
    },
    amazonAsin: "B0CZ2Y5CFL",
    priceUSD: 499,
    publishedDate: "2024-05-14",
    lastUpdated: "2026-03-25",
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
    status: "PUBLISHED",
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
    publishedDate: "2024-03-12",
    lastUpdated: "2026-03-20",
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
    status: "PUBLISHED",
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
    publishedDate: "2024-02-15",
    lastUpdated: "2026-03-12",
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
    status: "PUBLISHED",
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
    publishedDate: "2023-09-22",
    lastUpdated: "2026-04-01",
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
    status: "PUBLISHED",
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
    publishedDate: "2023-08-10",
    lastUpdated: "2026-03-18",
    faqList: [
      {
        question: "How long does the battery last on the Dyson V15 Detect in Boost mode?",
        answer: "In maximum Boost mode it runs for approximately 10-12 minutes; in Eco and Auto modes it achieves 45 to 60 minutes."
      }
    ]
  }
];

class ContentRepository {
  private products: Map<string, ReviewRecord> = new Map();

  constructor() {
    for (const p of INITIAL_PRODUCTS) {
      this.products.set(p.slug, p);
    }
  }

  getBySlug(slug: string): ReviewRecord | undefined {
    if (this.products.has(slug)) return this.products.get(slug);
    if (slug === "oneplus-nord-ce4") return this.products.get("best-oneplus-nord-ce4-review-2026");
    if (slug === "best-oneplus-nord-ce4-review-2026") return this.products.get("best-oneplus-nord-ce4-review-2026");
    return undefined;
  }

  getAll(): ReviewRecord[] {
    return Array.from(this.products.values());
  }

  getPublished(): ReviewRecord[] {
    return this.getAll().filter((p) => p.status === "PUBLISHED");
  }

  addOrUpdate(record: ReviewRecord): void {
    this.products.set(record.slug, record);
  }

  search(query: string): ReviewRecord[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();
    return this.getAll().filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
      );
    });
  }
}

export const contentRepository = new ContentRepository();
