import React from 'react';

interface AdSlotProps {
  id: string;
  type: 'leaderboard' | 'inArticle' | 'sidebar' | 'footerBanner';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ id, type, className = '' }) => {
  let sizeClasses = 'w-full h-[90px] max-w-[728px]';
  let slotDimensionText = '728 × 90 Leaderboard';

  if (type === 'inArticle') {
    sizeClasses = 'w-full max-w-[336px] h-[280px] sm:w-[336px]';
    slotDimensionText = '336 × 280 In-Article Ad';
  } else if (type === 'sidebar') {
    sizeClasses = 'w-full max-w-[300px] h-[250px] sm:w-[300px]';
    slotDimensionText = '300 × 250 Sidebar Rectangle';
  } else if (type === 'footerBanner') {
    sizeClasses = 'w-full max-w-4xl h-[90px]';
    slotDimensionText = 'Responsive Anchor Ad Banner';
  }

  return (
    <div
      id={`ad-container-${id}`}
      className={`my-6 flex flex-col items-center justify-center ${className}`}
    >
      <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 select-none">
        Advertisement
      </div>
      <div
        id={id}
        className={`${sizeClasses} border border-dashed border-zinc-200 bg-zinc-50/80 rounded-xl flex flex-col items-center justify-center p-4 text-center select-none transition-colors hover:bg-zinc-100/60`}
      >
        <div className="text-xs font-mono font-medium text-zinc-400">
          Google AdSense Ad Slot
        </div>
        <div className="text-[11px] font-mono text-zinc-300 mt-0.5">
          {slotDimensionText}
        </div>
      </div>
    </div>
  );
};
