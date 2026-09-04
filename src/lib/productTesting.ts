// Shared Product Testing & Methodology Utilities for Wirecutter India Clone

export interface TestingDetails {
  heading: string;
  summary: string;
  para1: string;
  para2: string;
}

// 1. Clean query helper:
// q = search?q param, lower, trim, remove leading "best/top"
// titleQ = Title Case of q
export function cleanQuery(raw: string): { q: string; titleQ: string } {
  const trimmed = (raw || '').toLowerCase().trim();
  const cleaned = trimmed.replace(/^(best|top)\s+/i, '').trim() || 'products';
  const titleQ = cleaned
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return { q: cleaned, titleQ };
}

// 2. How We Tested - DYNAMIC TITLE & BODY
// Heading must be: `How We Tested ${titleQ} in India` - NEVER "How We Tested These Smartphones" on juicer page
// Body per type (auto-detect without if-else list):
// If q has kitchen/juicer/grinder/mixer -> "Tested in Indian kitchens: voltage 170-270V, hard water, 45C, noise, steel"
// If q has AC/cooler/purifier -> "Tested in 45C Delhi, 180 sq ft room, energy meter"
// If q has TV/laptop/phone -> "140 hrs battery, thermal, nits, drop"
// Else -> "Build quality, user feedback, after-sales, value for Indian market"
export function getTestingDetails(q: string, titleQ: string): TestingDetails {
  const qLower = (q || '').toLowerCase();
  let summary = '';
  let para1 = '';
  let para2 = '';

  if (
    qLower.includes('kitchen') ||
    qLower.includes('juicer') ||
    qLower.includes('grinder') ||
    qLower.includes('mixer') ||
    qLower.includes('cook') ||
    qLower.includes('fryer') ||
    qLower.includes('oven') ||
    qLower.includes('blender') ||
    qLower.includes('toaster') ||
    qLower.includes('kettle')
  ) {
    summary = 'Tested in Indian kitchens: voltage 170-270V, hard water, 45C, noise, steel';
    para1 = `We tested ${titleQ} across real Indian household kitchens, benchmarking motor performance under fluctuating voltages between 170V and 270V, heavy borewell and municipal water, and 45°C ambient heat.`;
    para2 = 'Motor strain, operational noise levels, and food-grade stainless steel durability were measured under prolonged stress tests to guarantee kitchen reliability.';
  } else if (
    qLower.includes('ac') ||
    qLower.includes('cooler') ||
    qLower.includes('purifier') ||
    qLower.includes('fan') ||
    qLower.includes('geyser') ||
    qLower.includes('heater')
  ) {
    summary = 'Tested in 45C Delhi, 180 sq ft room, energy meter';
    para1 = `Testing for ${titleQ} was conducted during extreme Indian climatic conditions reaching 45°C in Delhi, measuring rapid thermal and air pull-down across an insulated 180 sq. ft room.`;
    para2 = 'Energy meters tracked kilowatt-hour electricity consumption continuously to calculate genuine seasonal running costs and long-term hardware resilience.';
  } else if (
    qLower.includes('tv') ||
    qLower.includes('television') ||
    qLower.includes('laptop') ||
    qLower.includes('phone') ||
    qLower.includes('mobile') ||
    qLower.includes('tablet') ||
    qLower.includes('monitor')
  ) {
    summary = '140 hrs battery, thermal, nits, drop';
    para1 = `We logged over 140 hours testing ${titleQ}, measuring real-world battery endurance, thermal throttling under sustained heavy load, and display legibility under direct sunlight in peak nits.`;
    para2 = 'Hardware durability was verified with drop tests, port stress cycling, and real-world network performance across Indian cellular and Wi-Fi networks.';
  } else {
    summary = 'Build quality, user feedback, after-sales, value for Indian market';
    para1 = `We evaluated ${titleQ} for Indian market durability, analyzing material build quality, verified Indian customer feedback, and brand after-sales service support across metro and tier-2 cities.`;
    para2 = 'Each model was benchmarked for genuine value for money, avoiding inflated brand premiums while ensuring long-term reliability.';
  }

  return {
    heading: `How We Tested ${titleQ} in India`,
    summary,
    para1,
    para2,
  };
}

// 5 Main categories only for instant zero-API benchmark
export function matchMainCategory(qLower: string): 'phone' | 'laptop' | 'tv' | 'ac' | 'earbuds' | null {
  if (
    qLower.includes('phone') ||
    qLower.includes('mobile') ||
    qLower.includes('smartphone') ||
    qLower.includes('30000') ||
    qLower.includes('30,000')
  ) {
    return 'phone';
  }
  if (
    qLower.includes('laptop') ||
    qLower.includes('macbook') ||
    qLower.includes('notebook')
  ) {
    return 'laptop';
  }
  if (
    qLower.includes('tv') ||
    qLower.includes('television') ||
    qLower.includes('oled') ||
    qLower.includes('bravia')
  ) {
    return 'tv';
  }
  if (
    qLower.includes('ac') ||
    qLower.includes('air conditioner') ||
    qLower.includes('split ac')
  ) {
    return 'ac';
  }
  if (
    qLower.includes('earbud') ||
    qLower.includes('headphone') ||
    qLower.includes('tws') ||
    qLower.includes('earphone') ||
    qLower.includes('buds')
  ) {
    return 'earbuds';
  }
  return null;
}
