export interface SubCategory {
  name: string;
  slug: string;
  searchQuery: string;
  description?: string;
  isPrescription?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  description: string;
  subcategories: SubCategory[];
  ctaType:
    | 'amazon'
    | 'cardekho'
    | 'flights'
    | 'hotels'
    | 'resorts'
    | 'restaurants'
    | 'villas'
    | 'cafes'
    | 'banquets'
    | 'finance'
    | 'healthcare'
    | 'realestate'
    | 'education'
    | 'financial_offer'
    | 'telecom_compare'
    | 'info_only';
  ctaLabel?: string;
  isServiceOrFinancial?: boolean;
  bannerImage?: string;
}

export const CATEGORIES: Category[] = [
  // ==========================================
  // RETAIL & CONSUMER TECH (Amazon Affiliate)
  // ==========================================
  {
    id: 'mobile-communication',
    slug: 'mobile-communication',
    name: 'Mobile & Communication',
    emoji: '📱',
    description: 'Smartphones, foldables, tablets, smartwatches & accessories',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Smartphones', slug: 'smartphones', searchQuery: 'smartphones 5g' },
      { name: 'Foldable Phones', slug: 'foldable-phones', searchQuery: 'foldable smartphones' },
      { name: 'Tablets & iPads', slug: 'tablets-ipads', searchQuery: 'tablets ipads' },
      { name: 'Smartwatches', slug: 'smartwatches', searchQuery: 'smartwatches' },
      { name: 'Power Banks & Cables', slug: 'power-banks', searchQuery: 'power banks fast charging cables' },
    ],
  },
  {
    id: 'computers-it',
    slug: 'computers-it',
    name: 'Computers & IT',
    emoji: '💻',
    description: 'Laptops, monitors, components, storage & peripherals',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Laptops (Gaming/Business)', slug: 'laptops', searchQuery: 'laptops for work and gaming' },
      { name: 'Monitors & Displays', slug: 'monitors', searchQuery: 'computer monitors 4k 144hz' },
      { name: 'Keyboards & Mice', slug: 'keyboards-mice', searchQuery: 'mechanical keyboards wireless mice' },
      { name: 'Storage (SSD, HDD, USB)', slug: 'storage-drives', searchQuery: 'nvme ssd external hard drives' },
    ],
  },
  {
    id: 'audio',
    slug: 'audio',
    name: 'Audio & Sound',
    emoji: '🎧',
    description: 'Headphones, TWS earbuds, soundbars & home theatre',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Wireless Headphones', slug: 'headphones', searchQuery: 'wireless noise cancelling headphones' },
      { name: 'TWS Earbuds & Neckbands', slug: 'tws-earbuds', searchQuery: 'tws earbuds true wireless' },
      { name: 'Bluetooth Speakers', slug: 'bluetooth-speakers', searchQuery: 'portable bluetooth speakers waterproof' },
      { name: 'Soundbars & Subwoofers', slug: 'soundbars', searchQuery: 'dolby atmos soundbars' },
    ],
  },
  {
    id: 'tv-video-entertainment',
    slug: 'tv-video-entertainment',
    name: 'TV & Home Entertainment',
    emoji: '📺',
    description: '4K/OLED Smart TVs, projectors & gaming consoles',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Smart 4K & OLED TVs', slug: 'smart-tvs', searchQuery: '4k smart oled tv' },
      { name: 'Home Projectors', slug: 'projectors', searchQuery: '4k home cinema projectors' },
      { name: 'Gaming Consoles', slug: 'gaming-consoles', searchQuery: 'playstation xbox consoles' },
    ],
  },
  {
    id: 'cameras-photography',
    slug: 'cameras-photography',
    name: 'Cameras & Photography',
    emoji: '📷',
    description: 'DSLRs, mirrorless cameras, action cams, gimbals & tripods',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Mirrorless & DSLR Cameras', slug: 'dslr-mirrorless', searchQuery: 'mirrorless 4k camera full frame' },
      { name: 'Action Cameras & Drones', slug: 'action-cameras-drones', searchQuery: 'action camera 4k 60fps waterproof drone' },
      { name: 'Gimbals & Tripods', slug: 'tripods-gimbals', searchQuery: 'camera gimbal stabilizer heavy duty tripod' },
    ],
  },
  {
    id: 'home-appliances',
    slug: 'home-appliances',
    name: 'Home Appliances',
    emoji: '❄️',
    description: 'Refrigerators, ACs, front load washing machines & geysers',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Inverter Split Air Conditioners', slug: 'air-conditioners', searchQuery: '1.5 ton 5 star inverter split ac' },
      { name: 'Double Door Refrigerators', slug: 'refrigerators', searchQuery: 'double door frost free refrigerator 5 star' },
      { name: 'Front Load Washing Machines', slug: 'washing-machines', searchQuery: 'front load fully automatic washing machine' },
      { name: 'Instant Water Heaters & Geysers', slug: 'water-heaters', searchQuery: '25 litre 5 star storage water heater geyser' },
    ],
  },
  {
    id: 'kitchen-dining',
    slug: 'kitchen-dining',
    name: 'Kitchen & Dining',
    emoji: '🍳',
    description: 'Mixer grinders, air fryers, microwaves & cookware',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Mixer Grinders & Blenders', slug: 'mixer-grinders', searchQuery: '750 watt mixer grinder 3 jars copper motor' },
      { name: 'Digital Air Fryers & OTG', slug: 'air-fryers', searchQuery: 'digital air fryer rapid air technology' },
      { name: 'Water Purifiers (RO+UV+MTDS)', slug: 'water-purifiers', searchQuery: 'ro uv mtds water purifier copper alkaline' },
      { name: 'Induction Cooktops & Cookware', slug: 'cookware-sets', searchQuery: 'triply stainless steel cookware set induction' },
    ],
  },
  {
    id: 'furniture-home',
    slug: 'furniture-home',
    name: 'Furniture & Living',
    emoji: '🛋️',
    description: 'Ergonomic chairs, memory foam mattresses, recliners & beds',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Ergonomic Office Chairs', slug: 'ergonomic-chairs', searchQuery: 'ergonomic office chair high back mesh lumbar' },
      { name: 'Orthopedic Mattresses', slug: 'mattresses', searchQuery: 'orthopedic memory foam mattress king size' },
      { name: 'Motorized Recliners & Sofas', slug: 'recliners', searchQuery: 'leatherette motorized recliner chair single seater' },
    ],
  },
  {
    id: 'cleaning-home-care',
    slug: 'cleaning-home-care',
    name: 'Cleaning & Home Care',
    emoji: '🧹',
    description: 'Robot vacuums, cordless stick cleaners & steam mops',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Robot Vacuum & Mop Cleaners', slug: 'robot-vacuums', searchQuery: 'robot vacuum cleaner and mop lidar navigation' },
      { name: 'Cordless Stick Vacuum Cleaners', slug: 'cordless-vacuums', searchQuery: 'cordless stick vacuum cleaner hepa filter' },
      { name: 'HEPA Room Air Purifiers', slug: 'air-purifiers', searchQuery: 'room air purifier true hepa filter pm2.5' },
    ],
  },
  {
    id: 'fashion-apparel',
    slug: 'fashion-apparel',
    name: 'Fashion & Apparel',
    emoji: '👕',
    description: 'Menswear, womenswear, activewear & jackets',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Men Pure Cotton Shirts & Polos', slug: 'mens-shirts', searchQuery: 'men 100 percent cotton formal casual shirts' },
      { name: 'Women Ethnic Sarees & Kurtas', slug: 'ethnic-wear', searchQuery: 'women pure cotton kurti palazzo set saree' },
      { name: 'Thermal Jackets & Hoodies', slug: 'jackets-hoodies', searchQuery: 'winter lightweight down puffer jacket hoodie' },
    ],
  },
  {
    id: 'footwear',
    slug: 'footwear',
    name: 'Footwear',
    emoji: '👟',
    description: 'Running shoes, sneakers, leather formals & sandals',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Cushioned Running Shoes', slug: 'running-shoes', searchQuery: 'breathable road running shoes lightweight bounce' },
      { name: 'Streetwear Sneakers', slug: 'sneakers', searchQuery: 'casual lifestyle streetwear sneakers white' },
      { name: 'Genuine Leather Formal Shoes', slug: 'formal-shoes', searchQuery: 'genuine leather formal oxford derby shoes' },
    ],
  },
  {
    id: 'jewellery-accessories',
    slug: 'jewellery-accessories',
    name: 'Jewellery & Luxury Watches',
    emoji: '💍',
    description: 'Sterling silver jewellery, analog chronographs & sunglasses',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: '925 Sterling Silver Jewellery', slug: 'silver-jewellery', searchQuery: '925 sterling silver necklace pendant earrings' },
      { name: 'Analog Chronograph Watches', slug: 'analog-watches', searchQuery: 'men analog chronograph stainless steel watch' },
      { name: 'Polarized UV Sunglasses', slug: 'sunglasses', searchQuery: 'polarized sunglasses 100 uv protection' },
    ],
  },
  {
    id: 'beauty-cosmetics',
    slug: 'beauty-cosmetics',
    name: 'Beauty & Cosmetics',
    emoji: '💄',
    description: 'Vitamin C serums, sunscreen gels, perfumes & makeup',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Vitamin C & Hyaluronic Serums', slug: 'face-serums', searchQuery: 'vitamin c 10 percent hyaluronic face serum' },
      { name: 'SPF 50+ Broad Spectrum Sunscreen', slug: 'sunscreen', searchQuery: 'spf 50 pa broad spectrum sunscreen gel' },
      { name: 'Long-Lasting Eau De Parfum', slug: 'perfumes', searchQuery: 'luxury long lasting eau de parfum for men women' },
    ],
  },
  {
    id: 'personal-care-appliances',
    slug: 'personal-care-appliances',
    name: 'Personal Care Appliances',
    emoji: '🪒',
    description: 'Beard trimmers, ionic hair dryers & sonic toothbrushes',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Cordless Beard Trimmers', slug: 'beard-trimmers', searchQuery: 'cordless beard trimmer fast charging self sharpening' },
      { name: 'Ionic Hair Dryers & Stylers', slug: 'hair-dryers', searchQuery: 'ionic hair dryer fast drying heat protection' },
      { name: 'Rechargeable Sonic Toothbrushes', slug: 'electric-toothbrushes', searchQuery: 'sonic electric toothbrush ultrasonic replacement heads' },
    ],
  },
  {
    id: 'baby-kids',
    slug: 'baby-kids',
    name: 'Baby & Kids',
    emoji: '🍼',
    description: 'Hypoallergenic baby wipes, diapers, car seats & strollers',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: '99% Pure Water Baby Wipes', slug: 'baby-wipes', searchQuery: '99 pure water baby wipes unscented hypoallergenic' },
      { name: 'Anti-Rash Overnight Pants Diapers', slug: 'baby-diapers', searchQuery: 'pant style baby diapers 12 hour leak lock' },
      { name: 'ISOFIX Convertible Baby Car Seats', slug: 'car-seats', searchQuery: 'isofix baby car seat 0 to 12 years crash tested' },
    ],
  },
  {
    id: 'toys-games',
    slug: 'toys-games',
    name: 'Toys & Games',
    emoji: '🧸',
    description: 'STEM building kits, board games, RC cars & educational puzzles',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'STEM Robotics & Building Sets', slug: 'stem-toys', searchQuery: 'stem robotic building block kit for kids' },
      { name: 'High-Speed 4WD RC Cars', slug: 'rc-cars', searchQuery: 'high speed 4wd rc offroad monster truck' },
      { name: 'Strategic Family Board Games', slug: 'board-games', searchQuery: 'strategy family board games brain development' },
    ],
  },
  {
    id: 'sports-fitness',
    slug: 'sports-fitness',
    name: 'Sports & Fitness',
    emoji: '🏋️',
    description: 'TPE yoga mats, adjustable dumbbells, treadmills & badminton',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: '6mm Anti-Slip TPE Yoga Mats', slug: 'yoga-mats', searchQuery: '6mm anti slip tpe yoga mat with strap' },
      { name: 'Quick-Lock Adjustable Dumbbells', slug: 'dumbbells', searchQuery: 'adjustable dumbbell set quick selector dial' },
      { name: 'Graphite Pro Badminton Rackets', slug: 'badminton-gear', searchQuery: 'full graphite high tension badminton racket' },
    ],
  },
  {
    id: 'automotive-accessories',
    slug: 'automotive-accessories',
    name: 'Automotive Accessories',
    emoji: '🛞',
    description: '4K dual dashcams, portable tyre inflators & high-power car vacuums',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: '4K Dual Dashcams (Front & Rear)', slug: 'dashcams', searchQuery: '4k dual dashcam front and rear night vision gps' },
      { name: 'Rechargeable Digital Tyre Inflators', slug: 'tyre-inflators', searchQuery: 'portable digital tyre inflator auto shutoff' },
      { name: 'High-Suction Cordless Car Vacuums', slug: 'car-vacuums', searchQuery: 'high power cordless car vacuum cleaner hepa' },
    ],
  },
  {
    id: 'garden-outdoor',
    slug: 'garden-outdoor',
    name: 'Garden & Outdoor',
    emoji: '🪴',
    description: 'Drip irrigation kits, solar garden lights & pressure washers',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Automated Drip Irrigation Kits', slug: 'drip-irrigation', searchQuery: 'automatic drip irrigation kit for home garden terrace' },
      { name: 'Waterproof Solar Garden Spotlights', slug: 'solar-lights', searchQuery: 'solar powered led garden lights waterproof auto on' },
      { name: 'High-Pressure Washer Machines', slug: 'pressure-washers', searchQuery: 'high pressure washer 140 bar for car garden' },
    ],
  },
  {
    id: 'tools-hardware',
    slug: 'tools-hardware',
    name: 'Tools & Hardware',
    emoji: '🔨',
    description: 'Cordless brushless drill kits, toolboxes & laser distance meters',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Cordless Brushless Impact Drills', slug: 'cordless-drills', searchQuery: 'brushless cordless drill driver kit 20v lithium' },
      { name: 'Hand Toolkits with Heavy Case', slug: 'tool-kits', searchQuery: 'professional home tool kit set with hard case' },
      { name: 'Digital Laser Distance Measures', slug: 'laser-measures', searchQuery: 'laser distance meter 50m accurate digital' },
    ],
  },
  {
    id: 'books-education-stationery',
    slug: 'books-education-stationery',
    name: 'Books & Stationery',
    emoji: '📚',
    description: 'Self-help bestsellers, luxury fountain pens & journals',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Productivity & Leadership Bestsellers', slug: 'bestseller-books', searchQuery: 'bestselling business productivity self help books' },
      { name: 'Luxury Fine Nib Fountain Pens', slug: 'fountain-pens', searchQuery: 'fine nib luxury fountain pen gift box' },
      { name: 'Hardbound Dotted Bullet Journals', slug: 'bullet-journals', searchQuery: '160 gsm paper dotted bullet journal notebook' },
    ],
  },
  {
    id: 'musical-instruments',
    slug: 'musical-instruments',
    name: 'Musical Instruments',
    emoji: '🎸',
    description: 'Acoustic guitars, touch-sensitive electronic keyboards & ukuleles',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Solid Spruce Acoustic Guitars', slug: 'acoustic-guitars', searchQuery: 'acoustic guitar solid spruce top 41 inch' },
      { name: '61-Key Touch Sensitive Keyboards', slug: 'electronic-keyboards', searchQuery: '61 key touch sensitive piano keyboard with adapter' },
      { name: 'Concert Mahogany Ukuleles', slug: 'ukuleles', searchQuery: 'concert ukulele mahogany wood with padded bag' },
    ],
  },
  {
    id: 'pet-products',
    slug: 'pet-products',
    name: 'Pet Supplies & Food',
    emoji: '🐾',
    description: 'High-protein grain-free dog food, cat litter & grooming tools',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Grain-Free High-Protein Dog Food', slug: 'dog-food', searchQuery: 'grain free dry dog food real chicken and vegetables' },
      { name: 'Bentonite Clumping Cat Litter', slug: 'cat-litter', searchQuery: 'odor control clumping bentonite cat litter' },
      { name: 'Self-Cleaning Pet Slicker Brushes', slug: 'pet-grooming', searchQuery: 'self cleaning pet slicker shedding brush' },
    ],
  },
  {
    id: 'grocery-food',
    slug: 'grocery-food',
    name: 'Packaged Grocery & Gourmet',
    emoji: '🥑',
    description: 'Cold-pressed extra virgin olive oils, rolled oats & almonds',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Cold-Pressed Extra Virgin Olive Oil', slug: 'olive-oil', searchQuery: 'cold pressed extra virgin olive oil 1 litre' },
      { name: 'Gluten-Free Rolled Oats', slug: 'rolled-oats', searchQuery: 'gluten free whole rolled oats jumbo size' },
      { name: 'Premium California Almonds', slug: 'almonds-dry-fruits', searchQuery: 'california almonds raw jumbo 1kg pack' },
    ],
  },
  {
    id: 'beverages',
    slug: 'beverages',
    name: 'Beverages & Coffee/Tea',
    emoji: '☕',
    description: '100% Arabica artisanal whole coffee beans, green teas & kombucha',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: '100% Arabica Medium Roast Coffee', slug: 'artisanal-coffee', searchQuery: '100 arabica medium roast whole bean ground coffee' },
      { name: 'Whole Leaf Darjeeling Green Tea', slug: 'green-tea', searchQuery: 'pure whole leaf organic darjeeling green tea' },
      { name: 'Organic Sparkling Fermented Kombucha', slug: 'kombucha', searchQuery: 'raw organic probiotic kombucha drink zero sugar' },
    ],
  },
  {
    id: 'health-wellness',
    slug: 'health-wellness',
    name: 'Health & Wellness',
    emoji: '💊',
    description: 'Gold standard whey isolate, digital BP monitors & multivitamins',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: '100% Whey Protein Isolate Powder', slug: 'whey-protein', searchQuery: '100 whey protein isolate microfiltered powder' },
      { name: 'Digital Blood Pressure Monitors', slug: 'bp-monitors', searchQuery: 'digital upper arm blood pressure monitor clinical' },
      { name: 'Omega-3 Triple Strength Fish Oil', slug: 'fish-oil', searchQuery: 'triple strength omega 3 fish oil epa dha capsules' },
    ],
  },
  {
    id: 'telecom-digital-services',
    slug: 'telecom-digital-services',
    name: 'Telecom & Digital Services',
    emoji: '📶',
    description: 'High-speed gigabit fiber, international eSIMs & secure VPNs',
    ctaType: 'telecom_compare',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Gigabit FTTH Home Fiber Broadband', slug: 'broadband-fiber', searchQuery: 'gigabit fiber broadband unlimited plans compare' },
      { name: 'Global Instant Travel eSIMs', slug: 'travel-esim', searchQuery: 'international travel esim unlimited data global' },
      { name: 'Zero-Log Fast Encryption VPNs', slug: 'vpn-services', searchQuery: 'fast no log privacy vpn secure tunneling' },
    ],
  },
  {
    id: 'travel-luggage',
    slug: 'travel-luggage',
    name: 'Travel & Luggage',
    emoji: '🧳',
    description: 'Polycarbonate trolley bags, water-repellent travel backpacks & packing cubes',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Unbreakable Polycarbonate Trolley', slug: 'trolley-bags', searchQuery: 'hard sided polycarbonate spinner luggage tsa lock' },
      { name: 'Water-Repellent Travel Backpacks', slug: 'travel-backpacks', searchQuery: 'anti theft water resistant laptop travel backpack' },
      { name: 'Compression Packing Cube Sets', slug: 'packing-cubes', searchQuery: 'compression travel packing cubes organizer set' },
    ],
  },
  {
    id: 'office-business-products',
    slug: 'office-business-products',
    name: 'Office & Business Supplies',
    emoji: '📎',
    description: 'High-speed document scanners, cross-cut shredders & thermal label printers',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Duplex Automatic Document Scanners', slug: 'document-scanners', searchQuery: 'duplex color document scanner adf feeder' },
      { name: 'Micro-Cut Paper & Credit Card Shredders', slug: 'paper-shredders', searchQuery: 'micro cut heavy duty paper shredder' },
      { name: 'Bluetooth Shipping Thermal Label Printers', slug: 'label-printers', searchQuery: 'bluetooth direct thermal shipping label printer 4x6' },
    ],
  },
  {
    id: 'security-smart-home',
    slug: 'security-smart-home',
    name: 'Security & Smart Home',
    emoji: '🔒',
    description: '360° WiFi CCTV cameras, smart door locks & video doorbells',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: '360° WiFi CCTV Security Cameras', slug: 'cctv-cameras', searchQuery: '360 degree wifi cctv outdoor security camera 2k color night vision' },
      { name: 'Biometric Smart Door Locks', slug: 'smart-locks', searchQuery: 'smart digital door lock fingerprint pin card keyless' },
      { name: 'HD Video Doorbells with 2-Way Talk', slug: 'video-doorbells', searchQuery: 'wireless wifi video doorbell chime camera' },
    ],
  },
  {
    id: 'cycles-e-mobility',
    slug: 'cycles-e-mobility',
    name: 'Cycles & E-Mobility',
    emoji: '🚲',
    description: 'Electric bicycles, mountain geared bikes & commuter cycles',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Electric Bicycles (E-Cycles)', slug: 'electric-cycles', searchQuery: 'electric bicycle throttle pedal assist removable battery' },
      { name: 'Mountain Geared Bicycles (MTB)', slug: 'mountain-bikes', searchQuery: '21 speed shimano gear mountain bike disc brakes' },
      { name: 'Hybrid City Commuter Cycles', slug: 'hybrid-cycles', searchQuery: 'lightweight hybrid city commuter bicycle alloy frame' },
    ],
  },
  {
    id: 'gifts-party-occasions',
    slug: 'gifts-party-occasions',
    name: 'Gifts, Party & Occasions',
    emoji: '🎁',
    description: 'Curated gourmet gift hampers, festive string lights & aromatherapy sets',
    ctaType: 'amazon',
    bannerImage: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Curated Gourmet Gift Hampers', slug: 'gift-hampers', searchQuery: 'luxury gourmet gift hamper chocolate grooming box' },
      { name: 'Warm White Festive Fairy Lights', slug: 'fairy-lights', searchQuery: 'warm white led fairy string curtain lights waterproof' },
      { name: 'Aromatherapy Scented Candle Sets', slug: 'scented-candles', searchQuery: 'organic soy wax scented candles gift set essential oils' },
    ],
  },

  // ==========================================
  // AUTOMOTIVE (CarDekho & BikeDekho Affiliate)
  // ==========================================
  {
    id: 'automotive-cars',
    slug: 'automotive-cars',
    name: 'Cars & SUVs (CarDekho)',
    emoji: '🚗',
    description: 'Real on-road price, engine specs, mileage & verified ownership reviews',
    ctaType: 'cardekho',
    bannerImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Mid-Size & Full-Size SUVs', slug: 'suvs', searchQuery: 'best suv in india 2026' },
      { name: 'Compact SUVs & Crossovers', slug: 'compact-suvs', searchQuery: 'compact suv under 15 lakh' },
      { name: 'Sedans & Executive Cars', slug: 'sedans', searchQuery: 'best sedan cars in india' },
      { name: 'Electric Vehicles (EV Cars)', slug: 'electric-cars', searchQuery: 'electric cars long range' },
    ],
  },
  {
    id: 'bikes-scooters',
    slug: 'bikes-scooters',
    name: 'Bikes & Scooters (BikeDekho)',
    emoji: '🏍️',
    description: 'Royal Enfield, commuter bikes, high-range EV scooters & sports motorcycles',
    ctaType: 'cardekho',
    bannerImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Cruiser & Classic Motorcycles', slug: 'cruiser-bikes', searchQuery: 'royal enfield classic 350 hunter' },
      { name: 'Electric Scooters (High Range)', slug: 'ev-scooters', searchQuery: 'best electric scooter high range fast charging' },
      { name: 'Commuter 125cc Bikes & Scooters', slug: 'commuter-bikes', searchQuery: 'activa 6g jupiter shine best mileage' },
    ],
  },

  // ==========================================
  // HOSPITALITY & TRAVEL (Booking.com / Zomato / Airbnb)
  // ==========================================
  {
    id: 'hotels-stays',
    slug: 'hotels-stays',
    name: 'Hotels & 5-Star Stays (Booking.com)',
    emoji: '🏨',
    description: 'Taj, Marriott, Hyatt, boutique stays with verified guest reviews & live availability',
    ctaType: 'hotels',
    bannerImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: '5-Star Luxury Heritage Hotels', slug: 'luxury-hotels', searchQuery: '5 star luxury hotel' },
      { name: 'Beachfront Hotels & Stays', slug: 'beach-hotels', searchQuery: 'beachfront hotel in goa' },
      { name: 'Business & Airport Hotels', slug: 'business-hotels', searchQuery: 'business hotel near airport' },
    ],
  },
  {
    id: 'resorts-getaways',
    slug: 'resorts-getaways',
    name: 'Luxury Resorts & Getaways',
    emoji: '🏖️',
    description: 'Beach resorts, hill-station retreats, wellness spas & weekend getaways',
    ctaType: 'resorts',
    bannerImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Beachfront Resorts & Spas', slug: 'beach-resorts', searchQuery: 'beach resort in goa with private beach' },
      { name: 'Hill Station & Nature Retreats', slug: 'hill-resorts', searchQuery: 'luxury resort in manali shimla munnar' },
      { name: 'Wellness & Ayurvedic Spas', slug: 'wellness-resorts', searchQuery: 'ayurvedic wellness retreat resort' },
    ],
  },
  {
    id: 'restaurants-dining',
    slug: 'restaurants-dining',
    name: 'Restaurants & Fine Dining (Zomato)',
    emoji: '🍽️',
    description: 'Authentic Mughlai, biryanis, fine dining, buffet spreads & chef specials',
    ctaType: 'restaurants',
    bannerImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Authentic Mughlai & Dum Biryanis', slug: 'biryani-mughlai', searchQuery: 'best authentic biryani restaurant' },
      { name: 'Luxury 5-Star Fine Dining', slug: 'fine-dining', searchQuery: 'luxury fine dining restaurant' },
      { name: 'Buffet & Family Barbeque', slug: 'family-buffet', searchQuery: 'unlimited buffet barbecue restaurant' },
    ],
  },
  {
    id: 'villas-homestays',
    slug: 'villas-homestays',
    name: 'Villas & Homestays (Airbnb)',
    emoji: '🏡',
    description: 'Private pool villas, heritage homestays, nature cottages & farmhouses',
    ctaType: 'villas',
    bannerImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Private Pool Luxury Villas', slug: 'pool-villas', searchQuery: 'private pool villa in goa lonavala' },
      { name: 'Heritage Homestays & Cottages', slug: 'homestays', searchQuery: 'heritage homestay nature cottage' },
      { name: 'Party Farmhouses & Estates', slug: 'farmhouses', searchQuery: 'luxury farmhouse with pool for weekend' },
    ],
  },
  {
    id: 'cafes-pubs',
    slug: 'cafes-pubs',
    name: 'Cafes, Bakeries & Pubs (Zomato)',
    emoji: '☕',
    description: 'Artisanal roasteries, sourdough bakeries, rooftop lounges & craft breweries',
    ctaType: 'cafes',
    bannerImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Specialty Coffee Roasteries', slug: 'specialty-cafes', searchQuery: 'specialty coffee roastery cafe' },
      { name: 'Artisan European Bakeries', slug: 'bakeries', searchQuery: 'french bakery sourdough croissants' },
      { name: 'Rooftop Lounges & Microbreweries', slug: 'pubs-lounges', searchQuery: 'rooftop lounge craft brewery' },
    ],
  },
  {
    id: 'banquet-halls',
    slug: 'banquet-halls',
    name: 'Banquet Halls & Venues (VenueLook)',
    emoji: '🏛️',
    description: 'Grand wedding halls, lush marriage lawns, banquet venues & corporate spaces',
    ctaType: 'banquets',
    bannerImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Grand AC Banquet Halls', slug: 'ac-banquets', searchQuery: 'luxury ac banquet hall for wedding' },
      { name: 'Sprawling Wedding Lawns & Resorts', slug: 'wedding-lawns', searchQuery: 'wedding lawn and banquet venue' },
      { name: 'Boutique Party & Anniversary Spaces', slug: 'party-halls', searchQuery: 'party hall for birthday anniversary' },
    ],
  },
  {
    id: 'flights-airlines',
    slug: 'flights-airlines',
    name: 'Flights & Airlines (Skyscanner)',
    emoji: '✈️',
    description: 'Compare non-stop routes, lowest fare calendar & airline baggage policies',
    ctaType: 'flights',
    bannerImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Domestic Flight Routes (Delhi, Mumbai, Goa)', slug: 'domestic-flights', searchQuery: 'mumbai to delhi flight' },
      { name: 'International Long-Haul Airlines', slug: 'international-flights', searchQuery: 'international flights cheap tickets' },
      { name: 'Premium Economy & Business Class', slug: 'business-class', searchQuery: 'business class flight deals' },
    ],
  },

  // ==========================================
  // SERVICES, HEALTHCARE, FINANCE & REAL ESTATE
  // ==========================================
  {
    id: 'financial-products-services',
    slug: 'financial-products-services',
    name: 'Financial Products & Credit Cards (BankBazaar)',
    emoji: '💳',
    description: 'Cashback credit cards, high-yield fixed deposits, home loans & term life plans',
    ctaType: 'finance',
    bannerImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Lifetime Free Cashback Credit Cards', slug: 'credit-cards', searchQuery: 'best cashback credit cards lifetime free' },
      { name: 'Low Interest Home & Personal Loans', slug: 'home-loans', searchQuery: 'lowest interest rate home loans compare' },
      { name: '1 Crore Pure Term Life Insurance', slug: 'term-insurance', searchQuery: 'term life insurance 1 crore claim settlement' },
    ],
  },
  {
    id: 'healthcare-hospitals',
    slug: 'healthcare-hospitals',
    name: 'Hospitals & Medical Centers (Info Only)',
    emoji: '🏥',
    description: 'AIIMS, Medanta, Apollo, Max Healthcare - verified clinical specialities & facilities',
    ctaType: 'healthcare',
    bannerImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Premier Multi-Specialty Hospitals', slug: 'multi-specialty-hospitals', searchQuery: 'best multi specialty hospital in delhi mumbai' },
      { name: 'Advanced Cardiology & Cardiac Surgery', slug: 'cardiac-centers', searchQuery: 'best heart hospital bypass cardiology' },
      { name: 'Comprehensive Oncology Cancer Centers', slug: 'cancer-institutes', searchQuery: 'advanced cancer hospital oncology radiation' },
    ],
  },
  {
    id: 'real-estate-properties',
    slug: 'real-estate-properties',
    name: 'Real Estate & 2BHK/3BHK (99acres)',
    emoji: '🏢',
    description: 'Luxury apartments, gated high-rises, builder floors & villas for sale',
    ctaType: 'realestate',
    bannerImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Ready-to-Move 2BHK & 3BHK Flats', slug: '2bhk-3bhk-flats', searchQuery: 'ready to move 2bhk 3bhk flat in delhi ncr' },
      { name: 'Luxury Gated High-Rise Condos', slug: 'luxury-condos', searchQuery: 'luxury residential project clubhouse swimming pool' },
      { name: 'Independent Builder Floors & Plots', slug: 'builder-floors', searchQuery: 'independent builder floor freehold with lift' },
    ],
  },
  {
    id: 'higher-education-courses',
    slug: 'higher-education-courses',
    name: 'Higher Education & Coaching (Shiksha)',
    emoji: '🎓',
    description: 'Top MBA colleges, engineering institutes, online degrees & competitive coaching',
    ctaType: 'education',
    bannerImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    subcategories: [
      { name: 'Top Ranked MBA & PGDM Institutes', slug: 'mba-colleges', searchQuery: 'best mba college in india placements ranking' },
      { name: 'UPSC & Government Exam Coaching', slug: 'upsc-coaching', searchQuery: 'best upsc civil services coaching online offline' },
      { name: 'Accredited Executive Online Degrees', slug: 'online-degrees', searchQuery: 'online mba data science executive masters' },
    ],
  },
];

