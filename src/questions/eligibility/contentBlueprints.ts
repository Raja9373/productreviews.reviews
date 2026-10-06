/**
 * ProductReviews.review — Content Blueprints Architecture
 * Defines structured section outlines required for indexable, high-value standalone pages.
 * Prevents thin programmatic pages by mandating complete editorial architectures.
 */

import { EligibilityPageType } from './eligibilityTypes';

export const CONTENT_BLUEPRINTS: Record<EligibilityPageType, string[]> = {
  PRODUCT_REVIEW: [
    'Executive Verdict & Bottom-Line Recommendation',
    'NICHOD Evidence Synthesis (Factual Claims vs Opinions)',
    'Verified Strengths & Real-World Lab Benchmark Results',
    'Key Weaknesses, Trade-Offs & Potential Dealbreakers',
    'Ideal Audience (Who Should Buy This)',
    'Who Should Avoid This Product',
    'Contradiction Analysis & Conflicting Evidence',
    'Market & Pricing Context (Authorized Retailers)',
    'Top Direct Alternatives Worth Considering',
    'Research Limitations & Unverified Assertions'
  ],

  COMPARISON: [
    'Authoritative Decision (Product A vs Product B)',
    'When to Choose Product A (Best Scenarios & Strengths)',
    'When to Choose Product B (Best Scenarios & Strengths)',
    'Aspect-by-Aspect Head-to-Head Evidence Analysis',
    'Key Weaknesses Comparison',
    'Crucial Trade-Offs & Compromises',
    'Direct Contradictions & Differing Lab Findings',
    'Market-Specific Price Differential & Availability',
    'Missing Information & Unresolved Claims',
    'Evidence Transparency & Source Attribution'
  ],

  USE_CASE: [
    'Use-Case Suitability Verdict (Performance Fit)',
    'Specific Real-World Demands & Hardware Stress Points',
    'Empirical Evidence in Target Workloads',
    'Critical Bottlenecks & Thermal/Battery Limitations',
    'Recommended Alternative Picks for This Exact Use Case',
    'Market & Pricing Context'
  ],

  BUYING_GUIDE: [
    'Category Overview & Evaluation Criteria',
    'Top Tested Recommendations by Budget & Need',
    'Key Hardware Specifications to Prioritize',
    'Features That Matter vs Marketing Gimmicks',
    'Long-Term Reliability & Brand Track Record',
    'Pricing Tiers & Optimal Value Sweet-Spots'
  ],

  ALTERNATIVE: [
    'Primary Benchmark Product Overview',
    'Top Recommended Alternatives Ranked by Value & Specialty',
    'Direct Trade-Offs Compared to the Benchmark',
    'Cheaper Budget-Friendly Options',
    'Premium Upgrades with Better Longevity',
    'Final Decision Guidance'
  ],

  PROBLEM_SOLUTION: [
    'Documented Hardware & Software Issues Summary',
    'Recurrence Rate & Verified Severity Assessment',
    'Affected Product Generations & Serial/Batch Variants',
    'Official Manufacturer Responses & Service Bulletins',
    'Troubleshooting Workarounds & Warranty Replacement Rights',
    'Should This Prevent You From Buying?'
  ],

  SPECIFICATION: [
    'Verified Technical Specification Sheet',
    'Lab Test Measurements vs Manufacturer Marketing Claims',
    'Thermal & Power Draw Analysis',
    'Display, Sensor, or Component Architecture Breakdown',
    'How These Specs Impact Daily Real-World Experience'
  ],

  COMPATIBILITY: [
    'Compatibility Matrix (OS, Platform, Ecosystem)',
    'Physical Ports, Wireless Protocols, and Dongle Needs',
    'Regional Standards (Cellular Bands, Voltage, Plug Types)',
    'Known Incompatibilities & Driver Limitations',
    'Setup & Configuration Instructions'
  ],

  UPGRADE_GUIDE: [
    'Is the Upgrade Justified? (Clear Buy / Keep Decision)',
    'What Genuinely Changed Since the Previous Generation',
    'Year-over-Year Benchmark Gains (Real vs Negligible)',
    'Trade-Offs in the Newer Model',
    'Price Differential vs Performance Value Analysis'
  ],

  GENERATION_COMPARISON: [
    'Generational Shift Summary',
    'Side-by-Side Spec Evolution',
    'Feature Additions & Omissions',
    'Longevity & Software Support Lifecycle',
    'Verdict: Upgrade or Stay with Existing'
  ],

  BRAND_RESEARCH: [
    'Brand Reputation & Manufacturing Pedigree',
    'Quality Control & Long-Term Reliability History',
    'Customer Support & Warranty Fulfillment Track Record',
    'Product Line Portfolio Comparison'
  ],

  SAFETY_GUIDE: [
    'Safety Certifications & Regulatory Approvals',
    'Thermal Testing & Battery Safety Guidelines',
    'Recall History & Known Hazard Reports',
    'Safe Operational Practices'
  ],

  AVAILABILITY_GUIDE: [
    'Regional Stock & Distribution Status',
    'Official Distributors vs Gray Market Importers',
    'Expected Restock Timelines & Price Gouging Warnings',
    'Authenticity Verification Guide'
  ],

  PRODUCT_RESEARCH: [
    'Exploratory Category Architecture',
    'Core Decision Factors & Consumer Traps to Avoid',
    'Market Trends & Next-Generation Horizons'
  ],

  FAQ: [
    'Core Question & Direct Evidence-Backed Answer',
    'Contextual Nuances & Edge Cases',
    'Related Technical Inquiries'
  ],

  NONE: []
};

/**
 * Retrieves the required Content Blueprint for a PageType
 */
export function getContentBlueprint(pageType: EligibilityPageType): string[] {
  return CONTENT_BLUEPRINTS[pageType] || [];
}
