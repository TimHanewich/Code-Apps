import { useRef, useEffect, useCallback, useState } from 'react';
import { Simulation, Renderer, ParticleType } from '../simulation';
import './ParticleCanvas.css';

const GRID_WIDTH = 200;
const GRID_HEIGHT = 150;
const TARGET_FPS = 60;

interface Props {
  selectedType: ParticleType;
  brushSize: number;
  paused: boolean;
  onReset: () => void;
  onBrushSize: (size: number) => void;
}

export default function ParticleCanvas({ selectedType, brushSize, paused, onBrushSize }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Simulation | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseDown = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(0);
  const [particleCount, setParticleCount] = useState(0);

  useEffect(() => {
    simRef.current = new Simulation(GRID_WIDTH, GRID_HEIGHT);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement!;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      rendererRef.current = new Renderer(canvas, GRID_WIDTH, GRID_HEIGHT);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Scroll to resize brush
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -1 : 1;
      onBrushSize(Math.max(1, Math.min(20, brushSize + delta)));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [brushSize, onBrushSize]);

  // Game loop
  useEffect(() => {
    let lastTime = 0;
    const frameInterval = 1000 / TARGET_FPS;
    let frameCount = 0;

    const loop = (time: number) => {
      animFrameRef.current = requestAnimationFrame(loop);

      const delta = time - lastTime;
      if (delta < frameInterval) return;
      lastTime = time - (delta % frameInterval);
      frameCount++;

      const sim = simRef.current;
      const renderer = rendererRef.current;
      if (!sim || !renderer) return;

      if (mouseDown.current) {
        sim.spawnParticles(
          mousePos.current.x,
          mousePos.current.y,
          brushSize,
          selectedType
        );
      }

      if (!paused) {
        sim.step();
      }

      renderer.render(sim);

      if (mousePos.current.x > 0 && mousePos.current.y > 0) {
        renderer.drawBrush(mousePos.current.x, mousePos.current.y, brushSize, selectedType);
      }

      if (frameCount % 15 === 0) {
        let count = 0;
        for (let i = 0; i < sim.grid.cells.length; i++) {
          if (sim.grid.cells[i].type !== ParticleType.Empty) count++;
        }
        setParticleCount(count);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [paused, selectedType, brushSize]);

  const getGridPos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = GRID_WIDTH / canvas.width;
    const scaleY = GRID_HEIGHT / canvas.height;
    return {
      x: Math.floor((e.clientX - rect.left) * scaleX),
      y: Math.floor((e.clientY - rect.top) * scaleY),
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseDown.current = true;
    mousePos.current = getGridPos(e);
  }, [getGridPos]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    mousePos.current = getGridPos(e);
  }, [getGridPos]);

  const handleMouseUp = useCallback(() => {
    mouseDown.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseDown.current = false;
    mousePos.current = { x: -1, y: -1 };
  }, []);

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onContextMenu={e => e.preventDefault()}
      />
      <div className="particle-count">Particles: {particleCount.toLocaleString()}</div>
    </div>
  );
}
