import React from 'react';
import { User, ChevronLeft } from 'lucide-react';

interface IntroViewProps {
  onStart: () => void;
}

const IntroView: React.FC<IntroViewProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between p-8 animate__animated animate__fadeIn">
      {/* Top Action */}
      <div className="w-full flex justify-start pt-4">
        <button className="p-3 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xs">
        {/* Face Recognition Logo Container */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-10">
          {/* Subtle blue background effect */}
          <div className="absolute inset-2 bg-blue-50/50 rounded-full blur-xl" />
          
          {/* Brackets Style Icon */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* The brackets from the reference */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-600 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-600 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-600 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-600 rounded-br-2xl" />
            
            <div className="bg-white shadow-xl shadow-blue-100/50 p-6 rounded-full">
                <User size={48} className="text-blue-600" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">Face Recognition</h1>
        <p className="text-slate-400 text-[15px] leading-relaxed px-4 font-medium opacity-80">
          We've sent a password recover instructions to your email
        </p>
      </div>

      <div className="w-full max-w-sm pb-8">
        <button
          onClick={onStart}
          className="w-full primary-blue hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-2xl shadow-blue-200 transition-all active:scale-95 text-base tracking-wide"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default IntroView;