import React from 'react';
import { ContentRecord } from '../content/store/contentStoreTypes';
import { DecisionCard } from './DecisionCard';
import { NichodSummary } from './NichodSummary';
import { Breadcrumbs } from './Breadcrumbs';
import { CheckCircle, AlertTriangle, HelpCircle, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { FaqSchemaGenerator } from './seo/FaqSchemaGenerator';
import { getFaqsForCategory } from '../seo/faqData';

interface PublishedContentViewProps {
  record: ContentRecord;
  onBack: () => void;
}

export const PublishedContentView: React.FC<PublishedContentViewProps> = ({ record, onBack }) => {
  const { content, decisionSnapshot, nichodSnapshot, metadata } = record;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation Breadcrumb & Back */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-mono px-2 py-1 bg-zinc-100 text-zinc-600 rounded">
          Published • Version {record.version}
        </span>
      </div>

      <Breadcrumbs
        domain="PRODUCT"
        query={record.title}
        onHomeClick={onBack}
      />

      {/* Main Headline & Meta */}
      <header className="mt-6 mb-8 border-b border-zinc-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-wirecutter text-zinc-950 tracking-tight leading-tight">
          {record.title}
        </h1>
        <p className="mt-4 text-lg text-zinc-700 leading-relaxed font-sans">
          {content.introduction}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500 font-mono">
          <span>Published: {record.publishedAt ? new Date(record.publishedAt).toLocaleDateString() : 'Recent'}</span>
          <span>Market: {record.market.countryCode}</span>
          <span>Language: {record.language.toUpperCase()}</span>
          <span>Verified Claims: {content.claims.length}</span>
        </div>
      </header>

      {/* Authoritative Decision Card */}
      {decisionSnapshot && (
        <section className="mb-8">
          <DecisionCard decision={decisionSnapshot} />
        </section>
      )}

      {/* NICHOD Summary */}
      {nichodSnapshot && (
        <section className="mb-8">
          <NichodSummary nichod={nichodSnapshot} />
        </section>
      )}

      {/* Synthesized Evidence Sections */}
      <div className="space-y-8">
        {content.sections.map((section) => (
          <section key={section.id} className="bg-white p-6 border border-zinc-200 rounded-sm shadow-xs">
            <h2 className="text-xl font-bold font-serif-wirecutter text-zinc-900 mb-3">
              {section.heading}
            </h2>

            {section.paragraphs.map((p, idx) => (
              <p key={idx} className="text-zinc-700 leading-relaxed mb-3 text-sm sm:text-base">
                {p}
              </p>
            ))}

            {section.bullets && section.bullets.length > 0 && (
              <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-700 mt-2">
                {section.bullets.map((b, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {section.claims && section.claims.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap gap-2 text-xs text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {section.claims.length} verified claims
                </span>
                {section.sourceIds && section.sourceIds.length > 0 && (
                  <span>Sources: {section.sourceIds.join(', ')}</span>
                )}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Frequently Asked Questions (Structured Data & Visual UI) */}
      <section className="mt-12">
        <FaqSchemaGenerator
          faqs={
            content.faqs && content.faqs.length > 0
              ? [...content.faqs, ...getFaqsForCategory(record.title).slice(0, 2)]
              : getFaqsForCategory(record.title)
          }
          renderUi={true}
          title="Frequently Asked Questions & Buying Advice"
          subtitle={`High-intent questions and verified facts regarding ${record.title}, return policies, warranties, and alternatives.`}
          schemaId={`${record.canonicalUrl || 'https://productreviews.review'}#faq`}
          scriptId={`published-faq-${record.slug}`}
        />
      </section>

      {/* Internal Link Recommendations */}
      {content.internalLinks && content.internalLinks.length > 0 && (
        <section className="mt-8 border-t border-zinc-200 pt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3">
            Related Research & Guides
          </h3>
          <div className="flex flex-wrap gap-3">
            {content.internalLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.urlPath}
                className="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded transition-colors"
              >
                {link.title} →
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
