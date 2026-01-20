
import React from 'react';
import { Check } from 'lucide-react';

interface CapturePreviewProps {
  imageSrc: string;
  onReset: () => void;
  method: 'auto' | 'manual';
}

const CapturePreview: React.FC<CapturePreviewProps> = ({ onReset }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate__animated animate__fadeIn">
      <div className="bg-white rounded-[32px] w-full max-w-sm p-10 flex flex-col items-center text-center shadow-2xl animate__animated animate__zoomIn animate__faster">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            <Check size={32} strokeWidth={3} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Scan Completed</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-[200px]">
          From now you can use your face ID
        </p>

        <button
          onClick={onReset}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default CapturePreview;
