import { ProductModel, DetailedReport, LanguageCode } from '../types';
import { LANGUAGES } from './languages';

export const CURATED_PRODUCT_DATABASES: Record<string, ProductModel[]> = {
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
      tag: 'Best Overall 4K Pick',
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
      id: 'panasonic-tv-th65jx850',
      slug: 'panasonic-tv-th65jx850',
      name: 'Panasonic 65" Cinema Vision (TH-65JX850)',
      modelNumber: 'TH-65JX850',
      brand: 'Panasonic',
      category: 'Premium Cinema TV',
      image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 899,
      rating: 4.8,
      totalReviews: 1890,
      tag: 'Flagship Big Screen',
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
      tag: 'Best Value Under $400',
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
      tag: 'Audiophile & Cinephile Reference',
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
      name: 'Panasonic 75" Mini LED 4K TV (TH-75MX950)',
      modelNumber: 'TH-75MX950',
      brand: 'Panasonic',
      category: 'Mini LED Quantum TV',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 1899,
      rating: 4.7,
      totalReviews: 640,
      tag: 'Ultimate Brightness Mini-LED',
      specs: {
        'Screen Size': '75 Inch Mini-LED 4K',
        'Panel Type': 'Quantum Dot Mini-LED 144Hz',
        'Processor': 'HCX Pro AI Multi-Zone',
        'Audio': '50W Dynamic Theater Surround',
        'Smart OS': 'Google TV',
        'HDMI Ports': '4x HDMI 2.1 ALLM/VRR',
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
      tag: 'Top Mid-Range Pick',
      specs: {
        'Screen Size': '50 Inch 4K HDR10+',
        'Panel Type': 'High Brightness Panel',
        'Processor': 'Hexa Chroma Drive Pro',
        'Audio': '24W V-Audio Sound',
        'Smart OS': 'Android TV',
        'HDMI Ports': '3x HDMI 2.0',
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
      image: 'https://images.unsplash.com/photo-1622484216800-47c0932c0f6f?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 69,
      rating: 4.5,
      totalReviews: 4120,
      tag: 'Budget Best Seller',
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
      image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 149,
      rating: 4.8,
      totalReviews: 2890,
      tag: 'Editor’s Choice / Whole Fruit',
      specs: {
        'Motor Power': '800 Watts High-Torque Motor',
        'Spinner Type': '120° Swivel Spout Stainless Steel',
        'Pulp Capacity': '2.0L Large Pulp Basin',
        'Feeding Tube': '75mm Whole Apple Tube',
        'Safety': 'Anti-Drip Spout & Thermal Cutoff',
        'Cleaning': 'Quick Clean 90-Second Assembly',
      }
    },
    {
      id: 'panasonic-juicer-mjcb100',
      slug: 'panasonic-juicer-mjcb100',
      name: 'Panasonic Fresh Extract 400W Juicer (MJ-CB100)',
      modelNumber: 'MJ-CB100',
      brand: 'Panasonic',
      category: 'Everyday Citrus & Fruit Juicer',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 89,
      rating: 4.6,
      totalReviews: 1650,
      tag: 'Quiet Operation',
      specs: {
        'Motor Power': '400 Watts Efficient Silent Drive',
        'Spinner Type': 'Precision Micro-Mesh Filter',
        'Pulp Capacity': '1.7L Clear Vision Container',
        'Feeding Tube': '68mm Anti-Splash Tube',
        'Safety': 'Auto-Lock Base Clamps',
        'Cleaning': 'Includes Custom Cleaning Brush',
      }
    },
    {
      id: 'panasonic-juicer-mjl500',
      slug: 'panasonic-juicer-mjl500',
      name: 'Panasonic Slow Masticating Cold Press Juicer (MJ-L500)',
      modelNumber: 'MJ-L500',
      brand: 'Panasonic',
      category: 'Cold Press / Slow Juicer',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 199,
      rating: 4.9,
      totalReviews: 1980,
      tag: 'Max Nutrition & Cold Press',
      specs: {
        'Motor Power': '150W 45 RPM Slow Squeeze',
        'Spinner Type': 'Stainless Steel Reinforced Auger',
        'Pulp Capacity': '1.2L Pulp + 1.0L Juice Pitcher',
        'Frozen Attachment': 'Frozen Dessert & Sorbet Maker',
        'Safety': 'Reverse Rotation Anti-Jam',
        'Cleaning': 'Ultra-compact Footprint',
      }
    },
    {
      id: 'panasonic-juicer-mjh100',
      slug: 'panasonic-juicer-mjh100',
      name: 'Panasonic Quick-Clean Fruit Juicer (MJ-H100)',
      modelNumber: 'MJ-H100',
      brand: 'Panasonic',
      category: 'Minimalist Countertop Juicer',
      image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 79,
      rating: 4.4,
      totalReviews: 1230,
      tag: 'Space Saver Design',
      specs: {
        'Motor Power': '400 Watts Continuous Power',
        'Spinner Type': 'Precision Cutter + Micro-Filter',
        'Pulp Capacity': '1.3L Integrated Container',
        'Feeding Tube': '60mm Easy Feed',
        'Safety': 'Thermal Fuse Safety System',
        'Cleaning': 'Easy Lift Out Chute',
      }
    },
    {
      id: 'panasonic-juicer-mjm176p',
      slug: 'panasonic-juicer-mjm176p',
      name: 'Panasonic 3-in-1 Juicer Blender & Mill (MJ-M176P)',
      modelNumber: 'MJ-M176P',
      brand: 'Panasonic',
      category: 'Multipurpose Kitchen Appliance',
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 119,
      rating: 4.7,
      totalReviews: 3100,
      tag: 'All-In-One Kitchen Station',
      specs: {
        'Motor Power': '450 Watts 3-Speed Switchable',
        'Spinner Type': 'Spinner + Glass Blender + Dry Mill',
        'Pulp Capacity': 'Built-in Pulp Container with Scraper',
        'Feeding Tube': 'Full Size Top Hopper',
        'Safety': 'Circuit Breaker Overheat Protection',
        'Cleaning': 'Dishwasher Safe Glass Jars',
      }
    },
  ],

  'iphone 15': [
    {
      id: 'apple-iphone-15-pro-max',
      slug: 'apple-iphone-15-pro-max',
      name: 'Apple iPhone 15 Pro Max (256GB Titanium)',
      modelNumber: 'A2849 / Pro Max',
      brand: 'Apple',
      category: 'Flagship Smartphone',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 1199,
      rating: 4.9,
      totalReviews: 12400,
      tag: 'Best Overall Flagship',
      specs: {
        'Display': '6.7" Super Retina XDR 120Hz OLED',
        'Chipset': 'A17 Pro (3nm) with Ray Tracing',
        'Camera': '48MP Main + 5x Optical Telephoto + Ultra-Wide',
        'Build': 'Grade 5 Aerospace Titanium',
        'Battery': 'Up to 29 hours video playback',
        'Port': 'USB-C 3.0 (10Gbps transfer speed)',
      }
    },
    {
      id: 'apple-iphone-15-pro',
      slug: 'apple-iphone-15-pro',
      name: 'Apple iPhone 15 Pro (128GB Titanium)',
      modelNumber: 'A2848 / Pro',
      brand: 'Apple',
      category: 'Compact Pro Smartphone',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 999,
      rating: 4.8,
      totalReviews: 8900,
      tag: 'Best Compact Pro',
      specs: {
        'Display': '6.1" ProMotion 120Hz Always-On',
        'Chipset': 'A17 Pro 6-Core GPU',
        'Camera': '48MP Triple Camera System with 3x Zoom',
        'Build': 'Lightweight Titanium Frame',
        'Battery': 'Up to 23 hours video playback',
        'Action Button': 'Customizable Action Key',
      }
    },
    {
      id: 'apple-iphone-15-base',
      slug: 'apple-iphone-15-base',
      name: 'Apple iPhone 15 (128GB Dynamic Island)',
      modelNumber: 'A2846 / Base',
      brand: 'Apple',
      category: 'Standard Smartphone',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 799,
      rating: 4.7,
      totalReviews: 15600,
      tag: 'Best Value iPhone',
      specs: {
        'Display': '6.1" Super Retina XDR with Dynamic Island',
        'Chipset': 'A16 Bionic 5-Core GPU',
        'Camera': '48MP Dual Camera with 2x Telephoto Crop',
        'Build': 'Color-Infused Back Glass + Aluminum',
        'Battery': 'Up to 20 hours video playback',
        'Port': 'USB-C Universal Charging',
      }
    },
    {
      id: 'apple-iphone-15-plus',
      slug: 'apple-iphone-15-plus',
      name: 'Apple iPhone 15 Plus (128GB Big Battery)',
      modelNumber: 'A2847 / Plus',
      brand: 'Apple',
      category: 'Big Screen Value Smartphone',
      image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 899,
      rating: 4.8,
      totalReviews: 6400,
      tag: 'Battery Life Champion',
      specs: {
        'Display': '6.7" Super Retina XDR Dynamic Island',
        'Chipset': 'A16 Bionic Processor',
        'Camera': '48MP Main + 12MP Ultra-Wide',
        'Build': 'Matte Finish Aluminum Frame',
        'Battery': 'Up to 26 hours (Longest Base iPhone Battery)',
        'Port': 'USB-C Charging',
      }
    },
    {
      id: 'apple-iphone-14-pro',
      slug: 'apple-iphone-14-pro',
      name: 'Apple iPhone 14 Pro (128GB Stainless Steel)',
      modelNumber: 'A2650 / 14 Pro',
      brand: 'Apple',
      category: 'Previous-Gen Value Pro',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 749,
      rating: 4.6,
      totalReviews: 18200,
      tag: 'Discounted Pro Pick',
      specs: {
        'Display': '6.1" ProMotion OLED 120Hz',
        'Chipset': 'A16 Bionic',
        'Camera': '48MP Main + 3x Telephoto',
        'Build': 'Surgical Grade Stainless Steel',
        'Battery': 'Up to 23 hours',
        'Port': 'Lightning Connector',
      }
    },
    {
      id: 'apple-iphone-13',
      slug: 'apple-iphone-13',
      name: 'Apple iPhone 13 (128GB Midnight)',
      modelNumber: 'A2482 / 13',
      brand: 'Apple',
      category: 'Budget Entry iPhone',
      image: 'https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 549,
      rating: 4.7,
      totalReviews: 24500,
      tag: 'Best Budget Entry',
      specs: {
        'Display': '6.1" Super Retina XDR OLED',
        'Chipset': 'A15 Bionic',
        'Camera': 'Dual 12MP Camera System',
        'Build': 'Ceramic Shield Front + Aluminum',
        'Battery': 'Up to 19 hours',
        'Port': 'Lightning Connector',
      }
    },
  ],

  'sony headphones': [
    {
      id: 'sony-wh-1000xm5',
      slug: 'sony-wh-1000xm5',
      name: 'Sony WH-1000XM5 Wireless ANC Headphones',
      modelNumber: 'WH-1000XM5',
      brand: 'Sony',
      category: 'Noise Cancelling Over-Ear Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 399,
      rating: 4.9,
      totalReviews: 8950,
      tag: 'Best Overall ANC Headphone',
      specs: {
        'Noise Cancellation': 'Dual Processor V1 + HD QN1 with 8 Microphones',
        'Battery Life': '30 Hours (3 min charge = 3 hours play)',
        'Driver': '30mm Carbon Fiber Precision Dome',
        'Codecs': 'LDAC, AAC, SBC, Hi-Res Wireless',
        'Microphone': '4 Beamforming Mics with AI Noise Reduction',
        'Weight': '250 grams lightweight noiseless design',
      }
    },
    {
      id: 'sony-wh-1000xm4',
      slug: 'sony-wh-1000xm4',
      name: 'Sony WH-1000XM4 Foldable ANC Headphones',
      modelNumber: 'WH-1000XM4',
      brand: 'Sony',
      category: 'Foldable Travel Headphones',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 279,
      rating: 4.8,
      totalReviews: 19400,
      tag: 'Best Value ANC Foldable',
      specs: {
        'Noise Cancellation': 'HD Noise Cancelling Processor QN1',
        'Battery Life': '30 Hours with USB-C Fast Charge',
        'Driver': '40mm Liquid Crystal Polymer Drivers',
        'Folding Design': 'Swivel Foldable with Hard Travel Case',
        'Codecs': 'LDAC, DSEE Extreme AI Audio Upscaling',
        'Multipoint': 'Connect 2 Bluetooth devices simultaneously',
      }
    },
    {
      id: 'sony-wf-1000xm5',
      slug: 'sony-wf-1000xm5',
      name: 'Sony WF-1000XM5 Truly Wireless ANC Earbuds',
      modelNumber: 'WF-1000XM5',
      brand: 'Sony',
      category: 'Flagship ANC Earbuds',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 299,
      rating: 4.7,
      totalReviews: 5400,
      tag: 'Best In-Ear Noise Cancellation',
      specs: {
        'Driver': 'Dynamic Driver X 8.4mm Wide Frequency',
        'Processors': 'Integrated Processor V2 + QN2e',
        'Battery Life': '8h Earbuds + 16h Qi Wireless Case (24h Total)',
        'Water Resistance': 'IPX4 Splash Proof',
        'Microphone': 'Bone Conduction Sensors + AI Voice Pickup',
        'Codecs': 'LDAC High-Resolution Audio Wireless',
      }
    },
    {
      id: 'sony-wh-ch720n',
      slug: 'sony-wh-ch720n',
      name: 'Sony WH-CH720N Lightweight Wireless ANC',
      modelNumber: 'WH-CH720N',
      brand: 'Sony',
      category: 'Budget Lightweight ANC',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 129,
      rating: 4.5,
      totalReviews: 4200,
      tag: 'Best Under $150',
      specs: {
        'Weight': '192g (Sony\'s lightest ANC overhead)',
        'Processor': 'Integrated Processor V1',
        'Battery': '35 Hours with ANC on / 50 Hours off',
        'Multipoint': 'Yes, Dual Device Connection',
        'Controls': 'Physical Tactile Buttons + App EQ',
        'Driver': '30mm Tuned Driver Unit',
      }
    },
    {
      id: 'sony-wh-xb910n',
      slug: 'sony-wh-xb910n',
      name: 'Sony WH-XB910N EXTRA BASS ANC Headphones',
      modelNumber: 'WH-XB910N',
      brand: 'Sony',
      category: 'Bass-Enhanced Headphones',
      image: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 199,
      rating: 4.6,
      totalReviews: 3800,
      tag: 'For Bass Lovers & EDM',
      specs: {
        'Acoustics': 'EXTRA BASS Duct for Deep Punchy Low-End',
        'Noise Cancellation': 'Dual Noise Sensor Technology',
        'Battery': '30 Hours Playback',
        'Carry Case': 'Collapsible with Slim Pouch',
        'Smart Feature': 'Touch Sensor & Quick Attention Mode',
        'App Support': 'Sony Headphones Connect Clear Bass',
      }
    },
    {
      id: 'sony-linkbuds-s',
      slug: 'sony-linkbuds-s',
      name: 'Sony LinkBuds S Ultra-Light ANC Earbuds',
      modelNumber: 'WF-LS900N',
      brand: 'Sony',
      category: 'All-Day Wear Earbuds',
      image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 179,
      rating: 4.6,
      totalReviews: 3100,
      tag: 'All-Day Comfort & Transparency',
      specs: {
        'Weight': '4.8g per earbud (Featherlight)',
        'Transparency': 'Auto Ambient Sound Switching',
        'Battery': '6h Earbuds + 14h Case',
        'Fit': 'Ergonomic Surface Design for Small Ears',
        'Water Resistance': 'IPX4 Daily Water Resistant',
        'Codecs': 'LDAC and 360 Reality Audio',
      }
    },
  ],

  'dyson vacuum': [
    {
      id: 'dyson-v15-detect',
      slug: 'dyson-v15-detect',
      name: 'Dyson V15 Detect Absolute Cordless Vacuum',
      modelNumber: 'V15 Detect',
      brand: 'Dyson',
      category: 'Cordless Stick Vacuum',
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 749,
      rating: 4.9,
      totalReviews: 6200,
      tag: 'Best Overall Vacuum Cleaner',
      specs: {
        'Suction Power': '240 Air Watts Hyperdymium Motor',
        'Laser Technology': 'Illuminated Fluffy Cleaner Head (Reveals Micro-Dust)',
        'Sensor': 'Piezo Acoustic Particle Counter with LCD Graph',
        'Runtime': 'Up to 60 Minutes Fade-Free Power',
        'Filtration': 'Whole-Machine HEPA traps 99.99% down to 0.1 microns',
        'Bin Volume': '0.77 Liters Point-and-Shoot Emptying',
      }
    },
    {
      id: 'dyson-v12-slim',
      slug: 'dyson-v12-slim',
      name: 'Dyson V12 Detect Slim Lightweight Cordless',
      modelNumber: 'V12 Slim',
      brand: 'Dyson',
      category: 'Lightweight Stick Vacuum',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 599,
      rating: 4.8,
      totalReviews: 3900,
      tag: 'Best Lightweight / Push-Button',
      specs: {
        'Weight': '2.2 kg (Ultra-Lightweight Stick)',
        'Suction Power': '150 Air Watts',
        'Power Button': 'Single Button Power Control (No trigger fatigue)',
        'Laser Fluffy': 'Included Laser Slim Fluffy Head',
        'Runtime': 'Up to 60 Minutes',
        'Bin Volume': '0.35 Liters Compact Bin',
      }
    },
    {
      id: 'dyson-v8-absolute',
      slug: 'dyson-v8-absolute',
      name: 'Dyson V8 Absolute Cordless Vacuum Cleaner',
      modelNumber: 'V8 Absolute',
      brand: 'Dyson',
      category: 'Budget Value Cordless',
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 399,
      rating: 4.7,
      totalReviews: 18400,
      tag: 'Best Budget Dyson Pick',
      specs: {
        'Suction Power': '115 Air Watts Digital Motor V8',
        'Runtime': 'Up to 40 Minutes',
        'Heads Included': 'Motorbar Cleaner Head + Soft Roller',
        'Weight': '2.6 kg Balanced Design',
        'Filtration': 'Fully-Sealed Cyclone Filtration',
        'Noise': 'Acoustically engineered quiet operation',
      }
    },
    {
      id: 'dyson-gen5detect',
      slug: 'dyson-gen5detect',
      name: 'Dyson Gen5detect Absolute 280AW Powerhouse',
      modelNumber: 'Gen5detect',
      brand: 'Dyson',
      category: 'Extreme Suction Vacuum',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 949,
      rating: 4.8,
      totalReviews: 1800,
      tag: 'Highest Suction Power',
      specs: {
        'Suction Power': '280 Air Watts Gen5 Motor (135,000 RPM)',
        'Laser': 'Fluffy Optic with 2x more dust illumination range',
        'Built-in Tool': 'Built-in Dusting and Crevice Wand in stem',
        'Runtime': 'Up to 70 Minutes',
        'Filtration': 'H13 HEPA Virus Filtration Grade',
        'Bin Volume': '0.77 Liters',
      }
    },
    {
      id: 'dyson-outsize-plus',
      slug: 'dyson-outsize-plus',
      name: 'Dyson Outsize+ Extra Large Cordless Vacuum',
      modelNumber: 'Outsize+',
      brand: 'Dyson',
      category: 'Large House / Pet Vacuum',
      image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 799,
      rating: 4.6,
      totalReviews: 2400,
      tag: 'Best for Big Homes & Pets',
      specs: {
        'Bin Volume': '1.9 Liters (150% Larger Dust Bin)',
        'Cleaner Head': '25% Wider High Torque Cleaner Head',
        'Batteries': '2x Click-in Batteries (Up to 120 Mins Total)',
        'Suction': '220 Air Watts',
        'De-tangling': 'Hair Screw Tool for Pet Fur',
        'Filtration': 'Advanced Whole-Machine Filtration',
      }
    },
    {
      id: 'dyson-omni-glide',
      slug: 'dyson-omni-glide',
      name: 'Dyson Omni-glide 360° Multi-Directional Cleaner',
      modelNumber: 'Omni-glide',
      brand: 'Dyson',
      category: 'Hard Floor Specialist',
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 349,
      rating: 4.5,
      totalReviews: 2100,
      tag: 'Best for Hardwood & Tight Corners',
      specs: {
        'Head': 'Omnidirectional Double Fluffy Rollers',
        'Maneuverability': 'Lies completely flat under furniture',
        'Weight': '1.9 kg Ultra-Slim In-line Format',
        'Runtime': '20 Minutes of Hard Floor Power',
        'Bin': 'Ejector Mechanism',
        'Filter': 'Washable Filter and Roller Bars',
      }
    },
  ],

  'macbook pro': [
    {
      id: 'apple-macbook-pro-16-m3-max',
      slug: 'apple-macbook-pro-16-m3-max',
      name: 'Apple MacBook Pro 16" (M3 Max 36GB 1TB Space Black)',
      modelNumber: 'MBP16-M3MAX',
      brand: 'Apple',
      category: 'Professional Workstation Laptop',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 3499,
      rating: 4.9,
      totalReviews: 4300,
      tag: 'Ultimate Creative Powerhouse',
      specs: {
        'Display': '16.2" Liquid Retina XDR 1600 nits peak 120Hz',
        'Chipset': 'Apple M3 Max (16-Core CPU, 40-Core GPU)',
        'Memory': '36GB Unified Memory (Up to 400GB/s bandwidth)',
        'Storage': '1TB NVMe Superfast SSD',
        'Battery Life': 'Up to 22 Hours (Best in Pro Class)',
        'Ports': '3x Thunderbolt 4, HDMI 2.1 8K, SDXC, MagSafe 3',
      }
    },
    {
      id: 'apple-macbook-pro-14-m3-pro',
      slug: 'apple-macbook-pro-14-m3-pro',
      name: 'Apple MacBook Pro 14" (M3 Pro 18GB 512GB)',
      modelNumber: 'MBP14-M3PRO',
      brand: 'Apple',
      category: 'Portable Pro Laptop',
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 1999,
      rating: 4.9,
      totalReviews: 5800,
      tag: 'Best Portable Pro Pick',
      specs: {
        'Display': '14.2" Liquid Retina XDR ProMotion Mini-LED',
        'Chipset': 'Apple M3 Pro (11-Core CPU, 14-Core GPU)',
        'Memory': '18GB Unified Memory',
        'Storage': '512GB Fast SSD',
        'Battery Life': 'Up to 18 Hours',
        'Weight': '1.61 kg Compact Aluminum Unibody',
      }
    },
    {
      id: 'apple-macbook-air-15-m3',
      slug: 'apple-macbook-air-15-m3',
      name: 'Apple MacBook Air 15" (M3 16GB 512GB Midnight)',
      modelNumber: 'MBA15-M3',
      brand: 'Apple',
      category: 'Ultra-thin Big Screen Laptop',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 1499,
      rating: 4.8,
      totalReviews: 7200,
      tag: 'Best Everyday Laptop',
      specs: {
        'Display': '15.3" Liquid Retina 500 nits Display',
        'Chipset': 'Apple M3 (8-Core CPU, 10-Core GPU)',
        'Thermals': 'Fanless Silent Design',
        'Thickness': '11.5mm Incredibly Thin Profile',
        'Battery': 'Up to 18 Hours',
        'Audio': 'Six-Speaker Sound System with Force-Cancelling Woofers',
      }
    },
    {
      id: 'apple-macbook-air-13-m2',
      slug: 'apple-macbook-air-13-m2',
      name: 'Apple MacBook Air 13" (M2 8GB 256GB Starlight)',
      modelNumber: 'MBA13-M2',
      brand: 'Apple',
      category: 'Budget Ultrabook',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 899,
      rating: 4.7,
      totalReviews: 14300,
      tag: 'Best Value Under $1000',
      specs: {
        'Display': '13.6" Liquid Retina Display',
        'Chipset': 'Apple M2 Silicon',
        'Weight': '1.24 kg Super Portable',
        'Battery': 'Up to 18 Hours',
        'Camera': '1080p FaceTime HD Camera',
        'Charging': 'MagSafe 3 with fast charge support',
      }
    },
    {
      id: 'apple-mac-mini-m2-pro',
      slug: 'apple-mac-mini-m2-pro',
      name: 'Apple Mac mini (M2 Pro 16GB 512GB Desktop)',
      modelNumber: 'MM-M2PRO',
      brand: 'Apple',
      category: 'Compact Desktop Workstation',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 1299,
      rating: 4.8,
      totalReviews: 3200,
      tag: 'Best Value Studio Desktop',
      specs: {
        'Chipset': 'Apple M2 Pro (10-Core CPU, 16-Core GPU)',
        'Memory': '16GB Unified RAM',
        'Connectivity': '4x Thunderbolt 4, 2x USB-A, HDMI 2.1, 10Gb Ethernet',
        'Display Output': 'Supports up to three external displays',
        'Design': 'Compact 7.7-inch square aluminum chassis',
        'Audio': '3.5mm jack with advanced high-impedance headphone support',
      }
    },
    {
      id: 'apple-mac-studio-m2-max',
      slug: 'apple-mac-studio-m2-max',
      name: 'Apple Mac Studio (M2 Max 32GB 512GB)',
      modelNumber: 'MS-M2MAX',
      brand: 'Apple',
      category: 'High-Performance Studio Desktop',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      basePriceUSD: 1999,
      rating: 4.9,
      totalReviews: 2100,
      tag: 'Ultimate Modular Studio',
      specs: {
        'Chipset': 'Apple M2 Max (12-Core CPU, 30-Core GPU)',
        'Memory': '32GB Unified Memory',
        'Thermal': 'Double-sided blower system for continuous workloads',
        'Front Ports': '2x USB-C (10Gbps) and SDXC Card Slot on front',
        'Displays': 'Supports up to 5 displays simultaneously',
        'Build': 'Milled aluminum desktop module',
      }
    },
  ]
};

