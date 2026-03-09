import type { Simulation } from './Simulation';
import type { Particle } from './types';
import { ParticleType } from './types';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  private cellSize: number;

  constructor(canvas: HTMLCanvasElement, gridWidth: number, gridHeight: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.ctx.imageSmoothingEnabled = false;

    // We draw at 1:1 pixel ratio on an offscreen ImageData, then scale up
    this.cellSize = Math.floor(Math.min(
      canvas.width / gridWidth,
      canvas.height / gridHeight
    ));
    this.imageData = this.ctx.createImageData(gridWidth, gridHeight);
  }

  render(sim: Simulation): void {
    const grid = sim.grid;
    const data = this.imageData.data;

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const particle: Particle = grid.get(x, y);
        const idx = (y * grid.width + x) * 4;
        data[idx] = particle.color[0];
        data[idx + 1] = particle.color[1];
        data[idx + 2] = particle.color[2];
        data[idx + 3] = 255;
      }
    }

    // Draw to a temp canvas at 1:1, then scale to actual canvas
    const offscreen = new OffscreenCanvas(grid.width, grid.height);
    const offCtx = offscreen.getContext('2d')!;
    offCtx.putImageData(this.imageData, 0, 0);

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(offscreen, 0, 0, this.canvas.width, this.canvas.height);
  }

  // Draw a brush preview circle
  drawBrush(x: number, y: number, radius: number, type: ParticleType): void {
    const colors: Record<number, string> = {
      [ParticleType.Sand]: 'rgba(210, 180, 100, 0.4)',
      [ParticleType.Water]: 'rgba(30, 100, 200, 0.4)',
      [ParticleType.Stone]: 'rgba(130, 130, 130, 0.4)',
    };
    const color = colors[type] || 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(x * this.cellSize, y * this.cellSize, radius * this.cellSize, 0, Math.PI * 2);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }
}
