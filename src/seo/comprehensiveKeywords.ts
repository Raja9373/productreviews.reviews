/**
 * ProductReviews.review — Comprehensive Internet-Scale Amazon & Category Keywords,
 * People Also Ask (PAA) Queries, and Product Record Database
 * 
 * Aggregates high-volume search intent keywords, buyer questions, and product categories
 * for automated SEO sitemap expansion and rich structured data indexing.
 */

export interface MasterKeywordCategory {
  categorySlug: string;
  categoryName: string;
  highVolumeKeywords: string[];
  paaQuestions: string[];
  topAsinsOrProducts: string[];
}

export const COMPREHENSIVE_MASTER_DATA: MasterKeywordCategory[] = [
  {
    categorySlug: 'amazon-shopping-guide',
    categoryName: 'Amazon Shopping & Buyer Protection',
    highVolumeKeywords: [
      'amazon india shopping guide 2026',
      'how to check original amazon seller',
      'amazon open box delivery rules',
      'amazon 7 day replacement policy electronics',
      'does amazon void manufacturer warranty',
      'amazon great indian festival best deals',
      'amazon renewed vs refurbished electronics safe',
      'amazon pay later EMI options interest free',
      'how to track amazon package live delivery',
    ],
    paaQuestions: [
      'How do I verify if a product on Amazon is sold by an authorized, genuine seller?',
      'What is Amazon’s Open Box Delivery and how does it protect buyers of electronics?',
      'How does Amazon’s 7-day replacement policy work for laptops, phones, and appliances?',
      'Does buying electronics from Amazon void the official brand manufacturer warranty?',
      'Why do Amazon prices fluctuate daily, and when is the best time to buy?',
      'Are refurbished or renewed products on Amazon safe and covered by warranty?',
    ],
    topAsinsOrProducts: ['Amazon Prime', 'Amazon Pay Later', 'Amazon Renewed', 'Open Box Delivery'],
  },
  {
    categorySlug: 'smartphones',
    categoryName: 'Smartphones & Mobile Devices',
    highVolumeKeywords: [
      'best phone under 30000 amazon',
      'oneplus nord ce4 5g review specifications',
      'iphone 16 pro vs samsung s24 ultra camera',
      'best camera smartphone india 2026',
      'fast charging battery health degradation test',
      '128gb vs 256gb storage enough for phone',
      'how to check iphone activation status online',
      'best gaming phone under 40000',
      'best budget 5g phone under 20000',
    ],
    paaQuestions: [
      'Which is the best all-round smartphone under ₹30,000 on Amazon in 2026?',
      'iPhone 16 Pro vs Samsung Galaxy S24 Ultra: which has the better camera and battery?',
      'Does rapid 100W or 120W charging damage phone battery health over time?',
      'Is 128GB storage enough for a new smartphone, or should I upgrade to 256GB?',
      'How can I check if an iPhone bought online is brand new and not activated before?',
      'Which phone has the best battery backup and fast charging under ₹30,000?',
    ],
    topAsinsOrProducts: ['Apple iPhone 16 Pro', 'OnePlus Nord CE4 5G', 'Samsung Galaxy S24 Ultra', 'Realme GT 6', 'iQOO Neo 9 Pro'],
  },
  {
    categorySlug: 'laptops',
    categoryName: 'Laptops & Computing',
    highVolumeKeywords: [
      'best laptop for students under 50000',
      'apple macbook air m2 m3 review india',
      '8gb vs 16gb ram macbook air unified memory',
      'best programming laptop 2026',
      'asus vivobook vs lenovo ideapad slim',
      'best gaming laptop under 80000 amazon',
      'dell xps vs macbook pro display battery',
    ],
    paaQuestions: [
      'Is an Apple MacBook Air with 8GB unified memory enough in 2026, or is 16GB required?',
      'MacBook Air M2/M3 vs Windows Laptop: which is better for work and students?',
      'What specifications should I look for in a work laptop under ₹50,000 on Amazon?',
      'Does Amazon provide brand warranty service for Dell, HP, Lenovo, and Apple laptops?',
      'Which is better for software coding: Windows or macOS?',
    ],
    topAsinsOrProducts: ['Apple MacBook Air M2', 'Apple MacBook Air M3', 'ASUS Vivobook 16X', 'Lenovo IdeaPad Slim 3', 'Dell Inspiron 15'],
  },
  {
    categorySlug: 'tvs',
    categoryName: '4K Smart TVs & Home Theater',
    highVolumeKeywords: [
      'best 55 inch 4k tv india amazon',
      'oled vs qled tv bright room comparison',
      'sony bravia vs lg c3 oled review',
      'free wall mount installation amazon smart tv',
      'best soundbar for tv dolby atmos',
    ],
    paaQuestions: [
      'OLED vs QLED 4K TVs: which display technology should you choose for bright rooms?',
      'Does Amazon provide free wall-mount installation for smart TVs?',
      'What is the ideal viewing distance for a 43-inch vs 55-inch vs 65-inch 4K TV?',
      'What should I inspect immediately when a new TV is delivered from Amazon?',
    ],
    topAsinsOrProducts: ['Sony Bravia 55 inch 4K OLED', 'LG C3 4K OLED TV', 'Samsung 55 inch Crystal 4K UHD', 'TCL 55C655 QLED'],
  },
  {
    categorySlug: 'appliances',
    categoryName: 'Inverter ACs & Home Appliances',
    highVolumeKeywords: [
      'best 1.5 ton inverter ac 5 star india',
      'copper vs aluminium condenser coil ac durability',
      'split ac installation charges amazon india',
      'dyson v15 detect cordless vacuum review',
      'best automatic washing machine front load',
    ],
    paaQuestions: [
      'Which is better for Indian summers: 3-Star or 5-Star 1.5 Ton Inverter Split AC?',
      'Why is 100% copper condenser coil essential when buying an air conditioner on Amazon?',
      'How much are standard installation charges for a split AC purchased on Amazon?',
      'Are cordless vacuum cleaners powerful enough to replace traditional bagged vacuums?',
    ],
    topAsinsOrProducts: ['Daikin 1.5 Ton 5 Star Inverter AC', 'Panasonic 1.5 Ton 5 Star Wi-Fi Inverter AC', 'Dyson V15 Detect', 'LG 8 Kg Front Load Washing Machine'],
  },
  {
    categorySlug: 'audio',
    categoryName: 'Wireless Audio & Noise-Cancelling Earbuds',
    highVolumeKeywords: [
      'best anc earbuds under 10000 amazon',
      'sony wh-1000xm5 vs bose qc ultra review',
      'oneplus buds pro 2 audio latency test',
      'airpods pro 2 vs sony wf-1000xm5',
    ],
    paaQuestions: [
      'Sony WH-1000XM5 vs Bose QuietComfort Ultra: which has superior noise cancellation?',
      'Are high-res bluetooth codecs like LDAC and aptX noticeable on wireless earbuds?',
      'How long do true wireless earbuds batteries last before significant degradation?',
    ],
    topAsinsOrProducts: ['Sony WH-1000XM5', 'Bose QuietComfort Ultra', 'OnePlus Buds Pro 2', 'Apple AirPods Pro 2', 'Sony WF-1000XM5'],
  },
];

export function getAllKeywords(): string[] {
  const all: string[] = [];
  for (const cat of COMPREHENSIVE_MASTER_DATA) {
    all.push(...cat.highVolumeKeywords);
    all.push(...cat.paaQuestions);
  }
  return all;
}
