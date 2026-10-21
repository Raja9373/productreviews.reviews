import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  Code,
  Sparkles,
  Layers,
  Smartphone,
  Laptop,
  Tv,
  Wind,
  Headphones,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { FAQItem, AMAZON_SHOPPING_FAQS, SMARTPHONES_FAQS, LAPTOPS_FAQS, TVS_FAQS, APPLIANCES_FAQS, AUDIO_FAQS } from '../../seo/faqData';

interface FAQGeneratorProps {
  initialCategory?: string;
  onInject?: (faqs: FAQItem[]) => void;
}

const CATEGORIES = [
  { id: 'amazon', label: 'Amazon Shopping & Safety', faqs: AMAZON_SHOPPING_FAQS, icon: ShieldCheck },
  { id: 'phones', label: 'Smartphones & Mobiles', faqs: SMARTPHONES_FAQS, icon: Smartphone },
  { id: 'laptops', label: 'Laptops & Computing', faqs: LAPTOPS_FAQS, icon: Laptop },
  { id: 'tvs', label: '4K Smart TVs & Displays', faqs: TVS_FAQS, icon: Tv },
  { id: 'appliances', label: 'ACs & Home Appliances', faqs: APPLIANCES_FAQS, icon: Wind },
  { id: 'audio', label: 'Headphones & Earbuds', faqs: AUDIO_FAQS, icon: Headphones },
];

export const FAQGenerator: React.FC<FAQGeneratorProps> = ({
  initialCategory = 'amazon',
  onInject,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(initialCategory);
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const found = CATEGORIES.find((c) => c.id === initialCategory);
    return found ? [...found.faqs] : [...AMAZON_SHOPPING_FAQS];
  });
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [copied, setCopied] = useState(false);
  const [injectedStatus, setInjectedStatus] = useState(false);

  const handleCategoryChange = (catId: string) => {
    setSelectedCatId(catId);
    const found = CATEGORIES.find((c) => c.id === catId);
    if (found) {
      setFaqs([...found.faqs]);
    }
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() && newAnswer.trim()) {
      setFaqs([{ question: newQuestion.trim(), answer: newAnswer.trim() }, ...faqs]);
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, idx) => idx !== index));
  };

  // Build Schema.org JSON-LD string
  const schemaObj = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  const schemaJsonString = JSON.stringify(schemaObj, null, 2);

  const handleCopyJsonLd = () => {
    navigator.clipboard.writeText(`<script type="application/ld+json">\n${schemaJsonString}\n</script>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInjectToHead = () => {
    if (typeof document === 'undefined') return;
    const existingScript = document.getElementById('manual-injected-faq-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'manual-injected-faq-schema';
    script.type = 'application/ld+json';
    script.textContent = schemaJsonString;
    document.head.appendChild(script);

    setInjectedStatus(true);
    if (onInject) onInject(faqs);
    setTimeout(() => setInjectedStatus(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden font-sans text-zinc-900 max-w-4xl mx-auto my-8">
      {/* Header */}
      <div className="bg-zinc-950 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-zinc-950 text-xs font-bold font-mono px-2 py-0.5 rounded">
              SEO UTILITY
            </span>
            <span className="text-xs text-zinc-400 font-mono">Long-Tail Keyword &amp; PAA Augmentation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-wirecutter mt-1 text-white tracking-tight">
            FAQSchema Generator &amp; Injector
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manually customize and inject category-specific FAQ schema to boost search engine visibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJsonLd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied JSON-LD' : 'Copy JSON-LD'}</span>
          </button>
          <button
            onClick={handleInjectToHead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{injectedStatus ? 'Successfully Injected!' : 'Inject to DOM Head'}</span>
          </button>
        </div>
      </div>

      {/* Category Preset Selector */}
      <div className="p-4 sm:p-5 bg-zinc-50 border-b border-zinc-200 flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-bold text-zinc-600 mr-2 uppercase tracking-wide">
          Category Presets:
        </span>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCatId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900 text-white font-semibold shadow-2xs'
                  : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Add FAQ Form + Current FAQ List */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Add Custom Question Form */}
        <div className="lg:col-span-1 bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add Custom PAA Question</span>
          </h3>

          <form onSubmit={handleAddFaq} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase text-zinc-600 mb-1">
                Question
              </label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="e.g. Does this product include an extended warranty?"
                className="w-full text-xs p-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase text-zinc-600 mb-1">
                Factual Answer
              </label>
              <textarea
                rows={4}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Provide a clear, authoritative factual answer..."
                className="w-full text-xs p-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Add to FAQ Schema
            </button>
          </form>

          <div className="pt-3 border-t border-zinc-200 text-[11px] text-zinc-500 leading-relaxed">
            <strong>Tip:</strong> Adding 5–8 category-specific questions increases long-tail keyword indexing across Google Search and People Also Ask snippets.
          </div>
        </div>

        {/* Right Column: List of Active FAQs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-700" />
              <span>Active FAQ Items ({faqs.length})</span>
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              Schema.org FAQPage Generation Active
            </span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-3.5 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 transition-all shadow-2xs flex items-start justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 mb-1">
                    {index + 1}. {faq.question}
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">{faq.answer}</p>
                </div>
                <button
                  onClick={() => handleRemoveFaq(index)}
                  className="text-zinc-400 hover:text-rose-600 p-1 transition-colors cursor-pointer shrink-0"
                  title="Remove question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Preview of JSON-LD */}
      <div className="bg-zinc-950 text-zinc-100 p-4 sm:p-5 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5" />
            <span>Generated Schema.org JSON-LD Output</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            {faqs.length} Questions Included
          </span>
        </div>
        <pre className="bg-zinc-900 p-3.5 rounded text-[11px] font-mono overflow-x-auto text-emerald-300 max-h-48 border border-zinc-800">
          {schemaJsonString}
        </pre>
      </div>
    </div>
  );
};

export default FAQGenerator;
