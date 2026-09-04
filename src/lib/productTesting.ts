// Shared Product Testing & Methodology Utilities for Wirecutter India Clone

import { MarketCode } from '../types';

export interface TestingDetails {
  heading: string;
  summary: string;
  para1: string;
  para2: string;
}

const REGION_NAMES: Record<string, string> = {
  IN: 'India',
  US: 'the United States',
  UK: 'the United Kingdom',
  JP: 'Japan',
  DE: 'Germany',
  FR: 'France',
  ES: 'Spain',
  IT: 'Italy',
  CA: 'Canada',
  AU: 'Australia',
};

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
export function getTestingDetails(q: string, titleQ: string, market: MarketCode = 'US'): TestingDetails {
  const qLower = (q || '').toLowerCase();
  const region = REGION_NAMES[market] || 'your region';
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
    summary = `Tested in real household kitchens: voltage stability, motor torque, thermal regulation, noise & food-grade durability`;
    para1 = `We tested ${titleQ} across real home kitchens in ${region}, benchmarking motor endurance under heavy loads, municipal water conditions, and continuous operational heating.`;
    para2 = 'Motor strain, operational noise decibels, and food-grade stainless steel longevity were measured under prolonged stress cycles to guarantee everyday reliability.';
  } else if (
    qLower.includes('ac') ||
    qLower.includes('cooler') ||
    qLower.includes('purifier') ||
    qLower.includes('fan') ||
    qLower.includes('geyser') ||
    qLower.includes('heater')
  ) {
    summary = `Tested across dynamic climate conditions, 180 sq ft chamber, continuous energy consumption monitoring`;
    para1 = `Testing for ${titleQ} was conducted during real seasonal climatic extremes in ${region}, measuring rapid thermal and air filtration pull-down across an insulated room environment.`;
    para2 = 'Digital energy meters logged kilowatt-hour electricity consumption continuously to calculate genuine seasonal running costs and long-term hardware resilience.';
  } else if (
    qLower.includes('tv') ||
    qLower.includes('television') ||
    qLower.includes('laptop') ||
    qLower.includes('phone') ||
    qLower.includes('mobile') ||
    qLower.includes('tablet') ||
    qLower.includes('monitor')
  ) {
    summary = `140+ hours real-world battery endurance, thermal throttling under load, peak nit brightness and drop resistance`;
    para1 = `We logged over 140 hours testing ${titleQ}, measuring real-world battery endurance, thermal throttling under sustained heavy load, and display legibility under direct ambient daylight in peak nits.`;
    para2 = `Hardware durability was verified with drop tests, port stress cycling, and real-world network performance across cellular and modern Wi-Fi networks in ${region}.`;
  } else {
    summary = `Material build quality, verified owner feedback, manufacturer warranty support and value in ${region}`;
    para1 = `We evaluated ${titleQ} for real-world durability in ${region}, analyzing material build quality, verified local customer feedback, and manufacturer after-sales support networks.`;
    para2 = 'Each model was benchmarked for genuine value, avoiding inflated brand premiums while ensuring long-term product satisfaction.';
  }

  return {
    heading: `How We Tested ${titleQ} in ${region}`,
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
