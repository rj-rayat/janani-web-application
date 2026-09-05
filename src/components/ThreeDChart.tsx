import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, BarChart3, Activity, Layers } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
  subtext?: string;
}

interface ThreeDChartProps {
  title?: string;
  subtitle?: string;
  data: DataPoint[];
  metricUnit?: string;
  height?: number;
  className?: string;
}

export const ThreeDChart: React.FC<ThreeDChartProps> = ({
  title = 'Department Diagnostic Throughput',
  subtitle = 'Analyzed test volumes and clinical processing distribution',
  data,
  metricUnit = 'tests',
  height = 240,
  className = '',
}) => {
  const [activeItem, setActiveItem] = useState<DataPoint | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  // Elegant medical palette
  const defaultColors = [
    { base: '#0d9488', light: '#2dd4bf', shadow: '#115e59' }, // Teal
    { base: '#0284c7', light: '#38bdf8', shadow: '#0369a1' }, // Sky/Blue
    { base: '#059669', light: '#34d399', shadow: '#065f46' }, // Emerald
    { base: '#7c3aed', light: '#a78bfa', shadow: '#5b21b6' }, // Violet
    { base: '#d97706', light: '#fbbf24', shadow: '#b45309' }, // Amber
    { base: '#e11d48', light: '#fb7185', shadow: '#9f1239' }, // Rose
  ];

  return (
    <div
      className={`bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/60">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">{title}</h3>
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-500 shadow-xs" />
            <span className="font-medium text-[11px]">Primary Volume</span>
          </div>
          <div className="flex items-center gap-1 text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[11px]">Live Feed</span>
          </div>
        </div>
      </div>

      {/* 3D Isometric / Depth Bar Chart Area */}
      <div
        className="relative flex items-end justify-between gap-3 sm:gap-6 pt-8 pb-4 px-2"
        style={{ minHeight: `${height}px` }}
      >
        {/* Background Grid Guide Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-slate-200 w-full" />
        </div>

        {data.map((item, idx) => {
          const percentage = Math.max((item.value / maxValue) * 100, 8);
          const colorPair = defaultColors[idx % defaultColors.length];
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={item.label}
              className="flex-1 flex flex-col items-center group relative cursor-pointer"
              onMouseEnter={() => {
                setHoveredIndex(idx);
                setActiveItem(item);
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
                setActiveItem(null);
              }}
            >
              {/* Tooltip Float Callout */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.85 }}
                    animate={{ opacity: 1, y: -12, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    className="absolute -top-12 z-30 bg-slate-900/95 text-white text-xs px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap pointer-events-none flex items-center gap-1.5 font-mono"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorPair.light }} />
                    <span className="font-bold">{item.value}</span>
                    <span className="text-slate-400 text-[10px]">{metricUnit}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3D Pillar Column with Multiple Faces */}
              <div
                className="w-full max-w-[56px] relative flex flex-col justify-end"
                style={{ height: `${height - 50}px` }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.08, type: 'spring', bounce: 0.2 }}
                  className="w-full relative rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                  style={{
                    perspective: '600px',
                  }}
                >
                  {/* Front Main Glass Surface */}
                  <div
                    className="w-full h-full rounded-t-xl relative overflow-hidden shadow-md transition-all duration-300"
                    style={{
                      background: `linear-gradient(180deg, ${colorPair.light} 0%, ${colorPair.base} 65%, ${colorPair.shadow} 100%)`,
                      boxShadow: isHovered
                        ? `0 12px 25px -4px ${colorPair.base}66, inset 0 1px 0 rgba(255,255,255,0.6)`
                        : `0 4px 12px -2px ${colorPair.base}33, inset 0 1px 0 rgba(255,255,255,0.4)`,
                    }}
                  >
                    {/* Glass Sheen Top Edge */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-white/40 rounded-t-xl" />
                    {/* Vertical Highlight Gradient */}
                    <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/30 to-transparent" />
                  </div>

                  {/* Value Badge inside pillar if tall enough */}
                  {percentage > 25 && (
                    <span className="absolute top-2 inset-x-0 text-center font-mono font-bold text-[11px] text-white drop-shadow-xs pointer-events-none">
                      {item.value}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* X-Axis Label */}
              <div className="mt-3 text-center w-full">
                <span
                  className={`block text-[11px] font-bold truncate max-w-[80px] transition-colors ${
                    isHovered ? 'text-teal-900' : 'text-slate-600'
                  }`}
                  title={item.label}
                >
                  {item.label}
                </span>
                {item.subtext && (
                  <span className="text-[10px] text-slate-400 block truncate">{item.subtext}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
