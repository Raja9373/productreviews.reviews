import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

interface RelatedResearchProps {
  currentQuery: string;
  onSelectCategory: (query: string) => void;
}

interface CategorySuggestion {
  title: string;
  query: string;
  description: string;
  tag: string;
}

export const RelatedResearch: React.FC<RelatedResearchProps> = ({ currentQuery, onSelectCategory }) => {
  const lower = currentQuery.toLowerCase();

  // Determine domain-specific suggestions based on current query keywords
  let suggestions: CategorySuggestion[] = [];

  if (lower.includes('phone') || lower.includes('mobile') || lower.includes('iphone') || lower.includes('samsung') || lower.includes('oneplus')) {
    suggestions = [
      { title: 'Best Noise-Cancelling Earbuds', query: 'Best noise cancelling earbuds', description: 'Compare top TWS earbuds with LDAC, ANC, and marathon battery life.', tag: 'AUDIO' },
      { title: 'Best Power Banks & Chargers', query: 'Best fast charger power bank', description: 'Tested GaN chargers and fast power banks for daily mobile use.', tag: 'ACCESSORIES' },
      { title: 'Best Smartwatches & Trackers', query: 'Best smartwatch', description: 'Fitness trackers and smartwatches reviewed for battery and health tracking.', tag: 'WEARABLES' },
      { title: 'Best Laptops for Productivity', query: 'Best laptops', description: 'Lightweight work and student laptops with 15+ hour battery endurance.', tag: 'COMPUTING' },
    ];
  } else if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('dell') || lower.includes('asus') || lower.includes('computer')) {
    suggestions = [
      { title: 'Best External Monitors', query: 'Best 4K monitor for programming', description: 'Color-accurate USB-C displays for office work, coding, and design.', tag: 'COMPUTING' },
      { title: 'Best Wireless Keyboards & Mice', query: 'Best ergonomic mechanical keyboard', description: 'Ergonomic typing gear and precision mice for long work sessions.', tag: 'ACCESSORIES' },
      { title: 'Best Noise-Cancelling Earbuds', query: 'Best noise cancelling earbuds', description: 'Focus in noisy offices with industry-leading active noise cancellation.', tag: 'AUDIO' },
      { title: 'Best Backpacks & Sleeves', query: 'Best laptop backpack', description: 'Water-resistant, padded everyday carry gear for tech commuters.', tag: 'GEAR' },
    ];
  } else if (lower.includes('tv') || lower.includes('television') || lower.includes('oled') || lower.includes('qled')) {
    suggestions = [
      { title: 'Best Soundbars & Atmos Systems', query: 'Best Dolby Atmos soundbar', description: 'Immersive multi-channel soundbars to pair with your 4K television.', tag: 'HOME CINEMA' },
      { title: 'Best Streaming Devices', query: 'Best 4K streaming box', description: 'Fast 4K media streamers with Dolby Vision and voice remotes.', tag: 'STREAMING' },
      { title: 'Best Noise-Cancelling Earbuds', query: 'Best wireless earbuds', description: 'Enjoy late-night cinematic audio without waking the house.', tag: 'AUDIO' },
      { title: 'Best Smart Home Hubs', query: 'Best smart home hub', description: 'Lighting and automation gear for modern smart living rooms.', tag: 'SMART HOME' },
    ];
  } else if (lower.includes('ac') || lower.includes('conditioner') || lower.includes('air purifier') || lower.includes('air fryer') || lower.includes('home')) {
    suggestions = [
      { title: 'Best HEPA Air Purifiers', query: 'Best air purifier', description: 'Remove dust, smoke, and allergens for clean indoor air quality.', tag: 'HEALTH' },
      { title: 'Best Smart Thermostats', query: 'Best smart thermostat', description: 'Automate home climate control and reduce electricity bills.', tag: 'SMART HOME' },
      { title: 'Best Robotic Vacuum Cleaners', query: 'Best robot vacuum', description: 'Autonomous floor cleaning and mopping systems tested for pet hair.', tag: 'CLEANING' },
      { title: 'Best Coffee Makers', query: 'Best espresso machine', description: 'Countertop espresso and drip coffee makers for home baristas.', tag: 'KITCHEN' },
    ];
  } else {
    // Default universal tech & gear recommendations
    suggestions = [
      { title: 'Best Smartphones under ₹30,000 / $500', query: 'Best smartphone', description: 'Top-tested mobile phones combining battery, camera, and performance.', tag: 'MOBILE' },
      { title: 'Best Laptops for Students & Work', query: 'Best laptops', description: 'Everyday computing champions with long battery life.', tag: 'COMPUTING' },
      { title: 'Best Noise-Cancelling Earbuds', query: 'Best earbuds', description: 'Top wireless audio gear for travel and focus.', tag: 'AUDIO' },
      { title: 'Best Air Fryers & Kitchen Gear', query: 'Best air fryer', description: 'Countertop cooking appliances for healthy, easy meals.', tag: 'KITCHEN' },
    ];
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 pt-10 border-t border-zinc-200">
      <div className="flex items-center gap-2 mb-2 text-[#b80000]">
        <Compass className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-widest">Related Research & Guides</span>
      </div>
      <h3 className="text-2xl font-normal text-zinc-950 font-serif-wirecutter mb-6">
        Continue Exploring Tested Categories
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectCategory(item.query)}
            className="text-left bg-white p-5 border border-zinc-200 hover:border-zinc-400 rounded-sm shadow-2xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded">
                  {item.tag}
                </span>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#b80000] group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-base font-bold text-zinc-900 group-hover:text-[#b80000] transition-colors mb-1.5 font-serif-wirecutter">
                {item.title}
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
              <span>View expert tests & picks</span>
              <span>→</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
