import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, ChevronRight, X, Sparkles, ExternalLink, ArrowUpRight, Search } from 'lucide-react';
import { CATEGORIES, Category, SubCategory } from '../data/categories';
import { LanguageCode } from '../types';

interface CategoryMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
  onSelectSubCategory: (category: Category, subcategory: SubCategory) => void;
  currentLang: LanguageCode;
}

export const CategoryMegaMenu: React.FC<CategoryMegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectSubCategory,
  currentLang,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCategories = CATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subcategories.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Distribute into 4 balanced columns
  const colSize = Math.ceil(filteredCategories.length / 4);
  const col1 = filteredCategories.slice(0, colSize);
  const col2 = filteredCategories.slice(colSize, colSize * 2);
  const col3 = filteredCategories.slice(colSize * 2, colSize * 3);
  const col4 = filteredCategories.slice(colSize * 3);

  const columns = [col1, col2, col3, col4];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-start justify-center pt-16 pb-12 px-3 sm:px-6 animate-in fade-in duration-200">
      <div
        ref={menuRef}
        className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-900 text-white shadow-xs">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-900">Browse All 33 Categories</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  33 Major Hubs
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Direct verified product analysis, demand rankings, and smart comparisons
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick search input within 33 categories */}
            <div className="relative hidden sm:flex items-center">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3" />
              <input
                type="text"
                placeholder="Filter 33 categories & subcategories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-white border border-zinc-200 rounded-full w-64 focus:outline-none focus:border-zinc-900 text-zinc-800"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4-Column Category Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 scrollbar-thin">
          {columns.map((catCol, colIdx) => (
            <div key={colIdx} className="space-y-6">
              {catCol.map((cat) => (
                <div
                  key={cat.id}
                  id={`cat-card-${cat.slug}`}
                  className="p-3.5 rounded-xl border border-zinc-100 hover:border-zinc-300 hover:shadow-xs transition-all bg-white group"
                >
                  <div
                    onClick={() => {
                      onSelectCategory(cat);
                      onClose();
                    }}
                    className="flex items-start justify-between cursor-pointer mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl leading-none">{cat.emoji}</span>
                      <h3 className="text-sm font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <p className="text-[11px] text-zinc-500 line-clamp-1 mb-2.5">
                    {cat.description}
                  </p>

                  {/* Subcategory links */}
                  <div className="space-y-1 pt-1 border-t border-zinc-50">
                    {cat.subcategories.slice(0, 5).map((sub) => (
                      <button
                        key={sub.slug}
                        onClick={() => {
                          onSelectSubCategory(cat, sub);
                          onClose();
                        }}
                        className="w-full text-left flex items-center justify-between text-xs py-1 px-1.5 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
                      >
                        <span className="truncate">{sub.name}</span>
                        <ChevronRight className="w-3 h-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                    {cat.subcategories.length > 5 && (
                      <button
                        onClick={() => {
                          onSelectCategory(cat);
                          onClose();
                        }}
                        className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 pt-0.5 pl-1.5"
                      >
                        +{cat.subcategories.length - 5} more options...
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing {filteredCategories.length} categories across Electronics, Appliances, Finance & Everyday Essentials
          </span>
          <span className="font-mono text-[11px] text-zinc-400">
            press ESC to close
          </span>
        </div>
      </div>
    </div>
  );
};
