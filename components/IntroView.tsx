
import React from 'react';
import { User, ShieldCheck } from 'lucide-react';

interface IntroViewProps {
  onStart: () => void;
}

const IntroView: React.FC<IntroViewProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between p-8 md:p-12 animate__animated animate__fadeIn">
      <div className="w-full flex justify-start">
        <button className="p-3 bg-slate-50 rounded-full border border-slate-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>

      <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center relative mb-4">
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-full animate-[spin_10s_linear_infinite]" />
          <User className="w-12 h-12 text-blue-600" />
          <div className="absolute -bottom-1 -right-1 bg-blue-600 p-1.5 rounded-full border-2 border-white">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Face Recognition</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          To ensure your security, we need to verify your identity using biometric facial scanning.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <button
          onClick={onStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default IntroView;
