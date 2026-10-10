/**
 * Predefined Canonical FAQ Data & Schema.org FAQPage Builder
 * 
 * Targets high-intent Google "People Also Ask" (PAA) queries for:
 * - Amazon product buying, warranty verification, return policies, and seller checks
 * - Smartphones, Laptops, 4K Smart TVs, Inverter ACs, and Noise-Cancelling Audio
 * - Head-to-head comparison decision criteria
 * - Editorial independence, zero commission bias, and testing methodologies
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategoryGroup {
  id: string;
  label: string;
  iconName: string;
  faqs: FAQItem[];
}

export const AMAZON_SHOPPING_FAQS: FAQItem[] = [
  {
    question: 'How do I verify if a product on Amazon is sold by an authorized, genuine seller?',
    answer:
      'Look for items listed as "Fulfilled by Amazon" (FBA) or sold directly by brand-authorized flagship sellers (such as Appario Retail, Cocoblu, or the official brand store). Check the seller profile ratings, ensure the listing specifies official manufacturer warranty in the description, and verify that serial numbers on the box match the invoice upon delivery.',
  },
  {
    question: 'What is Amazon’s Open Box Delivery and how does it protect buyers of electronics?',
    answer:
      'Open Box Delivery is a buyer-protection service where the delivery agent opens the sealed outer packaging in front of you. You inspect the physical item to verify it is undamaged, authentic, and complete with all accessories before sharing the one-time delivery OTP. If any physical damage or discrepancy exists, you can refuse delivery on the spot for an immediate full refund.',
  },
  {
    question: 'How does Amazon’s 7-day replacement policy work for laptops, phones, and appliances?',
    answer:
      'For most electronics, Amazon provides a 7-day replacement window for hardware defects or Dead-on-Arrival (DOA) units. A technician may perform a remote or in-person diagnostic test to confirm hardware failure, after which an exact replacement unit is dispatched at zero additional cost.',
  },
  {
    question: 'Does buying electronics from Amazon void the official brand manufacturer warranty?',
    answer:
      'No. When purchased from authorized sellers on Amazon, products carry standard manufacturer warranties identical to retail stores (typically 1 to 2 years for electronics, and up to 5-10 years for AC compressors or TV panels). The GST tax invoice downloaded from your Amazon account serves as valid proof of purchase at all authorized brand service centers.',
  },
  {
    question: 'Why do Amazon prices fluctuate daily, and when is the best time to buy?',
    answer:
      'Amazon utilizes dynamic algorithmic pricing based on merchant inventory, competitor rates, and demand curves. Major price drops historically occur during scheduled sale events (Amazon Great Indian Festival, Prime Day, Black Friday, and seasonal festival sales) accompanied by bank card instant discounts and exchange bonuses.',
  },
  {
    question: 'Are refurbished or renewed products on Amazon safe and covered by warranty?',
    answer:
      'Amazon Renewed products are professionally inspected, tested, and cleaned to work and look like new. They are backed by a minimum 6-month seller warranty and a return window, making them a safe, economical choice for certified budget laptops and smartphones.',
  },
];

export const SMARTPHONES_FAQS: FAQItem[] = [
  {
    question: 'Which is the best all-round smartphone under ₹30,000 on Amazon in 2026?',
    answer:
      'The OnePlus Nord CE4 currently leads the ₹20,000–₹30,000 category due to its 100W SUPERVOOC charging (full charge in under 30 minutes), dependable Snapdragon 7 Gen 3 processor, clean OxygenOS software experience, and IP54 splash resistance.',
  },
  {
    question: 'iPhone 16 Pro vs Samsung Galaxy S24 Ultra: which has the better camera and battery?',
    answer:
      'The iPhone 16 Pro excels in video recording fidelity, 4K120 Dolby Vision HDR, and compact pocket ergonomics. The Samsung Galaxy S24 Ultra leads in optical zoom versatility (5x and 10x periscope telephoto), integrated S-Pen productivity, and overall battery endurance during heavy multi-app usage.',
  },
  {
    question: 'Does rapid 100W or 120W charging damage phone battery health over time?',
    answer:
      'Modern smartphones with 80W–120W fast charging use dual-cell battery architectures, intelligent thermal throttles, and GaN power management chips to keep temperatures below 40°C during charging. Testing demonstrates minimal additional degradation (retaining >80% capacity after 800–1600 full charging cycles).',
  },
  {
    question: 'Is 128GB storage enough for a new smartphone, or should I upgrade to 256GB?',
    answer:
      'For general web browsing, messaging, and basic photo taking, 128GB suffices. However, if you shoot 4K video, install graphics-heavy games, or plan to keep your device for 3+ years without cloud subscription fees, 256GB is strongly recommended.',
  },
  {
    question: 'How can I check if an iPhone bought online is brand new and not activated before?',
    answer:
      'Prior to unsealing, enter the serial number printed on the back of the box into checkcoverage.apple.com. A brand-new unit will state "Please activate your device." Once activated with your Apple ID, verify that the 1-year limited warranty expiration date aligns with your activation date.',
  },
];

export const LAPTOPS_FAQS: FAQItem[] = [
  {
    question: 'Is an Apple MacBook Air with 8GB unified memory enough in 2026, or is 16GB required?',
    answer:
      'For students, daily web research, document editing, and video streaming, 8GB unified memory remains surprisingly smooth due to Apple Silicon’s high-bandwidth memory architecture. However, for software developers, multi-layer photo editing, and future-proofing over 4–5 years, 16GB is the safer investment.',
  },
  {
    question: 'MacBook Air M2/M3 vs Windows Laptop: which is better for work and students?',
    answer:
      'MacBook Air M2/M3 leads by a wide margin in battery life (15–18 real-world hours), silent fanless operation, and aluminium chassis build. Windows laptops (such as ASUS Vivobook or Dell XPS) offer greater port selection, upgradable RAM/SSD slots, and native support for Windows-exclusive engineering and accounting software.',
  },
  {
    question: 'What specifications should I look for in a work laptop under ₹50,000 on Amazon?',
    answer:
      'Aim for at least an Intel Core i5 (12th/13th Gen) or AMD Ryzen 5 (5000/7000 series), a minimum of 16GB DDR4/DDR5 RAM, 512GB NVMe SSD storage, and an IPS anti-glare display with at least 250–300 nits of brightness.',
  },
  {
    question: 'Does Amazon provide brand warranty service for Dell, HP, Lenovo, and Apple laptops?',
    answer:
      'Yes. All laptops sold by authorized Amazon sellers come with standard on-site or depot brand warranty. Register your laptop on the brand official portal (e.g., dell.com/support or support.apple.com) using your Amazon invoice within 14 days of delivery.',
  },
];

export const TVS_FAQS: FAQItem[] = [
  {
    question: 'OLED vs QLED 4K TVs: which display technology should you choose for bright rooms?',
    answer:
      'QLED (Mini-LED) TVs provide substantially higher peak brightness (1,000 to 2,000+ nits) and are immune to screen burn-in, making them the superior choice for sunlit living rooms. OLED TVs offer infinite contrast and absolute pitch-black levels, making them unmatched for dark-room cinema and HDR movies.',
  },
  {
    question: 'Does Amazon provide free wall-mount installation for smart TVs?',
    answer:
      'Yes. For most branded smart TVs (Sony, LG, Samsung, TCL, Xiaomi), the brand or Amazon Home Services provides complimentary standard table-top setup or wall-mount installation. The service technician is automatically scheduled or can be booked via a helpline provided on your order page.',
  },
  {
    question: 'What is the ideal viewing distance for a 43-inch vs 55-inch vs 65-inch 4K TV?',
    answer:
      'For 4K resolution, optimal viewing distances are approximately 4.5–6 feet for a 43-inch TV, 6–8 feet for a 55-inch TV, and 8–10 feet for a 65-inch TV to fully appreciate high-definition detail without eye strain.',
  },
  {
    question: 'What should I inspect immediately when a new TV is delivered from Amazon?',
    answer:
      'Always utilize Open Box Delivery. Check the display glass for hairline cracks or pressure spots, inspect the corners of the bezel, verify the remote and power cable are sealed, and ensure the delivery agent connects power to confirm the display panel powers up cleanly.',
  },
];

export const APPLIANCES_FAQS: FAQItem[] = [
  {
    question: 'Which is better for Indian summers: 3-Star or 5-Star 1.5 Ton Inverter Split AC?',
    answer:
      'If your AC operates for more than 6–8 hours daily during summer months, a 5-Star inverter AC repays its initial price premium in electricity bill savings within 18–24 months. For moderate usage (3–4 hours at night), a 3-Star inverter AC provides the best balance of upfront savings and cooling efficacy.',
  },
  {
    question: 'Why is 100% copper condenser coil essential when buying an air conditioner on Amazon?',
    answer:
      'Copper condenser coils conduct heat significantly faster than aluminium coils, withstand high pressure, and are far more resistant to corrosion caused by coastal air or industrial pollution. They are also easily repairable and solderable if a leak occurs, whereas damaged aluminium coils typically require costly full replacement.',
  },
  {
    question: 'How much are standard installation charges for a split AC purchased on Amazon?',
    answer:
      'Standard brand installation typically costs between ₹1,199 and ₹1,499 + GST for labor, which includes mounting indoor/outdoor units and up to 3 meters of connecting copper piping. Extra copper pipe, wall-mount brackets, and electrical wiring are charged separately per standard rate cards.',
  },
];

export const AUDIO_FAQS: FAQItem[] = [
  {
    question: 'Sony WH-1000XM5 vs Bose QuietComfort Ultra: which has superior noise cancellation?',
    answer:
      'Both lead the industry, but Bose QuietComfort Ultra delivers slightly superior passive seal and low-frequency engine rumble isolation for air travel, while Sony WH-1000XM5 offers more comprehensive EQ personalization, LDAC hi-res codec support, and superior voice call microphone noise reduction.',
  },
  {
    question: 'What should I look for in true wireless earbuds (TWS) under ₹3,000 on Amazon?',
    answer:
      'Prioritize earbuds with active noise cancellation (ANC of 30dB+), 10mm+ dynamic drivers, Bluetooth 5.3 or higher for stable low-latency connection, IPX4+ sweat resistance, and at least 6–7 hours of standalone earbud battery life.',
  },
  {
    question: 'How can I ensure earbuds bought online are authentic and not counterfeit copies?',
    answer:
      'Genuine earbuds immediately connect to their official companion smartphone app (e.g., Sony Headphones Connect, Apple Settings / Find My, Bose Music, or HeyMelody). Counterfeit units will fail to register with the official brand companion app or receive firmware updates.',
  },
];

export const GENERAL_SITE_FAQS: FAQItem[] = [
  {
    question: 'How does productreviews.review evaluate and score products?',
    answer:
      'productreviews.review evaluates products using an objective decision framework that analyzes verified technical specifications, independent benchmark data, aggregated consumer feedback, and documented real-world performance metrics rather than subjective opinion.',
  },
  {
    question: 'Are product recommendations influenced by merchant commissions or sponsorships?',
    answer:
      'No. productreviews.review operates with zero merchant bias. Products are ranked strictly by objective utility, specifications, build quality, and verified value-for-money. We never accept paid placement or merchant sponsorships.',
  },
  {
    question: 'How does productreviews.review determine regional pricing and availability?',
    answer:
      'Our multi-market resolution engine automatically identifies market context from user settings, regional store endpoints (such as Amazon US, UK, Germany, India, Japan, Canada), and explicit currency queries to display localized pricing notes and in-stock variants.',
  },
  {
    question: 'How are head-to-head product comparisons and trade-offs generated?',
    answer:
      'Our comparison engine performs side-by-side spec alignment, calculating distinct trade-offs, strengths, and drawbacks across hardware performance, battery endurance, software support, ergonomics, and cost efficiency.',
  },
  {
    question: 'How often are product reviews and pricing recommendations updated?',
    answer:
      'Product specifications and market pricing are continuously verified and refreshed against global merchant inventories and new product release cycles to maintain high editorial and decision accuracy.',
  },
];

export const PREDEFINED_FAQS: FAQItem[] = [
  ...AMAZON_SHOPPING_FAQS.slice(0, 3),
  ...SMARTPHONES_FAQS.slice(0, 2),
  ...LAPTOPS_FAQS.slice(0, 2),
  ...TVS_FAQS.slice(0, 1),
  ...GENERAL_SITE_FAQS.slice(0, 2),
];

export const ALL_FAQ_CATEGORY_GROUPS: FAQCategoryGroup[] = [
  {
    id: 'amazon',
    label: 'Amazon Buying & Safety',
    iconName: 'ShieldCheck',
    faqs: AMAZON_SHOPPING_FAQS,
  },
  {
    id: 'phones',
    label: 'Smartphones & Mobile',
    iconName: 'Smartphone',
    faqs: SMARTPHONES_FAQS,
  },
  {
    id: 'laptops',
    label: 'Laptops & Computing',
    iconName: 'Laptop',
    faqs: LAPTOPS_FAQS,
  },
  {
    id: 'tvs',
    label: '4K Smart TVs',
    iconName: 'Tv',
    faqs: TVS_FAQS,
  },
  {
    id: 'appliances',
    label: 'ACs & Appliances',
    iconName: 'Wind',
    faqs: APPLIANCES_FAQS,
  },
  {
    id: 'audio',
    label: 'Audio & Earbuds',
    iconName: 'Headphones',
    faqs: AUDIO_FAQS,
  },
  {
    id: 'methodology',
    label: 'Testing & Methodology',
    iconName: 'CheckCircle',
    faqs: GENERAL_SITE_FAQS,
  },
];

/**
 * Returns relevant FAQ items matching a category key or query keywords.
 */
