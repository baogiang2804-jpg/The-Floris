import React, { useState } from 'react';
import {
  Download,
  Check,
  Copy,
  FileSpreadsheet,
  Droplets,
  Calculator,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Sparkles,
  Beaker,
} from 'lucide-react';
import { CalculatedIngredient } from '../utils/perfumeCalculations';
import { FLORIS_IMAGES } from '../data/perfumeData';
import { InteractivePerfumeBottle } from './InteractivePerfumeBottle';

interface FormulaTableAndCsvProps {
  ingredients: CalculatedIngredient[];
  totalVolume: number;
  concentrationName: string;
  seasonLabel: string;
  tierTotals: { top: number; heart: number; base: number };
  onExportCsv: () => void;
  isValidTotal: boolean;
}

// Danh mục các mốc quy đổi thông dụng trong thực nghiệm nước hoa 10 mL
const COMMON_DROP_LOOKUP = [
  { ml: 0.05, drops: 1, label: 'Đơn vị tối thiểu (1 giọt chuẩn)', note: 'Định mức 1 giọt pipette' },
  { ml: 0.10, drops: 2, label: '0,10 mL', note: 'Vi chỉnh nốt hương' },
  { ml: 0.15, drops: 3, label: '0,15 mL', note: 'Vi chỉnh nốt hương' },
  { ml: 0.20, drops: 4, label: '0,20 mL (4 giọt)', note: 'Nốt Đào 🍑 (Mẫu chuẩn)' },
  { ml: 0.25, drops: 5, label: '0,25 mL (5 giọt)', note: 'Hoa Nhài 🌼 / Vanilla 🍦' },
  { ml: 0.30, drops: 6, label: '0,30 mL (6 giọt)', note: 'Xạ hương trắng 🤍' },
  { ml: 0.50, drops: 10, label: '0,50 mL (10 giọt)', note: 'Nửa mililít' },
  { ml: 1.00, drops: 20, label: '1,00 mL (20 giọt)', note: 'Tổng 10% cốt hương (Mẫu A)' },
  { ml: 2.00, drops: 40, label: '2,00 mL (40 giọt)', note: 'Tổng 20% cốt hương (Mẫu B/C)' },
  { ml: 8.00, drops: 160, label: '8,00 mL (160 giọt)', note: 'Ethanol 90% (Mẫu A)' },
  { ml: 9.00, drops: 180, label: '9,00 mL (180 giọt)', note: 'Tổng dung môi (Mẫu A)' },
  { ml: 10.00, drops: 200, label: '10,00 mL (200 giọt)', note: 'Dung tích chai thành phẩm' },
];

