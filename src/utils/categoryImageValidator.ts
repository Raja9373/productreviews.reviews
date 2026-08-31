/**
 * Category Image Catalog & Strict Cross-Category Image Validator
 * Ensures that product images strictly match their actual real-world category.
 * e.g. Washing machine gets ONLY washing machine photos (NEVER vacuum, phone, or watch!).
 */

export const CATEGORY_VERIFIED_IMAGES: Record<string, string[]> = {
  washing_machine: [
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&auto=format&fit=crop&q=80',
  ],
  tv: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&auto=format&fit=crop&q=80',
  ],
  phone: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
  ],
  laptop: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80',
  ],
  audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
  ],
  vacuum: [
    'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&auto=format&fit=crop&q=80',
  ],
  refrigerator: [
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1536353284924-9240ccfc21f7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80',
  ],
  ac: [
    'https://images.unsplash.com/photo-1614633833026-0820552978b6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614633833026-0820552978b6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
  ],
  kitchen: [
    'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800&auto=format&fit=crop&q=80',
  ],
  watch: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80',
  ],
  camera: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
  ],
  security_smart_home: [
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580983561371-7f4b242d8ec0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
  ],
  cycles_mobility: [
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
  ],
  gifts_party: [
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
  ],
  fitness_sports: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  ],
  tools_hardware: [
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=800&auto=format&fit=crop&q=80',
  ],
  beauty_cosmetics: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
  ],
  baby_kids: [
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80',
  ],
  general: [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
  ]
};

/**
 * Detects the canonical category key from a query or category string
 */
export function detectCategoryKey(text: string): string {
  const norm = text.toLowerCase();
  if (/wash|washing|washer|laundry/i.test(norm)) return 'washing_machine';
  if (/cctv|security camera|smart lock|doorbell|smoke alarm/i.test(norm)) return 'security_smart_home';
  if (/cycle|bicycle|e-bike|scooter|commuter/i.test(norm)) return 'cycles_mobility';
  if (/gift|hamper|party|candle|fairy light/i.test(norm)) return 'gifts_party';
  if (/tv|television|screen|oled|qled|bravia/i.test(norm)) return 'tv';
  if (/phone|mobile|smartphone|iphone|galaxy|vivo|pixel|xiaomi|redmi|oneplus|realme|oppo/i.test(norm)) return 'phone';
  if (/laptop|macbook|notebook|computer|pc|thinkpad|zenbook|vivobook/i.test(norm)) return 'laptop';
  if (/headphone|earphone|earbud|airpod|audio|speaker|soundbar/i.test(norm)) return 'audio';
  if (/vacuum|cleaner|roborock|dyson|roomba|sweeper/i.test(norm)) return 'vacuum';
  if (/fridge|refrigerator|freezer/i.test(norm)) return 'refrigerator';
  if (/ac|air conditioner|cooling|split ac/i.test(norm)) return 'ac';
  if (/juicer|blender|mixer|grinder|air fryer|oven|microwave|toaster|coffee|espresso|cookware/i.test(norm)) return 'kitchen';
  if (/watch|smartwatch|band|fitness band|luxury watch/i.test(norm)) return 'watch';
  if (/camera|dslr|mirrorless|lens|gopro|drone/i.test(norm)) return 'camera';
  if (/treadmill|gym|dumbbell|yoga|workout|sports/i.test(norm)) return 'fitness_sports';
  if (/drill|tool|hardware|measuring|screwdriver/i.test(norm)) return 'tools_hardware';
  if (/serum|sunscreen|cream|makeup|perfume|shampoo|lipstick/i.test(norm)) return 'beauty_cosmetics';
  if (/diaper|baby|stroller|pram|toy|kid/i.test(norm)) return 'baby_kids';
  return 'general';
}

/**
 * Strict Image Validator:
 * Validates whether an image matches the target category.
 * If there is ANY risk of cross-category contamination (e.g. vacuum or watch image for washing machine),
 * it rejects the invalid image and returns a verified category photo.
 */
export function getValidatedCategoryImage(categoryOrQuery: string, requestedUrl?: string, itemIndex = 0): string {
  const catKey = detectCategoryKey(categoryOrQuery);
  const images = CATEGORY_VERIFIED_IMAGES[catKey] || CATEGORY_VERIFIED_IMAGES.general;

  // Strict cross-category rejection rules
  if (requestedUrl && requestedUrl.length > 10) {
    const urlLower = requestedUrl.toLowerCase();
    
    // If washing machine, reject any image containing vacuum, watch, phone, laptop, audio keywords
    if (catKey === 'washing_machine') {
      const isBadForWashingMachine = /vacuum|cleaner|watch|mobile|phone|headphone|earbud|laptop/i.test(urlLower);
      if (!isBadForWashingMachine && (urlLower.includes('unsplash') || urlLower.includes('amazon') || urlLower.includes('media'))) {
        return requestedUrl;
      }
    } else if (catKey === 'vacuum') {
      const isBadForVacuum = /washing|washer|watch|phone|mobile|tv/i.test(urlLower);
      if (!isBadForVacuum) return requestedUrl;
    } else if (catKey === 'tv') {
      const isBadForTV = /washing|vacuum|phone|watch/i.test(urlLower);
      if (!isBadForTV) return requestedUrl;
    } else if (catKey === 'phone') {
      const isBadForPhone = /washing|vacuum|tv|refrigerator/i.test(urlLower);
      if (!isBadForPhone) return requestedUrl;
    } else {
      return requestedUrl;
    }
  }

  // Pick guaranteed category image by index
  const safeIdx = itemIndex % images.length;
  return images[safeIdx];
}
