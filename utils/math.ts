
import { Landmark } from '../types';

export const getDistance = (p1: Landmark, p2: Landmark) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const calculateEAR = (landmarks: any[], indices: number[]) => {
  // Eye Aspect Ratio formula
  // EAR = (||p2 - p6|| + ||p3 - p5||) / (2 * ||p1 - p4||)
  const p1 = landmarks[indices[0]];
  const p2 = landmarks[indices[1]];
  const p3 = landmarks[indices[2]];
  const p4 = landmarks[indices[3]];
  const p5 = landmarks[indices[4]];
  const p6 = landmarks[indices[5]];

  const vert1 = getDistance(p2, p6);
  const vert2 = getDistance(p3, p5);
  const horiz = getDistance(p1, p4);

  return (vert1 + vert2) / (2.0 * horiz);
};

export const calculateVariance = (values: number[]) => {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b) / values.length;
  return values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
};