export const FormulaTableAndCsv: React.FC<FormulaTableAndCsvProps> = ({
  ingredients,
  totalVolume,
  concentrationName,
  seasonLabel,
  tierTotals,
  onExportCsv,
  isValidTotal,
}) => {
  const [copied, setCopied] = useState(false);
  const [showLookup, setShowLookup] = useState(true);
  const [inputMl, setInputMl] = useState<string>('0.25');
  const [inputDrops, setInputDrops] = useState<string>('5');
  const [selectedBottle, setSelectedBottle] = useState<'sampleA' | 'sampleC' | 'sampleB'>('sampleA');

  const bottleDetails = {
    sampleA: {
      title: 'Mẫu A (Công thức gốc 10%)',
      subtitle: '20 giọt cốt hương + 180 giọt dung môi',
      img: FLORIS_IMAGES.sampleA,
      badge: 'Mẫu A Chuẩn',
      desc: 'Ảnh chụp sản phẩm thực tế chai xịt thủy tinh 10 mL sau 72h ủ maceration.',
    },
    sampleC: {
      title: 'Mẫu C (Dịu/Ngọt 20%)',
      subtitle: '40 giọt cốt hương + 160 giọt dung môi',
      img: FLORIS_IMAGES.sampleC,
      badge: 'Mẫu C Thực Nghiệm',
      desc: 'Ảnh chụp mẫu thực nghiệm C tăng tỉ lệ Xạ hương trắng & Vanilla.',
    },
    sampleB: {
      title: 'Chai Chiết 10 mL',
      subtitle: 'Vỏ chai thủy tinh nắp bạc',
      img: FLORIS_IMAGES.sampleB,
      badge: 'Chuẩn Bị Dụng Cụ',
      desc: 'Chai xịt thon dài 10 mL tiêu chuẩn dùng để hoàn thiện sản phẩm.',
    },
  };

  const currentBottle = bottleDetails[selectedBottle];

  const handleCopyText = () => {
    const textSummary = `🧪 CÔNG THỨC NƯỚC HOA (${seasonLabel}) - ${totalVolume} mL
Nồng độ: ${concentrationName}
Phân bổ tầng: Đầu ${tierTotals.top}% | Giữa ${tierTotals.heart}% | Cuối ${tierTotals.base}%

CHI TIẾT NGUYÊN LIỆU:
${ingredients
  .map(
    (ing, i) =>
      `${i + 1}. [${ing.tierLabel}] ${ing.name} (${ing.scentFamily}): ${ing.percentage}% = ${ing.volumeMl} mL (~${ing.drops} giọt)`
  )
  .join('\n')}

Được xuất từ Floris (Quy chuẩn 1 giọt = 0,05 mL)`;

    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMlChange = (valStr: string) => {
    setInputMl(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && num >= 0) {
      setInputDrops(Math.round(num / 0.05).toString());
    } else {
      setInputDrops('');
    }
  };

  const handleDropsChange = (valStr: string) => {
    setInputDrops(valStr);
    const num = parseInt(valStr, 10);
    if (!isNaN(num) && num >= 0) {
      setInputMl((num * 0.05).toFixed(2));
    } else {
      setInputMl('');
    }
  };

  const [rightPanelMode, setRightPanelMode] = useState<'3d_bottle' | 'lab_photo'>('3d_bottle');

  return (
    <div className="bg-white/95 border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(251,207,232,0.18)] backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100/70 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
            🌸 Bước 5: Bảng Định Lượng & Trực Quan Hóa
          </span>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mt-1">
            <FileSpreadsheet className="w-5 h-5 text-pink-500" />
            Bảng Công Thức Chi Tiết & Chai Nước Hoa Mùa Xuân
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowLookup((prev) => !prev)}
            type="button"
            className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200 transition-all flex items-center gap-1.5 font-medium"
            title="Mở hoặc thu gọn bảng tra cứu nhanh số giọt"
          >
            <Droplets className="w-3.5 h-3.5 text-emerald-500" />
            <span>{showLookup ? 'Thu gọn tra cứu' : 'Tra cứu số giọt'}</span>
            {showLookup ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleCopyText}
            type="button"
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Sao chép tóm tắt</span>
              </>
            )}
          </button>

          <button
            onClick={onExportCsv}
            type="button"
            className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
              isValidTotal
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-200 active:scale-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
            disabled={!isValidTotal}
            title={!isValidTotal ? 'Cần cân bằng tổng đạt 100% trước khi xuất CSV' : 'Tải file CSV'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Bảng CSV (Excel)</span>
          </button>
        </div>
      </div>

      {/* Grid: Formula Table (Trái) & Bottle Showcase / Interactive 3D (Phải) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Table view */}
        <div className="lg:col-span-8 xl:col-span-8 overflow-x-auto rounded-2xl border border-pink-100 bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-gradient-to-r from-pink-50/90 to-emerald-50/80 text-slate-800 font-semibold text-[11px] uppercase border-b border-pink-100">
              <tr>
                <th className="py-3 px-3 font-mono text-slate-600">STT</th>
                <th className="py-3 px-3">Tầng Hương</th>
                <th className="py-3 px-3">Tên Nguyên Liệu & Khoa Học</th>
                <th className="py-3 px-3">Nhóm Hương</th>
                <th className="py-3 px-3 text-right">Tỉ Lệ (%)</th>
                <th className="py-3 px-3 text-right">Thể Tích (mL)</th>
                <th className="py-3 px-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/80">
                  Số Giọt (0,05 mL)
                </th>
                <th className="py-3 px-3 text-right">IFRA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {ingredients.map((ing, idx) => {
                const tierBadgeClass =
                  ing.tier === 'top'
                    ? 'bg-pink-50 text-pink-700 border-pink-200'
                    : ing.tier === 'heart'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <tr key={ing.slotKey} className="hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500 font-semibold">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tierBadgeClass}`}>
                        {ing.tierLabel}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">{ing.name}</p>
                      <p className="text-[11px] text-slate-500 italic">{ing.scientificName}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100 text-[11px]">
                        {ing.scentFamily}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-pink-600">
                      {ing.percentage}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                      {ing.volumeMl} mL
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 bg-emerald-50/40">
                      {ing.drops} giọt
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500 text-[11px]">
                      ≤ {ing.ifraMaxPercent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gradient-to-r from-pink-50/60 to-emerald-50/60 font-semibold border-t-2 border-pink-100 text-slate-800">
              <tr>
                <td colSpan={4} className="py-3.5 px-3 text-slate-700 font-bold">
                  🌸 TỔNG CỘNG ({totalVolume} mL)
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-pink-600">
                  {ingredients.reduce((a, b) => a + b.percentage, 0)}%
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">
                  {ingredients.reduce((a, b) => a + b.volumeMl, 0).toFixed(2)} mL
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-700 bg-emerald-100/40">
                  {ingredients.reduce((a, b) => a + b.drops, 0)} giọt
                </td>
                <td className="py-3.5 px-3 text-right text-emerald-700 font-semibold text-[11px]">
                  ✓ Chuẩn IFRA
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* CỘT PHẢI: CHAI NƯỚC HOA 3D TƯƠNG TÁC HOẶC ẢNH MẪU THỰC TẾ */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-3">
          {/* Tabs chuyển đổi giữa Chai 3D và Ảnh Lab */}
          <div className="flex items-center gap-1 p-1 bg-pink-50/80 rounded-2xl border border-pink-100 text-xs">
            <button
              type="button"
              onClick={() => setRightPanelMode('3d_bottle')}
              className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightPanelMode === '3d_bottle'
                  ? 'bg-white text-pink-700 shadow-sm'
                  : 'text-slate-600 hover:text-pink-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Chai Đồ Họa 3D</span>
            </button>
            <button
              type="button"
              onClick={() => setRightPanelMode('lab_photo')}
              className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightPanelMode === 'lab_photo'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Beaker className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ảnh Mẫu Lab</span>
            </button>
          </div>

          {rightPanelMode === '3d_bottle' ? (
            <InteractivePerfumeBottle
              ingredients={ingredients}
              totalVolume={totalVolume}
              concentrationPercent={18}
              tierTotals={tierTotals}
            />
          ) : (
            <div className="bg-white border border-pink-100 rounded-3xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-1.5">
                  <Beaker className="w-3.5 h-3.5 text-emerald-600" />
                  Mẫu Thực Tế Phòng Lab
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {currentBottle.badge}
                </span>
              </div>

              {/* Bộ chọn mẫu nhanh */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedBottle('sampleA')}
                  className={`py-1 rounded-lg font-semibold transition-all ${
                    selectedBottle === 'sampleA'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mẫu A
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBottle('sampleC')}
                  className={`py-1 rounded-lg font-semibold transition-all ${
                    selectedBottle === 'sampleC'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mẫu C
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBottle('sampleB')}
                  className={`py-1 rounded-lg font-semibold transition-all ${
                    selectedBottle === 'sampleB'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Chai Chiết
                </button>
              </div>

              {/* Container ảnh thực tế */}
              <div className="relative rounded-2xl overflow-hidden border border-pink-100 bg-slate-50 aspect-[3/4] max-h-64 flex items-center justify-center group shadow-inner">
                <img
                  src={currentBottle.img}
                  alt={currentBottle.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-3">
                  <p className="text-xs font-bold text-white drop-shadow">
                    {currentBottle.title}
                  </p>
                  <p className="text-[11px] text-pink-200 font-medium drop-shadow">
                    {currentBottle.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {currentBottle.desc}
              </p>

              {/* Nghệ thuật 4 nốt hương mini */}
              <div className="pt-2 border-t border-pink-100 flex items-center gap-2.5 bg-pink-50/50 p-2.5 rounded-2xl">
                <img
                  src={FLORIS_IMAGES.scentStillLife}
                  alt="4 Nốt hương Floris"
                  className="w-12 h-12 rounded-xl object-cover border border-pink-200 shrink-0"
                  loading="lazy"
                />
                <div className="text-[11px] text-slate-700 leading-tight">
                  <strong className="text-slate-800 block">4 Nốt Hương Floris:</strong>
                  <span className="text-pink-600 font-medium">Nhài 🌼 • Đào 🍑 • Xạ Hương 🤍 • Vanilla 🍦</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BẢNG TRA CỨU NHANH SỐ GIỌT (1 GIỌT = 0,05 mL) */}
      {showLookup && (
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/40 to-pink-50/30 p-4 space-y-4 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100/70 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100/60 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  Bảng Tra Cứu Nhanh: Quy Đổi Số Giọt Thao Tác Thủ Công
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                    1 giọt = 0,05 mL (20 giọt = 1,00 mL)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Phục vụ đong đếm trực tiếp bằng pipet / ống nhỏ giọt trong phòng thực hành nước hoa Floris
                </p>
              </div>
            </div>

            {/* Quy đổi nhanh tương tác */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-emerald-100 text-xs font-mono shadow-xs">
              <Calculator className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputMl}
                  onChange={(e) => handleMlChange(e.target.value)}
                  className="w-14 px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-800 font-bold text-right focus:outline-none focus:border-emerald-500"
                  placeholder="mL"
                />
                <span className="text-slate-600">mL</span>
              </div>
              <span className="text-slate-400 font-bold">=</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={inputDrops}
                  onChange={(e) => handleDropsChange(e.target.value)}
                  className="w-12 px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 font-bold text-right focus:outline-none focus:border-emerald-500"
                  placeholder="giọt"
                />
                <span className="text-slate-600 font-sans">giọt</span>
              </div>
            </div>
          </div>

          {/* Grid các mốc chuẩn thực nghiệm */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {COMMON_DROP_LOOKUP.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setInputMl(item.ml.toFixed(2));
                  setInputDrops(item.drops.toString());
                }}
                className="p-2.5 rounded-xl bg-white border border-pink-100/80 hover:border-emerald-400 hover:bg-emerald-50/30 cursor-pointer transition-all group flex flex-col justify-between shadow-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-slate-700 font-bold text-xs">{item.ml.toFixed(2)} mL</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full text-[11px] border border-emerald-200 group-hover:border-emerald-400">
                    {item.drops} giọt
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate group-hover:text-slate-700">
                  {item.note}
                </div>
              </div>
            ))}
          </div>

          {/* Ghi chú kỹ thuật phòng thí nghiệm & hình ảnh thao tác thực tế */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-[11px] text-slate-700 bg-white p-3 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <img
                src={FLORIS_IMAGES.verticalPipetteSolvent}
                alt="Thao tác nhỏ giọt vuông góc 90 độ"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover object-center border border-emerald-200 shrink-0 shadow-xs"
                loading="lazy"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Kỹ thuật nhỏ giọt chuẩn phòng lab (1 giọt = 0,05 mL):</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Giữ Pasteur pipet thẳng đứng góc 90° so với miệng cốc, bóp nhẹ nhàng và đều tay ở nhiệt độ phòng 25°C để sức căng bề mặt tạo thể tích giọt ổn định đúng 0,05 mL.
                </p>
              </div>
            </div>
            <div className="text-emerald-700 shrink-0 font-medium text-[11px] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Tổ 1 - 12A13 THPT NTMK
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
