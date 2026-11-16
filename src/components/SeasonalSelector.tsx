import React from 'react';
import { Flower2, Sun, CloudRain, Snowflake, Sparkles } from 'lucide-react';
import { SEASONAL_TEMPLATES } from '../data/perfumeData';

interface SeasonalSelectorProps {
  selectedSeason: 'spring' | 'summer' | 'autumn' | 'winter';
  onSelectSeason: (season: 'spring' | 'summer' | 'autumn' | 'winter') => void;
  onApplySeasonalTemplate: () => void;
}

export const SeasonalSelector: React.FC<SeasonalSelectorProps> = ({
  selectedSeason,
  onSelectSeason,
  onApplySeasonalTemplate,
}) => {
  const currentTemplate = SEASONAL_TEMPLATES[selectedSeason];

  const seasonsList = [
    {
      key: 'spring' as const,
      label: 'Mùa Xuân (Spring)',
      tag: 'Tươi mới • Hoa cỏ',
      icon: Flower2,
      color: 'from-pink-500/20 to-emerald-500/20 border-pink-500/40 text-pink-300',
      activeBorder: 'border-pink-500 shadow-pink-500/10',
      iconColor: 'text-pink-400',
    },
    {
      key: 'summer' as const,
      label: 'Mùa Hè (Summer)',
      tag: 'Sảng khoái • Cam chanh',
      icon: Sun,
      color: 'from-amber-500/20 to-cyan-500/20 border-amber-500/40 text-amber-300',
      activeBorder: 'border-amber-400 shadow-amber-500/10',
      iconColor: 'text-amber-400',
    },
    {
      key: 'autumn' as const,
      label: 'Mùa Thu (Autumn)',
      tag: 'Gỗ ấm • Hoài niệm',
      icon: CloudRain,
      color: 'from-orange-500/20 to-amber-700/20 border-orange-500/40 text-orange-300',
      activeBorder: 'border-orange-500 shadow-orange-500/10',
      iconColor: 'text-orange-400',
    },
    {
      key: 'winter' as const,
      label: 'Mùa Đông (Winter)',
      tag: 'Hổ phách • Gỗ quý',
      icon: Snowflake,
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300',
      activeBorder: 'border-blue-400 shadow-blue-500/10',
      iconColor: 'text-blue-400',
    },
  ];

  return (
    <div className="bg-white/95 border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(251,207,232,0.18)] backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 text-xs font-bold border border-pink-200">
            🌸 Bước 1: Khí Hậu & Mùi Hương
          </span>
          <h2 className="text-lg font-bold text-slate-800 mt-1" style={{ color: '#f7add7' }}>
            Chọn Mùa &amp; Định Hướng Nốt Hương
          </h2>
        </div>

        <button
          onClick={onApplySeasonalTemplate}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200 transition-all self-start sm:self-auto shadow-xs active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Tải mẫu {currentTemplate.title}</span>
        </button>
      </div>

      {/* Grid of Season Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        {seasonsList.map((item) => {
          const isSelected = selectedSeason === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectSeason(item.key)}
              className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-pink-50 via-white to-pink-50/50 border-pink-300 shadow-sm ring-2 ring-pink-200'
                  : 'bg-slate-50/60 border-slate-200 hover:border-pink-200 hover:bg-pink-50/30 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-pink-100 text-pink-600' : 'bg-white border border-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                    Đang chọn
                  </span>
                )}
              </div>

              <div>
                <p className={`font-bold text-sm ${isSelected ? 'text-pink-900' : 'text-slate-800'}`}>
                  {item.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{item.tag}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Seasonal guide snippet */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50/60 via-white to-emerald-50/60 border border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-700 leading-relaxed font-medium">
          <strong className="text-pink-600">{currentTemplate.title}:</strong>{' '}
          {currentTemplate.description}
        </p>

        <div className="flex items-center gap-2 font-mono shrink-0 text-[11px] text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-pink-100 shadow-xs">
          <span className="font-sans font-bold text-slate-600">Tỉ lệ vàng:</span>
          <span className="text-pink-600 font-bold">{currentTemplate.recommendedTiers.top}% Đầu</span>
          <span>•</span>
          <span className="text-emerald-600 font-bold">{currentTemplate.recommendedTiers.heart}% Giữa</span>
          <span>•</span>
          <span className="text-amber-600 font-bold">{currentTemplate.recommendedTiers.base}% Cuối</span>
        </div>
      </div>
    </div>
  );
};
