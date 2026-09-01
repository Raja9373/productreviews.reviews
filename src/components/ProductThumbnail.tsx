import React, { useState } from 'react';
import { resolveProductImage } from '../utils/productImageRegistry';
import { ShieldCheck } from 'lucide-react';

interface ProductThumbnailProps {
  product: {
    id?: string;
    name: string;
    category?: string;
    modelNumber?: string;
    image?: string;
    verifiedImageUrl?: string;
  };
  alt?: string;
  className?: string;
  imageClassName?: string;
  showInitialsLabel?: boolean;
}

/**
 * Universal Bullet-proof Product Thumbnail Component
 * 
 * Implements:
 * 1. Centralized registry lookup & validation check
 * 2. Cross-category anti-hallucination rejection
 * 3. Grey Box with Product Initials ("WB", "AC", "WM") if no verified real image exists
 * 4. NEVER renders wrong category photos or AI generated guesses
 */
export const ProductThumbnail: React.FC<ProductThumbnailProps> = ({
  product,
  alt,
  className = '',
  imageClassName = '',
  showInitialsLabel = true,
}) => {
  const [hasError, setHasError] = useState(false);

  const { imageUrl, initials, isSyncing } = resolveProductImage(product);

  const isShowImage = imageUrl && !hasError && !isSyncing;

  if (isShowImage) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
        <img
          src={imageUrl}
          alt={alt || product.name}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`w-full h-full object-contain transition-transform duration-300 ${imageClassName}`}
        />
      </div>
    );
  }

  // Grey Box with Product Initials (e.g. "WB" for Water Bottle, "AC" for Alarm Clock)
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-700 select-none p-3 border border-zinc-200/80 rounded-lg ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-zinc-300/80 flex items-center justify-center mb-2">
        <span className="text-xl font-bold tracking-wider text-zinc-800 font-mono">
          {initials}
        </span>
      </div>

      {showInitialsLabel && (
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
            Image Syncing...
          </span>
          <span className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1 max-w-[140px]">
            Verified SKU: {product.modelNumber || initials}
          </span>
        </div>
      )}
    </div>
  );
};
