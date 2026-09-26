import React, { useEffect, useMemo, useState } from 'react';
import { FAQItem, PREDEFINED_FAQS, buildFaqPageSchema } from '../../seo/faqData';

export type { FAQItem };

export interface FaqSchemaGeneratorProps {
  /**
   * Static or dynamic array of FAQ items.
   * If omitted, falls back to PREDEFINED_FAQS.
   */
  faqs?: FAQItem[];

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
 * Automatically maps a static array of FAQ objects into a Schema.org JSON-LD structured
 * data script, enabling Google "People Also Ask" rich snippets on any page via simple props.
 */
export const FaqSchemaGenerator: React.FC<FaqSchemaGeneratorProps> = ({
  faqs = PREDEFINED_FAQS,
  schemaId = 'https://productreviews.review/#faq',
  scriptId = 'faq-schema-jsonld',
  injectHeadScript = true,
  renderUi = false,
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about our objective product evaluation and decision engine.',
  className = '',
}) => {
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({});

  const activeFaqs = useMemo(() => {
    return Array.isArray(faqs) && faqs.length > 0 ? faqs : PREDEFINED_FAQS;
  }, [faqs]);

  const jsonLdString = useMemo(() => {
    return generateFaqSchemaJsonString(activeFaqs, schemaId);
  }, [activeFaqs, schemaId]);

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
      // Cleanup if component unmounts or faqs change
      const el = document.getElementById(scriptId);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [jsonLdString, scriptId, injectHeadScript]);

  const toggleAccordion = (index: number) => {
    setOpenIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      {/* Direct JSX Schema script tag for initial SSR/prerender DOM discovery */}
      <script
        id={`${scriptId}-jsx`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      {/* Optional visible FAQ Section UI */}
      {renderUi && (
        <section
          className={`w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 ${className}`}
          aria-label="FAQ Section"
        >
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && (
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-2 text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            {activeFaqs.map((faq, index) => {
              const isOpen = !!openIndices[index];
              const buttonId = `faq-btn-${index}`;
              const panelId = `faq-panel-${index}`;

              return (
                <div
                  key={index}
                  className="border border-zinc-200 rounded-xl bg-white overflow-hidden transition-all duration-200 shadow-xs hover:border-zinc-300"
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-5 py-4 text-left font-medium text-zinc-900 flex justify-between items-center gap-4 hover:bg-zinc-50/75 transition-colors"
                  >
                    <span className="text-sm sm:text-base leading-snug">{faq.question}</span>
                    <span
                      className={`text-zinc-400 transform transition-transform duration-200 shrink-0 text-sm ${
                        isOpen ? 'rotate-180 text-zinc-700' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ▼
                    </span>
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
            })}
          </div>
        </section>
      )}
    </>
  );
};

export default FaqSchemaGenerator;