export function getFaqsForCategory(categoryKey: string): FAQItem[] {
  const normalized = categoryKey.toLowerCase();
  if (normalized.includes('phone') || normalized.includes('mobile')) {
    return SMARTPHONES_FAQS;
  }
  if (normalized.includes('laptop') || normalized.includes('macbook') || normalized.includes('computer')) {
    return LAPTOPS_FAQS;
  }
  if (normalized.includes('tv') || normalized.includes('television') || normalized.includes('oled')) {
    return TVS_FAQS;
  }
  if (normalized.includes('ac') || normalized.includes('conditioner') || normalized.includes('appliance')) {
    return APPLIANCES_FAQS;
  }
  if (normalized.includes('audio') || normalized.includes('earbud') || normalized.includes('headphone')) {
    return AUDIO_FAQS;
  }
  return AMAZON_SHOPPING_FAQS;
}

/**
 * Generates head-to-head comparison FAQ questions for two products.
 */
export function getComparisonFaqs(productA: string, productB: string): FAQItem[] {
  const cleanA = productA.trim() || 'Product A';
  const cleanB = productB.trim() || 'Product B';

  return [
    {
      question: `Which is better on Amazon: ${cleanA} or ${cleanB}?`,
      answer: `The decision between ${cleanA} and ${cleanB} depends on your primary use-case. ${cleanA} generally offers distinct advantages in specific feature areas, while ${cleanB} provides competitive trade-offs in value, durability, or ecosystem integration. Review our side-by-side spec scorecard above for detailed point-by-point verdict.`,
    },
    {
      question: `What are the key price and value differences between ${cleanA} and ${cleanB}?`,
      answer: `Pricing varies dynamically across Amazon retail channels. When comparing overall value, factor in included box accessories, warranty duration, and seasonal discount drops on both ${cleanA} and ${cleanB} before making your purchase.`,
    },
    {
      question: `Does Amazon offer official brand warranty and easy returns for both ${cleanA} and ${cleanB}?`,
      answer: `Yes. As long as you purchase from authorized merchant partners or items marked "Fulfilled by Amazon", both ${cleanA} and ${cleanB} include complete manufacturer warranties and standard 7-day replacement or return protection against technical defects.`,
    },
    {
      question: `Who should buy ${cleanA} instead of ${cleanB}?`,
      answer: `Choose ${cleanA} if you prioritize its leading performance benchmarks, build materials, and unique features. Opt for ${cleanB} if you seek better battery efficiency, lower price point, or specific ecosystem compatibility.`,
    },
  ];
}

