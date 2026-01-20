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

    const meshColor = 'rgba(45, 116, 255, 0.25)';
    const nodeColor = '#ffffff';
    const arcColor = '#2D74FF';

    const drawLine = (p1: any, p2: any) => {
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.stroke();
    };

    // 1. Draw Mesh
    ctx.strokeStyle = meshColor;
    ctx.lineWidth = 0.5;
    const meshLinks = [
      [10, 151], [151, 9], [9, 8], [8, 168], [168, 6],
      [33, 133], [362, 263], [61, 291], [0, 17],
      // Cheeks/Jaw
      [127, 234], [234, 93], [93, 132], [132, 58], [58, 172], [172, 136], [150, 149], [152, 377], [377, 400], [400, 378], [378, 379], [379, 365]
    ];
    meshLinks.forEach(([i, j]) => {
      if (landmarks[i] && landmarks[j]) drawLine(landmarks[i], landmarks[j]);
    });

    // 2. Draw Blue Forehead Arc
    // The reference shows a thick blue arc above the eyebrows
    const foreheadTop = landmarks[10];
    if (foreheadTop) {
        ctx.strokeStyle = arcColor;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        // Create an arc around index 10
        const arcPoints = [103, 67, 109, 10, 338, 297, 332];
        arcPoints.forEach((idx, i) => {
            const p = landmarks[idx];
            // Offset for the floating effect
            const y = (p.y * height) - (0.04 * height);
            const x = p.x * width;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    // 3. Draw Landmark Nodes
    ctx.fillStyle = nodeColor;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'white';
    const highlightPoints = [1, 33, 263, 61, 291, 152, 10, 168, 197, 5, 4, 151, 103, 332];
    highlightPoints.forEach(idx => {
      const p = landmarks[idx];
      if (!p) return;
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

  }, [landmarks, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 z-20 pointer-events-none scale-x-[-1] mesh-canvas"
    />
  );
};

export default FaceMeshOverlay;