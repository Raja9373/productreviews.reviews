import React, { useEffect, useMemo, useState } from 'react';
import {
  FAQItem,
  PREDEFINED_FAQS,
  ALL_FAQ_CATEGORY_GROUPS,
  FAQCategoryGroup,
} from '../../seo/faqData';
import {
  ShieldCheck,
  Smartphone,
  Laptop,
  Tv,
  Wind,
  Headphones,
  CheckCircle,
  Search,
  ChevronDown,
} from 'lucide-react';

export type { FAQItem };

export interface FaqSchemaGeneratorProps {
  /**
   * Static or dynamic array of FAQ items.
   * If omitted, falls back to PREDEFINED_FAQS.
   */
  faqs?: FAQItem[];

  /**
   * If true, renders category tabs allowing the user to browse all Amazon & Product categories.
   */
  showCategories?: boolean;

  /**
   * Custom Schema.org @id URI.
   * Defaults to 'https://productreviews.review/#faq'
   */
  schemaId?: string;

  /**
   * HTML id attribute for the <script type="application/ld+json"> tag.
   * Defaults to 'faq-schema-jsonld'
   */
  scriptId?: string;

  /**
   * If true, manages a <script> element in document.head in client-side lifecycle.
   * Defaults to true.
   */
  injectHeadScript?: boolean;

  /**
   * If true, also renders a visual, accessible FAQ Accordion UI on the page.
   * Defaults to false (structured data only).
   */
  renderUi?: boolean;

  /**
   * Optional heading title for the visual FAQ UI (when renderUi is true).
   */
  title?: string;

  /**
   * Optional description/subtitle for the visual FAQ UI.
   */
  subtitle?: string;

  /**
   * Additional container CSS classes for visual UI mode.
   */
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  Laptop: <Laptop className="w-4 h-4" />,
  Tv: <Tv className="w-4 h-4" />,
  Wind: <Wind className="w-4 h-4" />,
  Headphones: <Headphones className="w-4 h-4" />,
  CheckCircle: <CheckCircle className="w-4 h-4" />,
};

/**
 * Builds standard Schema.org FAQPage structured data object.
 */
export function generateFaqSchema(
  faqs: FAQItem[] = PREDEFINED_FAQS,
  schemaId: string = 'https://productreviews.review/#faq'
) {
  const safeFaqs = Array.isArray(faqs) && faqs.length > 0 ? faqs : PREDEFINED_FAQS;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': schemaId,
    mainEntity: safeFaqs.map((faq) => ({
      '@type': 'Question',
      name: String(faq.question || '').trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: String(faq.answer || '').trim(),
      },
    })),
  };
}

/**
 * Serializes FAQ schema to safe JSON string, escaping HTML/script tags to prevent XSS.
 */