/**
 * Builds standard Schema.org FAQPage JSON-LD entity
 */
export function buildFaqPageSchema(
  faqs: FAQItem[] = PREDEFINED_FAQS,
  schemaId: string = 'https://productreviews.review/#faq'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': schemaId,
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };
}

/**
 * Metadata for a category inside the FAQ manifest
 */
export interface FaqManifestCategory {
  id: string;
  name: string;
  canonicalPath: string;
  questionCount: number;
  schemaId: string;
  schema: ReturnType<typeof buildFaqPageSchema>;
  questions: FAQItem[];
}

/**
 * Standard Search Engine Indexable FAQ Knowledge Graph Manifest
 */
export interface FaqManifest {
  manifestVersion: string;
  generator: string;
  siteUrl: string;
  generatedAt: string;
  totalCategories: number;
  totalQuestions: number;
  categories: FaqManifestCategory[];
  fullSchema: ReturnType<typeof buildFaqPageSchema>;
}

/**
 * Helper function: Generates a complete, structured JSON manifest containing all
 * category-specific FAQs, their Schema.org FAQPage representations, and metadata.
 * Ensures FAQ content is indexable by search engines even without JavaScript execution.
 */
export function generateFaqManifest(baseUrl: string = 'https://productreviews.review'): FaqManifest {
  const allQuestions = ALL_FAQ_CATEGORY_GROUPS.flatMap((g) => g.faqs);
  const categories: FaqManifestCategory[] = ALL_FAQ_CATEGORY_GROUPS.map((g) => {
    const categoryPath = g.id === 'amazon' ? '/' : `/?q=${encodeURIComponent(g.label)}`;
    const schemaId = `${baseUrl}/#faq-${g.id}`;
    return {
      id: g.id,
      name: g.label,
      canonicalPath: `${baseUrl}${categoryPath}`,
      questionCount: g.faqs.length,
      schemaId,
      schema: buildFaqPageSchema(g.faqs, schemaId),
      questions: g.faqs,
    };
  });

  return {
    manifestVersion: '1.0',
    generator: 'productreviews.review Knowledge Graph & FAQ Engine',
    siteUrl: baseUrl,
    generatedAt: new Date().toISOString(),
    totalCategories: categories.length,
    totalQuestions: allQuestions.length,
    categories,
    fullSchema: buildFaqPageSchema(allQuestions, `${baseUrl}/#master-faq`),
  };
}

