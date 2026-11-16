import React from 'react';
import {
  FlaskConical,
  AlertTriangle,
  Bookmark,
  BookOpen,
  Mic,
} from 'lucide-react';

interface HeaderProps {
  isValidTotal: boolean;
  totalPercentage: number;
  savedCount: number;
  activePage: 'main' | 'experimental' | 'csv' | 'ai' | 'python';
  onChangePage: (page: 'main' | 'experimental' | 'csv' | 'ai' | 'python') => void;
  onOpenSavedFormulas: () => void;
  onQuickSave: () => void;
  onOpenPythonCode: () => void;
  onExportCsv: () => void;
  onAutoBalance: () => void;
  onOpenGuide: () => void;
  onOpenVoiceWidget: () => void;
  onOpenExperimentalPopup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isValidTotal,
  totalPercentage,
  savedCount,
  activePage,
  onChangePage,
  onOpenSavedFormulas,
  onAutoBalance,
  onOpenGuide,
  onOpenVoiceWidget,
  onOpenExperimentalPopup,
}) => {
  return (
    <header className="border-b border-pink-100/80 bg-white/85 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-8 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3.5">
        {/* Zone 1: Brand wordmark with spring emblem */}
        <button
          type="button"
          onClick={() => onChangePage('main')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="relative">
            <img
              src={import.meta.env.BASE_URL + 'assets/aistudio/image_404d5511.png'}
              alt="Floris Official Emblem"
              className="w-10 h-10 rounded-full object-cover border-2 border-pink-200 shadow-xs group-hover:scale-105 transition-transform bg-white"
              loading="lazy"
            />
            <span className="absolute -bottom-1 -right-1 text-xs">🌸</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-emerald-600 bg-clip-text text-transparent tracking-tight">
              Floris
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline font-medium">
              · Mùa Xuân · 12A13 THPT NTMK
            </span>
          </div>
        </button>

        {/* Zone 2: Clean spring navigation tabs (Desktop & Tablet) */}
        <nav
          aria-label="Điều hướng"
          className="hidden md:flex items-center gap-1 p-1 bg-pink-50/70 rounded-full border border-pink-100/90 overflow-x-auto shadow-xs"
        >
          <button
            type="button"
            onClick={() => onChangePage('main')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activePage === 'main'
                ? 'bg-white text-pink-700 shadow-xs'
                : 'text-slate-600 hover:text-pink-600'
            }`}
          >
            Trang chính
          </button>

          <button
            type="button"
            onClick={() => onChangePage('experimental')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activePage === 'experimental'
                ? 'bg-white text-pink-700 shadow-xs'
                : 'text-slate-600 hover:text-pink-600'
            }`}
          >
            Thực nghiệm
          </button>

          <button
            type="button"
            onClick={() => onChangePage('csv')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activePage === 'csv'
                ? 'bg-white text-pink-700 shadow-xs'
                : 'text-slate-600 hover:text-pink-600'
            }`}
          >
            Bảng tính & CSV
          </button>

          <button
            type="button"
            onClick={() => onChangePage('ai')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activePage === 'ai'
                ? 'bg-white text-pink-700 shadow-xs'
                : 'text-slate-600 hover:text-pink-600'
            }`}
          >
            Tư vấn AI
          </button>

          <button
            type="button"
            onClick={() => onChangePage('python')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activePage === 'python'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-300'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>App Python</span>
          </button>
        </nav>

        {/* Zone 3: Concise utility actions & Gemini Live Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          {!isValidTotal && (
            <button
              onClick={onAutoBalance}
              type="button"
              className="text-xs px-2.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors flex items-center gap-1.5 font-bold whitespace-nowrap"
              title="Tự động cân bằng tổng tỉ lệ về 100%"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{totalPercentage}%</span>
              <span className="hidden sm:inline">· Cân bằng</span>
            </button>
          )}

          {/* Gemini Live Voice Button */}
          <button
            onClick={onOpenVoiceWidget}
            type="button"
            className="text-xs px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ring-2 ring-pink-200 active:scale-95 group"
            title="Mở trợ lý giọng nói Gemini Live để nhận diện và tinh chỉnh hương trực tiếp"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <Mic className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Gemini Live</span>
          </button>

          <button
            onClick={onOpenExperimentalPopup}
            type="button"
            className="hidden sm:flex text-xs px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 transition-colors items-center gap-1.5 font-semibold whitespace-nowrap shadow-xs"
            title="Mở cửa sổ pop-up xem nhanh phiếu thực hành"
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
            <span>Phiếu thực hành</span>
          </button>

          <button
            onClick={onOpenSavedFormulas}
            type="button"
            className="hidden sm:flex text-xs px-2.5 py-1.5 rounded-full bg-white hover:bg-pink-50 text-slate-700 border border-pink-200 transition-colors items-center gap-1.5 whitespace-nowrap shadow-xs font-semibold"
            title="Danh sách công thức đã lưu & so sánh song song"
          >
            <Bookmark className="w-3.5 h-3.5 text-pink-500" />
            <span>Đã lưu</span>
            <span className="font-mono text-pink-700">({savedCount})</span>
          </button>

          <button
            onClick={onOpenGuide}
            type="button"
            className="text-xs px-2.5 py-1.5 rounded-full bg-white hover:bg-pink-50 text-slate-700 border border-pink-200 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs font-medium"
            title="Xem hướng dẫn sử dụng"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Hướng dẫn</span>
          </button>
        </div>
      </div>
    </header>
  );
};