export function generateFaqSchemaJsonString(
  faqs: FAQItem[] = PREDEFINED_FAQS,
  schemaId?: string
): string {
  const schema = generateFaqSchema(faqs, schemaId);
  return JSON.stringify(schema, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/**
 * FaqSchemaGenerator Component
 *
 * Maps high-intent Amazon & product decision questions into a Schema.org JSON-LD
 * structured data script, enabling Google "People Also Ask" rich snippets while providing
 * an accessible, interactive FAQ UI.
 */
export const FaqSchemaGenerator: React.FC<FaqSchemaGeneratorProps> = ({
  faqs,
  showCategories = false,
  schemaId = 'https://productreviews.review/#faq',
  scriptId = 'faq-schema-jsonld',
  injectHeadScript = true,
  renderUi = false,
  title = 'Frequently Asked Questions: Amazon Buying & Product Decision Guide',
  subtitle = 'Objective answers to the most common Google & Amazon search queries regarding product authenticity, warranty, comparisons, and purchasing safety.',
  className = '',
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [openIndices, setOpenIndices] = useState<Record<string, boolean>>({});

  // Compute all available FAQs when showCategories is active
  const allCategoryFaqs = useMemo(() => {
    if (!showCategories) return faqs || PREDEFINED_FAQS;
    return ALL_FAQ_CATEGORY_GROUPS.flatMap((g) => g.faqs);
  }, [showCategories, faqs]);

  // Active display FAQs based on selected category tab & search filter
  const displayedFaqs = useMemo(() => {
    let list: FAQItem[] = [];
    if (!showCategories) {
      list = Array.isArray(faqs) && faqs.length > 0 ? faqs : PREDEFINED_FAQS;
    } else if (selectedCategoryId === 'all') {
      list = allCategoryFaqs;
    } else {
      const group = ALL_FAQ_CATEGORY_GROUPS.find((g) => g.id === selectedCategoryId);
      list = group ? group.faqs : allCategoryFaqs;
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
      );
    }

    return list;
  }, [showCategories, selectedCategoryId, faqs, allCategoryFaqs, searchFilter]);

  // All FAQs included in Schema.org JSON-LD to maximize Google PAA ranking coverage
  const schemaFaqs = useMemo(() => {
    return showCategories ? allCategoryFaqs : (faqs && faqs.length > 0 ? faqs : PREDEFINED_FAQS);
  }, [showCategories, allCategoryFaqs, faqs]);

  const jsonLdString = useMemo(() => {
    return generateFaqSchemaJsonString(schemaFaqs, schemaId);
  }, [schemaFaqs, schemaId]);

  // Client-side document.head injection & cleanup
  useEffect(() => {
    if (!injectHeadScript || typeof document === 'undefined') return;

    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = jsonLdString;

    return () => {
      const el = document.getElementById(scriptId);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [jsonLdString, scriptId, injectHeadScript]);

  const toggleAccordion = (idKey: string) => {
    setOpenIndices((prev) => ({
      ...prev,
      [idKey]: !prev[idKey],
    }));
  };

  return (
    <>
      {/* Direct JSX Schema script tag for prerender & crawler discovery */}
      <script
        id={`${scriptId}-jsx`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      {/* Visible FAQ Section UI */}
      {renderUi && (
        <section
          className={`w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 ${className}`}
          aria-label="FAQ Section"
        >
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && (
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-wirecutter tracking-tight text-zinc-900">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-2.5 text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Interactive Category Filter Tabs (Home / Guide Mode) */}
          {showCategories && (
            <div className="mb-6 space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId('all')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                    selectedCategoryId === 'all'
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  All Questions ({allCategoryFaqs.length})
                </button>
                {ALL_FAQ_CATEGORY_GROUPS.map((group) => {
                  const isActive = selectedCategoryId === group.id;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(group.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {CATEGORY_ICONS[group.iconName] || <CheckCircle className="w-3.5 h-3.5" />}
                      <span>{group.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Optional Quick Search in Questions */}
              <div className="relative max-w-md mx-auto">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter questions (e.g. warranty, battery, 100W, Open Box)..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
                />
              </div>
            </div>
          )}

          {/* Questions Accordion List */}
          <div className="space-y-3">
            {displayedFaqs.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">
                No questions found matching your search. Try another keyword.
              </div>
            ) : (
              displayedFaqs.map((faq, index) => {
                const itemKey = `faq-${selectedCategoryId}-${index}`;
                const isOpen = !!openIndices[itemKey];
                const buttonId = `faq-btn-${itemKey}`;
                const panelId = `faq-panel-${itemKey}`;

                return (
                  <div
                    key={itemKey}
                    className="border border-zinc-200 rounded-xl bg-white overflow-hidden transition-all duration-200 shadow-xs hover:border-zinc-300"
                  >
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleAccordion(itemKey)}
                      className="w-full px-5 py-4 text-left font-medium text-zinc-900 flex justify-between items-center gap-4 hover:bg-zinc-50/75 transition-colors"
                    >
                      <span className="text-sm sm:text-base leading-snug">{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-400 transform transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-zinc-800' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className="px-5 pb-4 pt-1 text-sm sm:text-base text-zinc-600 border-t border-zinc-100 leading-relaxed"
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default FaqSchemaGenerator;