/**
 * Helper function: Exports all category-specific FAQ data into a formatted JSON string.
 */
export function exportFaqManifestJson(
  baseUrl: string = 'https://productreviews.review',
  pretty: boolean = true
): string {
  const manifest = generateFaqManifest(baseUrl);
  return JSON.stringify(manifest, null, pretty ? 2 : 0);
}

/**
 * Helper function: Writes the generated FAQ manifest JSON to /public/faq-manifest.json
 * (and /dist/faq-manifest.json if dist directory exists).
 */
export async function writeFaqManifestToDisk(baseUrl: string = 'https://productreviews.review'): Promise<string[]> {
  try {
    if (typeof window !== 'undefined') return [];
    const fs = await import('node:fs');
    const path = await import('node:path');
    const jsonStr = exportFaqManifestJson(baseUrl, true);
    const rootDir = process.cwd();
    const targets = [path.join(rootDir, 'public', 'faq-manifest.json')];

    const distDir = path.join(rootDir, 'dist');
    if (fs.existsSync(distDir)) {
      targets.push(path.join(distDir, 'faq-manifest.json'));
    }

    const written: string[] = [];
    for (const t of targets) {
      const p = path.dirname(t);
      if (!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive: true });
      }
      fs.writeFileSync(t, jsonStr, 'utf-8');
      written.push(t);
    }
    return written;
  } catch (e: any) {
    console.warn('[writeFaqManifestToDisk error]:', e?.message || e);
    return [];
  }
}

export default PREDEFINED_FAQS;

