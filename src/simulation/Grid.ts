import type { Particle } from './types';
import { ParticleType, createParticle } from './types';

export class Grid {
  width: number;
  height: number;
  cells: Particle[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
    this.clear();
  }

  clear(): void {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = createParticle(ParticleType.Empty);
    }
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  index(x: number, y: number): number {
    return y * this.width + x;
  }

  get(x: number, y: number): Particle {
    return this.cells[this.index(x, y)];
  }

  set(x: number, y: number, particle: Particle): void {
    this.cells[this.index(x, y)] = particle;
  }

  isEmpty(x: number, y: number): boolean {
    if (!this.inBounds(x, y)) return false;
    return this.get(x, y).type === ParticleType.Empty;
  }

  swap(x1: number, y1: number, x2: number, y2: number): void {
    const i1 = this.index(x1, y1);
    const i2 = this.index(x2, y2);
    const temp = this.cells[i1];
    this.cells[i1] = this.cells[i2];
    this.cells[i2] = temp;
  }
}
