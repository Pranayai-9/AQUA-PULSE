import React, { useState } from 'react';
import { Camera, AlertCircle, CheckCircle, Wrench, X } from 'lucide-react';

interface ARRepairModeProps {
  onClose: () => void;
}

const ARRepairMode: React.FC<ARRepairModeProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      text: "Scan the pipe assembly under the sink.",
      action: "Scanning...",
      delay: 2000
    },
    {
      text: "Issue Detected: P-Trap compression nut loose.",
      action: "Tap to fix",
      delay: 0
    },
    {
      text: "Use a channel-lock plier. Rotate clockwise 1/4 turn.",
      action: "Simulate Turn",
      delay: 0
    },
    {
      text: "Leak resolved! Great job.",
      action: "Finish",
      delay: 0
    }
  ];

  const handleAction = () => {
    if (step < steps.length - 1) {
      if (step === 0) {
        // Simulate scan delay
        setTimeout(() => setStep(s => s + 1), 2000);
      } else {
        setStep(s => s + 1);
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Fake Camera View */}
      <div className="relative flex-1 bg-gray-900 overflow-hidden">
        {/* Background Image simulating camera feed */}
        <img 
            src="https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" 
            alt="Under sink pipes" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        
        {/* HUD Overlay */}
        <div className="absolute inset-0 p-6 pointer-events-none">
            <div className="flex justify-between items-start">
                <div className="bg-slate-900/80 backdrop-blur rounded px-3 py-1 text-xs text-green-400 font-mono flex items-center gap-2">
                    <Camera size={14} /> LIVE FEED • AI ACTIVE
                </div>
                <button 
                    onClick={onClose} 
                    className="pointer-events-auto bg-slate-900/50 p-2 rounded-full text-white hover:bg-slate-800 transition"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Target Reticle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-cyan-400/50 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border border-cyan-400 rounded-full"></div>
            </div>

            {/* AR Augmentation (Arrows/Highlights) */}
            {step >= 2 && (
                <div className="absolute top-[55%] left-[60%] animate-bounce">
                    <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded mb-1">Tighten Here</div>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="3">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                </div>
            )}
        </div>
      </div>

      {/* Interactive Bottom Sheet */}
      <div className="bg-slate-900 border-t border-slate-800 p-6 pb-10 rounded-t-3xl -mt-6 relative z-10 shadow-2xl">
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6"></div>
        
        <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${step === steps.length -1 ? 'bg-green-500/20 text-green-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                {step === steps.length -1 ? <CheckCircle /> : <Wrench />}
            </div>
            <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">
                    {step === 0 ? "Analyzing Plumbing..." : "AI Assistant"}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                    {steps[step].text}
                </p>
                <button 
                    onClick={handleAction}
                    disabled={step === 0}
                    className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                        step === 0 
                        ? 'bg-slate-800 text-slate-500 cursor-wait'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/50'
                    }`}
                >
                   {steps[step].action}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ARRepairMode;