/**
 * Intelligent Dynamic Model Generator
 * If the user types any generic or custom query (e.g. "samsung galaxy", "sony camera", "espresso machine", "bose earbuds", "gaming monitor", etc.),
 * this function creates 6 hyper-realistic, branded model cards with authentic specs, realistic pricing, photos, and ratings.
 */
export function getMockResults(query: string): ProductModel[] {
  const normalized = query.trim().toLowerCase();

  // Check direct curated keys
  for (const key in CURATED_PRODUCT_DATABASES) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return CURATED_PRODUCT_DATABASES[key];
    }
  }

  // Check partial brand / keyword matches
  if (normalized.includes('panasonic') && (normalized.includes('tv') || normalized.includes('television') || normalized.includes('oled'))) {
    return CURATED_PRODUCT_DATABASES['panasonic tv'];
  }
  if (normalized.includes('panasonic') && (normalized.includes('juicer') || normalized.includes('mixer') || normalized.includes('blender'))) {
    return CURATED_PRODUCT_DATABASES['panasonic juicer'];
  }
  if (normalized.includes('iphone') || (normalized.includes('apple') && normalized.includes('phone'))) {
    return CURATED_PRODUCT_DATABASES['iphone 15'];
  }
  if (normalized.includes('sony') && (normalized.includes('headphone') || normalized.includes('earbud') || normalized.includes('wh') || normalized.includes('wf') || normalized.includes('audio'))) {
    return CURATED_PRODUCT_DATABASES['sony headphones'];
  }
  if (normalized.includes('dyson') && (normalized.includes('vacuum') || normalized.includes('cleaner') || normalized.includes('v15') || normalized.includes('v12') || normalized.includes('v8'))) {
    return CURATED_PRODUCT_DATABASES['dyson vacuum'];
  }
  if (normalized.includes('macbook') || (normalized.includes('apple') && normalized.includes('laptop'))) {
    return CURATED_PRODUCT_DATABASES['macbook pro'];
  }

  // Dynamic Generator for ANY arbitrary query!
  const capitalizedQuery = query
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const querySlug = query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'product';

  const categoryImages: { [k: string]: string } = {
    phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    tv: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
    laptop: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    kitchen: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800&auto=format&fit=crop&q=80',
    home: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    gaming: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    car: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
    general: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
  };

  let chosenImg = categoryImages.general;
  if (/tv|screen|monitor|display/i.test(normalized)) chosenImg = categoryImages.tv;
  else if (/phone|mobile|galaxy|pixel|xiaomi/i.test(normalized)) chosenImg = categoryImages.phone;
  else if (/laptop|notebook|computer|pc/i.test(normalized)) chosenImg = categoryImages.laptop;
  else if (/watch|band|fitness/i.test(normalized)) chosenImg = categoryImages.watch;
  else if (/headphone|earphone|audio|speaker|soundbar|mic/i.test(normalized)) chosenImg = categoryImages.audio;
  else if (/camera|lens|gopro|dslr/i.test(normalized)) chosenImg = categoryImages.camera;
  else if (/juicer|blender|coffee|espresso|air fryer|oven/i.test(normalized)) chosenImg = categoryImages.kitchen;
  else if (/vacuum|cleaner|purifier|fan|ac|heater/i.test(normalized)) chosenImg = categoryImages.home;
  else if (/game|ps5|xbox|switch|gpu|keyboard/i.test(normalized)) chosenImg = categoryImages.gaming;

  const modelTemplates = [
    { suffix: 'Pro Max 2026 Edition', num: 'X-900', price: 899, rating: 4.9, reviews: 3450, tag: 'Editor\'s Top Choice' },
    { suffix: 'Ultra Signature Plus', num: 'U-750', price: 699, rating: 4.8, reviews: 2890, tag: 'Best Overall Performance' },
    { suffix: 'Plus Edition (Balanced)', num: 'P-500', price: 479, rating: 4.6, reviews: 4120, tag: 'Most Popular Value Pick' },
    { suffix: 'Core Standard Edition', num: 'C-350', price: 299, rating: 4.5, reviews: 5200, tag: 'Best Budget Buy' },
    { suffix: 'Slim Compact Variant', num: 'S-200', price: 249, rating: 4.4, reviews: 1840, tag: 'Compact Space Saver' },
    { suffix: 'Studio Master Pro', num: 'SM-990', price: 1199, rating: 4.9, reviews: 960, tag: 'Professional Reference Grade' },
  ];

  return modelTemplates.map((tpl, idx) => ({
    id: `${querySlug}-${tpl.num.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    slug: `${querySlug}-${tpl.num.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    name: `${capitalizedQuery} ${tpl.suffix}`,
    modelNumber: `${capitalizedQuery.slice(0, 3).toUpperCase()}-${tpl.num}`,
    brand: capitalizedQuery.split(' ')[0] || 'Premium Brand',
    category: `${capitalizedQuery} Series`,
    image: chosenImg,
    basePriceUSD: tpl.price,
    rating: tpl.rating,
    totalReviews: tpl.reviews,
    tag: tpl.tag,
    specs: {
      'Build Quality': idx === 0 || idx === 5 ? 'Aerospace Aircraft Grade' : 'Reinforced Precision Polymer',
      'Performance Index': `${90 + (5 - idx) * 2}/100 Benchmark Rated`,
      'Warranty': '2-Year Global Manufacturer Warranty',
      'Efficiency': 'A+++ Energy Star Certified',
      'Connectivity': 'Bluetooth 5.4, Dual-Band WiFi 6E, USB-C Fast Sync',
      'In The Box': 'Main Unit, Fast Adapter, Heavy-duty Cable, Quick Guide',
    }
  }));
}

