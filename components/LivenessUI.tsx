
import React from 'react';
import { ChevronLeft } from 'lucide-react';
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
  stage,
  status,
  isFaceInside,
  blinkCount,
  onBack
}) => {
  const blinkProgress = Math.min((blinkCount / REQUIRED_BLINK_COUNT) * 100, 100);
  const recognitionScore = Math.floor(Math.max(blinkProgress, isFaceInside ? 20 : 0));

  return (
    <div className="absolute inset-0 flex flex-col items-center bg-white z-20">
      
      {/* Header */}
      <div className="w-full flex items-center p-6 pt-12 pointer-events-auto">
        <button 
          onClick={onBack}
          className="p-2 text-slate-800 hover:bg-slate-50 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="flex-1 text-center font-bold text-sm mr-8">Face ID</span>
      </div>

      {/* Instruction */}
      <div className="mt-6 text-center px-8">
        <p className="text-slate-600 text-[15px] font-medium">
          Look directly into the camera
        </p>
      </div>

      {/* Camera Frame Container */}
      <div className="flex-1 w-full flex flex-col items-center justify-center -mt-10">
        <div className="relative w-72 h-72">
          {/* Transparent hole area is handled by the parent's layout and masking in App.tsx */}
          {/* We add corner brackets here */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white rounded-tl-3xl z-30" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white rounded-tr-3xl z-30" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-white rounded-bl-3xl z-30" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white rounded-br-3xl z-30" />
          
          {/* Subtle Frame Edge */}
          <div className={`absolute inset-0 rounded-[40px] border border-slate-100 pointer-events-none z-20`} />
        </div>

        {/* Dynamic Status Text */}
        <div className="mt-20 text-center px-10">
          <p className="text-slate-400 text-sm font-medium animate-pulse">
            {isFaceInside ? "Hold still, we are processing" : "Position your face in the frame"}
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="w-full max-w-xs px-6 pb-20 space-y-4">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full progress-gradient transition-all duration-700 ease-out"
            style={{ width: `${recognitionScore}%` }}
          />
        </div>
        <div className="text-right">
          <span className="text-pink-500 font-bold text-sm">{recognitionScore}%</span>
        </div>
      </div>
    </div>
  );
};

export default LivenessUI;
