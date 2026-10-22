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
      Display: '6.9-inch Super Retina XDR OLED',
      Processor: 'Apple A18 Pro 3nm',
      Battery: '4685 mAh (Up to 33 hours video playback)',
      Storage: '256GB / 512GB / 1TB',
      Weight: '227 grams'
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
    return this.products.get(slug);
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
