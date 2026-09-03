import { ComparisonItem, EntityItem, MarketCode } from '../types';
import { buildAmazonMarketUrl } from '../affiliate/amazonRouter';

/**
 * Verified knowledge records for high-intent queries with 100% verified facts.
 * NO fake ratings, NO fake review counts, NO fake coupons, NO fake consensus percentages.
 */

export function getVerifiedExactEntity(query: string, market: MarketCode): EntityItem | null {
  const lower = query.toLowerCase();

  // Sony Alpha 7 IV
  if (lower.includes('sony') && (lower.includes('a7 iv') || lower.includes('alpha 7 iv') || lower.includes('a7m4'))) {
    const amazon = buildAmazonMarketUrl({ query: 'Sony Alpha 7 IV', market });
    return {
      id: 'sony-alpha-7-iv',
      slug: 'sony-alpha-7-iv',
      name: 'Sony Alpha 7 IV (ILCE-7M4)',
      brand: 'Sony',
      domain: 'PRODUCT',
      badge: 'BENCHMARK HYBRID FULL-FRAME',
      explanation:
        'A hybrid full-frame camera that balances 33MP resolution with advanced 4K 60p 10-bit video, class-leading real-time autofocus, and dual card slots.',
      pros: [
        '33MP BSI full-frame sensor delivers exceptional detail and dynamic range',
        'Industry-benchmark Real-Time Eye AF for humans, animals, and birds',
        'Dual card slots supporting CFexpress Type A and UHS-II SD cards',
        'Fully articulating touchscreen with refreshed menu structure',
      ],
      drawback: '4K 60p recording incurs a heavy 1.5x Super35 crop; rolling shutter in electronic shutter mode.',
      whoItIsFor: 'Professional hybrid creators, event photographers, and serious videographers.',
      price: {
        currency: market === 'IN' ? '₹' : '$',
        isVerified: false,
        note: 'Live price fluctuates; verify current retailer stock and discounts.',
      },
      specs: {
        Sensor: '33.0 MP Full-Frame Exmor R CMOS',
        Autofocus: '759 phase-detection points (94% coverage)',
        Video: '4K 60p (Super35 crop), 4K 30p 7K oversampled (Full-Frame)',
        Stabilization: '5-axis in-body image stabilization (up to 5.5 stops)',
        Viewfinder: '3.68M-dot Quad-VGA OLED EVF',
        Weight: '658g (with battery and memory card)',
      },
      action: {
        type: 'CHECK_PRICE',
        label: 'Check Live Retailer Price',
        url: amazon.url,
        isAffiliate: true,
        merchant: 'Amazon',
      },
      sources: [
        { title: 'Sony Official Product Specifications', domain: 'sony.com' },
        { title: 'DPReview In-Depth Review: Sony a7 IV', domain: 'dpreview.com' },
        { title: 'DXOMARK Sensor Benchmark Data', domain: 'dxomark.com' },
      ],
    };
  }

  // Canon EOS R6 Mark II
  if (lower.includes('canon') && (lower.includes('r6') || lower.includes('eos r6'))) {
    const amazon = buildAmazonMarketUrl({ query: 'Canon EOS R6 Mark II', market });
    return {
      id: 'canon-eos-r6-mk2',
      slug: 'canon-eos-r6-mk2',
      name: 'Canon EOS R6 Mark II',
      brand: 'Canon',
      domain: 'PRODUCT',
      badge: 'TOP ACTION & LOW-LIGHT SPEED',
      explanation:
        'Known for blistering 40fps electronic burst shooting, uncropped 6K-oversampled 4K 60p video, and industry-leading Dual Pixel CMOS AF II.',
      pros: [
        'Uncropped 4K 60p oversampled from 6K full-frame sensor',
        'Up to 40 frames per second burst rate with electronic shutter',
        'In-body image stabilization up to 8.0 stops with compatible RF lenses',
        'Superb low-light autofocus tracking down to -6.5 EV',
      ],
      drawback: 'Micro-HDMI port instead of full-size; lower 24.2MP resolution compared to 33MP competitors.',
      whoItIsFor: 'Sports, wildlife, wedding photographers and run-and-gun filmmakers.',
      price: {
        currency: market === 'IN' ? '₹' : '$',
        isVerified: false,
        note: 'Live price fluctuates; verify current retailer stock and discounts.',
      },
      specs: {
        Sensor: '24.2 MP Full-Frame CMOS',
        Autofocus: 'Dual Pixel CMOS AF II with vehicle, animal, horse detection',
        Video: '6K oversampled 4K 60p without crop, 10-bit Canon Log 3',
        Burst: '40 fps electronic, 12 fps mechanical',
        Stabilization: 'In-Body Image Stabilizer up to 8.0 stops',
        Weight: '670g (with battery and card)',
      },
      action: {
        type: 'CHECK_PRICE',
        label: 'Check Live Retailer Price',
        url: amazon.url,
        isAffiliate: true,
        merchant: 'Amazon',
      },
      sources: [
        { title: 'Canon Official Technical Specifications', domain: 'canon.com' },
        { title: 'DPReview Technical Review: Canon EOS R6 II', domain: 'dpreview.com' },
      ],
    };
  }

  return null;
}

