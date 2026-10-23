import React, { useState, useEffect, useRef } from "react";
import { Search, X, Package, Tag, ArrowRight } from "lucide-react";
import { contentRepository, ReviewRecord } from "../../content/store/contentRepository";

interface GlobalSearchBarProps {
  onSelectProduct: (record: ReviewRecord) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ onSelectProduct }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReviewRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = contentRepository.search(query);
      setResults(filtered.slice(0, 6)); // Limit to 6 results for the dropdown
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (record: ReviewRecord) => {
    onSelectProduct(record);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md hidden sm:block">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-amber-600 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search reviews, brands, or categories..."
          className="w-full bg-stone-100 border border-stone-200 rounded-xl py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-stone-200 rounded-md text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="p-2 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-stone-400 px-2 tracking-widest">
              {results.length > 0 ? `Found ${results.length} results` : "No matches found"}
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {results.length > 0 ? (
              results.map((record) => (
                <button
                  key={record.slug}
                  onClick={() => handleSelect(record)}
                  className="w-full p-3 text-left hover:bg-amber-50 transition-colors group border-b border-stone-50 last:border-none flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-stone-900 text-sm truncate">
                        {record.name}
                      </span>
                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-stone-100 rounded text-[9px] font-bold text-stone-500 uppercase tracking-tighter">
                        <Tag className="w-2 h-2" /> {record.category}
                      </div>
                    </div>
                    <p className="text-xs text-stone-500 truncate leading-relaxed">
                      {record.brand} • {record.summary}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-stone-300" />
                </div>
                <p className="text-sm font-medium text-stone-900 mb-1">No results for "{query}"</p>
                <p className="text-xs text-stone-500">Try searching for a brand like "Apple" or category like "Audio".</p>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center">
              <p className="text-[10px] text-stone-400 italic">
                Press Enter to see all results
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
