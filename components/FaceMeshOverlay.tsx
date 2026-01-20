
import React, { useEffect, useRef } from 'react';

interface FaceMeshOverlayProps {
  landmarks: any[] | null;
  width: number;
  height: number;
}

const FaceMeshOverlay: React.FC<FaceMeshOverlayProps> = ({ landmarks, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    if (!landmarks || landmarks.length === 0) return;

    const eyeColor = 'rgba(59, 130, 246, 0.3)';
    
    const drawPath = (indices: number[], color: string, lineWidth: number, close = false) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      indices.forEach((idx, i) => {
        const p = landmarks[idx];
        if (i === 0) ctx.moveTo(p.x * width, p.y * height);
        else ctx.lineTo(p.x * width, p.y * height);
      });
      if (close) ctx.closePath();
      ctx.stroke();
    };

    // Minimal eye tracking (softly indicated)
    drawPath([33, 160, 158, 133, 153, 144], eyeColor, 0.5, true);
    drawPath([362, 385, 387, 263, 373, 380], eyeColor, 0.5, true);

    // Single soft central anchor point (very small)
    const nose = landmarks[1];
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(nose.x * width, nose.y * height, 1, 0, Math.PI * 2);
    ctx.fill();

  }, [landmarks, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 z-10 pointer-events-none scale-x-[-1]"
    />
  );
};

export default FaceMeshOverlay;
