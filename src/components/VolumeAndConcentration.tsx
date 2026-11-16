import React from 'react';
import { Beaker, Droplets } from 'lucide-react';

interface VolumeAndConcentrationProps {
  totalVolume: number;
  onChangeVolume: (volume: number) => void;
  concentrationName: string;
  concentrationPercent: number;
  onChangeConcentration: (name: string, percent: number) => void;
  pureFragranceMl: number;
  carrierAlcoholMl: number;
}

const CONCENTRATIONS = [
  { name: 'Extrait de Parfum', percent: 25, desc: 'Đậm đặc nhất, lưu hương 10-14h+' },
  { name: 'Eau de Parfum (EDP)', percent: 18, desc: 'Tiêu chuẩn vàng phổ biến, lưu 6-8h' },
  { name: 'Eau de Toilette (EDT)', percent: 12, desc: 'Nhẹ nhàng thanh lịch, lưu 4-6h' },
  { name: 'Eau de Cologne (EDC)', percent: 6, desc: 'Tươi mát sảng khoái, lưu 2-3h' },
];

export const VolumeAndConcentration: React.FC<VolumeAndConcentrationProps> = ({
  totalVolume,
  onChangeVolume,
  concentrationName,
  concentrationPercent,
  onChangeConcentration,
  pureFragranceMl,
  carrierAlcoholMl,
}) => {
  const quickVolumes = [10, 30, 50, 100];
  const estimatedSprays = Math.round(totalVolume * 10); // standard atomizer ~0.1ml per spray

  return (
    <div className="bg-white/95 border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(251,207,232,0.18)] backdrop-blur-md">
      <div className="mb-4">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 text-xs font-bold border border-pink-200">
          🌸 Bước 2: Thể Tích &amp; Nồng Độ
        </span>
        <h2 className="text-lg font-bold text-slate-800 mt-1" style={{ color: '#f7add7' }}>
          Quy Chuẩn Pha Chế &amp; Dung Môi
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Volume selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Tổng Thể Tích Chai Thành Phẩm (mL):
          </label>

          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <input
                type="number"
                min={5}
                max={500}
                step={1}
                value={totalVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val > 0) onChangeVolume(val);
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-pink-200 rounded-2xl text-slate-800 font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:bg-white transition-all shadow-xs"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-pink-500">
                mL
              </span>
            </div>

            <div className="flex gap-1.5">
              {quickVolumes.map((vol) => (
                <button
                  key={vol}
                  type="button"
                  onClick={() => onChangeVolume(vol)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                    totalVolume === vol
                      ? 'bg-pink-100 border border-pink-300 text-pink-800 font-bold shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-pink-200'
                  }`}
                >
                  {vol}ml
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Ước tính khoảng <strong className="text-pink-600 font-mono font-bold">{estimatedSprays}</strong> lần xịt qua vòi phun sương (~0.1mL/nhát).
          </p>
        </div>

        {/* Right: Concentration */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Nồng Độ Cốt Hương (Concentration):
          </label>

          <select
            value={concentrationName}
            onChange={(e) => {
              const selected = CONCENTRATIONS.find((c) => c.name === e.target.value);
              if (selected) onChangeConcentration(selected.name, selected.percent);
            }}
            className="w-full px-4 py-2.5 bg-slate-50 border border-pink-200 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:bg-white mb-2 shadow-xs cursor-pointer"
          >
            {CONCENTRATIONS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.percent}% Tinh Dầu) - {c.desc}
              </option>
            ))}
          </select>

          {/* Real-time calculated breakdown card */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-pink-50/70 to-emerald-50/70 border border-pink-100 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Cốt hương ({concentrationPercent}%)</p>
                <p className="text-sm font-mono font-bold text-pink-700">
                  {pureFragranceMl} mL <span className="text-xs font-normal text-pink-600">({Math.round(pureFragranceMl * 20)} giọt)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                <Beaker className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Dung môi ({100 - concentrationPercent}%)</p>
                <p className="text-sm font-mono font-bold text-emerald-700">
                  {carrierAlcoholMl} mL <span className="text-xs font-normal text-emerald-600">({Math.round(carrierAlcoholMl * 20)} giọt)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
