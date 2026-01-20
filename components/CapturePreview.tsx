import React from 'react';
import { Check, User } from 'lucide-react';

interface CapturePreviewProps {
  imageSrc: string;
  onReset: () => void;
  method: 'auto' | 'manual';
}

const CapturePreview: React.FC<CapturePreviewProps> = ({ imageSrc, onReset }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm p-6 animate__animated animate__fadeIn">
        <div className="bg-white rounded-[32px] w-full max-w-sm p-10 flex flex-col items-center text-center shadow-2xl animate__animated animate__zoomIn animate__faster">
          {/* Success Badge */}
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              <Check size={32} strokeWidth={3} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Congrats!</h2>
          <p className="text-slate-500 text-[14px] leading-relaxed mb-10 max-w-[240px]">
            The biometric data of your selfie match with your record.
          </p>

          {/* Captured Image Preview */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 mb-10 shadow-lg">
            <img src={imageSrc} alt="Verification Result" className="w-full h-full object-cover" />
          </div>

          <button
            onClick={onReset}
            className="w-full primary-blue hover:bg-blue-700 text-white font-bold py-4.5 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            Done
          </button>
        </div>
    </div>
  );
};

export default CapturePreview;