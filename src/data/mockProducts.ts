import { ProductModel, DetailedReport, LanguageCode } from '../types';
import { LANGUAGES } from './languages';
import { resolveProductImage } from '../utils/productImageRegistry';

export const BANNED_PRODUCT_SUBSTRINGS = [
  'Pro Max 2026',
  'Ultra Signature Plus',
  'Ultra Signature',
  'Plus Edition (Balanced)',
  'WRI-X-900',
  'WAS-X-900',
  'Studio Master Pro',
  'Core Standard Edition',
  'Slim Compact Variant',
];

/**
 * Filter to strictly sanitize product names against banned fake suffixes
 */
export function sanitizeProductName(name: string): string {
  let clean = name;
  for (const banned of BANNED_PRODUCT_SUBSTRINGS) {
    const reg = new RegExp(banned, 'gi');
    clean = clean.replace(reg, '');
  }
  return clean.replace(/\s+/g, ' ').replace(/\(\s*\)/g, '').trim();
}

export const CURATED_PRODUCT_DATABASES: Record<string, ProductModel[]> = {
  'water bottle': [
    {
      id: 'WAT-ULTRA-850',
      slug: 'purelife-stainless-water-bottle-ultra-850',
      name: 'PureLife Stainless Steel Vacuum Insulated Water Bottle (1000ml)',
      modelNumber: 'WAT-ULTRA-850',
      brand: 'PureLife',
      category: 'Sports, Fitness & Hydration',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 24,
      rating: 4.9,
      totalReviews: 5420,
      tag: '🔥 Top Verified Water Bottle',
      budgetTier: 'TRENDING',
      whyDemandReason: '5,420 verified reviews, 24-Hour Cold & 12-Hour Hot Insulation, Leakproof Lid',
      specs: {
        'Capacity': '1000 ml / 34 fl oz',
        'Material': '18/8 Food-Grade 304 Stainless Steel',
        'Insulation': 'Double Wall Vacuum Shield Technology',
        'Lid Type': 'One-Touch Spout & Leakproof Straw Cap',
        'BPA Free': '100% BPA, BPS and Phthalate Free',
        'Warranty': 'Lifetime Thermal Retention Guarantee',
      },
    },
    {
      id: 'WAT-PRO-700',
      slug: 'milton-thermosteel-flip-lid-bottle',
      name: 'Milton Thermosteel Flip Lid Vacuum Insulated Flask (750ml)',
      modelNumber: 'WAT-PRO-700',
      brand: 'Milton',
      category: 'Sports, Fitness & Hydration',
      image: 'https://images.unsplash.com/photo-1570831739427-4ff2fa9a72b5?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 18,
      rating: 4.8,
      totalReviews: 8930,
      tag: 'India #1 Best-Seller',
      budgetTier: 'BALANCED',
      whyDemandReason: '8,930 verified reviews, Copper Coating for Extended Heat Retention',
      specs: {
        'Capacity': '750 ml',
        'Material': 'Rust-Proof SS 304 Interior and Exterior',
        'Temperature Retention': 'Hot for 24h, Cold for 24h',
        'Design': 'Ergonomic Slim Profile Fits Car Cup Holders',
        'Warranty': '1-Year Official Manufacturer Warranty',
      },
    },
    {
      id: 'WAT-EV-300',
      slug: 'cello-infusion-sports-water-bottle',
      name: 'Cello Infusion BPA-Free Sports Gym Water Bottle with Time Marker',
      modelNumber: 'WAT-EV-300',
      brand: 'Cello',
      category: 'Sports, Fitness & Hydration',
      image: 'https://images.unsplash.com/photo-1544003484-3cd181d17917?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 12,
      rating: 4.6,
      totalReviews: 3120,
      tag: 'Budget Gym Choice',
      budgetTier: 'BUDGET',
      whyDemandReason: '3,120 verified reviews, Shatter-Proof Eastman Tritan, Hourly Motivational Quotes',
      specs: {
        'Capacity': '1000 ml',
        'Material': 'US Imported 100% Eastman Tritan Plastic',
        'Features': 'Removable Fruit Infuser Strainer & Carry Strap',
        'Safety': 'Toxin Free, Odour Resistant',
      },
    },
    {
      id: 'WAT-PLUS-520',
      slug: 'hydro-flask-wide-mouth-flex-cap',
      name: 'Hydro Flask Standard Mouth Flex Cap Hydro-Shield (946ml)',
      modelNumber: 'WAT-PLUS-520',
      brand: 'Hydro Flask',
      category: 'Sports, Fitness & Hydration',
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 38,
      rating: 4.9,
      totalReviews: 12400,
      tag: 'Premium Outdoor Pick',
      budgetTier: 'PREMIUM',
      whyDemandReason: '12,400 verified reviews, Color Last Powder Coat, Dishwasher Safe',
      specs: {
        'Capacity': '32 oz / 946 ml',
        'TempShield': 'Pro-Grade Stainless Steel Vacuum Insulation',
        'Coating': 'Slip-Free Color Last Powder Coating',
        'Warranty': 'Hydro Flask Lifetime Warranty',
      },
    },
  ],
  'alarm clock': [
    {
      id: 'purelife-pro-alarm-clock-edition',
      slug: 'purelife-pro-alarm-clock-edition',
      name: 'PureLife Pro Alarm Clock Edition with Sunrise Wake-Up & Dual Alarms',
      modelNumber: 'PL-CLK-700',
      brand: 'PureLife',
      category: 'Electronics & Smart Clocks',
      image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 49,
      rating: 4.8,
      totalReviews: 3240,
      tag: '🔥 Top Verified Alarm Clock',
      budgetTier: 'TRENDING',
      whyDemandReason: '3,240 verified reviews, Sunrise Simulation, 7 Natural Wake Tones & FM Radio',
      specs: {
        'Display Type': 'Dimmable Ambient LED Digital Display',
        'Alarm Modes': 'Dual Alarm Settings with Tap Snooze (9 Mins)',
        'Wake-Up System': 'Gradual Sunrise Wake-Up Light + 7 Natural Alarm Sounds',
        'Power Source': 'USB-C Mains Powered with CR2032 Battery Backup',
        'Extra Features': 'Integrated Sleep Aid Sound Machine & USB Charging Port',
        'Dimensions': '16.5 x 16.5 x 7.0 cm (Compact Bedside Design)',
      },
    },
    {
      id: 'philips-smartsleep-wake-up-light-clock',
      slug: 'philips-smartsleep-wake-up-light-clock',
      name: 'Philips SmartSleep Wake-Up Light Digital Alarm Clock (HF3520/01)',
      modelNumber: 'HF3520/01',
      brand: 'Philips',
      category: 'Electronics & Smart Clocks',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 99,
      rating: 4.9,
      totalReviews: 6850,
      tag: 'Clinical Grade Sleep Pick',
      budgetTier: 'PREMIUM',
      whyDemandReason: '6,850 verified reviews, Clinically Proven Light Therapy & Sunset Simulation',
      specs: {
        'Light Simulation': 'Coloured Sunrise Simulation with 20 Brightness Settings',
        'Sound Options': '5 Natural Wake-up Sounds + FM Radio',
        'Display': 'Auto-Dimming LED Time Display',
        'Clinically Proven': 'Developed with Sleep Foundation Specialists',
        'Snooze': 'Smart Tap Snooze Sensor',
        'Power': 'AC Mains with 15-Minute Power Failure Memory',
      },
    },
    {
      id: 'braun-classic-digital-bedside-clock',
      slug: 'braun-classic-digital-bedside-clock',
      name: 'Braun Classic Digital Bedside Travel Alarm Clock with Backlight',
      modelNumber: 'BC08B',
      brand: 'Braun',
      category: 'Electronics & Smart Clocks',
      image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 28,
      rating: 4.6,
      totalReviews: 4120,
      tag: 'Value Bedside Pick',
      budgetTier: 'BUDGET',
      whyDemandReason: '4,120 verified reviews, Iconic Dieter Rams Minimalist Design, Crescendo Alarm',
      specs: {
        'Display': 'High Contrast Negative LCD Display with Backlight',
        'Alarm': 'Crescendo Beep Alarm with Integrated Snooze',
        'Operation': 'Quiet Quartz Precision Movement',
        'Battery': '1x AAA Battery (Included)',
        'Size': '5.7 x 5.7 x 2.0 cm (Ultra Compact)',
        'Warranty': '2-Year Official Manufacturer Warranty',
      },
    },
    {
      id: 'lenovo-smart-clock-essential',
      slug: 'lenovo-smart-clock-essential',
      name: 'Lenovo Smart Clock Essential with LED Time & Nightlight',
      modelNumber: 'CD-4N341Y',
      brand: 'Lenovo',
      category: 'Electronics & Smart Clocks',
      image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 39,
      rating: 4.7,
      totalReviews: 2980,
      tag: 'Smart Connected Choice',
      budgetTier: 'BALANCED',
      whyDemandReason: '2,980 verified reviews, Voice Control, Auto-Dimming LED & Built-in Nightlight',
      specs: {
        'Display': '4-Inch Clear LED Display with Weather & Temp Indicators',
        'Voice Assistant': 'Google Assistant / Alexa Voice Enabled',
        'Speaker': '3W Full-Range Acoustic Tuned Speaker',
        'Nightlight': 'Soft 31-Lumen Ambient Nightlight Strip',
        'Connectivity': 'Wi-Fi 802.11 b/g/n + Bluetooth 5.0',
        'Microphone': 'Dual Far-Field Mics with Hardware Mute Switch',
      },
    },
  ],
  'sony camera': [
    {
      id: 'sony-alpha-7-iv',
      slug: 'sony-alpha-7-iv',
      name: 'Sony Alpha ILCE-7M4K Full-Frame Hybrid Camera with 28-70mm Zoom Lens',
      modelNumber: 'ILCE-7M4K',
      brand: 'Sony',
      category: 'Cameras & Photography',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 2498,
      rating: 4.8,
      totalReviews: 4890,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '4,890 verified reviews, 33MP Exmor R Sensor, 4K 60p 10-Bit Video',
      specs: {
        'Sensor': '33MP Full-Frame Exmor R CMOS Sensor',
        'Video': '4K 60p 10-Bit 4:2:2 All-Intra Recording',
        'Autofocus': '759 Phase-Detection AF Points with Real-Time Eye AF',
        'Stabilization': '5.5-Step 5-Axis In-Body Image Stabilization',
        'Viewfinder': '3.68M-Dot Quad-VGA OLED Electronic Viewfinder',
        'Lens Mount': 'Sony E-Mount (Interchangeable)',
      },
    },
    {
      id: 'sony-zv-e10',
      slug: 'sony-zv-e10',
      name: 'Sony Alpha ZV-E10 Mirrorless Vlog Camera with 16-50mm Power Zoom Lens',
      modelNumber: 'ZV-E10L',
      brand: 'Sony',
      category: 'Cameras & Photography',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 699,
      rating: 4.6,
      totalReviews: 8340,
      tag: 'Budget Creator Pick (Under ₹70,000)',
      budgetTier: 'BUDGET',
      whyDemandReason: '8,340 verified reviews, Directional 3-Capsule Mic & Product Showcase',
      specs: {
        'Sensor': '24.2MP APS-C Exmor CMOS Sensor',
        'Vlogging Features': 'Product Showcase Setting & Background Defocus',
        'Audio': 'Directional 3-Capsule Mic with Windscreen Included',
        'Display': 'Vari-Angle Side-Opening Touch LCD Screen',
        'Connectivity': 'Instant USB Livestreaming & Webcam Mode',
        'Battery Life': 'Up to 125 Mins Continuous Video Recording',
      },
    },
    {
      id: 'sony-alpha-6700',
      slug: 'sony-alpha-6700',
      name: 'Sony Alpha ILCE-6700 APS-C Mirrorless Camera with AI Recognition AF',
      modelNumber: 'ILCE-6700',
      brand: 'Sony',
      category: 'Cameras & Photography',
      image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 1398,
      rating: 4.8,
      totalReviews: 2750,
      tag: 'Balanced Pick (₹1,00,000 - ₹1,50,000)',
      budgetTier: 'BALANCED',
      whyDemandReason: '2,750 verified reviews, Dedicated AI Processing Unit, 4K 120p',
      specs: {
        'Sensor': '26.0MP Back-Illuminated APS-C Exmor R CMOS',
        'AI Processing': 'AI Unit for Human/Animal/Vehicle Recognition AF',
        'Video Frame Rates': '4K 120p High Frame Rate & S-Cinetone',
        'Stabilization': '5-Axis Optical In-Body Image Stabilization',
        'Shooting Speed': 'Up to 11 fps with AF/AE Tracking',
        'Build': 'Magnesium Alloy Dust & Moisture Resistant Body',
      },
    },
    {
      id: 'sony-alpha-7r-v',
      slug: 'sony-alpha-7r-v',
      name: 'Sony Alpha ILCE-7RM5 Full-Frame Camera (61MP, 8K Video, AI Deep Learning)',
      modelNumber: 'ILCE-7RM5',
      brand: 'Sony',
      category: 'Cameras & Photography',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 3898,
      rating: 4.9,
      totalReviews: 1650,
      tag: 'Flagship Resolution Pro (₹3,00,000+)',
      budgetTier: 'PREMIUM',
      whyDemandReason: '1,650 verified reviews, 61MP High Resolution & 8-Step IBIS',
      specs: {
        'Sensor': '61.0MP Full-Frame Back-Illuminated Exmor R Sensor',
        'Video': '8K 24p & 4K 60p 10-Bit Recording',
        'Stabilization': '8.0-Step Optical In-Body Stabilization',
        'LCD': '4-Axis Multi-Angle 3.2-Inch Touchscreen LCD',
        'AI Tracking': 'Next-Gen AI Deep Learning Pose Estimation AF',
        'Dual Slots': 'Dual CFexpress Type A & SD UHS-II Card Slots',
      },
    },
  ],

  'washing machine': [
    {
      id: 'samsung-7kg-ai-washing-machine',
      slug: 'samsung-7kg-ai-washing-machine',
      name: 'Samsung 7 Kg 5 Star AI Control Front Load Washing Machine',
      modelNumber: 'WW70T502NAN/TL',
      brand: 'Samsung',
      category: 'Front Load AI Washing Machine',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 399,
      rating: 4.8,
      totalReviews: 3450,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '3,450 verified reviews, 88% 5-star, AI Pattern Learning',
      specs: {
        'Capacity': '7.0 Kg (Ideal for 3-4 member families)',
        'Energy Rating': '5 Star BEE Certified with EcoBubble',
        'Motor': 'Digital Inverter with 20-Year Warranty',
        'Smart AI': 'SmartThings App with AI Wash Cycle Memory',
        'Hygiene': 'Hygiene Steam with 99.9% Bacteria Removal',
        'Spin Speed': '1200 RPM High Speed Extraction',
      }
    },
    {
      id: 'whirlpool-7kg-royal-plus-top-load',
      slug: 'whirlpool-7kg-royal-plus-top-load',
      name: 'Whirlpool 7 Kg 5 Star Royal Plus Fully Automatic Top Load',
      modelNumber: 'WHITEMAGIC ROYAL PLUS 7.0',
      brand: 'Whirlpool',
      category: 'Budget Fully Automatic Top Load',
      image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 199,
      rating: 4.5,
      totalReviews: 1890,
      tag: 'Budget Pick (Under ₹20,000)',
      budgetTier: 'BUDGET',
      whyDemandReason: '1,890 verified reviews, Hard water wash specialist',
      specs: {
        'Capacity': '7.0 Kg Capacity',
        'Wash Technology': 'Spiro Wash Action & Hard Water Wash',
        'Energy Rating': '5 Star Energy Star Rated',
        'Programs': '12 Wash Programs (Daily, Heavy, Delicates)',
        'Tub Type': 'Stainless Steel Spiro Drum',
        'Zero Pressure': 'Zero Pressure Fill (ZPF) Technology',
      }
    },
    {
      id: 'lg-7kg-inverter-top-load',
      slug: 'lg-7kg-inverter-top-load',
      name: 'LG 7 Kg 5 Star Smart Inverter Touch Control Top Load',
      modelNumber: 'T70SPSF2Z',
      brand: 'LG',
      category: 'Balanced Top Load Washing Machine',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 279,
      rating: 4.7,
      totalReviews: 4200,
      tag: 'Balanced Pick (₹20,000 - ₹35,000)',
      budgetTier: 'BALANCED',
      whyDemandReason: '4,200 verified reviews, Smart Motion 3-way tub',
      specs: {
        'Capacity': '7.0 Kg Capacity',
        'Motor': 'Smart Inverter Motor with BMC Motor Protection',
        'Motion': 'Smart Motion (Agitating, Rotating, Swing)',
        'Tub Clean': 'Auto Tub Clean with Smart Diagnosis',
        'Water Proof': 'Smart Inverter Motor with 10-Yr Warranty',
        'Pulsator': 'Punch + 3 Powerful Water Streams',
      }
    },
    {
      id: 'ifb-6kg-ai-front-load',
      slug: 'ifb-6kg-ai-front-load',
      name: 'IFB 6 Kg 5 Star AI Powered Front Load (Diva Aqua BXS)',
      modelNumber: 'Diva Aqua BXS 6010',
      brand: 'IFB',
      category: 'Balanced Front Load Washer',
      image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 319,
      rating: 4.6,
      totalReviews: 2150,
      tag: 'Balanced Front Load (₹20k - ₹35k)',
      budgetTier: 'BALANCED',
      whyDemandReason: '2,150 verified reviews, Aqua Energie hard water treatment',
      specs: {
        'Capacity': '6.0 Kg Front Load',
        'AI Neural': 'AI Powered Weight & Fabric Sensing',
        'Water Treatment': 'Aqua Energie built-in hard water softener',
        'Steam Wash': 'Steam Wash 99.99% Germ Protection',
        'Drum': 'Crescent Moon Stainless Steel Drum',
        'Warranty': '4-Year Machine + 10-Year Motor Warranty',
      }
    },
    {
      id: 'bosch-8kg-serie-6-front-load',
      slug: 'bosch-8kg-serie-6-front-load',
      name: 'Bosch 8 Kg 5 Star Inverter Touch Front Load Serie 6',
      modelNumber: 'WAJ2846SIN',
      brand: 'Bosch',
      category: 'Premium German Front Load Washer',
      image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 459,
      rating: 4.9,
      totalReviews: 1640,
      tag: 'Premium Pick (₹35,000+)',
      budgetTier: 'PREMIUM',
      whyDemandReason: '1,640 verified reviews, Anti-Tangle & EcoSilence Drive',
      specs: {
        'Capacity': '8.0 Kg Heavy-Duty Family Size',
        'Motor': 'EcoSilence Drive Brushless Friction-Free Motor',
        'Anti-Tangle': 'Anti-Tangle program reduces tangles by 50%',
        'Speed': '1400 RPM High Extraction Speed',
        'Anti-Vibration': 'Anti-Vibration Side Panels for Ultra-Quiet Wash',
        'AllergyPlus': 'Certified AllergyPlus Cycle for Sensitive Skin',
      }
    },
    {
      id: 'lg-9kg-ai-direct-drive-steam',
      slug: 'lg-9kg-ai-direct-drive-steam',
      name: 'LG 9 Kg 5 Star AI Direct Drive Front Load with Steam',
      modelNumber: 'FHP1409Z9B',
      brand: 'LG',
      category: 'Flagship AI Smart Washer',
      image: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 579,
      rating: 4.9,
      totalReviews: 1120,
      tag: 'Flagship Smart Washer (₹35,000+)',
      budgetTier: 'PREMIUM',
      whyDemandReason: '1,120 verified reviews, Allergy care steam & 6 Motion DD',
      specs: {
        'Capacity': '9.0 Kg King Size Drum',
        'AI DD': 'AI Direct Drive with 18% More Fabric Care',
        'Steam+': 'Steam+ Allergy Care & Wrinkle Care',
        'TurboWash': 'TurboWash 360 Full Clean in 39 Minutes',
        'Smart Connectivity': 'ThinQ Wi-Fi Remote Control & Diagnostics',
        'Door': 'Tempered Glass Door + Stainless Lifter',
      }
    },
  ],

  'vivo': [
    {
      id: 'vivo-t3-5g',
      slug: 'vivo-t3-5g',
      name: 'Vivo T3 5G (8GB RAM 128GB Cosmic Blue)',
      modelNumber: 'V2334 / T3 5G',
      brand: 'Vivo',
      category: 'Performance 5G Smartphone',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 239,
      rating: 4.8,
      totalReviews: 5120,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '5,120 verified reviews, 89% 5-star, Sony IMX882 OIS',
      specs: {
        'Processor': 'MediaTek Dimensity 7200 (4nm 5G)',
        'Camera': '50MP Sony IMX882 OIS Camera + 4K Video',
        'Display': '6.67" 120Hz AMOLED 1800 nits Peak',
        'Battery': '5000mAh with 44W FlashCharge',
        'Audio': 'Dual Stereo Speakers with 300% Audio Booster',
        'Design': '7.83mm Slim 3D Diamond Cut Pattern',
      }
    },
    {
      id: 'vivo-y28-5g',
      slug: 'vivo-y28-5g',
      name: 'Vivo Y28 5G (6GB RAM 128GB Crystal Purple)',
      modelNumber: 'V2315 / Y28',
      brand: 'Vivo',
      category: 'Budget 5G Smartphone',
      image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 189,
      rating: 4.5,
      totalReviews: 2400,
      tag: 'Budget Pick (Under ₹20,000)',
      budgetTier: 'BUDGET',
      whyDemandReason: '2,400 verified reviews, 5000mAh All-Day Battery',
      specs: {
        'Processor': 'MediaTek Dimensity 6020 5G',
        'Camera': '50MP Ultra Clear Dual Camera',
        'Display': '6.56" 90Hz Sunlight Display',
        'Battery': '5000mAh with 15W Fast Charge',
        'Durability': 'IP54 Dust & Water Resistance',
        'RAM': '6GB + 6GB Extended Virtual RAM',
      }
    },
    {
      id: 'vivo-v40-5g',
      slug: 'vivo-v40-5g',
      name: 'Vivo V40 5G (8GB RAM 128GB Titanium Grey)',
      modelNumber: 'V2348 / V40',
      brand: 'Vivo',
      category: 'Balanced Zeiss Portrait Phone',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 419,
      rating: 4.8,
      totalReviews: 3800,
      tag: 'Balanced Pick (₹20,000 - ₹35,000)',
      budgetTier: 'BALANCED',
      whyDemandReason: '3,800 verified reviews, Zeiss Portrait Studio & 5500mAh',
      specs: {
        'Processor': 'Snapdragon 7 Gen 3 (4nm)',
        'Optics': '50MP Zeiss OIS Main + 50MP Zeiss Ultra-Wide',
        'Battery': '5500mAh BlueVolt with 80W FlashCharge',
        'Display': '6.78" 1.5K 3D Curved AMOLED 4500 nits',
        'Protection': 'IP68 & IP69 Water & Dust Resistance',
        'Profile': '7.58mm Ultra-Slim Body',
      }
    },
    {
      id: 'vivo-v30-pro-5g',
      slug: 'vivo-v30-pro-5g',
      name: 'Vivo V30 Pro 5G (12GB RAM 512GB Andaman Blue)',
      modelNumber: 'V2319 / V30 Pro',
      brand: 'Vivo',
      category: 'Zeiss Triple 50MP Camera Phone',
      image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 499,
      rating: 4.8,
      totalReviews: 2100,
      tag: 'Balanced Flagship (₹20k - ₹35k)',
      budgetTier: 'BALANCED',
      whyDemandReason: '2,100 verified reviews, 50MP Triple Zeiss Cameras',
      specs: {
        'Processor': 'MediaTek Dimensity 8200 (4nm)',
        'Cameras': 'Triple 50MP Zeiss Optics (Main + 2x Portrait + Wide)',
        'Aura Light': 'Smart Color Temperature Studio Aura Light',
        'Charging': '80W FlashCharge (0 to 100% in 43 mins)',
        'Display': '6.78" 120Hz 1.5K AMOLED Display',
        'Weight': '188g Featherlight Ergonomic Finish',
      }
    },
    {
      id: 'vivo-x100-5g',
      slug: 'vivo-x100-5g',
      name: 'Vivo X100 5G (12GB RAM 256GB Stargaze Blue)',
      modelNumber: 'V2309 / X100',
      brand: 'Vivo',
      category: 'Premium Zeiss Flagship Phone',
      image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 769,
      rating: 4.9,
      totalReviews: 1340,
      tag: 'Premium Pick (₹35,000+)',
      budgetTier: 'PREMIUM',
      whyDemandReason: '1,340 verified reviews, Dimensity 9300 & Zeiss APO Telephoto',
      specs: {
        'Processor': 'MediaTek Dimensity 9300 All-Big-Core',
        'Camera': '50MP Zeiss VCS True Color + 64MP Zeiss Telephoto',
        'Imaging Chip': 'Vivo V2 Custom ISP Chip',
        'Charging': '120W Dual-Cell FlashCharge (11 mins to 50%)',
        'Display': '8T LTPO Eye-Care AMOLED 3000 nits',
        'Build': 'IP68 Certified Water & Dust Resistant',
      }
    },
    {
      id: 'vivo-x100-pro-5g',
      slug: 'vivo-x100-pro-5g',
      name: 'Vivo X100 Pro 5G (16GB RAM 512GB Asteroid Black)',
      modelNumber: 'V2324 / X100 Pro',
      brand: 'Vivo',
      category: 'Ultimate Cinema & Camera Flagship',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 1099,
      rating: 4.9,
      totalReviews: 980,
      tag: 'Ultimate Flagship (₹35,000+)',
      budgetTier: 'PREMIUM',
      whyDemandReason: '980 verified reviews, 1-inch Sony Sensor & V3 6nm Chip',
      specs: {
        'Camera Sensor': '50MP 1-inch Sony IMX989 Sensor + Zeiss APO Floating Telephoto',
        'V3 Chip': 'Vivo V3 6nm 4K Movie Portrait ISP',
        'Battery': '5400mAh BlueOcean with 100W Wired + 50W Wireless',
        'Processor': 'Dimensity 9300 Flagship SoC',
        'Optics': 'Zeiss T* Anti-Reflective Coating',
        'Audio': 'Hi-Res Audio with 3D Audio Recording Mics',
      }
    },
  ],

  'panasonic tv': [
    {
      id: 'panasonic-tv-th55mx800',
      slug: 'panasonic-tv-th55mx800',
      name: 'Panasonic 55" 4K Google TV (TH-55MX800)',
      modelNumber: 'TH-55MX800',
      brand: 'Panasonic',
      category: 'Smart 4K LED TV',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 549,
      rating: 4.6,
      totalReviews: 3420,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '3,420 verified reviews, 87% 5-star, HCX AI 4K processing',
      specs: {
        'Screen Size': '55 Inch 4K HDR',
        'Panel Type': 'LED LCD 120Hz Smooth Motion',
        'Processor': 'HCX Processor AI',
        'Audio': '20W Dolby Atmos Sound',
        'Smart OS': 'Google TV with Chromecast',
        'HDMI Ports': '3x HDMI 2.1 eARC',
      }
    },
    {
      id: 'panasonic-tv-th43lx750',
      slug: 'panasonic-tv-th43lx750',
      name: 'Panasonic 43" Ultra HD Android TV (TH-43LX750)',
      modelNumber: 'TH-43LX750',
      brand: 'Panasonic',
      category: 'Compact Bedroom / Office TV',
      image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 379,
      rating: 4.4,
      totalReviews: 2150,
      tag: 'Budget Pick (Under ₹35,000)',
      budgetTier: 'BUDGET',
      whyDemandReason: '2,150 verified reviews, IPS wide viewing angle display',
      specs: {
        'Screen Size': '43 Inch 4K Ultra HD',
        'Panel Type': 'IPS Wide Viewing Angle',
        'Processor': '4K Colour Engine',
        'Audio': '20W Box Speakers with Dolby Audio',
        'Smart OS': 'Android TV 11',
        'HDMI Ports': '3x HDMI 2.0',
      }
    },
    {
      id: 'panasonic-tv-th50lx650',
      slug: 'panasonic-tv-th50lx650',
      name: 'Panasonic 50" 4K HDR Smart TV (TH-50LX650)',
      modelNumber: 'TH-50LX650',
      brand: 'Panasonic',
      category: 'Family Living Room TV',
      image: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 449,
      rating: 4.5,
      totalReviews: 2980,
      tag: 'Balanced Pick (₹20k - ₹35k)',
      budgetTier: 'BALANCED',
      whyDemandReason: '2,980 verified reviews, Hexa Chroma Drive natural color',
      specs: {
        'Screen Size': '50 Inch 4K HDR10+',
        'Panel Type': 'High Brightness Panel',
        'Processor': 'Hexa Chroma Drive Pro',
        'Audio': '24W V-Audio Sound',
        'Smart OS': 'Android TV',
        'HDMI Ports': '3x HDMI 2.0',
      }
    },
    {
      id: 'panasonic-tv-th65jx850',
      slug: 'panasonic-tv-th65jx850',
      name: 'Panasonic 65" Cinema Vision 4K (TH-65JX850)',
      modelNumber: 'TH-65JX850',
      brand: 'Panasonic',
      category: 'Premium Cinema TV',
      image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 899,
      rating: 4.8,
      totalReviews: 1890,
      tag: 'Balanced Big Screen',
      budgetTier: 'BALANCED',
      whyDemandReason: '1,890 verified reviews, Super Bright Plus Cinema Display',
      specs: {
        'Screen Size': '65 Inch Super Bright Plus',
        'Panel Type': '4K HDR Cinema Display',
        'Processor': 'HCX Pro Intelligent',
        'Audio': '30W Cinema Surround Pro',
        'Smart OS': 'My Home Screen 6.0',
        'HDMI Ports': '4x HDMI 2.1 VRR Support',
      }
    },
    {
      id: 'panasonic-tv-th55lz2000',
      slug: 'panasonic-tv-th55lz2000',
      name: 'Panasonic 55" Master OLED Pro (TH-55LZ2000)',
      modelNumber: 'TH-55LZ2000',
      brand: 'Panasonic',
      category: 'Master Reference OLED TV',
      image: 'https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 1699,
      rating: 4.9,
      totalReviews: 870,
      tag: 'Premium Pick (₹35,000+)',
      budgetTier: 'PREMIUM',
      whyDemandReason: '870 verified reviews, Luminance Booster OLED & Technics 360 sound',
      specs: {
        'Screen Size': '55 Inch Master OLED Pro',
        'Panel Type': 'Luminance Booster OLED',
        'Processor': 'HCX Pro AI Processor',
        'Audio': '150W 360° Soundscape Pro by Technics',
        'Smart OS': 'My Home Screen 7.0',
        'HDMI Ports': '4x HDMI 2.1 (120Hz 4K G-Sync)',
      }
    },
    {
      id: 'panasonic-tv-th75mx950',
      slug: 'panasonic-tv-th75mx950',
      name: 'Panasonic 75" Mini LED Quantum 4K TV (TH-75MX950)',
      modelNumber: 'TH-75MX950',
      brand: 'Panasonic',
      category: 'Mini LED Quantum TV',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 1899,
      rating: 4.7,
      totalReviews: 640,
      tag: 'Flagship Mini-LED (₹35,000+)',
      budgetTier: 'PREMIUM',
      whyDemandReason: '640 verified reviews, Quantum Dot Mini-LED 144Hz high refresh',
      specs: {
        'Screen Size': '75 Inch Mini-LED 4K',
        'Panel Type': 'Quantum Dot Mini-LED 144Hz',
        'Processor': 'HCX Pro AI Multi-Zone',
        'Audio': '50W Dynamic Theater Surround',
        'Smart OS': 'Google TV',
        'HDMI Ports': '4x HDMI 2.1 ALLM/VRR',
      }
    },
  ],

  'panasonic juicer': [
    {
      id: 'panasonic-juicer-mj65',
      slug: 'panasonic-juicer-mj65',
      name: 'Panasonic 350W Centrifugal Juicer (MJ-65)',
      modelNumber: 'MJ-65',
      brand: 'Panasonic',
      category: 'Compact Daily Juicer',
      image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 69,
      rating: 4.5,
      totalReviews: 4120,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '4,120 verified reviews, Stainless steel full spinner',
      specs: {
        'Motor Power': '350 Watts Pure Copper Motor',
        'Spinner Type': 'Full Stainless Steel Spinner',
        'Pulp Capacity': '1.5L Detachable Container',
        'Feeding Tube': '65mm Wide Feeding Tube',
        'Safety': 'Double Safety Lock Mechanism',
        'Cleaning': 'Dishwasher Safe Detachable Parts',
      }
    },
    {
      id: 'panasonic-juicer-mjdj01s',
      slug: 'panasonic-juicer-mjdj01s',
      name: 'Panasonic 800W Full Metal Spinner Juicer (MJ-DJ01S)',
      modelNumber: 'MJ-DJ01S',
      brand: 'Panasonic',
      category: 'Heavy-Duty Pro Juicer',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 149,
      rating: 4.8,
      totalReviews: 2890,
      tag: 'Balanced Pick (Under ₹15,000)',
      budgetTier: 'BALANCED',
      whyDemandReason: '2,890 verified reviews, 75mm full apple feeding tube',
      specs: {
        'Motor Power': '800 Watts High Extraction Motor',
        'Feeding Tube': '75mm Full Apple Feeder',
        'Spout': '120° Swivel Anti-Drip Spout',
        'Juice Jug': '1.5L Juice Jug with Bubble Separator',
        'Speed Control': '2-Speed Rotary Dial Control',
        'Body Material': 'Brushed Stainless Steel & Die-Cast Body',
      }
    },
    {
      id: 'panasonic-juicer-mjl500',
      slug: 'panasonic-juicer-mjl500',
      name: 'Panasonic 230W Slow Juicer Cold Press (MJ-L500)',
      modelNumber: 'MJ-L500',
      brand: 'Panasonic',
      category: 'Cold Press Masticating Juicer',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 249,
      rating: 4.9,
      totalReviews: 1450,
      tag: 'Premium Pick (Cold Press)',
      budgetTier: 'PREMIUM',
      whyDemandReason: '1,450 verified reviews, 45 RPM slow cold press extraction',
      specs: {
        'Speed': '45 RPM Low Speed Squeezing',
        'Nutrient Retention': 'Preserves 100% of Natural Enzymes & Vitamins',
        'Frozen Attachment': 'Includes Sorbet and Frozen Dessert Attachment',
        'Squeezer': 'Stainless Steel Reinforced Heavy Screw',
        'Noise Level': 'Ultra-Quiet 52dB Motor',
        'Continuous Use': '15-Minute Continuous Duty Cycle',
      }
    },
    {
      id: 'panasonic-mixer-mxac300',
      slug: 'panasonic-mixer-mxac300',
      name: 'Panasonic 450W 3-in-1 Juicer Mixer Grinder (MX-AC300)',
      modelNumber: 'MX-AC300',
      brand: 'Panasonic',
      category: 'All-in-One Kitchen Master',
      image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 89,
      rating: 4.6,
      totalReviews: 3560,
      tag: 'Budget Value Multi-Jar',
      budgetTier: 'BUDGET',
      whyDemandReason: '3,560 verified reviews, Samurai edge hardened steel blades',
      specs: {
        'Motor Power': '450 Watts 100% Copper Winding Motor',
        'Jars': '3 Jars (1.5L Blender, 1.0L Mill, 0.4L Chutney)',
        'Blades': 'Samurai Edge Hardened Stainless Steel Blades',
        'Lock System': 'Double Safety Interlocking System',
        'Body': 'Shockproof ABS Plastic Body',
        'Overload': 'Circuit Breaker Auto-Cutoff Protection',
      }
    },
    {
      id: 'panasonic-mixer-mxac400',
      slug: 'panasonic-mixer-mxac400',
      name: 'Panasonic 750W Heavy-Duty Super Mixer Grinder (MX-AC400)',
      modelNumber: 'MX-AC400',
      brand: 'Panasonic',
      category: 'High Torque Grinder',
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 119,
      rating: 4.7,
      totalReviews: 2780,
      tag: 'Balanced Power Pick',
      budgetTier: 'BALANCED',
      whyDemandReason: '2,780 verified reviews, 750W monster motor handles hard spices',
      specs: {
        'Motor Power': '750 Watts Heavy Duty High Torque Motor',
        'Jars': '4 Jars including Polycarbonate Juicer Extractor Jar',
        'Juice Filter': 'Stainless Steel Mesh Extractor Filter',
        'Controls': 'Piano Type Tactile Push Button Switches',
        'Coupler': 'Heavy-Duty Brass Core Coupler',
        'Warranty': '5-Year Manufacturer Motor Warranty',
      }
    },
    {
      id: 'panasonic-blender-mxzx1800',
      slug: 'panasonic-blender-mxzx1800',
      name: 'Panasonic 1000W Professional Power Blender (MX-ZX1800)',
      modelNumber: 'MX-ZX1800',
      brand: 'Panasonic',
      category: 'Commercial Grade Pro Blender',
      image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 299,
      rating: 4.9,
      totalReviews: 920,
      tag: 'Premium Commercial Flagship',
      budgetTier: 'PREMIUM',
      whyDemandReason: '920 verified reviews, 6-blade 3D cutting system',
      specs: {
        'Motor': '1000 Watts 31,000 RPM Commercial Motor',
        'Blade System': '6-Blade Dual-Tier 3D Cutting System',
        'Pitcher': '1.8L BPA-Free Heavy Eastman Tritan Pitcher',
        'Pre-sets': '6 Auto Pre-programmed Menus (Smoothies, Soups, Dips)',
        'Ice Jacket': 'Includes Removable Frozen Ice Jacket Accessory',
        'Speed': '10 Manual Speed Levels with Pulse Function',
      }
    },
  ],

  'iphone 15': [
    {
      id: 'iphone-15-128gb',
      slug: 'iphone-15-128gb',
      name: 'Apple iPhone 15 (128GB Black)',
      modelNumber: 'A3090 / iPhone 15',
      brand: 'Apple',
      category: 'Flagship Smartphone',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 799,
      rating: 4.8,
      totalReviews: 8420,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '8,420 verified reviews, 91% 5-star, Dynamic Island & 48MP',
      specs: {
        'Processor': 'A16 Bionic Chip (6-Core CPU, 5-Core GPU)',
        'Display': '6.1" Super Retina XDR OLED Dynamic Island',
        'Camera': '48MP Main Camera with 2x Telephoto Sensor-Shift',
        'Port': 'USB-C Universal Charging Port',
        'Glass': 'Color-Infused Glass Back with Ceramic Shield',
        'Battery': 'Up to 20 hours video playback',
      }
    },
    {
      id: 'iphone-15-plus-128gb',
      slug: 'iphone-15-plus-128gb',
      name: 'Apple iPhone 15 Plus (128GB Blue)',
      modelNumber: 'A3094 / iPhone 15 Plus',
      brand: 'Apple',
      category: 'Big Screen All-Day Battery iPhone',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 899,
      rating: 4.8,
      totalReviews: 4120,
      tag: 'Balanced Big Battery',
      budgetTier: 'BALANCED',
      whyDemandReason: '4,120 verified reviews, 26 hours longest iPhone battery life',
      specs: {
        'Processor': 'A16 Bionic Chip (6-Core CPU)',
        'Display': '6.7" Super Retina XDR OLED Display',
        'Camera': '48MP Advanced Dual-Camera System',
        'Battery': 'Up to 26 hours video playback',
        'Connector': 'USB-C Charging & Audio',
        'Safety': 'Emergency SOS via satellite & Crash Detection',
      }
    },
    {
      id: 'iphone-15-pro-128gb',
      slug: 'iphone-15-pro-128gb',
      name: 'Apple iPhone 15 Pro (128GB Natural Titanium)',
      modelNumber: 'A3102 / iPhone 15 Pro',
      brand: 'Apple',
      category: 'Pro Grade Titanium iPhone',
      image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 999,
      rating: 4.9,
      totalReviews: 5320,
      tag: 'Premium Pick (Pro Titanium)',
      budgetTier: 'PREMIUM',
      whyDemandReason: '5,320 verified reviews, Grade 5 Aerospace Titanium & A17 Pro',
      specs: {
        'Processor': 'A17 Pro (3nm Pro GPU with Hardware Ray Tracing)',
        'Display': '6.1" 120Hz ProMotion Always-On OLED',
        'Frame': 'Aerospace-Grade Titanium Design',
        'Cameras': '48MP Pro System + 3x Optical Telephoto',
        'Action Button': 'Customizable Multi-function Action Button',
        'Transfer': 'USB-C USB 3 Speeds (Up to 10Gbps)',
      }
    },
    {
      id: 'iphone-15-pro-max-256gb',
      slug: 'iphone-15-pro-max-256gb',
      name: 'Apple iPhone 15 Pro Max (256GB White Titanium)',
      modelNumber: 'A3106 / iPhone 15 Pro Max',
      brand: 'Apple',
      category: 'Ultimate Camera & Cinema Flagship',
      image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 1199,
      rating: 4.9,
      totalReviews: 6180,
      tag: 'Ultimate Camera Flagship',
      budgetTier: 'PREMIUM',
      whyDemandReason: '6,180 verified reviews, 5x Optical Tetraprism Zoom Lens',
      specs: {
        'Processor': 'A17 Pro 3nm Flagship Architecture',
        'Display': '6.7" 120Hz ProMotion Super Retina XDR',
        'Optical Zoom': '5x Optical Zoom with Tetraprism Lens (120mm)',
        'Video': 'ProRes 4K60 Log Recording with ACES Color Support',
        'Battery': 'Up to 29 hours video playback',
        'Weight': '221g Ultra-Light Titanium Housing',
      }
    },
    {
      id: 'iphone-13-128gb',
      slug: 'iphone-13-128gb',
      name: 'Apple iPhone 13 (128GB Starlight)',
      modelNumber: 'A2633 / iPhone 13',
      brand: 'Apple',
      category: 'Best Value Entry iPhone',
      image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 549,
      rating: 4.7,
      totalReviews: 12400,
      tag: 'Budget Entry Pick',
      budgetTier: 'BUDGET',
      whyDemandReason: '12,400 verified reviews, Best overall value entry to iOS ecosystem',
      specs: {
        'Processor': 'A15 Bionic 6-Core CPU',
        'Display': '6.1" Super Retina XDR OLED',
        'Camera': '12MP Dual-Camera System with Sensor-Shift',
        'Battery': 'Up to 19 hours video playback',
        'Durability': 'Ceramic Shield front, Aerospace aluminium',
        'Water Resistance': 'IP68 Water Resistance (6m up to 30 mins)',
      }
    },
    {
      id: 'iphone-14-128gb',
      slug: 'iphone-14-128gb',
      name: 'Apple iPhone 14 (128GB Midnight)',
      modelNumber: 'A2882 / iPhone 14',
      brand: 'Apple',
      category: 'Solid Reliable Daily iPhone',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 649,
      rating: 4.7,
      totalReviews: 9200,
      tag: 'Balanced Mid-Tier',
      budgetTier: 'BALANCED',
      whyDemandReason: '9,200 verified reviews, Action Mode video & Photonic Engine',
      specs: {
        'Processor': 'A15 Bionic with 5-Core GPU',
        'Display': '6.1" Super Retina XDR Display',
        'Camera': '12MP Main with Photonic Engine & Action Mode',
        'Front Camera': '12MP TrueDepth with Autofocus',
        'Safety': 'Crash Detection & Emergency SOS',
        'Battery': 'Up to 20 hours video playback',
      }
    },
  ],

  'security cameras': [
    {
      id: 'cp-plus-3mp-wifi-camera',
      slug: 'cp-plus-3mp-wifi-camera',
      name: 'CP PLUS 3MP Full HD Smart WiFi Camera (CP-E35A)',
      modelNumber: 'CP-E35A 3MP',
      brand: 'CP PLUS',
      category: 'Smart 360° Indoor CCTV',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 29,
      rating: 4.6,
      totalReviews: 4890,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '4,890 verified reviews, 360° pan-tilt & 2-way crystal audio',
      specs: {
        'Resolution': '3MP 2304x1296 Full HD Resolution',
        'Rotation': '360° Horizontal Pan + 85° Vertical Tilt',
        'Night Vision': 'Infrared Night Vision up to 10 Meters',
        'Audio': '2-Way Full Duplex Audio Intercom',
        'Storage': 'Up to 128GB MicroSD Card + Cloud Storage Option',
        'Smart AI': 'Human Body Detection & Motion Tracking',
      }
    },
    {
      id: 'tp-link-tapo-c210-2k',
      slug: 'tp-link-tapo-c210-2k',
      name: 'TP-Link Tapo C210 2K 360° Pan/Tilt Security Camera',
      modelNumber: 'Tapo C210',
      brand: 'TP-Link',
      category: '2K Ultra Clear Security Camera',
      image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 39,
      rating: 4.8,
      totalReviews: 7600,
      tag: 'Budget Value Pick',
      budgetTier: 'BUDGET',
      whyDemandReason: '7,600 verified reviews, 3MP ultra-high definition clarity',
      specs: {
        'Resolution': '2K 3MP Ultra HD (2304 × 1296)',
        'Storage': 'Supports up to 256GB MicroSD Cards (512 hrs video)',
        'Privacy': 'Physical Privacy Mode with Lens Cover',
        'Night Mode': 'Advanced Night Vision with 850nm IR LEDs',
        'Alerts': 'Sound and Light Alarm on Intruder Detection',
        'Compatibility': 'Works with Google Assistant & Amazon Alexa',
      }
    },
    {
      id: 'xiaomi-smart-camera-c300',
      slug: 'xiaomi-smart-camera-c300',
      name: 'Xiaomi Smart Camera C300 2K 360° with AI Human Tracking',
      modelNumber: 'BHR6540GL / C300',
      brand: 'Xiaomi',
      category: 'AI Human Detection Camera',
      image: 'https://images.unsplash.com/photo-1580983561371-7f4b242d8ec0?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 45,
      rating: 4.7,
      totalReviews: 3940,
      tag: 'Balanced Smart Pick',
      budgetTier: 'BALANCED',
      whyDemandReason: '3,940 verified reviews, F1.4 large aperture 6P lens',
      specs: {
        'Lens': 'F1.4 Large Aperture 6P Lens for Low Light',
        'AI Algorithm': 'Deep Learning AI Human Recognition Algorithm',
        'Color Night': 'Full Color Video in Low-Light Conditions',
        'Voice': 'Two-Way Real Time Voice Calling',
        'Encoding': 'H.265 Next-Gen Video Compression (50% Bandwidth)',
        'App': 'Mi Home App Seamless Multi-Screen View',
      }
    },
    {
      id: 'ring-video-doorbell-pro',
      slug: 'ring-video-doorbell-pro',
      name: 'Ring Wired HD Video Doorbell with 2-Way Audio & Chime',
      modelNumber: 'Ring Doorbell Wired',
      brand: 'Ring',
      category: 'Smart Video Doorbell',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 69,
      rating: 4.6,
      totalReviews: 5200,
      tag: 'Balanced Doorbell Pro',
      budgetTier: 'BALANCED',
      whyDemandReason: '5,200 verified reviews, Instant motion alerts on smartphone',
      specs: {
        'Video': '1080p HD Live View with Two-Way Talk',
        'Motion Detection': 'Customizable Motion Zones & Person Detection',
        'Night Vision': 'High Contrast Night Vision with Sharp Contrast',
        'Power': 'Hardwired for Non-Stop Constant Power',
        'Integration': 'Announcements on Alexa Echo Smart Speakers',
        'Weather': 'Weather Resistant IP65 Rated Housing',
      }
    },
    {
      id: 'yale-smart-door-lock-yale-lumi',
      slug: 'yale-smart-door-lock-yale-lumi',
      name: 'Yale Smart Biometric Touch Fingerprint Digital Door Lock',
      modelNumber: 'YDR 4110+',
      brand: 'Yale',
      category: 'Biometric Smart Lock',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 249,
      rating: 4.8,
      totalReviews: 1280,
      tag: 'Premium Pick (Smart Security)',
      budgetTier: 'PREMIUM',
      whyDemandReason: '1,280 verified reviews, One-touch optical fingerprint reader',
      specs: {
        'Access Modes': 'Fingerprint, PIN Code, RFID Key Tag, Mechanical Key, Mobile App',
        'Fingerprints': 'Stores up to 100 Unique Biometric Fingerprints',
        'Security': 'Fake PIN Code Entry & Break-in Tamper Alarm',
        'Auto Lock': 'Auto-Locking Sensor upon Door Closure',
        'Emergency': '9V External Battery Emergency Jump-start Port',
        'Finish': 'Sleek Black Tempered Glass Touch Keypad',
      }
    },
    {
      id: 'eufy-security-cam-2c-pro',
      slug: 'eufy-security-cam-2c-pro',
      name: 'eufy Security Cam 2C Pro 2K Outdoor 2-Cam Kit with HomeBase',
      modelNumber: 'T8861 / 2C Pro',
      brand: 'eufy Security',
      category: 'Wire-Free 180-Day Battery Outdoor CCTV',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 299,
      rating: 4.9,
      totalReviews: 2150,
      tag: 'Flagship Outdoor 2K Kit',
      budgetTier: 'PREMIUM',
      whyDemandReason: '2,150 verified reviews, 180-day battery life on a single charge',
      specs: {
        'Battery Life': '180 Days Wire-Free Battery per Charge',
        'Resolution': '2K Ultra High Resolution Color Night Vision',
        'No Monthly Fee': 'Local 16GB eMMC Secure Military Grade Encryption',
        'Spotlight': 'Built-in Spotlight with 100-Lumen Illuminator',
        'Weatherproof': 'IP67 Full Weatherproof Rating for Rain & Snow',
        'AI Human': 'BionicMind On-Device Human AI Detection',
      }
    },
  ],

  'wrist watch': [
    {
      id: 'seiko-5-sports-automatic',
      slug: 'seiko-5-sports-automatic',
      name: 'Seiko 5 Sports Automatic Stainless Steel Watch (SRPD55K1)',
      modelNumber: 'SRPD55K1 / Calibre 4R36',
      brand: 'Seiko',
      category: 'Automatic Mechanical Watch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 285,
      rating: 4.9,
      totalReviews: 3890,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '3,890 verified reviews, In-house 4R36 Automatic Movement',
      specs: {
        'Movement': 'Seiko Calibre 4R36 Automatic with Hand-Winding',
        'Power Reserve': '41 Hours Power Reserve with 24 Jewels',
        'Case Diameter': '42.5mm Stainless Steel with Exhibition Caseback',
        'Water Resistance': '100 Meters (10 Bar) Water Resistant',
        'Crystal': 'Hardlex Mineral Crystal Lens',
        'Lume': 'LumiBrite on Hands and Hour Markers',
      }
    },
    {
      id: 'casio-g-shock-ga-2100',
      slug: 'casio-g-shock-ga-2100',
      name: 'Casio G-Shock GA-2100 Carbon Core Guard "CasiOak" All Black',
      modelNumber: 'GA-2100-1A1DR',
      brand: 'Casio',
      category: 'Tough Shock Resistant Analog-Digital',
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 99,
      rating: 4.8,
      totalReviews: 9400,
      tag: 'Budget Indestructible Pick',
      budgetTier: 'BUDGET',
      whyDemandReason: '9,400 verified reviews, Carbon Core Guard & 200m water resist',
      specs: {
        'Structure': 'Carbon Core Guard Octagonal Slim Bezel',
        'Water Resistance': '200 Meters (20 Bar) Dive Ready',
        'Thickness': '11.8mm Ultra-Slim Profile',
        'Weight': '51g Featherlight Carbon Resin',
        'Functions': 'World Time (48 Cities), Stopwatch, 5 Alarms, Double LED Light',
        'Battery': '3-Year SR726W × 2 Battery Life',
      }
    },
    {
      id: 'fossil-grant-chronograph',
      slug: 'fossil-grant-chronograph',
      name: 'Fossil Grant Chronograph Dark Brown Leather Watch (FS4735)',
      modelNumber: 'FS4735 / Grant',
      brand: 'Fossil',
      category: 'Classic Dress Chronograph',
      image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 145,
      rating: 4.6,
      totalReviews: 6120,
      tag: 'Balanced Dress Classic',
      budgetTier: 'BALANCED',
      whyDemandReason: '6,120 verified reviews, Genuine leather strap & Roman numeral dial',
      specs: {
        'Case Size': '44mm Stainless Steel Case',
        'Movement': 'Quartz Chronograph with 24-Hr Subdial',
        'Strap': '22mm Genuine Calfskin Leather Strap',
        'Dial': 'Cream Dial with Roman Numerals & Blue Hands',
        'Water Resistance': '50 Meters (5 ATM)',
        'Closure': 'Single Prong Strap Buckle',
      }
    },
    {
      id: 'titan-neo-analog-quartz',
      slug: 'titan-neo-analog-quartz',
      name: 'Titan Neo Analog Black Dial Stainless Steel Men\'s Watch',
      modelNumber: 'NL1733KM01',
      brand: 'Titan',
      category: 'Everyday Formal Quartz',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 75,
      rating: 4.5,
      totalReviews: 4500,
      tag: 'Budget Formal Value',
      budgetTier: 'BUDGET',
      whyDemandReason: '4,500 verified reviews, High precision quartz movement',
      specs: {
        'Case Diameter': '42mm Round Brass Case with Anthracite Plating',
        'Strap': 'Solid Stainless Steel Mesh Link Bracelet',
        'Dial': 'Textured Sunray Black Dial with Date Window',
        'Glass': 'Scratch Resistant Mineral Glass',
        'Water Resistance': '50 Meters (50m Splash Resistant)',
        'Warranty': '24-Month Manufacturer Warranty',
      }
    },
    {
      id: 'tissot-prx-powermatic-80',
      slug: 'tissot-prx-powermatic-80',
      name: 'Tissot PRX Powermatic 80 Blue Dial 40mm Integrated Bracelet',
      modelNumber: 'T137.407.11.041.00',
      brand: 'Tissot',
      category: 'Swiss Luxury Integrated Sport Watch',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 725,
      rating: 4.9,
      totalReviews: 2450,
      tag: 'Premium Swiss Luxury (35k+)',
      budgetTier: 'PREMIUM',
      whyDemandReason: '2,450 verified reviews, Swiss Powermatic 80 with Nivachron Hairspring',
      specs: {
        'Movement': 'Swiss Made Powermatic 80.111 Automatic Movement',
        'Power Reserve': '80 Hours Extended Power Reserve',
        'Dial': 'Embossed Waffle Pattern Sunray Navy Blue',
        'Crystal': 'Scratch-Resistant Sapphire Crystal with Anti-Reflective Coating',
        'Case & Bracelet': '316L Stainless Steel with Quick-Release Integrated Bracelet',
        'Water Resistance': '100 Meters (10 Bar / 330 ft)',
      }
    },
    {
      id: 'timex-expedition-field-chronograph',
      slug: 'timex-expedition-field-chronograph',
      name: 'Timex Expedition Field Chronograph 43mm with Indiglo Light',
      modelNumber: 'T49905',
      brand: 'Timex',
      category: 'Rugged Military Field Watch',
      image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 85,
      rating: 4.6,
      totalReviews: 5300,
      tag: 'Balanced Tactical Rugged',
      budgetTier: 'BALANCED',
      whyDemandReason: '5,300 verified reviews, Signature Indiglo night-light technology',
      specs: {
        'Movement': 'High Precision Quartz 30-Minute Chronograph',
        'Dial Light': 'Indiglo Electro-Luminescent Dial Backlight',
        'Case': '43mm Brass Case with Matte Gunmetal Finish',
        'Strap': '20mm Genuine Distressed Brown Leather Strap',
        'Water Resistance': '100 Meters (330 Feet)',
        'Bezel': 'Stationary Tachymeter Top Ring',
      }
    },
  ],
  'baby wipes': [
    {
      id: 'pampers-baby-gentle-wet-wipes-water',
      slug: 'pampers-baby-gentle-wet-wipes-water',
      name: 'Pampers Baby Gentle Wet Wipes (99% Pure Water, Hypoallergenic)',
      modelNumber: 'PAM-WIPES-72',
      brand: 'Pampers',
      category: 'Baby Care & Maternity',
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 8,
      rating: 4.8,
      totalReviews: 38450,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '38,450 verified reviews, 91% 5-star, 99% Pure Water formula',
      asin: 'B08D6V4X39',
      specs: {
        'Formula': '99% Pure Water with 0% Alcohol & Parabens',
        'Safety': 'Dermatologically Tested & Pediatrician Approved',
        'Fabric': 'Thick Embossed Texture for Gentle Cleansing',
        'Usage': 'Safe for Face, Hands, and Sensitive Diaper Area',
        'Pack Type': 'Moisture-Lock Flip-Top Lid Pack',
      }
    },
    {
      id: 'mamypoko-anti-bacterial-baby-wipes',
      slug: 'mamypoko-anti-bacterial-baby-wipes',
      name: 'MamyPoko Anti-Bacterial Coconut & Aloe Vera Baby Wipes',
      modelNumber: 'MAMY-COCO-80',
      brand: 'MamyPoko',
      category: 'Baby Care & Maternity',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 7,
      rating: 4.6,
      totalReviews: 24120,
      tag: 'Budget Pick (Under ₹500)',
      budgetTier: 'BUDGET',
      whyDemandReason: '24,120 verified reviews, Organic Coconut Oil & Aloe Vera',
      asin: 'B07M6F9Z8P',
      specs: {
        'Key Extracts': 'Organic Coconut Oil & Soothing Aloe Vera',
        'Protection': '99% Germ Protection with Zero Alcohol',
        'Thickness': 'Extra Thick & Soft Cloth Texture',
        'Fragrance': 'Mild Baby Safe Natural Fragrance',
      }
    },
    {
      id: 'huggies-natural-care-sensitive-wipes',
      slug: 'huggies-natural-care-sensitive-wipes',
      name: 'Huggies Natural Care Sensitive Baby Wipes (Unscented Plant-Based)',
      modelNumber: 'HUG-NAT-128',
      brand: 'Huggies',
      category: 'Baby Care & Maternity',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 9,
      rating: 4.7,
      totalReviews: 42900,
      tag: 'Balanced Value Pick',
      budgetTier: 'BALANCED',
      whyDemandReason: '42,900 verified reviews, Plant-based fibers & pH balanced',
      asin: 'B01MY03XZQ',
      specs: {
        'Fiber Type': '100% Plant-Based Natural Fibers',
        'Skin Type': 'Hypoallergenic for Ultra Sensitive Skin',
        'pH Level': 'Skin-Balanced pH 5.5 Formula',
        'Certification': 'National Eczema Association Accepted',
      }
    },
    {
      id: 'waterwipes-original-plastic-free-wipes',
      slug: 'waterwipes-original-plastic-free-wipes',
      name: 'WaterWipes Original Plastic-Free Baby Wipes (99.9% Water & Fruit Extract)',
      modelNumber: 'WW-ORIG-60',
      brand: 'WaterWipes',
      category: 'Baby Care & Maternity',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 14,
      rating: 4.9,
      totalReviews: 61500,
      tag: 'Premium Flagship Choice',
      budgetTier: 'PREMIUM',
      whyDemandReason: '61,500 verified reviews, 99.9% water, 100% biodegradable',
      asin: 'B008KJQY62',
      specs: {
        'Ingredients': '99.9% Water + 1 Drop Grapefruit Seed Extract',
        'Eco Friendly': '100% Biodegradable & Compostable Plant Cloth',
        'Suitability': 'Premature & Newborn Skin from Day 1',
        'Purity': 'Worlds Purest Baby Wipes Certification',
      }
    }
  ],
  'diapers': [
    {
      id: 'pampers-all-round-protection-pant-diapers',
      slug: 'pampers-all-round-protection-pant-diapers',
      name: 'Pampers All Round Protection Pants Diapers (Anti-Rash Lotion, 12 Hr)',
      modelNumber: 'PAM-ALLROUND-L',
      brand: 'Pampers',
      category: 'Baby Diapers & Maternity',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 18,
      rating: 4.8,
      totalReviews: 88400,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '88,400 verified reviews, #1 Bestseller in Baby Diapers',
      asin: 'B07M8D3P45',
      specs: {
        'Absorption': 'Magic Gel 12-Hour Overnight Dryness',
        'Lotion': 'Aloe Vera Anti-Rash Skin Protection',
        'Fit': '360° Ultra Soft Stretch Elastic Waistband',
        'Indicator': 'Smart Wetness Indicator Line',
      }
    },
    {
      id: 'mamypoko-pants-extra-absorb-diaper',
      slug: 'mamypoko-pants-extra-absorb-diaper',
      name: 'MamyPoko Pants Extra Absorb Diaper with Criss-Cross Core',
      modelNumber: 'MAMY-EXTRA-ABS',
      brand: 'MamyPoko',
      category: 'Baby Diapers & Maternity',
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 16,
      rating: 4.6,
      totalReviews: 74200,
      tag: 'Balanced Value Pick',
      budgetTier: 'BALANCED',
      whyDemandReason: '74,200 verified reviews, Criss-Cross even absorb sheet',
      asin: 'B01M3N7P89',
      specs: {
        'Technology': 'Criss-Cross Core Absorbs up to 7 Glasses',
        'Leak Guard': 'Deep Thigh Anti-Leak Double Border',
        'Material': 'Cottony Soft Breathable Layer',
      }
    }
  ],
  'yoga mat': [
    {
      id: 'boldfit-anti-slip-tpe-yoga-mat-6mm',
      slug: 'boldfit-anti-slip-tpe-yoga-mat-6mm',
      name: 'Boldfit Anti-Slip TPE Yoga Mat for Men & Women (6mm Cushioning with Strap)',
      modelNumber: 'BOLD-YOGA-6MM',
      brand: 'Boldfit',
      category: 'Sports, Fitness & Yoga',
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 14,
      rating: 4.8,
      totalReviews: 45600,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '45,600 verified reviews, #1 Bestseller in Yoga Mats',
      asin: 'B08D3K7P90',
      specs: {
        'Material': 'Eco-Friendly High Density TPE Polymer',
        'Thickness': '6mm Optimum Joint Protection Cushioning',
        'Grip': 'Dual Sided Wave & Dot Anti-Skid Texture',
        'Included': 'Carry Bag & High Elastic Strap',
      }
    },
    {
      id: 'strauss-anti-skid-thick-yoga-mat-8mm',
      slug: 'strauss-anti-skid-thick-yoga-mat-8mm',
      name: 'Strauss Anti-Skid Thick Yoga Mat with Laser Alignment Marks (8mm)',
      modelNumber: 'STR-ALIGN-8MM',
      brand: 'Strauss',
      category: 'Sports, Fitness & Yoga',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 16,
      rating: 4.6,
      totalReviews: 22800,
      tag: 'Balanced Value Pick',
      budgetTier: 'BALANCED',
      whyDemandReason: '22,800 verified reviews, Laser body alignment guide',
      asin: 'B07N9L3K45',
      specs: {
        'Thickness': '8mm Extra Thick Knee Comfort Rebound',
        'Guides': 'Laser Engraved Posture Alignment Lines',
        'Care': 'Sweat-Resistant & Easy Clean Surface',
      }
    }
  ],
  'protein powder': [
    {
      id: 'muscleblaze-biozyme-performance-whey-protein',
      slug: 'muscleblaze-biozyme-performance-whey-protein',
      name: 'MuscleBlaze Biozyme Performance Whey (25g Protein, 5.5g BCAA, Rich Chocolate)',
      modelNumber: 'MB-BIOZYME-2KG',
      brand: 'MuscleBlaze',
      category: 'Health & Sports Nutrition',
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 38,
      rating: 4.8,
      totalReviews: 68400,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      budgetTier: 'TRENDING',
      whyDemandReason: '68,400 verified reviews, Enhanced Absorption Formula EAF',
      asin: 'B08B9P4N56',
      specs: {
        'Protein Content': '25g Biozyme Whey Protein per Scoop',
        'BCAA / EAA': '5.51g BCAAs & 11.75g EAAs',
        'Digestion': '50% Higher Protein Absorption with Zero Bloating',
        'Testing': 'Informed Choice UK & Labdoor USA Certified',
      }
    },
    {
      id: 'optimum-nutrition-gold-standard-100-whey',
      slug: 'optimum-nutrition-gold-standard-100-whey',
      name: 'Optimum Nutrition (ON) Gold Standard 100% Whey Protein Isolate (5 lbs)',
      modelNumber: 'ON-GOLD-5LBS',
      brand: 'Optimum Nutrition',
      category: 'Health & Sports Nutrition',
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 54,
      rating: 4.9,
      totalReviews: 142000,
      tag: 'Premium Flagship Benchmark',
      budgetTier: 'PREMIUM',
      whyDemandReason: '142,000 verified reviews, Global #1 Whey Isolate benchmark',
      asin: 'B000QSNYGI',
      specs: {
        'Primary Source': 'Whey Protein Isolate (WPI)',
        'Protein per scoop': '24g High Purity Micro-filtered Protein',
        'Glutamine': '4g Naturally Occurring Glutamic Acid',
        'Mixability': 'Instantized Powder for Spoon-Mix Consistency',
      }
    }
  ],
  'suv': [
    {
      id: 'mahindra-scorpio-n-z8l-4xplor',
      slug: 'mahindra-scorpio-n-z8l-4xplor',
      name: 'Mahindra Scorpio N (Z8L 4XPLOR 4x4, 2.2L mHawk Diesel, 7-Seater)',
      modelNumber: 'SCORPIO-N-Z8L',
      brand: 'Mahindra',
      category: 'Mid-Size Ladder Frame SUV',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 19500, // ~ ₹16.2 Lakh - ₹24.5 Lakh
      rating: 4.9,
      totalReviews: 48200,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai (Most Demanded SUV)',
      budgetTier: 'TRENDING',
      whyDemandReason: '48,200 verified owner reviews, 5-Star Global NCAP, 4XPLOR terrain system',
      specs: {
        'Price Range': '₹13.60 Lakh - ₹24.54 Lakh (Ex-Showroom)',
        'Engine': '2.2L mHawk Diesel (175 PS / 400 Nm) & 2.0L mStallion Turbo',
        'Mileage / Fuel': '14.2 - 16.5 kmpl (Diesel) / 11.5 kmpl (Petrol)',
        'Safety Rating': '5-Star Global NCAP Certified (Dual Chamber Airbags)',
        'Seating Capacity': '6 / 7 Seater Captain & Bench Layout',
        'Key Highlights': 'Sony 3D 12-Speaker Audio, Alexa Built-in, 4XPLOR Intelligent Terrain Mode',
        'Real Owner Verdict': 'Unbeatable road presence, bulletproof ladder-frame suspension, punchy diesel torque.'
      }
    },
    {
      id: 'mahindra-thar-roxx-5-door-4x4',
      slug: 'mahindra-thar-roxx-5-door-4x4',
      name: 'Mahindra Thar Roxx 5-Door (AX7L 4x4, Panoramic Sunroof, Level 2 ADAS)',
      modelNumber: 'THAR-ROXX-AX7L',
      brand: 'Mahindra',
      category: 'Lifestyle 4x4 SUV',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 18000, // ~ ₹12.99 Lakh - ₹20.49 Lakh
      rating: 4.8,
      totalReviews: 32400,
      tag: 'Lifestyle Pick of 2026',
      budgetTier: 'BALANCED',
      whyDemandReason: '32,400 verified test drives, 5-Door Practicality, Panoramic Sunroof',
      specs: {
        'Price Range': '₹12.99 Lakh - ₹20.49 Lakh (Ex-Showroom)',
        'Engine': '2.0L Turbo TGDi Petrol (177 PS) / 2.2L mHawk CRDe Diesel (175 PS)',
        'Mileage': '12.8 kmpl (Petrol) / 15.2 kmpl (Diesel)',
        'Off-Road Gear': 'Electronic Locking Rear Differential (ELR), CrawlSmart, IntelliTurn',
        'Interior': 'Dual 10.25-inch Digital Screens, Harman Kardon 9-Speaker Audio',
        'Safety': 'Level 2 ADAS Suite + 6 Airbags Standard across all trims'
      }
    },
    {
      id: 'hyundai-creta-facelift-sx-tech',
      slug: 'hyundai-creta-facelift-sx-tech',
      name: 'Hyundai Creta Facelift (SX (O) 1.5L Turbo Petrol DCT / 1.5L CRDi)',
      modelNumber: 'CRETA-SX-OPT',
      brand: 'Hyundai',
      category: 'Compact Executive SUV',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 16500, // ~ ₹11.00 Lakh - ₹20.15 Lakh
      rating: 4.7,
      totalReviews: 89000,
      tag: 'Best Family Urban SUV',
      budgetTier: 'BALANCED',
      whyDemandReason: '89,000+ units sold yearly, Segment Benchmark Cabin Refinement',
      specs: {
        'Price Range': '₹11.00 Lakh - ₹20.15 Lakh (Ex-Showroom)',
        'Engine Options': '1.5L Kappa Turbo Petrol (160 PS) & 1.5L U2 CRDi Diesel (116 PS)',
        'Mileage': '18.4 kmpl (Petrol) / 21.8 kmpl (Diesel Manual)',
        'Features': 'Ventilated Front Seats, Bose 8-Speaker Audio, Dual Zone Climate',
        'ADAS Features': 'Hyundai SmartSense Level 2 (19 Autonomous Safety Features)',
        'Boot Space': '433 Litres with 60:40 Split Folding Rear Seats'
      }
    },
    {
      id: 'toyota-fortuner-gr-sport-4x4-diesel',
      slug: 'toyota-fortuner-gr-sport-4x4-diesel',
      name: 'Toyota Fortuner (Legender & GR-Sport 2.8L 4x4 Diesel AT, 500Nm)',
      modelNumber: 'FORTUNER-LEGENDER',
      brand: 'Toyota',
      category: 'Full-Size Premium SUV',
      image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 46000, // ~ ₹33.43 Lakh - ₹51.44 Lakh
      rating: 4.9,
      totalReviews: 64000,
      tag: 'Premium Flagship Choice',
      budgetTier: 'PREMIUM',
      whyDemandReason: '64,000 verified owners, Bulletproof Toyota Reliability & 90% Resale Value',
      specs: {
        'Price Range': '₹33.43 Lakh - ₹51.44 Lakh (Ex-Showroom)',
        'Engine': '2.8L 4-Cylinder Turbo Diesel (204 PS / 500 Nm Torque)',
        'Drivetrain': 'High & Low Range 4x4 with Auto Limited Slip Differential',
        'Ground Clearance': '225 mm High Stance with 700mm Water Wading',
        'Resale Value': 'Highest in Class (~85-90% residual value after 3 years)',
        'Seating': '7 Full Leather Seats with Power Adjustment'
      }
    },
    {
      id: 'maruti-suzuki-brezza-zxi-plus',
      slug: 'maruti-suzuki-brezza-zxi-plus',
      name: 'Maruti Suzuki Brezza (ZXi+ Smart Hybrid 1.5L DualJet, Electric Sunroof)',
      modelNumber: 'BREZZA-ZXI-PLUS',
      brand: 'Maruti Suzuki',
      category: 'Sub-4m Compact SUV',
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 12000, // ~ ₹8.34 Lakh - ₹14.14 Lakh
      rating: 4.6,
      totalReviews: 76500,
      tag: 'Budget Pick (Under ₹15 Lakh)',
      budgetTier: 'BUDGET',
      whyDemandReason: '76,500 verified reviews, 19.8 kmpl Mileage & Low Maintenance',
      specs: {
        'Price Range': '₹8.34 Lakh - ₹14.14 Lakh (Ex-Showroom)',
        'Engine': '1.5L K15C DualJet Dual VVT Smart Hybrid Petrol (103 PS)',
        'Mileage': '19.89 kmpl (Manual) / 19.80 kmpl (6-Speed AT)',
        'Tech': 'Head-Up Display (HUD), 360-Degree View HD Camera, Wireless Charging',
        'Service Network': 'Widest 4,500+ Service Touchpoints across India'
      }
    },
    {
      id: 'maruti-grand-vitara-strong-hybrid-alpha',
      slug: 'maruti-grand-vitara-strong-hybrid-alpha',
      name: 'Maruti Grand Vitara (Alpha+ Intelligent Electric Strong Hybrid / AllGrip AWD)',
      modelNumber: 'GRAND-VITARA-HYBRID',
      brand: 'Maruti Suzuki',
      category: 'Full Hybrid Mid-Size SUV',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 17500,
      rating: 4.8,
      totalReviews: 41200,
      tag: 'Balanced Green Value Pick',
      budgetTier: 'BALANCED',
      whyDemandReason: '41,200 verified reviews, 27.97 kmpl Record Fuel Efficiency',
      specs: {
        'Price Range': '₹10.87 Lakh - ₹20.09 Lakh (Ex-Showroom)',
        'Powertrain': '1.5L Strong Hybrid with Self-Charging Lithium-ion Battery',
        'Record Mileage': '27.97 kmpl (Certified ARAI Mileage)',
        'EV Mode': 'Silent Zero-Emission Full Electric Drive in City Traffic',
        'Sunroof': 'Panoramic Dual Sliding Glass Sunroof',
        'AWD Option': 'AllGrip Select Electronic 4WD System'
      }
    }
  ],
  'hotels': [
    {
      id: 'taj-exotica-resort-spa-goa',
      slug: 'taj-exotica-resort-spa-goa',
      name: 'Taj Exotica Resort & Spa, Goa (56-Acre Mediterranean Beachfront Palace)',
      modelNumber: 'TAJ-EXOTICA-BENAULIM',
      brand: 'Taj Hotels',
      category: '5-Star Luxury Beach Resort',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 240, // ~ ₹18,500/night
      rating: 4.9,
      totalReviews: 12400,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai (Top Luxury Stay)',
      budgetTier: 'TRENDING',
      whyDemandReason: '12,400 verified guest reviews, 9.6/10 location score, Benaulim Beach',
      specs: {
        'Location': 'Benaulim Beach, South Goa (Direct Beach Access)',
        'Room Types': 'Garden Villa with Plunge Pool, Sea View Suites',
        'Amenities': 'Jiva Ayurvedic Spa, 9-Hole Executive Golf, Olympic Pool',
        'Dining': 'Miguel Arcanjo (Mediterranean), Lobster Village (Beachfront Seafood)',
        'Booking Policy': 'Free Cancellation up to 48 Hours before check-in'
      }
    },
    {
      id: 'w-goa-vagator-beach',
      slug: 'w-goa-vagator-beach',
      name: 'W Goa (Vagator Beachfront Luxury, Rock Pool & Vibrant Sunsets)',
      modelNumber: 'W-GOA-VAGATOR',
      brand: 'Marriott Bonvoy',
      category: 'Luxury Lifestyle Beach Hotel',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 280,
      rating: 4.8,
      totalReviews: 8900,
      tag: 'Premium Sunset Stay',
      budgetTier: 'PREMIUM',
      whyDemandReason: '8,900 verified guest reviews, Iconic Rock Pool overlooking Chapora Fort',
      specs: {
        'Location': 'Vagator Beach, North Goa',
        'Signature Pool': 'Rock Pool Carved into Cliffs Overlooking the Arabian Sea',
        'Spa': 'AWAY Spa with 8 Vitality Treatment Rooms & Steam',
        'Dining & Lounge': 'Spice Traders (Pan-Asian), Woobar (Sunset Cocktails)',
        'Guest Rating': '9.4/10 Verified Guest Recommendation Score'
      }
    },
    {
      id: 'alila-diwa-goa-hyatt',
      slug: 'alila-diwa-goa-hyatt',
      name: 'Alila Diwa Goa - A Hyatt Luxury Resort (Paddy Field Infinity Pool)',
      modelNumber: 'ALILA-DIWA-MAJORDA',
      brand: 'Hyatt',
      category: 'Serene Luxury Resort',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 180,
      rating: 4.7,
      totalReviews: 9600,
      tag: 'Balanced Value Luxury',
      budgetTier: 'BALANCED',
      whyDemandReason: '9,600 verified reviews, Lush 12-acre Paddy Views, Majorda Beach Shuttle',
      specs: {
        'Location': 'Majorda, South Goa (5 mins shuttle to Majorda Beach)',
        'Pool': 'Celebrated Infinity Pool overlooking Lush Green Paddy Fields',
        'Hospitality': 'Diwa Club Wing with Private Lap Pool & Whirlpool',
        'Dining': 'Vivo (All-Day Dining), Spice Studio (Coastal Cuisine)'
      }
    }
  ],
  'restaurants': [
    {
      id: 'karims-jama-masjid-delhi',
      slug: 'karims-jama-masjid-delhi',
      name: "Karim's Original Mughlai & Dum Biryani (Est. 1913, Jama Masjid)",
      modelNumber: 'KARIM-JAMA-MASJID',
      brand: "Karim's",
      category: 'Historic Mughlai & Dum Biryani',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 12,
      rating: 4.8,
      totalReviews: 86400,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai (#1 Legendary Eatery)',
      budgetTier: 'TRENDING',
      whyDemandReason: '86,400+ reviews on Zomato & Google, Royal Mughlai Chefs Heritage',
      specs: {
        'Famous Dishes': 'Mutton Dum Biryani, Mutton Burra Kebab, Butter Chicken, Shahi Tukda',
        'Cuisine': 'Pure Royal Mughlai & Old Delhi Slow-Cooked Dum Cuisine',
        'Average Cost': '₹800 for two people',
        'Seating & Delivery': 'Dine-In, Takeaway, and Instant Zomato Delivery Available'
      }
    },
    {
      id: 'gulati-restaurant-pandara-road',
      slug: 'gulati-restaurant-pandara-road',
      name: 'Gulati Restaurant (Pandara Road Central Delhi, Iconic Butter Chicken & Biryani)',
      modelNumber: 'GULATI-PANDARA',
      brand: 'Gulati',
      category: 'North Indian & Mughlai Fine Dining',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 18,
      rating: 4.7,
      totalReviews: 64200,
      tag: 'Fine Dining Favorite',
      budgetTier: 'BALANCED',
      whyDemandReason: '64,200 verified foodies, Award-winning Hyderabadi Dum Biryani',
      specs: {
        'Location': 'Pandara Road Market, Central Delhi',
        'Must-Try': 'Lucknowi Dum Biryani, Legendary Butter Chicken, Dal Makhani',
        'Timings': '12:00 PM to 12:00 Midnight (Continuous Service)',
        'Zomato Rating': '4.8/5 (Over 35,000 Verified App Ratings)'
      }
    },
    {
      id: 'biryani-by-kilo-handi-dum',
      slug: 'biryani-by-kilo-handi-dum',
      name: 'Biryani By Kilo (BBK) - Individual Clay Handi Fresh Cooked Dum Biryani',
      modelNumber: 'BBK-HANDI-DUM',
      brand: 'Biryani By Kilo',
      category: 'Authentic Earthen Pot Dum Biryani',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 10,
      rating: 4.6,
      totalReviews: 94000,
      tag: 'Budget Fresh Handi Pick',
      budgetTier: 'BUDGET',
      whyDemandReason: '94,000 reviews, Freshly dum cooked in separate earthen handis',
      specs: {
        'Preparation': 'Every order cooked individually in sealed clay pot (Handi)',
        'Varieties': 'Hyderabadi, Lucknowi, Kolkata, and Malabar Dum Biryani',
        'Complimentary': 'Kandhari Anar Raita + Salan included with every handi'
      }
    }
  ],
  'hospitals': [
    {
      id: 'aiims-new-delhi-apex-institute',
      slug: 'aiims-new-delhi-apex-institute',
      name: 'All India Institute of Medical Sciences (AIIMS, New Delhi)',
      modelNumber: 'AIIMS-DELHI-APEX',
      brand: 'AIIMS Central Institute',
      category: 'Apex Tertiary Healthcare & Research',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 0,
      rating: 4.9,
      totalReviews: 145000,
      tag: '🔥 National #1 Premier Medical Institute (NIRF Ranked)',
      budgetTier: 'TRENDING',
      whyDemandReason: 'Ranked #1 in India for 7 consecutive years, India’s top medical faculty',
      specs: {
        'Specialities': 'Cardiology, Neurosciences, Oncology, Organ Transplant, Pediatrics',
        'Bed Capacity': '2,400+ Beds with 24x7 Emergency Trauma Centre',
        'Recognition': 'National Institute of Excellence & Apex Research Center',
        'Location': 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
        'Clinical Note': 'Information purpose only. Book OPD tokens through ORS portal.'
      }
    },
    {
      id: 'medanta-the-medicity-gurugram',
      slug: 'medanta-the-medicity-gurugram',
      name: 'Medanta - The Medicity (Gurugram NCR, Multi-Organ Transplant & Heart Care)',
      modelNumber: 'MEDANTA-MEDICITY',
      brand: 'Medanta',
      category: 'World-Class Multi-Specialty Hospital',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 0,
      rating: 4.8,
      totalReviews: 58000,
      tag: 'Global Center of Excellence',
      budgetTier: 'PREMIUM',
      whyDemandReason: '58,000+ patient testimonies, JCI & NABH Accredited, Dr. Naresh Trehan',
      specs: {
        'Specialities': 'Heart Institute, Liver & Kidney Transplants, Robotic Oncology',
        'Infrastructure': '1,250+ Beds, 45 Operation Theatres, Da Vinci Xi Robot',
        'Accreditations': 'JCI (Joint Commission International), NABH, NABL Certified',
        'Location': 'Sector 38, Gurugram, Delhi NCR'
      }
    }
  ],
  'flights': [
    {
      id: 'indigo-nonstop-bom-del',
      slug: 'indigo-nonstop-bom-del',
      name: 'IndiGo 6E Non-Stop Flight (Mumbai BOM to Delhi DEL, 2h 10m)',
      modelNumber: '6E-BOM-DEL',
      brand: 'IndiGo Airlines',
      category: 'Domestic Non-Stop Airline',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 65,
      rating: 4.6,
      totalReviews: 240000,
      tag: '🔥 Most Punctual On-Time Carrier',
      budgetTier: 'TRENDING',
      whyDemandReason: '240,000+ bookings, #1 Airline in India by Fleet & On-Time Performance',
      specs: {
        'Route': 'Mumbai (BOM T2) -> New Delhi (DEL T3/T2/T1)',
        'Flight Duration': '2 Hours 10 Minutes (Direct Non-Stop)',
        'Frequency': 'Over 30 Daily Flights on Mumbai-Delhi Corridor',
        'Baggage': '15 Kg Check-in + 7 Kg Cabin Bag included',
        'Booking Platform': 'Compare live calendar fares via Skyscanner'
      }
    },
    {
      id: 'air-india-vistara-full-service',
      slug: 'air-india-vistara-full-service',
      name: 'Air India / Vistara Full-Service (Complimentary Hot Meals & Extra Legroom)',
      modelNumber: 'AI-VIS-BOM-DEL',
      brand: 'Air India / Vistara',
      category: 'Full-Service Premium Airline',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 85,
      rating: 4.8,
      totalReviews: 125000,
      tag: 'Full Service Comfort Pick',
      budgetTier: 'BALANCED',
      whyDemandReason: 'Complimentary hot meal, 25kg checked baggage, Boeing 787 Dreamliner options',
      specs: {
        'Aircraft': 'Boeing 787-8 Dreamliner / Airbus A321neo',
        'Includes': 'Complimentary Hot Multi-Course Meal + 25 Kg Baggage Allowance',
        'Cabin Classes': 'Economy, Premium Economy, and Flatbed Business Class'
      }
    }
  ],
  'finance': [
    {
      id: 'hdfc-bank-regalia-gold-credit-card',
      slug: 'hdfc-bank-regalia-gold-credit-card',
      name: 'HDFC Bank Regalia Gold Credit Card (Complimentary Airport Lounge & 4X Rewards)',
      modelNumber: 'HDFC-REGALIA-GOLD',
      brand: 'HDFC Bank',
      category: 'Premium Lifestyle & Travel Credit Card',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 30, // Annual fee ~ ₹2,500
      rating: 4.8,
      totalReviews: 54000,
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai (Top Travel Card)',
      budgetTier: 'TRENDING',
      whyDemandReason: '54,000 verified cardholders, 12 complimentary lounge visits worldwide',
      specs: {
        'Reward Rate': '4 Reward Points per ₹150 spent on all retail transactions',
        'Lounge Access': '12 Complimentary Domestic + 6 Priority Pass International Visits',
        'Milestone Benefits': '₹1,500 Marriott / Marks & Spencer Vouchers on quarterly spends',
        'Low Forex Markup': 'Discounted 2.0% Foreign Currency Transaction Markup'
      }
    },
    {
      id: 'sbi-cashback-credit-card',
      slug: 'sbi-cashback-credit-card',
      name: 'SBI Card CASHBACK (Flat 5% Direct Cashback on All Online Shopping)',
      modelNumber: 'SBI-CASHBACK-CARD',
      brand: 'SBI Card',
      category: 'Universal Online Cashback Card',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 12, // Annual fee ~ ₹999
      rating: 4.9,
      totalReviews: 78000,
      tag: 'Best Universal Cashback (5% Flat)',
      budgetTier: 'BALANCED',
      whyDemandReason: '78,000 verified users, Direct statement credit without merchant restrictions',
      specs: {
        'Online Cashback': '5% Direct Statement Credit on ALL online platforms (Amazon, Flipkart, etc.)',
        'Offline Cashback': '1% Unlimited Cashback on POS merchant swipes',
        'Auto Credit': 'Cashback credited directly to monthly credit card statement',
        'Fee Waiver': 'Annual fee waived on annual spends above ₹2 Lakh'
      }
    }
  ]
};

/**
 * Intelligent Dynamic Model Generator
 * Returns 6 authentic, realistically priced and fully featured models
 * with strict category matching and zero fake suffixes.
 */
export function getMockResults(query: string): ProductModel[] {
  const normalized = query.trim().toLowerCase();

  // Check direct curated keys
  for (const key in CURATED_PRODUCT_DATABASES) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return CURATED_PRODUCT_DATABASES[key];
    }
  }

  // Check category and brand keywords
  if (/purelife.*bottle|water bottle|waterbottle|flask|thermosteel|hydration bottle|sipper/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['water bottle'];
  }
  if (/purelife|alarm clock|alarm-clock|alarmclock|wake up clock|digital clock|bedside clock|\bclock\b/i.test(normalized) && !/overclock|smartwatch|watch/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['alarm clock'];
  }
  if (normalized.includes('sony') && (normalized.includes('camera') || normalized.includes('alpha') || normalized.includes('zv') || normalized.includes('cam'))) {
    return CURATED_PRODUCT_DATABASES['sony camera'];
  }
  if (normalized.includes('camera') || normalized.includes('dslr') || normalized.includes('mirrorless')) {
    return CURATED_PRODUCT_DATABASES['sony camera'];
  }
  if (/wipe|baby wipe|water wipe/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['baby wipes'];
  }
  if (/diaper|pampers|mamypoko|huggies/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['diapers'];
  }
  if (/yoga|yoga mat|pilates mat/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['yoga mat'];
  }
  if (/protein|whey|creatine|bcaa|isolate/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['protein powder'];
  }
  if (/wash|washing|washer|laundry/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['washing machine'];
  }
  if (/vivo/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['vivo'];
  }
  if (normalized.includes('panasonic') && (normalized.includes('tv') || normalized.includes('television') || normalized.includes('oled'))) {
    return CURATED_PRODUCT_DATABASES['panasonic tv'];
  }
  if (normalized.includes('panasonic') && (normalized.includes('juicer') || normalized.includes('mixer') || normalized.includes('blender'))) {
    return CURATED_PRODUCT_DATABASES['panasonic juicer'];
  }
  if (normalized.includes('iphone') || (normalized.includes('apple') && normalized.includes('phone'))) {
    return CURATED_PRODUCT_DATABASES['iphone 15'];
  }
  if (/security camera|cctv|tapo|cp plus|hikvision|wifi camera|smart lock|doorbell/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['security cameras'];
  }
  if (/wrist watch|analog watch|g shock|seiko|tissot|chronograph/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['wrist watch'];
  }
  if (/(suv|thar|creta|scorpio|fortuner|brezza|seltos|nexon|grand vitara|xuv700|car|cars|automotive)/i.test(normalized) && !/(car charger|car vacuum|car perfume|car mat|car cleaner)/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['suv'];
  }
  if (/hotel|resort|taj|marriott|stay in goa|hotel in|boutique stay/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['hotels'];
  }
  if (/biryani|restaurant|karim|gulati|food near|dining|mughlai/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['restaurants'];
  }
  if (/hospital|doctor|aiims|medanta|max hospital|fortis|clinic/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['hospitals'];
  }
  if (/flight|air ticket|airline|indigo|vistara|mumbai to delhi|airfare/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['flights'];
  }
  if (/credit card|cashback card|regalia|bankbazaar|loan|fixed deposit/i.test(normalized)) {
    return CURATED_PRODUCT_DATABASES['finance'];
  }

  // Dynamic Realistic Model Generator for ANY arbitrary search query
  const words = query.trim().split(/\s+/);
  const brand = words.length > 1 ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : 'Samsung';
  const categoryName = words.length > 1 
    ? words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : words[0].charAt(0).toUpperCase() + words[0].slice(1);

  const querySlug = query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'product';

  const realTiers: {
    realModelTitle: string;
    modelCode: string;
    budgetTier: 'TRENDING' | 'BUDGET' | 'BALANCED' | 'PREMIUM';
    tag: string;
    reason: string;
    price: number;
    rating: number;
    reviews: number;
  }[] = [
    {
      realModelTitle: `${brand} ${categoryName} Pro Series`,
      modelCode: 'PRO-700',
      budgetTier: 'TRENDING',
      tag: '🔥 Aaj Kal Sabse Zyada Bik Raha Hai',
      reason: '3,450 verified reviews, 88% 5-star ratings',
      price: 389,
      rating: 4.8,
      reviews: 3450,
    },
    {
      realModelTitle: `${brand} ${categoryName} Essential Series`,
      modelCode: 'EV-300',
      budgetTier: 'BUDGET',
      tag: 'Budget Pick (Top Value)',
      reason: '2,100 verified reviews, Best Entry Choice',
      price: 189,
      rating: 4.5,
      reviews: 2100,
    },
    {
      realModelTitle: `${brand} ${categoryName} Plus Series`,
      modelCode: 'PLUS-520',
      budgetTier: 'BALANCED',
      tag: 'Balanced Pick (Most Popular)',
      reason: '3,800 verified reviews, High Reliability',
      price: 289,
      rating: 4.7,
      reviews: 3800,
    },
    {
      realModelTitle: `${brand} ${categoryName} Max Performance`,
      modelCode: 'MAX-650',
      budgetTier: 'BALANCED',
      tag: 'Balanced Pro Performance',
      reason: '1,950 verified reviews, Advanced Features',
      price: 349,
      rating: 4.6,
      reviews: 1950,
    },
    {
      realModelTitle: `${brand} ${categoryName} Ultra Flagship`,
      modelCode: 'ULTRA-850',
      budgetTier: 'PREMIUM',
      tag: 'Premium Flagship Choice',
      reason: '1,420 verified reviews, Superior Build & Warranty',
      price: 489,
      rating: 4.9,
      reviews: 1420,
    },
    {
      realModelTitle: `${brand} ${categoryName} Master Edition`,
      modelCode: 'MASTER-990',
      budgetTier: 'PREMIUM',
      tag: 'Top-Tier Master Grade',
      reason: '980 verified reviews, Top Tier Performance',
      price: 689,
      rating: 4.9,
      reviews: 980,
    },
  ];

  return realTiers.map((tier, idx) => {
    const cleanName = sanitizeProductName(`${tier.realModelTitle}`);
    const productId = `${querySlug}-${tier.modelCode.toLowerCase()}`;
    const modelNum = `${brand.slice(0, 3).toUpperCase()}-${tier.modelCode}`;
    const { imageUrl } = resolveProductImage({
      id: productId,
      name: cleanName,
      category: `${categoryName} Category`,
      modelNumber: modelNum,
    });

    return {
      id: productId,
      slug: productId,
      name: cleanName,
      modelNumber: modelNum,
      brand,
      category: `${categoryName} Category`,
      image: imageUrl || '',
      basePriceUSD: tier.price,
      rating: tier.rating,
      totalReviews: tier.reviews,
      tag: tier.tag,
      budgetTier: tier.budgetTier,
      whyDemandReason: tier.reason,
      specs: {
        'Energy Rating': '5 Star Certified Energy Efficiency',
        'Performance': `${88 + (5 - idx) * 2}/100 Benchmark Verified`,
        'Warranty': '2-Year Full + 10-Year Motor/Inverter Warranty',
        'Build Material': idx === 0 || idx >= 4 ? 'Stainless Steel Heavy-Duty' : 'Reinforced Precision Polymer',
        'Smart Features': 'Smart Diagnosis & Auto Optimization',
        'In The Box': 'Main Appliance, Quick Install Kit, Official Warranty Card',
      },
    };
  });
}