/**
 * Quick Helper to find a category by slug or query string
 */
export function findCategoryBySlug(slug: string): Category | undefined {
  const norm = slug.toLowerCase().trim();
  return CATEGORIES.find(
    (c) => c.slug === norm || c.id === norm || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === norm
  );
}

/**
 * Match arbitrary search query to the closest category and subcategory
 */
export function matchCategoryFromQuery(query: string): { category: Category; subcategory?: SubCategory } | undefined {
  const norm = query.toLowerCase().trim();

  // 1. Direct subcategory query search
  for (const cat of CATEGORIES) {
    for (const sub of cat.subcategories) {
      if (norm.includes(sub.name.toLowerCase()) || sub.searchQuery.toLowerCase().includes(norm)) {
        return { category: cat, subcategory: sub };
      }
    }
  }

  // 2. Direct category keyword match
  for (const cat of CATEGORIES) {
    if (norm.includes(cat.name.toLowerCase()) || norm.includes(cat.slug)) {
      return { category: cat };
    }
  }

  // 3. Common domain-specific synonyms
  if (/suv|thar|creta|scorpio|fortuner|brezza|seltos|car|automobile|sedan|hatchback/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'automotive-cars')! };
  }
  if (/bike|activa|scooter|motorcycle|bullet|royal enfield/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'bikes-scooters')! };
  }
  if (/hotel|oyo|5 star hotel|stay in|marriott|taj/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'hotels-stays')! };
  }
  if (/resort|beach resort|hill resort|spa retreat/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'resorts-getaways')! };
  }
  if (/restaurant|biryani|dining|eatery|food near/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'restaurants-dining')! };
  }
  if (/villa|homestay|airbnb|farmhouse/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'villas-homestays')! };
  }
  if (/cafe|coffee shop|starbucks|bakery|pub|brewery/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'cafes-pubs')! };
  }
  if (/banquet|marriage hall|wedding venue|party lawn/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'banquet-halls')! };
  }
  if (/flight|air ticket|airline|skyscanner/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'flights-airlines')! };
  }
  if (/card|loan|insurance|bank|fd|mutual fund|bankbazaar/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'financial-products-services')! };
  }
  if (/hospital|doctor|clinic|apollo|aiims|max|fortis/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'healthcare-hospitals')! };
  }
  if (/flat|2bhk|3bhk|property|house for sale|real estate|99acres/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'real-estate-properties')! };
  }
  if (/college|coaching|mba|university|shiksha/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'higher-education-courses')! };
  }
  if (/cctv|camera.*security|smart lock|doorbell/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'security-smart-home')! };
  }
  if (/cycle|bicycle|ebike/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'cycles-e-mobility')! };
  }
  if (/gift|hamper|diwali|candle/i.test(norm)) {
    return { category: CATEGORIES.find((c) => c.slug === 'gifts-party-occasions')! };
  }

  return undefined;
}
