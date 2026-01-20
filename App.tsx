
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import LivenessUI from './components/LivenessUI';
import CapturePreview from './components/CapturePreview';
import IntroView from './components/IntroView';
import FaceMeshOverlay from './components/FaceMeshOverlay';
import { 
  FALLBACK_TIMEOUT_SECONDS, 
  EAR_THRESHOLD, 
  MIN_MOTION_THRESHOLD, 
  REQUIRED_BLINK_COUNT 
} from './constants';
import { calculateEAR, calculateVariance } from './utils/math';
import { ValidationStage } from './types';

const LEFT_EYE = [362, 385, 387, 263, 373, 380];
const RIGHT_EYE = [33, 160, 158, 133, 153, 144];

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  const [stage, setStage] = useState<ValidationStage>(ValidationStage.INTRO);
  const [status, setStatus] = useState('Position face');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFaceInside, setIsFaceInside] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [capture, setCapture] = useState<{ src: string; method: 'auto' | 'manual' } | null>(null);
  const [currentLandmarks, setCurrentLandmarks] = useState<any[] | null>(null);

  const blinkCountRef = useRef(0);
  const headPosHistoryRef = useRef<number[]>([]);
  const isBlinkingRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const isVerifiedRef = useRef(false);

  const doCapture = useCallback((method: 'auto' | 'manual') => {
    if (isVerifiedRef.current && method === 'auto') return;
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // High-quality capture matching original stream dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0);
        ctx.restore();
        
        setCapture({ src: canvas.toDataURL('image/jpeg', 0.95), method });
        setStage(ValidationStage.VERIFIED);
        isVerifiedRef.current = true;
      }
    }
  }, []);

  useEffect(() => {
    if (stage === ValidationStage.INTRO || stage === ValidationStage.VERIFIED) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      setElapsedTime(elapsed);

      if (elapsed >= FALLBACK_TIMEOUT_SECONDS && stage !== ValidationStage.FALLBACK) {
        setStage(ValidationStage.FALLBACK);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  const onResults = useCallback((results: any) => {
    if (isVerifiedRef.current) return;

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      setCurrentLandmarks(landmarks);

      // Check if face is centered within the frame
      // Frame is centered at 0.5, 0.45 roughly in the view
      const nose = landmarks[1];
      const isCentred = nose.x > 0.4 && nose.x < 0.6 && nose.y > 0.35 && nose.y < 0.65;
      setIsFaceInside(isCentred);

      if (!isCentred) {
        setStatus('Center face');
        return;
      }

      // Blink detection logic
      const leftEar = calculateEAR(landmarks, LEFT_EYE);
      const rightEar = calculateEAR(landmarks, RIGHT_EYE);
      const avgEar = (leftEar + rightEar) / 2;

      if (avgEar < EAR_THRESHOLD) {
        isBlinkingRef.current = true;
        setStatus('Hold...');
      } else {
        if (isBlinkingRef.current) {
          blinkCountRef.current += 1;
          setBlinkCount(blinkCountRef.current);
          isBlinkingRef.current = false;
        }
        setStatus('Blink Now');
      }

      // Motion analysis (liveness confirmation)
      headPosHistoryRef.current.push(nose.x + nose.y);
      if (headPosHistoryRef.current.length > 20) headPosHistoryRef.current.shift();
      const variance = calculateVariance(headPosHistoryRef.current);

      if (blinkCountRef.current >= REQUIRED_BLINK_COUNT && variance > MIN_MOTION_THRESHOLD) {
        setStatus('Processing...');
        setTimeout(() => doCapture('auto'), 800);
      }
    } else {
      setIsFaceInside(false);
      setCurrentLandmarks(null);
      setStatus('No face detected');
    }
  }, [doCapture]);

  const startVerification = () => {
    setStage(ValidationStage.LOADING);
    startTimeRef.current = Date.now();
    initMediaPipe();
  };

  const initMediaPipe = () => {
    const FaceMesh = (window as any).FaceMesh;
    const Camera = (window as any).Camera;

    if (!FaceMesh || !Camera) {
      setTimeout(initMediaPipe, 500);
      return;
    }

    const faceMesh = new FaceMesh({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
      selfieMode: true,
    });

    faceMesh.onResults(onResults);
    faceMeshRef.current = faceMesh;

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && faceMeshRef.current) {
            await faceMeshRef.current.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720,
      });
      camera.start().then(() => setStage(ValidationStage.IDLE));
      cameraRef.current = camera;
    }
  };

  const resetVerification = () => {
    isVerifiedRef.current = false;
    setCapture(null);
    setElapsedTime(0);
    setBlinkCount(0);
    setStage(ValidationStage.INTRO);
    setStatus('Position face');
    blinkCountRef.current = 0;
    headPosHistoryRef.current = [];
    setCurrentLandmarks(null);
  };

  return (
    <main className="relative h-screen w-screen bg-white overflow-hidden flex items-center justify-center">
      {stage === ValidationStage.INTRO && <IntroView onStart={startVerification} />}

      {/* Video Content Layer */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${stage === ValidationStage.INTRO ? 'opacity-0' : 'opacity-100'}`}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          playsInline
          muted
        />
        
        {/* Face Mesh Overlay */}
        {videoRef.current && (
          <FaceMeshOverlay 
            landmarks={currentLandmarks} 
            width={window.innerWidth} 
            height={window.innerHeight} 
          />
        )}
      </div>

      {/* White Mask Overlay - Creates the cutout effect */}
      {stage !== ValidationStage.INTRO && stage !== ValidationStage.VERIFIED && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <mask id="kyc-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect 
                x="50%" 
                y="45%" 
                width="288" 
                height="288" 
                rx="60" 
                fill="black" 
                transform="translate(-144, -144)"
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="white" mask="url(#kyc-mask)" />
        </svg>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Main UI Controls Overlay */}
      {stage !== ValidationStage.INTRO && stage !== ValidationStage.VERIFIED && !capture && (
        <LivenessUI
          stage={stage}
          status={status}
          elapsedTime={elapsedTime}
          isFaceInside={isFaceInside}
          blinkCount={blinkCount}
          onManualCapture={() => doCapture('manual')}
          canManualCapture={elapsedTime >= FALLBACK_TIMEOUT_SECONDS}
          onBack={resetVerification}
        />
      )}

      {/* Verification Result */}
      {capture && (
        <CapturePreview 
          imageSrc={capture.src} 
          method={capture.method} 
          onReset={resetVerification} 
        />
      )}

      {/* Elegant Loading Screen */}
      {stage === ValidationStage.LOADING && (
        <div className="absolute inset-0 z-[60] bg-white flex flex-col items-center justify-center animate__animated animate__fadeIn">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin mb-6" />
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Secure Loading...</p>
        </div>
      )}
    </main>
  );
};

export default App;