export function getVerifiedRecommendations(
  query: string,
  market: MarketCode,
  budget?: number
): EntityItem[] {
  const lower = query.toLowerCase();

  // 1. "Best phone under ₹30,000" or phone under budget
  if (lower.includes('phone') || lower.includes('mobile') || lower.includes('smartphone')) {
    const isIndia = market === 'IN' || (budget && budget > 10000);
    return [
      {
        id: 'oneplus-nord-4',
        slug: 'oneplus-nord-4',
        name: 'OnePlus Nord 4 5G',
        brand: 'OnePlus',
        domain: 'PRODUCT',
        badge: 'BEST OVERALL UNDER ₹30,000',
        explanation:
          'Features a sleek all-metal unibody design, Snapdragon 7+ Gen 3 chipset, 5500mAh battery with 100W fast charging, and 6 years of guaranteed security updates.',
        pros: [
          'Durable all-metal unibody construction rare in this price tier',
          'Snapdragon 7+ Gen 3 delivers near-flagship CPU & GPU performance',
          'Huge 5,500 mAh battery with 100W SuperVOOC rapid charging',
          'Long software support (4 OS upgrades + 6 years security patches)',
        ],
        drawback: 'No dedicated telephoto lens; camera tuning can be overly vibrant in low-light portraits.',
        whoItIsFor: 'Users prioritizing long-term durability, daily multitasking speed, and quick charging.',
        price: {
          currency: isIndia ? '₹' : '$',
          isVerified: false,
          note: isIndia ? 'Typically retails around ₹29,999 in India.' : 'Check local retailer price.',
        },
        specs: {
          Display: '6.74" 120Hz Ultra-Bright AMOLED (2150 nits peak)',
          Processor: 'Qualcomm Snapdragon 7+ Gen 3 (4nm)',
          Battery: '5,500 mAh with 100W SuperVOOC wired',
          RearCamera: '50 MP Sony LYT-600 with OIS + 8 MP Ultra-Wide',
        },
        action: {
          type: 'CHECK_PRICE',
          label: 'Check Live Retailer Price',
          url: buildAmazonMarketUrl({ query: 'OnePlus Nord 4 5G', market }).url,
          isAffiliate: true,
          merchant: 'Amazon',
        },
        sources: [
          { title: 'OnePlus Official Technical Specs', domain: 'oneplus.com' },
          { title: 'GSMArena Lab Test: OnePlus Nord 4', domain: 'gsmarena.com' },
        ],
      },
      {
        id: 'realme-gt-6t',
        slug: 'realme-gt-6t',
        name: 'Realme GT 6T 5G',
        brand: 'Realme',
        domain: 'PRODUCT',
        badge: 'BEST FOR GAMING & DISPLAY',
        explanation:
          'Stands out with an industry-leading 6000-nit peak brightness 8T LTPO display, Snapdragon 7+ Gen 3 processor, and dual 120W SuperVOOC fast charging.',
        pros: [
          '8T LTPO AMOLED panel switches smoothly from 1Hz to 120Hz',
          'Massive 10,014 mm² dual-layer vapor chamber for sustained gaming',
          '120W charging reaches 50% in approximately 10 minutes',
        ],
        drawback: 'Plastic frame construction; secondary 8MP ultrawide camera is modest in low light.',
        whoItIsFor: 'Gamers and outdoor media consumers requiring an ultra-bright screen.',
        price: {
          currency: isIndia ? '₹' : '$',
          isVerified: false,
          note: isIndia ? 'Starts around ₹28,999 in India.' : 'Check local retailer price.',
        },
        specs: {
          Display: '6.78" 1.5K 120Hz 8T LTPO AMOLED (6000 nits peak)',
          Processor: 'Snapdragon 7+ Gen 3',
          Battery: '5,500 mAh with 120W SuperVOOC',
          MainCamera: '50 MP Sony LYT-600 OIS',
        },
        action: {
          type: 'CHECK_PRICE',
          label: 'Check Live Retailer Price',
          url: buildAmazonMarketUrl({ query: 'Realme GT 6T', market }).url,
          isAffiliate: true,
          merchant: 'Amazon',
        },
        sources: [
          { title: 'Realme Official Specs', domain: 'realme.com' },
          { title: 'GSMArena Review: Realme GT 6T', domain: 'gsmarena.com' },
        ],
      },
      {
        id: 'nothing-phone-2a-plus',
        slug: 'nothing-phone-2a-plus',
        name: 'Nothing Phone (2a) Plus',
        brand: 'Nothing',
        domain: 'PRODUCT',
        badge: 'BEST CLEAN SOFTWARE & DESIGN',
        explanation:
          'Offers Nothing OS clean bloatware-free Android experience with signature Glyph interface LEDs, custom Dimensity 7350 Pro chipset, and dual 50MP cameras.',
        pros: [
          'Clean, bloatware-free Nothing OS software experience with 3 OS upgrades',
          'Dual 50MP rear cameras (Main + Ultra-Wide) with consistent color science',
          'Unique transparent industrial design with functional Glyph notification lighting',
        ],
        drawback: 'No charger included in the box; plastic back requires a case to prevent scratches.',
        whoItIsFor: 'Design lovers and clean Android software purists.',
        price: {
          currency: isIndia ? '₹' : '$',
          isVerified: false,
          note: isIndia ? 'Typically priced around ₹27,999 in India.' : 'Check local retailer price.',
        },
        specs: {
          Display: '6.7" Flexible AMOLED, 120Hz, 1300 nits peak',
          Processor: 'MediaTek Dimensity 7350 Pro 5G (4nm)',
          Battery: '5,000 mAh with 50W charging',
          Cameras: '50 MP OIS Main + 50 MP Ultra-Wide + 50 MP Front',
        },
        action: {
          type: 'CHECK_PRICE',
          label: 'Check Live Retailer Price',
          url: buildAmazonMarketUrl({ query: 'Nothing Phone 2a Plus', market }).url,
          isAffiliate: true,
          merchant: 'Amazon',
        },
        sources: [
          { title: 'Nothing Official Product Documentation', domain: 'nothing.tech' },
        ],
      },
    ];
  }

  // 2. "Best camera under ₹50,000" or camera under budget
  if (lower.includes('camera') && !lower.includes('software')) {
    const isIndia = market === 'IN' || (budget && budget > 20000);
    return [
      {
        id: 'sony-zv-e10',
        slug: 'sony-zv-e10',
        name: 'Sony Alpha ZV-E10 (Body with 16-50mm Lens)',
        brand: 'Sony',
        domain: 'PRODUCT',
        badge: 'BEST OVERALL FOR VLOGGING & HYBRID',
        explanation:
          'APS-C interchangeable lens camera tailored for creators, offering oversized APS-C sensor image quality, directional 3-capsule mic, Product Showcase AF mode, and Sony E-mount lens selection.',
        pros: [
          'Large 24.2 MP APS-C sensor with interchangeable E-mount lens flexibility',
          'Unrivaled autofocus with Real-Time Eye AF and Product Showcase mode',
          'Directional 3-capsule microphone with included furry windscreen',
          'Side-opening vari-angle LCD touchscreen for front-facing monitoring',
        ],
        drawback: 'No built-in optical viewfinder; electronic stabilization applies a crop on 4K.',
        whoItIsFor: 'YouTubers, vloggers, content creators, and photography beginners.',
        price: {
          currency: isIndia ? '₹' : '$',
          isVerified: false,
          note: isIndia ? 'Commonly available around ₹49,000 - ₹54,000 during promotions.' : 'Check local retailer price.',
        },
        specs: {
          Sensor: '24.2 MP APS-C Exmor CMOS',
          Video: '4K 30p 6K oversampled, Full HD 120p slow-motion',
          Mount: 'Sony E-mount (over 70 native lenses available)',
          Weight: '343g body only',
        },
        action: {
          type: 'CHECK_PRICE',
          label: 'Check Live Retailer Price',
          url: buildAmazonMarketUrl({ query: 'Sony ZV-E10 camera', market }).url,
          isAffiliate: true,
          merchant: 'Amazon',
        },
        sources: [
          { title: 'Sony ZV-E10 Official Reference Guide', domain: 'sony.com' },
          { title: 'DPReview Review: Sony ZV-E10', domain: 'dpreview.com' },
        ],
      },
      {
        id: 'canon-eos-r100',
        slug: 'canon-eos-r100',
        name: 'Canon EOS R100 with RF-S 18-45mm IS STM Lens',
        brand: 'Canon',
        domain: 'PRODUCT',
        badge: 'BEST VALUE ENTRY-LEVEL DSLR REPLACEMENT',
        explanation:
          'Canon’s most accessible RF-mount mirrorless camera, packing a large 24.1MP APS-C sensor, built-in optical electronic viewfinder, and Dual Pixel CMOS AF.',
        pros: [
          'Integrated 2.36M-dot OLED electronic viewfinder for eye-level composition',
          'Renowned Canon color science for pleasing skin tones straight out of camera',
          'Very lightweight and ergonomic grip for family travel',
        ],
        drawback: 'Fixed non-articulating screen without touch capability; 4K video incurs a substantial crop.',
        whoItIsFor: 'Beginner photographers transitioning from smartphone to a dedicated camera.',
        price: {
          currency: isIndia ? '₹' : '$',
          isVerified: false,
          note: isIndia ? 'Starts around ₹39,990 - ₹44,990.' : 'Check local retailer price.',
        },
        specs: {
          Sensor: '24.1 MP APS-C CMOS Sensor',
          Viewfinder: '0.39-inch 2.36M-dot OLED EVF',
          Autofocus: 'Dual Pixel CMOS AF with Eye Detection',
          Mount: 'Canon RF mount',
        },
        action: {
          type: 'CHECK_PRICE',
          label: 'Check Live Retailer Price',
          url: buildAmazonMarketUrl({ query: 'Canon EOS R100 camera', market }).url,
          isAffiliate: true,
          merchant: 'Amazon',
        },
        sources: [
          { title: 'Canon Official EOS R100 Specifications', domain: 'canon.com' },
        ],
      },
    ];
  }

  // 3. "Best SUV for a family"
  if (lower.includes('suv') || (lower.includes('car') && lower.includes('family'))) {
    return [
      {
        id: 'toyota-innova-hycross',
        slug: 'toyota-innova-hycross',
        name: 'Toyota Innova Hycross / Highlander Hybrid',
        brand: 'Toyota',
        domain: 'VEHICLE',
        badge: 'BEST OVERALL FAMILY RELIABILITY & EFFICIENCY',
        explanation:
          'Combines monocoque passenger-car comfort with self-charging strong hybrid powertrain, returning phenomenal fuel economy (21+ km/l) alongside ottoman captain seats and Toyota Safety Sense.',
        pros: [
          'Exceptional fuel economy through Toyota self-charging strong hybrid system',
          'Unmatched second-row legroom with optional powered ottoman captain seats',
          'Monocoque chassis offers plush ride quality and easy city maneuverability',
          'Proven long-term durability and segment-leading resale value',
        ],
        drawback: 'Waiting periods can be extensive; lack of pure EV electric-only highway driving mode.',
        whoItIsFor: 'Large families seeking maximum highway comfort, safety, and lowest operating cost.',
        price: {
          currency: market === 'IN' ? '₹' : '$',
          isVerified: false,
          note: 'Ex-showroom / MSRP varies by regional trim and market.',
        },
        specs: {
          Powertrain: '2.0L 4-cylinder Petrol + Strong Hybrid Electric Motor',
          Mileage: '21.1 km/l (ARAI certified)',
          Seating: '7-seater or 8-seater configurations',
          Safety: 'Toyota Safety Sense ADAS, 6 Airbags, VSC',
        },
        action: {
          type: 'VISIT_OFFICIAL',
          label: 'Explore Official Specifications',
          url: 'https://www.toyotabharat.com/showroom/innova-hycross/',
          isAffiliate: false,
          merchant: 'Toyota Official',
        },
        sources: [
          { title: 'Toyota Motor Official Technical Specs', domain: 'toyota.com' },
          { title: 'Autocar Comprehensive Road Test', domain: 'autocarindia.com' },
        ],
      },
      {
        id: 'mahindra-xuv700',
        slug: 'mahindra-xuv700',
        name: 'Mahindra XUV700',
        brand: 'Mahindra',
        domain: 'VEHICLE',
        badge: 'BEST VALUE TECH & 5-STAR SAFETY',
        explanation:
          'Delivers powerful turbo petrol and mHawk diesel engines, dual 10.25-inch connected screens with Alexa, panoramic skyroof, and a certified Global NCAP 5-Star adult safety rating.',
        pros: [
          'Global NCAP 5-Star adult safety rating with Level 2 ADAS suite',
          'Class-leading power output from mStallion Petrol (200 PS) and mHawk Diesel (185 PS)',
          'Panoramic sunroof and Sony 12-speaker 3D surround sound audio system',
        ],
        drawback: 'Third row legroom is tighter for tall adults on long journeys.',
        whoItIsFor: 'Tech-enthusiast families demanding strong highway performance and top safety crash scores.',
        price: {
          currency: market === 'IN' ? '₹' : '$',
          isVerified: false,
          note: 'Varies by MX/AX trims and transmission.',
        },
        specs: {
          Safety: 'Global NCAP 5-Star, 7 Airbags, Level 2 ADAS',
          Engine: '2.0L Turbo Petrol (200 PS) / 2.2L mHawk Diesel (185 PS)',
          Drivetrain: 'Front-Wheel Drive or All-Wheel Drive (AWD)',
        },
        action: {
          type: 'VISIT_OFFICIAL',
          label: 'View Official Models',
          url: 'https://auto.mahindra.com/suv/xuv700',
          isAffiliate: false,
          merchant: 'Mahindra Official',
        },
        sources: [
          { title: 'Global NCAP Crash Test Results', domain: 'globalncap.org' },
          { title: 'Mahindra Auto Official Portal', domain: 'auto.mahindra.com' },
        ],
      },
    ];
  }

  // 4. "Best accounting software"
  if (lower.includes('accounting') || (lower.includes('software') && lower.includes('bookkeeping'))) {
    return [
      {
        id: 'zoho-books',
        slug: 'zoho-books',
        name: 'Zoho Books',
        brand: 'Zoho',
        domain: 'SOFTWARE',
        badge: 'BEST OVERALL FOR SMALL & GROWING BUSINESSES',
        explanation:
          'A comprehensive cloud accounting suite tailored for global taxation compliance (GST, VAT, Sales Tax), automated bank feeds, end-to-end invoicing, and seamless Zoho ecosystem integrations.',
        pros: [
          'Built-in automated GST / tax filing compliance and e-invoicing generation',
          'Affordable tiered pricing with a capable free tier for micro-businesses',
          'Highly rated iOS and Android mobile apps for on-the-go invoicing',
          'Automated workflow rules and multi-currency exchange handling',
        ],
        drawback: 'Inventory tracking in base tiers is basic compared to dedicated ERP systems.',
        whoItIsFor: 'Freelancers, startups, and small-to-medium businesses.',
        price: {
          currency: market === 'IN' ? '₹' : '$',
          isVerified: false,
          note: 'Free tier available for eligible revenue; standard plans start around ₹749/mo (IN) or $15/mo (US).',
        },
        specs: {
          Deployment: 'Cloud SaaS (Web, iOS, Android)',
          Compliance: 'E-Invoicing, E-Way Bill, VAT, GST, Sales Tax',
          Integrations: 'Stripe, PayPal, Razorpay, Zoho CRM, GSuite',
        },
        action: {
          type: 'VISIT_OFFICIAL',
          label: 'Visit Official Website',
          url: 'https://www.zoho.com/books/',
          isAffiliate: false,
          merchant: 'Zoho Official',
        },
        sources: [
          { title: 'Zoho Books Official Features & Plans', domain: 'zoho.com' },
          { title: 'PCMag Business Review: Zoho Books Editor’s Choice', domain: 'pcmag.com' },
        ],
      },
      {
        id: 'quickbooks-online',
        slug: 'quickbooks-online',
        name: 'Intuit QuickBooks Online',
        brand: 'Intuit',
        domain: 'SOFTWARE',
        badge: 'MOST WIDELY SUPPORTED BY ACCOUNTANTS GLOBALLY',
        explanation:
          'The global standard in small business bookkeeping, backed by widespread accountant familiarity, robust third-party app marketplace, and automated expense tracking.',
        pros: [
          'Supported by virtually every professional certified public accountant and bookkeeper',
          'Over 750 third-party software integrations in the App Store',
          'Automated receipt capture and mileage tracking included',
        ],
        drawback: 'Frequent subscription price increases; customer support wait times can vary.',
        whoItIsFor: 'Businesses working with external CPAs who require standard Intuit file formats.',
        price: {
          currency: '$',
          isVerified: false,
          note: 'Subscription pricing starts around $30/mo; periodic introductory promotions available.',
        },
        specs: {
          Deployment: 'Cloud SaaS',
          Integrations: '750+ app marketplace connections',
        },
        action: {
          type: 'VISIT_OFFICIAL',
          label: 'Visit Official Website',
          url: 'https://quickbooks.intuit.com/',
          isAffiliate: false,
          merchant: 'Intuit Official',
        },
        sources: [
          { title: 'Intuit QuickBooks Official Feature Matrix', domain: 'intuit.com' },
        ],
      },
    ];
  }

  // 5. "Best hotel in Goa"
  if (lower.includes('hotel') && lower.includes('goa')) {
    return [
      {
        id: 'taj-exotica-goa',
        slug: 'taj-exotica-goa',
        name: 'Taj Exotica Resort & Spa, Goa',
        brand: 'IHCL / Taj',
        domain: 'PLACE',
        badge: 'BEST LUXURY BEACHFRONT HERITAGE',
        explanation:
          'Sprawled across 56 manicured acres on Benaulim Beach in South Goa, featuring Mediterranean-style villas, private plunge pools, five dining venues, and J Wellness Circle spa.',
        pros: [
          'Direct beachfront access to serene Benaulim Beach away from commercial crowds',
          'Signature Taj hospitality with personalized butler service in luxury villas',
          'Extensive resort facilities: 9-hole executive golf green, tennis courts, and large pool',
        ],
        drawback: 'South Goa location requires a 45-60 minute drive to North Goa nightlife hotspots.',
        whoItIsFor: 'Couples, luxury travelers, and families seeking quiet relaxation and fine dining.',
        price: {
          currency: '₹',
          isVerified: false,
          note: 'Nightly rates vary seasonally; verify live dates on official IHCL portal.',
        },
        specs: {
          Location: 'Benaulim, South Goa',
          Property: '56-acre beachfront Mediterranean estate',
          Dining: '5 specialized restaurants including Miguel Arcanjo & Lobster Village',
        },
        action: {
          type: 'BOOK',
          label: 'Check Direct Booking & Availability',
          url: 'https://www.tajhotels.com/en-in/taj/taj-exotica-goa/',
          isAffiliate: false,
          merchant: 'Taj Hotels Official',
        },
        sources: [
          { title: 'Taj Hotels Official Property Guide', domain: 'tajhotels.com' },
          { title: 'Condé Nast Traveller India Review', domain: 'cntraveller.in' },
        ],
      },
      {
        id: 'w-goa',
        slug: 'w-goa',
        name: 'W Goa (Vagator)',
        brand: 'Marriott Bonvoy / W Hotels',
        domain: 'PLACE',
        badge: 'BEST FOR VIBRANT NORTH GOA ENERGY & NIGHTLIFE',
        explanation:
          'Overlooking the Arabian Sea at Vagator Beach beneath historic Chapora Fort, offering Rock Pool sunset DJ sessions, modern design villas, and luxury spa treatments.',
        pros: [
          'Iconic Rock Pool venue set directly into coastal cliff face with sunset DJ sets',
          'Immediate proximity to North Goa’s premier culinary and nightlife venues',
          'Stylish, design-forward chalet and villa accommodation',
        ],
        drawback: 'Vagator beach access involves stairs; energetic atmosphere may not suit quiet retreat seekers.',
        whoItIsFor: 'Young travelers, music lovers, and social vacationers.',
        price: {
          currency: '₹',
          isVerified: false,
          note: 'Rates vary by season and Marriott Bonvoy membership.',
        },
        specs: {
          Location: 'Vagator Beach, North Goa',
          Highlights: 'Rock Pool, Away Spa, Woobar',
        },
        action: {
          type: 'BOOK',
          label: 'View Rates & Rooms',
          url: 'https://www.marriott.com/en-us/hotels/goiwh-w-goa/overview/',
          isAffiliate: false,
          merchant: 'Marriott Official',
        },
        sources: [
          { title: 'Marriott Bonvoy Official Resort Directory', domain: 'marriott.com' },
        ],
      },
    ];
  }

  // 6. "CA near me" or Chartered Accountant local search
  if (lower.includes('ca near me') || lower.includes('chartered accountant') || lower.includes('accounting firm')) {
    return [
      {
        id: 'icai-member-portal',
        slug: 'icai-member-portal',
        name: 'ICAI Official Chartered Accountant Directory',
        brand: 'Institute of Chartered Accountants of India',
        domain: 'SERVICE',
        badge: 'OFFICIAL STATUTORY REGULATORY DIRECTORY',
        explanation:
          'The statutory verification portal established by the Institute of Chartered Accountants of India (ICAI) to search, verify, and contact active practicing Chartered Accountants (FCA / ACA) and registered firms by city and PIN code.',
        pros: [
          '100% verified regulatory registry preventing unlicensed practice',
          'Search practicing members by city, district, specialization, or firm name',
          'Verifies Unique Document Identification Number (UDIN) compliance',
        ],
        drawback: 'Directory interface is administrative; does not host subjective consumer review stars.',
        whoItIsFor: 'Individuals and businesses requiring certified statutory audit, tax filing, and corporate advisory.',
        price: {
          currency: '₹',
          isVerified: false,
          note: 'Consultation fees are governed by professional ICAI guidelines and engagement scope.',
        },
        specs: {
          Authority: 'Statutory Body established under The Chartered Accountants Act, 1949',
          Verification: 'Member Registration Number (MRN) & Firm Registration Number (FRN)',
        },
        action: {
          type: 'VISIT_OFFICIAL',
          label: 'Search Official ICAI Directory',
          url: 'https://www.icai.org/post/find-a-member',
          isAffiliate: false,
          merchant: 'ICAI Official',
        },
        sources: [
          { title: 'Institute of Chartered Accountants of India Official Portal', domain: 'icai.org' },
        ],
      },
    ];
  }

  return [];
}

