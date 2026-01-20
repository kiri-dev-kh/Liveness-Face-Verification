
export interface LivenessState {
  isFacePresent: boolean;
  blinkDetected: boolean;
  motionDetected: boolean;
  isVerified: boolean;
  elapsedTime: number;
  status: string;
}

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export type Point = { x: number; y: number };

export enum ValidationStage {
  INTRO = 'INTRO',
  LOADING = 'LOADING',
  IDLE = 'IDLE',
  TRACKING = 'TRACKING',
  BLINK_CHECK = 'BLINK_CHECK',
  VERIFIED = 'VERIFIED',
  FALLBACK = 'FALLBACK'
}
