/**
 * ProductReviews.review — Content Safety & Validation Engine
 * Enforces zero unsupported factual claims, zero fabricated URLs,
 * zero unsupported superlatives, zero fake first-person testing claims,
 * and strict market evidence isolation.
 */

import { ContentClaim, SynthesizedContent, ContentSection } from './contentTypes';
import { EvidencePoint, SourceStatus } from '../types';

// Unsafe superlatives that must never appear in synthesis without explicit factual support
const UNSAFE_SUPERLATIVES = [
  /\bworld(?:'s)?\s+best\b/i,
  /\bthe\s+best\s+(?:phone|laptop|product|choice|deal|headphone|earbud|camera)\b/i,
  /\bnumber\s+(?:one|1)\b/i,
  /\b#1\b/i,
  /\b100%\s+unbiased\b/i,
  /\bflawless\b/i,
  /\bperfect\s+(?:phone|laptop|product|camera|device)\b/i,
  /\bunbeatable\b/i,
  /\bultimate\s+winner\b/i
];

// Unsafe first-person testing phrases that pretend to have hands-on lab infrastructure when not present
const UNSAFE_FIRST_PERSON_TESTING = [
  /\bwe\s+tested\b/i,
  /\bi\s+tested\b/i,
  /\bour\s+lab\s+found\b/i,
  /\bour\s+testing\s+revealed\b/i,
  /\bin\s+our\s+hands-on\s+test\b/i,
  /\bwe\s+spent\s+\d+\s+hours\s+testing\b/i,
  /\bi\s+personally\s+used\b/i,
  /\bour\s+team\s+unboxed\b/i
];

// Patterns for price, availability, warranty, compatibility
const PRICE_PATTERNS = [/\$\d+/, /₹\d+/, /£\d+/, /€\d+/, /\b\d+\s*(?:rs|inr|usd|gbp|eur)\b/i, /\bprice\s+is\s+[\$₹£€]?\d+/i];
const AVAILABILITY_PATTERNS = [/\bin\s+stock\b/i, /\bavailable\s+in\s+([A-Z][a-z]+)\b/i, /\bships\s+to\b/i];
const WARRANTY_PATTERNS = [/\b\d+-year\s+warranty\b/i, /\bwarranty\s+coverage\b/i, /\bmanufacturer\s+warranty\b/i];
const COMPATIBILITY_PATTERNS = [/\bcompatible\s+with\b/i, /\bsupports\s+(?:5g|esim|band\s+\d+|volte)\b/i];

export interface SafetyCheckResult {
  passed: boolean;
  violations: string[];
}

/**
 * Checks for unsupported superlatives in text
 */
export function checkSuperlatives(text: string, supportedClaimsText: string = ''): SafetyCheckResult {
  const violations: string[] = [];
  for (const pattern of UNSAFE_SUPERLATIVES) {
    if (pattern.test(text) && !pattern.test(supportedClaimsText)) {
      violations.push(`Unsupported superlative detected: matches "${pattern.source}"`);
    }
  }
  return { passed: violations.length === 0, violations };
}

/**
 * Checks for fake first-hand / lab testing claims
 */
export function checkFirstPersonTestingClaims(text: string): SafetyCheckResult {
  const violations: string[] = [];
  for (const pattern of UNSAFE_FIRST_PERSON_TESTING) {
    if (pattern.test(text)) {
      violations.push(`Fake first-hand testing claim detected: matches "${pattern.source}"`);
    }
  }
  return { passed: violations.length === 0, violations };
}

/**
 * Validates that all URLs in content or claims originate from verified STRUCTURED evidence
 */
export function checkSourceUrlIntegrity(
  text: string,
  verifiedEvidencePoints: EvidencePoint[]
): SafetyCheckResult {
  const violations: string[] = [];
  const foundUrls = text.match(/https?:\/\/[^\s"'<>)]+/gi) || [];

  const validUrls = new Set<string>();
  for (const ep of verifiedEvidencePoints) {
    if (ep.sourceStatus === SourceStatus.STRUCTURED && ep.sourceUrl) {
      validUrls.add(ep.sourceUrl.trim());
    }
  }

  for (const url of foundUrls) {
    if (!validUrls.has(url)) {
      violations.push(`Fabricated or unverified source URL detected: ${url}`);
    }
  }

  return { passed: violations.length === 0, violations };
}

/**
 * Validates market-specific assertions (Price, Availability, Warranty)
 * Guarantees that local assertions in market M only exist if local evidence exists for market M.
 */
export function checkMarketAssertionSafety(
  content: string,
  targetCountryCode: string,
  hasLocalEvidence: boolean,
  verifiedClaims: ContentClaim[] = []
): SafetyCheckResult {
  const violations: string[] = [];

  if (targetCountryCode !== 'GLOBAL' && !hasLocalEvidence) {
    // If target is India (IN) and we have NO local evidence, content must not claim local price in INR or local availability
    if (targetCountryCode === 'IN') {
      if (/₹\d+/.test(content) || /\b(?:inr|rupees?|rs\.?)\b/i.test(content)) {
        violations.push(`Local INR pricing presented without verified India market evidence.`);
      }
      if (/\b(?:available|in stock|buy)\s+in\s+india\b/i.test(content)) {
        violations.push(`India availability claimed without verified India market evidence.`);
      }
      if (/\bindia\s+warranty\b/i.test(content)) {
        violations.push(`India warranty claimed without verified India market evidence.`);
      }
    } else {
      // General country check
      const countryRegex = new RegExp(`\\b(?:available|in stock|warranty|price)\\s+in\\s+${targetCountryCode}\\b`, 'i');
      if (countryRegex.test(content)) {
        violations.push(`Local assertions for ${targetCountryCode} presented without verified local evidence.`);
      }
    }
  }

  return { passed: violations.length === 0, violations };
}

/**
 * Validates that every factual statement in the sections traces back to evidence
 */
export function validateSectionProvenance(sections: ContentSection[]): SafetyCheckResult {
  const violations: string[] = [];

  for (const section of sections) {
    if (section.contentType === 'FACT' || section.contentType === 'TRADEOFF') {
      if (section.evidencePointIds.length === 0) {
        violations.push(`Section "${section.heading}" of type ${section.contentType} has zero evidence references.`);
      }
    }
  }

  return { passed: violations.length === 0, violations };
}
