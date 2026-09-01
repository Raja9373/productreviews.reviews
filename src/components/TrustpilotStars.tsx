import React from 'react';
import { Star, ShieldCheck, Check } from 'lucide-react';

interface TrustpilotStarsProps {
  score: number; // 0 to 5 (e.g. 4.9)
  totalReviews?: number;
  showTextScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  statusText?: string;
  className?: string;
}

export const TrustpilotStars: React.FC<TrustpilotStarsProps> = ({
  score,
  totalReviews,
  showTextScore = true,
  size = 'md',
  statusText,
  className = '',
}) => {
  // Normalize score between 0 and 5
  const clampedScore = Math.max(0, Math.min(5, score));

  // Determine Trustpilot tier label (Excellent, Great, Average, etc.)
  const getRatingTier = (val: number) => {
    if (val >= 4.5) return 'Excellent';
    if (val >= 3.8) return 'Great';
    if (val >= 3.0) return 'Average';
    if (val >= 2.0) return 'Poor';
    return 'Bad';
  };

  const tier = statusText || getRatingTier(clampedScore);

  // Sizing definitions for Trustpilot square star blocks
  const boxSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-5 h-5';
  const starSize = size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';
  const gap = size === 'sm' ? 'gap-0.5' : 'gap-1';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* 5 Iconic Trustpilot Square Green Star Blocks */}
      <div className={`flex items-center ${gap}`} aria-label={`Rating: ${clampedScore.toFixed(1)} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const fillRatio = Math.max(0, Math.min(1, clampedScore - (starIndex - 1)));
          const isFull = fillRatio >= 0.75;
          const isHalf = fillRatio >= 0.25 && fillRatio < 0.75;

          return (
            <div
              key={starIndex}
              className={`${boxSize} flex items-center justify-center rounded-xs transition-colors select-none ${
                isFull
                  ? 'bg-[#00B67A]'
                  : isHalf
                  ? 'bg-gradient-to-r from-[#00B67A] 50% to-zinc-200 50%'
                  : 'bg-zinc-200'
              }`}
            >
              <Star
                className={`${starSize} fill-white text-white drop-shadow-2xs`}
                strokeWidth={2}
              />
            </div>
          );
        })}
      </div>

      {/* TrustScore & Review Count Text */}
      {showTextScore && (
        <div className={`flex items-center gap-1.5 ${textSize} text-zinc-700 font-medium`}>
          <span className="font-bold text-zinc-900">{clampedScore.toFixed(1)}</span>
          <span className="text-zinc-400">/ 5.0</span>
          <span className="text-zinc-300">•</span>
          <span className="font-semibold text-[#005128] bg-[#E8F8F2] px-1.5 py-0.5 rounded text-[11px]">
            {tier}
          </span>
          {totalReviews !== undefined && (
            <>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-500 font-normal">
                {totalReviews.toLocaleString()} verified reviews
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
