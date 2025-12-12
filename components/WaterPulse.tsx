import React from 'react';
import { Droplet } from 'lucide-react';

interface WaterPulseProps {
  percentage: number;
  isFlowing: boolean;
}

const WaterPulse: React.FC<WaterPulseProps> = ({ percentage, isFlowing }) => {
  // Clamp percentage between 0 and 100
  const safePercent = Math.min(100, Math.max(0, percentage));
  
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Outer Glow Ring */}
      <div className={`absolute inset-0 rounded-full border-2 border-cyan-500/30 ${isFlowing ? 'animate-pulse' : ''}`}></div>
      
      {/* Ripple Effects (only when flowing) */}
      {isFlowing && (
        <>
           <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping"></div>
           <div className="absolute inset-4 rounded-full border border-cyan-400/10 animate-[ping_1.5s_infinite]"></div>
        </>
      )}

      {/* Main Circle Container */}
      <div className="relative w-56 h-56 rounded-full bg-slate-800 border-4 border-slate-700 overflow-hidden shadow-2xl shadow-cyan-900/50">
        
        {/* Water Level */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600 to-teal-500 transition-all duration-1000 ease-in-out opacity-80"
          style={{ height: `${safePercent}%` }}
        >
          {/* Wave Top */}
          <div className="absolute -top-4 left-0 w-[200%] h-8 bg-teal-400/30 rounded-[50%] animate-wave transform -translate-x-1/2"></div>
        </div>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <Droplet className={`w-10 h-10 mb-2 ${isFlowing ? 'text-white fill-white' : 'text-cyan-400'}`} />
            <span className="text-4xl font-bold text-white drop-shadow-md">
              {Math.round(safePercent)}%
            </span>
            <span className="text-xs text-slate-300 uppercase tracking-widest mt-1">Daily Limit</span>
        </div>
      </div>
    </div>
  );
};

export default WaterPulse;