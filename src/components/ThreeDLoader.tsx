import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

interface ThreeDLoaderProps {
  label?: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThreeDLoader: React.FC<ThreeDLoaderProps> = ({
  label = 'Processing Diagnostic Specimen...',
  subtext = 'Validating clinical reference intervals and cryptographic signature',
  size = 'md',
}) => {
  const sizeDims = {
    sm: { container: 'w-12 h-12', icon: 'w-5 h-5' },
    md: { container: 'w-20 h-20', icon: 'w-7 h-7' },
    lg: { container: 'w-28 h-28', icon: 'w-10 h-10' },
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* 3D Multi-Ring Orbital Spinner */}
      <div className={`relative ${sizeDims.container} mb-5`} style={{ perspective: '800px' }}>
        {/* Ring 1 - Outer Teal Ring */}
        <motion.div
          animate={{ rotateX: [0, 360], rotateY: [0, 180], rotateZ: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-teal-500/60 border-t-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]"
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* Ring 2 - Cyan Middle Ring */}
        <motion.div
          animate={{ rotateX: [180, 0], rotateY: [0, 360], rotateZ: [360, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-2 border-cyan-400/70 border-b-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* Ring 3 - Emerald Inner Ring */}
        <motion.div
          animate={{ rotateX: [0, 180], rotateY: [180, 0], rotateZ: [0, 180] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 rounded-full border-2 border-emerald-400/80 border-r-emerald-100"
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* Center Glowing Heartbeat Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/40"
          >
            <Activity className={sizeDims.icon} />
          </motion.div>
        </div>
      </div>

      {/* Label and Subtext */}
      {label && (
        <h4 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">{label}</h4>
      )}
      {subtext && (
        <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">{subtext}</p>
      )}
    </div>
  );
};