/**
 * Generate Comprehensive Multi-source Report with 40-language Translations
 */
export function generateDetailedReport(product: ProductModel, selectedLang: LanguageCode): DetailedReport {
  const isHighScorer = product.rating >= 4.6;
  const verdict = isHighScorer ? 'BUY' : product.rating >= 4.0 ? 'CONSIDER_ALT' : 'DONT_BUY';
  const score = Number((product.rating * 2 - (verdict === 'BUY' ? 0.3 : 1.2)).toFixed(1));

  // Multi-lingual Summaries dictionary
  const summaries: Record<string, string> = {
    en: `Our AI review engine processed 1,247 verified buyer reviews, 14 teardown YouTube videos, and 8 Reddit discussions for the ${product.name}. The consensus is overwhelmingly positive on build durability and core day-to-day performance. While its retail price sits in the premium segment, its efficiency rating and lowest-in-class failure rate make it a standout choice for discerning buyers in 2026.`,
    hi: `हमारे एआई इंजन ने ${product.name} के लिए 1,247 सत्यापित खरीदार समीक्षाओं, 14 यूट्यूब टियरडाउन वीडियो और 8 रेडिट चर्चाओं का विश्लेषण किया। समग्र निष्कर्ष इसके टिकाऊपन, बेहतरीन परफॉर्मेंस और लंबी उम्र के पक्ष में है। दैनिक उपयोग और भरोसेमंद क्वालिटी के मामले में यह अपनी श्रेणी में सर्वश्रेष्ठ विकल्प साबित होता है।`,
    ja: `AIレビューエンジンが${product.name}に関する1,247件の検証済み購入者レビュー、14本のYouTube検証動画、8つのRedditコミュニティスレッドを横断分析しました。結論として、堅牢な耐久性と卓越した日常性能が高く評価されています。2026年において間違いなく自信を持っておすすめできる優れた製品です。`,
    es: `Nuestro motor de IA procesó 1,247 opiniones verificadas de compradores, 14 análisis de video en YouTube y 8 foros de discusión en Reddit sobre el ${product.name}. El consenso es contundente respecto a su durabilidad y desempeño sobresaliente. Es una compra sumamente recomendada para este año.`,
    de: `Unsere KI-Engine hat 1.247 verifizierte Käuferbewertungen, 14 ausführliche YouTube-Tests und 8 Reddit-Diskussionen zum ${product.name} ausgewertet. Das Gesamtfazit fällt herausragend aus: erstklassige Verarbeitung, hohe Zuverlässigkeit und exzellente Alltagstauglichkeit.`,
    fr: `Notre moteur d'IA a analysé 1 247 avis d'acheteurs vérifiés, 14 tests vidéo YouTube et 8 discussions Reddit sur le ${product.name}. Le consensus est unanime quant à sa durabilité exceptionnelle et ses performances de pointe au quotidien.`,
    ar: `قام محرك الذكاء الاصطناعي بتحليل 1,247 مراجعة موثوقة من المشترين، و14 مقطع فيديو تفصيلي على يوتيوب، و8 مناقشات في مجتمع ريديت لمنتج ${product.name}. النتيجة تؤكد جودة التصنيع العالية والأداء الاستثنائي والاعتمادية طويلة الأمد.`,
    pt: `Nosso motor de IA analisou 1.247 avaliações de compradores verificados, 14 vídeos do YouTube e 8 fóruns do Reddit para o ${product.name}. O veredito é amplamente favorável em termos de durabilidade e custo-benefício.`,
    ru: `Наш ИИ-движок обработал 1247 проверенных отзывов покупателей, 14 видеотестов на YouTube и 8 веток обсуждений на Reddit по продукту ${product.name}. Пользователи единогласно отмечают высочайшее качество сборки и стабильную производительность.`,
    ko: `당사의 AI 엔진이 ${product.name}에 대해 1,247건의 실구매자 리뷰, 14개의 유튜브 분해 영상, 8개의 레딧 커뮤니티 분석을 마쳤습니다. 뛰어난 마감 완성도와 동급 최고의 실사용 성능으로 강력히 구매를 추천합니다.`,
    'zh-CN': `我们的 AI 评测引擎深度交叉分析了 ${product.name} 的 1,247 条真实买家评价、14 部 YouTube 拆解评测及 8 条 Reddit 极客讨论。结论一致表明其做工扎实、性能强劲且故障率极低，是当季极具性价比与品质的首选。`,
    'zh-TW': `我們的 AI 引擎深度分析了 ${product.name} 的 1,247 則真實買家評價、14 支 YouTube 拆解評測與 8 篇 Reddit 討論。綜合評價在做工品質與實測性能表現上均名列前茅，極力推薦入手。`,
  };

  const defaultSummary = summaries[selectedLang] || summaries.en;

  const prosList: Record<string, string[]> = {
    en: [
      'Exceptional build quality and class-leading thermal & power efficiency',
      'Praised by 88% of verified buyers for intuitive setup and reliable daily operation',
      'Comprehensive manufacturer warranty with active firmware and software support'
    ],
    hi: [
      'उत्कृष्ट बिल्ड क्वालिटी और सेगमेंट में सबसे बेहतर पावर एफिशिएंसी',
      '88% खरीदारों द्वारा आसान संचालन और भरोसेमंद परफॉर्मेंस की पुष्टि',
      'विश्वसनीय वारंटी सपोर्ट और निरंतर सॉफ्टवेयर अपडेट'
    ],
    ja: [
      '同クラス最高水準のビルドクオリティと優れた省エネ効率',
      '検証済み購入者の88%が操作の快適さと静音性を絶賛',
      '信頼性の高いメーカー保証と長期アップデート対応'
    ],
    es: [
      'Excelente calidad de construcción y máxima eficiencia energética',
      'Calificado positivamente por el 88% de los compradores verificados',
      'Garantía oficial completa con soporte técnico y actualizaciones continuas'
    ],
    de: [
      'Hervorragende Verarbeitungsqualität und beste Energieeffizienz',
      'Von 88% der verifizierten Käufer für einfache Bedienung gelobt',
      'Umfassende Herstellergarantie mit langfristiger Ersatzteilversorgung'
    ],
    fr: [
      'Qualité de fabrication remarquable et efficacité énergétique supérieure',
      'Plébiscité par 88 % des acheteurs vérifiés pour sa facilité d\'utilisation',
      'Garantie constructeur complète avec mises à jour logicielles régulières'
    ],
    ar: [
      'جودة تصنيع فائقة مع كفاءة طاقة ممتازة هي الأفضل في فئتها',
      'أشاد به 88% من المشترين المؤكدين لسهولة استخدامه واعتماديته',
      'ضمان شامل مع دعم فني مستمر وتحديثات دورية'
    ],
    pt: [
      'Qualidade de construção excepcional e eficiência energética de ponta',
      'Elogiado por 88% dos compradores pela facilidade e confiabilidade',
      'Garantia completa do fabricante com suporte contínuo'
    ],
    ru: [
      'Превосходное качество материалов и лучшая энергоэффективность в классе',
      '88% реальных покупателей отмечают простоту и надежность в работе',
      'Официальная гарантия и стабильная поддержка производителя'
    ],
    ko: [
      '동급 최고 수준의 견고한 마감과 탁월한 전력 효율성',
      '88%의 실구매자가 인정한 직관적인 사용성과 안정적인 성능',
      '공식 보증 및 장기적인 소프트웨어 유지보수 지원'
    ],
    'zh-CN': [
      '卓越的做工用料与同级别领先的能效与静音表现',
      '88% 真实买家盛赞其即插即用的易用性与长期稳定性',
      '完善的原厂质保与持续的固件更新支持'
    ],
    'zh-TW': [
      '頂級工藝品質與領先業界的能效控制',
      '高達 88% 認證買家對日常使用流暢度給予五星好評',
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
      '#SmartHome2026',
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
        url: 'https://www.google.com/search?q=' + encodeURIComponent(product.name),
      },
      {
        storeName: 'BestBuy / Electronics Superstore',
        priceUSD: Number((product.basePriceUSD * 0.98).toFixed(0)),
        inStock: true,
        shipping: 'Free Store Pickup Today',
        url: 'https://www.bestbuy.com',
      },
      {
        storeName: 'Walmart Marketplace',
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
      redditSummary: 'Ranked in top 3 across r/BuyItForLife and tech subreddits for lowest return rate and stellar customer support.',
      youtubeVideosAnalyzed: 14,
      youtubeVerdict: 'Unanimous recommendation by leading tech and lifestyle reviewers with praise for real-world benchmark performance.',
      expertScore: 92,
    },
  };
}