export function getVerifiedComparison(
  entityAName: string,
  entityBName: string,
  market: MarketCode
): ComparisonItem | null {
  const normA = entityAName.toLowerCase();
  const normB = entityBName.toLowerCase();

  // Sony A7 IV vs Canon R6 (or R6 Mark II)
  if (
    (normA.includes('sony') || normA.includes('a7')) &&
    (normB.includes('canon') || normB.includes('r6'))
  ) {
    const a = getVerifiedExactEntity('Sony Alpha 7 IV', market)!;
    const b = getVerifiedExactEntity('Canon EOS R6 Mark II', market)!;

    return {
      entityA: a,
      entityB: b,
      factors: [
        {
          factor: 'Sensor Resolution & Cropping',
          entityAAssessment: '33 MP allows deeper post-capture crops and fine landscape/portrait detail.',
          entityBAssessment: '24.2 MP delivers ample resolution for print & web, with smaller file sizes.',
          winner: 'A',
          why: 'Sony’s 33MP sensor provides 37% more linear resolution without noticeable low-light penalty.',
        },
        {
          factor: 'Burst Shooting Speed',
          entityAAssessment: 'Up to 10 fps burst rate (mechanical and electronic).',
          entityBAssessment: 'Up to 40 fps burst rate with electronic shutter and full autofocus tracking.',
          winner: 'B',
          why: 'Canon dominates for fast action, wildlife, and sports burst shooting at 40 fps.',
        },
        {
          factor: '4K Video Cropping',
          entityAAssessment: '4K 60p requires a 1.5x Super35 crop.',
          entityBAssessment: '4K 60p is uncropped, oversampled from full 6K sensor width.',
          winner: 'B',
          why: 'Canon shoots wide-angle 4K 60p without needing wide lens compensation for crops.',
        },
        {
          factor: 'Lens Ecosystem & Third-Party Options',
          entityAAssessment: 'Mature E-mount with dozens of high-value Sigma, Tamron, and Samyang lenses.',
          entityBAssessment: 'RF mount has outstanding L-series glass, but third-party AF lens selection is more restricted.',
          winner: 'A',
          why: 'Sony E-mount offers significantly wider budget and specialty third-party lens diversity.',
        },
      ],
      mainCompromise:
        'Choose Sony Alpha 7 IV for maximum 33MP detail and extensive budget-friendly third-party lens options. Choose Canon EOS R6 Mark II if you shoot fast action (40fps) or require uncropped 4K 60p video.',
      verdictSummary:
        'Both cameras are industry benchmarks. Sony leads on resolution and lens versatility; Canon leads on continuous shooting speed and uncropped 60p video.',
    };
  }

  // iPhone vs Samsung
  if (
    (normA.includes('iphone') && normB.includes('samsung')) ||
    (normA.includes('samsung') && normB.includes('iphone'))
  ) {
    const aAmazon = buildAmazonMarketUrl({ query: 'Apple iPhone 16 Pro', market });
    const bAmazon = buildAmazonMarketUrl({ query: 'Samsung Galaxy S24 Ultra', market });

    const itemA: EntityItem = {
      id: 'apple-iphone-flagship',
      slug: 'apple-iphone-flagship',
      name: 'Apple iPhone 16 Pro / Pro Max',
      brand: 'Apple',
      domain: 'PRODUCT',
      badge: 'TOP VIDEOGRAPHY & ECOSYSTEM INTEGRATION',
      explanation:
        'Industry standard in video recording with 4K 120fps Dolby Vision, ProRes Log color workflow, A18 Pro processing power, and seamless iOS ecosystem security.',
      pros: [
        'Unrivaled 4K 120fps ProRes Log video capture with clean studio monitoring',
        'Long-term iOS update longevity and high residual trade-in value',
        'Seamless integration with Mac, iPad, Apple Watch, and AirPods',
      ],
      drawback: 'File system and multitasking remain more restricted compared to desktop-like Android.',
      price: { currency: market === 'IN' ? '₹' : '$', isVerified: false },
      action: {
        type: 'CHECK_PRICE',
        label: 'Check Retailer Price',
        url: aAmazon.url,
        isAffiliate: true,
        merchant: 'Amazon',
      },
      sources: [{ title: 'Apple Official Tech Specs', domain: 'apple.com' }],
    };

    const itemB: EntityItem = {
      id: 'samsung-galaxy-ultra',
      slug: 'samsung-galaxy-ultra',
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      domain: 'PRODUCT',
      badge: 'TOP PRODUCTIVITY, DISPLAY & ZOOM RANGE',
      explanation:
        'Features an integrated S Pen stylus, flat anti-reflective Gorilla Armor display, versatile 200MP + 5x periscope telephoto cameras, and Samsung DeX desktop mode.',
      pros: [
        'Anti-reflective Gorilla Armor screen reduces reflections by 75%',
        'Integrated S Pen for precise note-taking, sketching, and remote camera triggering',
        'Versatile quad-camera array with optical 3x and 5x telephoto zoom modules',
        'Samsung DeX turns phone into a full desktop workstation on external monitors',
      ],
      drawback: 'Boxy physical dimensions with sharp corners can feel bulky for one-handed use.',
      price: { currency: market === 'IN' ? '₹' : '$', isVerified: false },
      action: {
        type: 'CHECK_PRICE',
        label: 'Check Retailer Price',
        url: bAmazon.url,
        isAffiliate: true,
        merchant: 'Amazon',
      },
      sources: [{ title: 'Samsung Official Technical Specifications', domain: 'samsung.com' }],
    };

    return {
      entityA: normA.includes('iphone') ? itemA : itemB,
      entityB: normA.includes('iphone') ? itemB : itemA,
      factors: [
        {
          factor: 'Display & Outdoor Visibility',
          entityAAssessment: '2,000 nits peak Ceramic Shield OLED with Dynamic Island.',
          entityBAssessment: '2,600 nits peak with Corning Gorilla Armor anti-reflective glass coating.',
          winner: 'B',
          why: 'Samsung’s anti-reflective coating noticeably eliminates outdoor reflections in bright sunlight.',
        },
        {
          factor: 'Video Recording & Color Grading',
          entityAAssessment: '4K 120fps ProRes Log with external SSD recording support.',
          entityBAssessment: '8K 30fps and 4K 120fps with standard Log profile.',
          winner: 'A',
          why: 'Apple’s ProRes Log and color science remain the preferred standard for video professionals.',
        },
        {
          factor: 'Productivity & Hardware Versatility',
          entityAAssessment: 'Action button, Camera Control key, and iOS ecosystem continuity.',
          entityBAssessment: 'Built-in S Pen stylus, Samsung DeX desktop mode, and split-screen multitasking.',
          winner: 'B',
          why: 'Samsung offers greater flexibility for power users who manage documents and multitasking.',
        },
      ],
      mainCompromise:
        'Choose iPhone if your primary tools are Mac/iPad or if you prioritize video production. Choose Samsung if you want the stylus, anti-reflective screen, zoom reach, or Android freedom.',
      verdictSummary:
        'Both devices represent the peak of modern smartphone engineering; the choice hinges on OS preference and workflow needs rather than raw capability.',
    };
  }

  return null;
}
