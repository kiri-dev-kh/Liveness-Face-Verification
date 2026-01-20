import React from 'react';
import { ChevronLeft, Camera } from 'lucide-react';
import { REQUIRED_BLINK_COUNT } from '../constants';

interface LivenessUIProps {
  stage: string;
  status: string;
  elapsedTime: number;
  isFaceInside: boolean;
  blinkCount: number;
  onManualCapture: () => void;
  canManualCapture: boolean;
  onBack: () => void;
}

const LivenessUI: React.FC<LivenessUIProps> = ({
  isFaceInside,
  blinkCount,
  onManualCapture,
  canManualCapture,
  onBack
}) => {
  const blinkProgress = Math.min((blinkCount / REQUIRED_BLINK_COUNT) * 100, 100);
  const recognitionScore = Math.floor(Math.max(blinkProgress, isFaceInside ? 18 : 0));

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center z-30">
      {/* Top Header */}
      <div className="w-full flex items-center justify-start p-6 pt-12 pointer-events-auto">
        <button 
          onClick={onBack}
          className="p-3 bg-white border border-slate-100 rounded-full text-slate-800 shadow-sm transition-all active:scale-90"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Instruction Text */}
      <div className="mt-4 text-center px-10 animate__animated animate__fadeIn">
        <p className="text-slate-600 text-[15px] font-bold tracking-tight opacity-70">
          Please look the camera and hold still
        </p>
      </div>

      {/* Scanning Viewport Area - NO BORDER HERE to prevent duplication */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        <div className="relative w-[280px] h-[340px] overflow-hidden rounded-[48px]">
          {/* Brackets (Internal) */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white rounded-tl-[32px] opacity-60 z-30" />
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-white rounded-tr-[32px] opacity-60 z-30" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-white rounded-bl-[32px] opacity-60 z-30" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white rounded-br-[32px] opacity-60 z-30" />

          {/* Green Scan Line */}
          {isFaceInside && <div className="scan-line" />}
        </div>
      </div>

      {/* Bottom Progress Area */}
      <div className="w-full max-w-[320px] px-6 pb-20 pointer-events-auto flex flex-col items-center">
        <div className="w-full flex flex-col items-center gap-4 mb-6">
          <span className="text-slate-700 font-bold text-[13px] tracking-tight opacity-90">
            {isFaceInside ? `${recognitionScore}% Recognition` : 'Scanning...'}
          </span>
          <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-sm border border-slate-100">
            <div 
              className="h-full primary-blue rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${recognitionScore}%` }}
            />
          </div>
        </div>

        {/* Manual Fallback Button */}
        {canManualCapture && (
          <button
            onClick={onManualCapture}
            className="w-full primary-blue hover:bg-blue-700 text-white font-bold py-4.5 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all animate__animated animate__fadeInUp"
          >
            <Camera size={20} />
            Capture Photo Manually
          </button>
        )}
      </div>
    </div>
  );
};

export default LivenessUI;