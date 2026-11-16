import React, { useState } from 'react';
import { Flower2, EyeOff } from 'lucide-react';

interface SpringPetalData {
  id: number;
  left: number; // percentage 0 - 100
  duration: number; // seconds
  delay: number; // seconds
  size: number; // px
  rotation: number; // initial rotation
  color: string;
  type: 'blossom' | 'petal' | 'leaf';
}

interface SpringPetalsProps {
  defaultEnabled?: boolean;
}

export const SpringPetals: React.FC<SpringPetalsProps> = ({ defaultEnabled = true }) => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('floris_spring_petals_enabled');
      return saved !== null ? JSON.parse(saved) : defaultEnabled;
    } catch {
      return defaultEnabled;
    }
  });

  const togglePetals = () => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('floris_spring_petals_enabled', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Generate 18 gentle spring petals
  const petals: SpringPetalData[] = React.useMemo(() => {
    const colors = [
      '#FBCFE8', // sakura light pink
      '#F472B6', // cherry blossom medium
      '#FDA4AF', // rose bud
      '#FDF2F8', // sheer petal
      '#BBF7D0', // young sprout leaf
      '#FDE047', // butter pollen
    ];

    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.floor((i * 5.6 + Math.random() * 4) % 96),
      duration: 10 + Math.random() * 10, // 10s - 20s for graceful slow floating
      delay: Math.random() * 8,
      size: 14 + Math.random() * 12, // 14px - 26px
      rotation: Math.floor(Math.random() * 360),
      color: colors[i % colors.length],
      type: i % 5 === 0 ? 'leaf' : i % 3 === 0 ? 'blossom' : 'petal',
    }));
  }, []);

  return (
    <>
      {/* Floating Petals Canvas */}
      {enabled && (
        <div
          className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
          aria-hidden="true"
        >
          {petals.map((petal) => (
            <div
              key={petal.id}
              className="animate-petal-fall opacity-75"
              style={{
                left: `${petal.left}%`,
                animationDuration: `${petal.duration}s`,
                animationDelay: `${petal.delay}s`,
                width: `${petal.size}px`,
                height: `${petal.size}px`,
              }}
            >
              {petal.type === 'blossom' ? (
                // 5-petal cherry blossom flower
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-full h-full drop-shadow-[0_2px_4px_rgba(244,114,182,0.2)]"
                  style={{ transform: `rotate(${petal.rotation}deg)` }}
                >
                  <circle cx="12" cy="12" r="2.5" fill="#FDE047" />
                  <path
                    d="M12 2C13.5 5 15.5 6 18 5C17 7.5 18 9.5 21 11C18 12.5 17 14.5 18 17C15.5 16 13.5 17 12 20C10.5 17 8.5 16 6 17C7 14.5 6 12.5 3 11C6 9.5 7 7.5 6 5C8.5 6 10.5 5 12 2Z"
                    fill={petal.color}
                    opacity="0.9"
                  />
                </svg>
              ) : petal.type === 'leaf' ? (
                // Young spring leaf
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-full h-full drop-shadow-[0_1px_3px_rgba(34,197,94,0.2)]"
                  style={{ transform: `rotate(${petal.rotation}deg)` }}
                >
                  <path
                    d="M6 18C6 18 8 10 16 6C16 6 18 14 10 18C8 19 6 18 6 18Z"
                    fill={petal.color}
                  />
                  <path
                    d="M8 17L14 9"
                    stroke="#15803D"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              ) : (
                // Single curved petal
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-full h-full drop-shadow-[0_2px_4px_rgba(244,114,182,0.25)]"
                  style={{ transform: `rotate(${petal.rotation}deg)` }}
                >
                  <path
                    d="M12 3C8 6 6 12 9 17C12 22 17 21 19 16C21 11 16 6 12 3Z"
                    fill={petal.color}
                    opacity="0.85"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Floating Subtle Spring Toggle Button */}
      <button
        onClick={togglePetals}
        title={enabled ? 'Tắt hiệu ứng hoa đào rơi' : 'Bật hiệu ứng hoa đào rơi'}
        className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-md backdrop-blur-md border ${
          enabled
            ? 'bg-white/90 text-pink-700 border-pink-200 hover:bg-pink-50'
            : 'bg-white/80 text-slate-500 border-slate-200 hover:bg-white'
        }`}
      >
        {enabled ? (
          <>
            <Flower2 className="w-3.5 h-3.5 text-pink-500 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="hidden sm:inline">Hoa rơi: Bật</span>
          </>
        ) : (
          <>
            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Hoa rơi: Tắt</span>
          </>
        )}
      </button>
    </>
  );
};
