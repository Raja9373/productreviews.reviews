import React from 'react';
import { Star, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Tag, Shield } from 'lucide-react';
import { ProductModel, LanguageCode } from '../types';
import { LANGUAGES, TRANSLATIONS } from '../data/languages';

interface ModelSelectorProps {
  query: string;
  models: ProductModel[];
  currentLang: LanguageCode;
  onSelectModel: (model: ProductModel) => void;
  onBackToSearch: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  query,
  models,
  currentLang,
  onSelectModel,
  onBackToSearch,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentLangDef = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const formatPrice = (usd: number) => {
    const local = Math.round(usd * currentLangDef.currencyRate);
    return `${currentLangDef.currencySymbol}${local.toLocaleString()}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-in fade-in duration-200">
      {/* Top Navigation & Query Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <button
            id="back-to-search-btn"
            onClick={onBackToSearch}
            className="px-3.5 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.changeQuery}</span>
          </button>

          <div>
            <div className="text-xs font-medium text-zinc-400">
              Query: "{query}"
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              {t.modelsFoundTitle} <span className="text-zinc-900">"{query}"</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-full w-fit">
          <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
          <span>{t.selectModelPrompt}</span>
        </div>
      </div>

      {/* 6 Model Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div
            key={model.id}
            id={`model-card-${model.slug}`}
            onClick={() => onSelectModel(model)}
            className="group bg-white rounded-[24px] border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer p-6 relative"
          >
            {/* Top Tag & Model Number Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800">
                <Tag className="w-3 h-3 text-zinc-500" />
                {model.tag}
              </span>
              <span className="text-[11px] font-mono text-zinc-400 uppercase">
                {model.modelNumber}
              </span>
            </div>

            {/* Product Image */}
            <div className="w-full h-48 rounded-2xl bg-zinc-50 overflow-hidden mb-4 relative flex items-center justify-center p-4">
              <img
                src={model.image}
                alt={model.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-medium text-white">
                {model.brand}
              </div>
            </div>

            {/* Product Information */}
            <div className="flex-1 flex flex-col">
              <h3 className="font-bold text-base text-zinc-900 group-hover:text-zinc-600 transition-colors line-clamp-2 mb-1">
                {model.name}
              </h3>
              <p className="text-xs text-zinc-400 mb-3">{model.category}</p>

              {/* Specs Preview */}
              <div className="space-y-1.5 mb-4 py-2.5 px-3 rounded-xl bg-zinc-50 text-xs text-zinc-600">
                {Object.entries(model.specs).slice(0, 2).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-zinc-400 text-[11px]">{key}:</span>
                    <span className="font-medium text-zinc-800 truncate max-w-[140px]">{val}</span>
                  </div>
                ))}
              </div>

              {/* Price & Rating Row */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Est. Price</span>
                  <span className="text-base font-bold text-zinc-900">
                    {formatPrice(model.basePriceUSD)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-right">
                  <div className="flex items-center text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 mr-1" />
                    <span>{model.rating}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    ({model.totalReviews.toLocaleString()})
                  </span>
                </div>
              </div>
            </div>

            {/* Action Hover Prompt */}
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-900 group-hover:text-zinc-600">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
                Scan &amp; Generate Review
              </span>
              <div className="p-1.5 rounded-lg bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
