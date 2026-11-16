import React, { useState } from 'react';
import { CalculatedIngredient } from '../utils/perfumeCalculations';
import { Sparkles, Droplets, Info } from 'lucide-react';

interface InteractivePerfumeBottleProps {
  ingredients: CalculatedIngredient[];
  totalVolume: number;
  concentrationPercent: number;
  tierTotals?: {
    top: number;
    heart: number;
    base: number;
  };
  bottleName?: string;
}

export const InteractivePerfumeBottle: React.FC<InteractivePerfumeBottleProps> = ({
  ingredients,
  totalVolume,
  concentrationPercent,
  tierTotals = { top: 30, heart: 45, base: 25 },
  bottleName = 'Floris Spring 🌸',
}) => {
  const [activeIngredient, setActiveIngredient] = useState<CalculatedIngredient | null>(null);

  // Group or map ingredients to color hues
  const getIngredientColor = (ing: CalculatedIngredient) => {
    if (ing.color) return ing.color;
    if (ing.tier === 'top') return '#FDE047'; // bright sunny citrus/spring
    if (ing.tier === 'heart') return '#F472B6'; // floral blossom pink
    return '#CA8A04'; // warm amber woody base
  };

  // Filter ingredients with percentage > 0
  const activeIngredients = ingredients.filter((ing) => ing.percentage > 0);

  // Total perfume oil % in bottle
  // Let's assume the bottle fill height is 160 units (from y=90 to y=250)
  const totalBottleHeight = 150;
  const liquidBaseY = 245;

  // Calculate cumulative layer positions from bottom (base) to top (top notes)
  // Ordered: base ingredients first at bottom, then heart, then top
  const orderedIngredients = [...activeIngredients].sort((a, b) => {
    const tierOrder = { base: 1, heart: 2, top: 3 };
    return (tierOrder[a.tier] || 0) - (tierOrder[b.tier] || 0);
  });

  let currentY = liquidBaseY;
  const layers = orderedIngredients.map((ing) => {
    // Proportional height based on percentage out of 100%
    const height = Math.max(8, (ing.percentage / 100) * totalBottleHeight);
    const y = currentY - height;
    currentY = y;
    return {
      ingredient: ing,
      y,
      height,
      color: getIngredientColor(ing),
    };
  });

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 border border-pink-100 shadow-[0_8px_30px_rgb(251,207,232,0.2)] flex flex-col items-center">
      {/* Title & Spring Badge */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-pink-50 text-pink-600 border border-pink-100">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Chai Nước Hoa 3D Minh Họa</h3>
            <p className="text-[11px] text-slate-500 font-medium">Trực quan hóa phân tầng tinh dầu</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100 flex items-center gap-1">
          <Droplets className="w-3 h-3 text-emerald-500" />
          {totalVolume} mL ({concentrationPercent}% EDP)
        </span>
      </div>

      {/* Interactive Bottle SVG Container */}
      <div className="relative w-full flex items-center justify-center py-2">
        {/* Background Spring Blossom Decor */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-48 h-48 text-pink-200">
            <circle cx="100" cy="100" r="70" fill="currentColor" fillOpacity="0.25" />
          </svg>
        </div>

        <svg
          viewBox="0 0 220 300"
          className="w-44 h-60 drop-shadow-lg select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Glass reflections */}
            <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>

            {/* Spray Cap Gold Gradient */}
            <linearGradient id="goldSprayer" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            {/* Bottle Clip Path for Liquid Layers */}
            <clipPath id="bottleInnerArea">
              <rect x="42" y="92" width="136" height="156" rx="22" />
            </clipPath>
          </defs>

          {/* Spray Nozzle & Cap */}
          <rect x="100" y="24" width="20" height="26" rx="4" fill="url(#goldSprayer)" stroke="#B45309" strokeWidth="1" />
          {/* Nozzle hole */}
          <circle cx="104" cy="34" r="2.5" fill="#78350F" />
          {/* Atomizer ring */}
          <rect x="94" y="50" width="32" height="12" rx="3" fill="url(#goldSprayer)" stroke="#B45309" strokeWidth="1" />
          {/* Glass neck */}
          <rect x="88" y="62" width="44" height="28" rx="6" fill="#F8FAFC" fillOpacity="0.7" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Internal spray tube */}
          <line x1="110" y1="46" x2="110" y2="242" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" strokeDasharray="3 2" />

          {/* Liquid Layers inside bottle (Clipped) */}
          <g clipPath="url(#bottleInnerArea)">
            {/* Ethanol carrier background liquid (very soft warm gold-rose) */}
            <rect x="42" y="92" width="136" height="156" fill="#FFFBEB" fillOpacity="0.85" />

            {/* Shimmer liquid layers for each perfume ingredient */}
            {layers.map((layer, idx) => {
              const isHovered = activeIngredient?.id === layer.ingredient.id;
              return (
                <g
                  key={`${layer.ingredient.id}-${idx}`}
                  className="cursor-pointer transition-opacity duration-200"
                  onMouseEnter={() => setActiveIngredient(layer.ingredient)}
                  onMouseLeave={() => setActiveIngredient(null)}
                  onClick={() => setActiveIngredient(layer.ingredient)}
                >
                  <rect
                    x="42"
                    y={layer.y}
                    width="136"
                    height={layer.height}
                    fill={layer.color}
                    fillOpacity={isHovered ? 0.95 : 0.72}
                    className="transition-all duration-300"
                  />
                  {/* Subtle wave separator */}
                  <line
                    x1="42"
                    y1={layer.y}
                    x2="178"
                    y2={layer.y}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                  />
                </g>
              );
            })}
          </g>

          {/* Outer Crystal Glass Bottle Body */}
          <rect
            x="40"
            y="90"
            width="140"
            height="160"
            rx="24"
            fill="url(#glassReflection)"
            stroke="#FBCFE8"
            strokeWidth="3.5"
          />

          {/* Elegant Front Label */}
          <rect
            x="64"
            y="135"
            width="92"
            height="58"
            rx="8"
            fill="#FFFFFF"
            fillOpacity="0.92"
            stroke="#F472B6"
            strokeWidth="1"
            className="drop-shadow-sm"
          />
          <text
            x="110"
            y="152"
            textAnchor="middle"
            fill="#831843"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="1.5"
            fontFamily="Quicksand, sans-serif"
          >
            FLORIS
          </text>
          <text
            x="110"
            y="164"
            textAnchor="middle"
            fill="#DB2777"
            fontSize="7"
            fontWeight="600"
            letterSpacing="1"
            fontFamily="Quicksand, sans-serif"
          >
            SPRING ATELIER
          </text>
          <line x1="80" y1="170" x2="140" y2="170" stroke="#FCE7F3" strokeWidth="1" />
          <text
            x="110"
            y="180"
            textAnchor="middle"
            fill="#64748B"
            fontSize="7"
            fontWeight="500"
          >
            10 mL • EDP {concentrationPercent}%
          </text>
          <circle cx="110" cy="186" r="1.5" fill="#F472B6" />
        </svg>
      </div>

      {/* Active Layer Tooltip / Legend */}
      <div className="w-full mt-2 pt-2 border-t border-pink-100 min-h-[46px] flex items-center justify-between text-xs">
        {activeIngredient ? (
          <div className="flex items-center gap-2 w-full animate-fadeIn">
            <span
              className="w-3 h-3 rounded-full shrink-0 border border-white shadow-sm"
              style={{ backgroundColor: getIngredientColor(activeIngredient) }}
            />
            <div className="flex-1 truncate">
              <span className="font-bold text-slate-800">{activeIngredient.name}</span>
              <span className="text-slate-500 text-[11px] ml-1.5 font-medium">
                ({activeIngredient.tierLabel} • {activeIngredient.percentage}%)
              </span>
            </div>
            <span className="font-bold text-pink-600 shrink-0">
              {activeIngredient.drops} giọt ({activeIngredient.volumeMl} mL)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-500 w-full justify-center text-[11px]">
            <Info className="w-3.5 h-3.5 text-pink-400" />
            <span>Chạm hoặc rê chuột vào các tầng màu để xem chi tiết</span>
          </div>
        )}
      </div>

      {/* Pyramid Tier Mini Proportions Bar */}
      <div className="w-full mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="bg-pink-50/80 rounded-xl p-1.5 border border-pink-100">
          <span className="text-pink-500 font-semibold block">🌸 Hương Đầu</span>
          <span className="font-bold text-slate-700">{tierTotals.top}%</span>
        </div>
        <div className="bg-emerald-50/80 rounded-xl p-1.5 border border-emerald-100">
          <span className="text-emerald-600 font-semibold block">🌿 Hương Giữa</span>
          <span className="font-bold text-slate-700">{tierTotals.heart}%</span>
        </div>
        <div className="bg-amber-50/80 rounded-xl p-1.5 border border-amber-100">
          <span className="text-amber-600 font-semibold block">🪵 Hương Cuối</span>
          <span className="font-bold text-slate-700">{tierTotals.base}%</span>
        </div>
      </div>
    </div>
  );
};