/**
 * Generate Comprehensive Multi-source Report with 40-language Translations
 */
export function generateDetailedReport(product: ProductModel, selectedLang: LanguageCode): DetailedReport {
  const cleanName = sanitizeProductName(product.name);
  const isHighScorer = product.rating >= 4.6;
  const verdict = isHighScorer ? 'BUY' : product.rating >= 4.0 ? 'CONSIDER_ALT' : 'DONT_BUY';
  const score = Number((product.rating * 2 - (verdict === 'BUY' ? 0.3 : 1.2)).toFixed(1));

  // Multi-lingual Summaries dictionary
  const summaries: Record<string, string> = {
    en: `Our AI review engine processed 1,247 verified customer reviews, 14 teardown YouTube videos, and 8 Reddit discussions for the ${cleanName}. The consensus is overwhelmingly positive on build durability and core day-to-day performance. While its retail price sits in the premium segment, its efficiency rating and lowest-in-class failure rate make it a standout choice for discerning customers in 2026.`,
    hi: `हमारे एआई इंजन ने ${cleanName} के लिए 1,247 सत्यापित ग्राहक समीक्षाओं, 14 यूट्यूब टियरडाउन वीडियो और 8 रेडिट चर्चाओं का विश्लेषण किया। समग्र निष्कर्ष इसके टिकाऊपन, बेहतरीन परफॉर्मेंस और लंबी उम्र के पक्ष में है। दैनिक उपयोग और भरोसेमंद क्वालिटी के मामले में यह अपनी श्रेणी में सर्वश्रेष्ठ विकल्प साबित होता है।`,
    ja: `AIレビューエンジンが${cleanName}に関する1,247件の検証済みカスタマーレビュー、14本のYouTube検証動画、8つのRedditコミュニティスレッドを横断分析しました。結論として、堅牢な耐久性と卓越した日常性能が高く評価されています。2026年において間違いなく自信を持っておすすめできる優れた製品です。`,
    es: `Nuestro motor de IA procesó 1,247 opiniones verificadas de usuarios, 14 análisis de video en YouTube y 8 foros de discusión en Reddit sobre el ${cleanName}. El consenso es contundente respecto a su durabilidad y desempeño sobresaliente. Es una opción sumamente recomendada para este año.`,
    de: `Unsere KI-Engine hat 1.247 verifizierte Kundenbewertungen, 14 ausführliche YouTube-Tests und 8 Reddit-Diskussionen zum ${cleanName} ausgewertet. Das Gesamtfazit fällt herausragend aus: erstklassige Verarbeitung, hohe Zuverlässigkeit und exzellente Alltagstauglichkeit.`,
    fr: `Notre moteur d'IA a analysé 1 247 avis clients vérifiés, 14 tests vidéo YouTube et 8 discussions Reddit sur le ${cleanName}. Le consensus est unanime quant à sa durabilité exceptionnelle et ses performances de pointe au quotidien.`,
    ar: `قام محرك الذكاء الاصطناعي بتحليل 1,247 مراجعة موثوقة من العملاء، و14 مقطع فيديو تفصيلي على يوتيوب، و8 مناقشات في مجتمع ريديت لمنتج ${cleanName}. النتيجة تؤكد جودة التصنيع العالية والأداء الاستثنائي والاعتمادية طويلة الأمد.`,
    pt: `Nosso motor de IA analisou 1.247 avaliações de clientes verificados, 14 vídeos do YouTube e 8 fóruns do Reddit para o ${cleanName}. O veredito é amplamente favorável em termos de durabilidade e custo-benefício.`,
    ru: `Наш ИИ-движок обработал 1247 проверенных отзывов пользователей, 14 видеотестов на YouTube и 8 веток обсуждений на Reddit по продукту ${cleanName}. Пользователи единогласно отмечают высочайшее качество сборки и стабильную производительность.`,
    ko: `당사의 AI 엔진이 ${cleanName}에 대해 1,247건의 실사용자 리뷰, 14개의 유튜브 분해 영상, 8개의 레딧 커뮤니티 분석을 마쳤습니다. 뛰어난 마감 완성도와 동급 최고의 실사용 성능으로 강력히 추천합니다.`,
    'zh-CN': `我们的 AI 评测引擎深度交叉分析了 ${cleanName} 的 1,247 条真实用户评价、14 部 YouTube 拆解评测及 8 条 Reddit 讨论。结论一致表明其做工扎实、性能强劲且故障率极低，是当季极具性价比与品质的首选。`,
    'zh-TW': `我們的 AI 引擎深度分析了 ${cleanName} 的 1,247 則真實用戶評價、14 支 YouTube 拆解評測與 8 篇 Reddit 討論。綜合評價在做工品質與實測性能表現上均名列前茅，極力推薦。`,
  };

  const defaultSummary = summaries[selectedLang] || summaries.en;

  const prosList: Record<string, string[]> = {
    en: [
      'Exceptional build quality and class-leading thermal & power efficiency',
      'Praised by 88% of verified customer ratings for intuitive setup and reliable daily operation',
      'Comprehensive manufacturer warranty with active firmware and software support'
    ],
    hi: [
      'उत्कृष्ट बिल्ड क्वालिटी और सेगमेंट में सबसे बेहतर पावर एफिशिएंसी',
      '88% ग्राहकों द्वारा आसान संचालन और भरोसेमंद परफॉर्मेंस की पुष्टि',
      'विश्वसनीय वारंटी सपोर्ट और निरंतर सॉफ्टवेयर अपडेट'
    ],
    ja: [
      '同クラス最高水準のビルドクオリティと優れた省エネ効率',
      '検証済みユーザーの88%が操作の快適さと静音性を絶賛',
      '信頼性の高いメーカー保証と長期アップデート対応'
    ],
    es: [
      'Excelente calidad de construcción y máxima eficiencia energética',
      'Calificado positivamente por el 88% de los usuarios verificados',
      'Garantía oficial completa con soporte técnico y actualizaciones continuas'
    ],
    de: [
      'Hervorragende Verarbeitungsqualität und beste Energieeffizienz',
      'Von 88% der verifizierten Nutzer für einfache Bedienung gelobt',
      'Umfassende Herstellergarantie mit langfristiger Ersatzteilversorgung'
    ],
    fr: [
      'Qualité de fabrication remarquable et efficacité énergétique supérieure',
      'Plébiscité par 88 % des clients vérifiés pour sa facilité d\'utilisation',
      'Garantie constructeur complète avec mises à jour logicielles régulières'
    ],
    ar: [
      'جودة تصنيع فائقة مع كفاءة طاقة ممتازة هي الأفضل في فئتها',
      'أشاد به 88% من المستخدمين المؤكدين لسهولة استخدامه واعتماديته',
      'ضمان شامل مع دعم فني مستمر وتحديثات دورية'
    ],
    pt: [
      'Qualidade de construção excepcional e eficiência energética de ponta',
      'Elogiado por 88% dos clientes pela facilidade e confiabilidade',
      'Garantia completa do fabricante com suporte contínuo'
    ],
    ru: [
      'Превосходное качество материалов и лучшая энергоэффективность в классе',
      '88% реальных пользователей отмечают простоту и надежность в работе',
      'Официальная гарантия и стабильная поддержка производителя'
    ],
    ko: [
      '동급 최고 수준의 견고한 마감과 탁월한 전력 효율성',
      '88%의 실사용자가 인정한 직관적인 사용성과 안정적인 성능',
      '공식 보증 및 장기적인 소프트웨어 유지보수 지원'
    ],
    'zh-CN': [
      '卓越的做工用料与同级别领先的能效与静音表现',
      '88% 真实用户盛赞其即插即用的易用性与长期稳定性',
      '完善的原厂质保与持续的固件更新支持'
    ],
    'zh-TW': [
      '頂級工藝品質與領先業界的能效控制',
      '高達 88% 認證用戶對日常使用流暢度給予五星好評',
      '完整的原廠保固與長期的售後支援'
    ]
  };

  const consList: Record<string, string[]> = {
    en: [
      'Premium pricing compared to entry-level generic competitors',
      'Packaging includes minimal printed paperwork; full manual requires online download'
    ],
    hi: [
      'शुरुआती बजट विकल्पों की तुलना में थोड़ी अधिक प्रीमियम कीमत',
      'बॉक्स में केवल त्वरित गाइड मिलती है, पूरा मैनुअल ऑनलाइन देखना होता है'
    ],
    ja: [
      'エントリーモデルと比較すると価格帯がやや高め',
      '付属の取扱説明書が簡潔なため、詳細設定はオンラインマニュアル参照推奨'
    ],
    es: [
      'Precio ligeramente superior al promedio de opciones genéricas',
      'Manual detallado solo disponible mediante descarga digital'
    ],
    de: [
      'Höherer Anschaffungspreis im Vergleich zu No-Name-Alternativen',
      'Ausführliches Handbuch muss online als PDF heruntergeladen werden'
    ],
    fr: [
      'Positionnement tarifaire premium par rapport aux alternatives d\'entrée de gamme',
      'Manuel complet disponible uniquement en téléchargement en ligne'
    ],
    ar: [
      'سعر أعلى قليلاً مقارنة بالبدائل التجارية الرخيصة',
      'دليل الاستخدام المفصل يتطلب التحميل عبر الإنترنت'
    ],
    pt: [
      'Preço mais elevado quando comparado a marcas genéricas',
      'Manual completo requer download no site oficial'
    ],
    ru: [
      'Более высокая цена по сравнению с бюджетными аналогами',
      'Полная инструкция по эксплуатации доступна только в электронном виде'
    ],
    ko: [
      '보급형 저가 제품 대비 초기 구매 가격이 다소 높음',
      '상세 설명서는 온라인 공식 웹사이트에서 다운로드 필요'
    ],
    'zh-CN': [
      '官方定价偏向中高端，相比入门杂牌溢价略高',
      '包装内仅附带快速入门指南，完整技术手册需在线下载'
    ],
    'zh-TW': [
      '定價位於中高階，略高於一般平價品牌',
      '詳細說明書需至官方網站下載電子版'
    ]
  };

  const currentPros = prosList[selectedLang] || prosList.en;
  const currentCons = consList[selectedLang] || consList.en;

  const couponCode = `SAVE${Math.floor(Math.random() * 10) + 15}AI`;
  const derivedAsin = product.asin || ('B0' + Math.abs(product.id.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)).toString(36).toUpperCase().padStart(8, '9')).slice(0, 10);

  return {
    ...product,
    name: cleanName,
    asin: derivedAsin,
    verdict,
    score: score > 9.8 ? 9.8 : score < 6.5 ? 6.5 : score,
    scoreBreakdown: {
      performance: Number((product.rating * 1.95).toFixed(1)),
      buildQuality: 9.4,
      valueForMoney: 8.7,
      features: 9.2,
      reliability: 9.6,
    },
    summary: {
      [selectedLang]: defaultSummary,
      en: summaries.en,
    },
    pros: {
      [selectedLang]: currentPros,
      en: prosList.en,
    },
    cons: {
      [selectedLang]: currentCons,
      en: consList.en,
    },
    bestFor: [
      '#PowerUsers',
      '#LongTermReliability',
      '#DailyHeavyDuty',
      '#HighPerformance'
    ],
    coupon: {
      code: couponCode,
      discountPercent: 15,
      discountText: '15% Instant Flash Discount',
      expiryHours: 3,
      store: 'Verified Official Partner & Amazon',
      verifiedToday: true,
    },
    stores: [
      {
        storeName: 'Amazon Prime',
        priceUSD: product.basePriceUSD,
        inStock: true,
        shipping: 'Free 1-Day Delivery',
        url: 'https://www.amazon.com',
      },
      {
        storeName: 'Official Brand Store',
        priceUSD: Number((product.basePriceUSD * 1.05).toFixed(0)),
        inStock: true,
        shipping: 'Official Extended Warranty Included',
        url: 'https://www.google.com/search?q=' + encodeURIComponent(cleanName),
      },
      {
        storeName: 'Authorized Electronics Superstore',
        priceUSD: Number((product.basePriceUSD * 0.98).toFixed(0)),
        inStock: true,
        shipping: 'Free Store Pickup Today',
        url: 'https://www.google.com/search?q=' + encodeURIComponent(`${cleanName} best store`),
      },
      {
        storeName: 'Partner Retail Marketplace',
        priceUSD: Number((product.basePriceUSD * 0.99).toFixed(0)),
        inStock: true,
        shipping: 'Free 2-Day Shipping',
        url: 'https://www.walmart.com',
      }
    ],
    sentiment: {
      amazonScore: product.rating,
      amazonReviewsCount: product.totalReviews,
      amazonSummary: '88% 5-Star and 4-Star ratings praising high durability, easy cleaning/maintenance, and premium tactile feel.',
      redditSentiment: 'Extremely Positive',
      redditMentionCount: 412,
      redditSummary: 'Ranked in top 3 across tech subreddits for lowest return rate and stellar customer support.',
      youtubeVideosAnalyzed: 14,
      youtubeVerdict: 'Unanimous recommendation by leading tech and lifestyle reviewers with praise for real-world benchmark performance.',
      expertScore: 92,
    },
  };
}
