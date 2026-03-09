import { Grid } from './Grid';
import { ParticleType, createParticle } from './types';

const MAX_VELOCITY = 8;
const GRAVITY = 0.5;

export class Simulation {
  grid: Grid;
  private evenFrame = false;

  constructor(width: number, height: number) {
    this.grid = new Grid(width, height);
  }

  reset(): void {
    this.grid.clear();
  }

  spawnParticles(cx: number, cy: number, radius: number, type: ParticleType): void {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > radius * radius) continue;
        const x = cx + dx;
        const y = cy + dy;
        if (!this.grid.inBounds(x, y)) continue;
        if (this.grid.get(x, y).type !== ParticleType.Empty) continue;
        if (Math.random() > 0.45) continue;
        this.grid.set(x, y, createParticle(type));
      }
    }
  }

  step(): void {
    for (let i = 0; i < this.grid.cells.length; i++) {
      this.grid.cells[i].updated = false;
    }

    this.evenFrame = !this.evenFrame;

    for (let y = this.grid.height - 1; y >= 0; y--) {
      const startX = this.evenFrame ? 0 : this.grid.width - 1;
      const endX = this.evenFrame ? this.grid.width : -1;
      const stepX = this.evenFrame ? 1 : -1;

      for (let x = startX; x !== endX; x += stepX) {
        const particle = this.grid.get(x, y);
        if (particle.type === ParticleType.Empty || particle.updated) continue;

        switch (particle.type) {
          case ParticleType.Sand:
            this.updateSand(x, y);
            break;
          case ParticleType.Water:
            this.updateWater(x, y);
            break;
          case ParticleType.Stone:
            break;
        }
      }
    }
  }

  private updateSand(x: number, y: number): void {
    const particle = this.grid.get(x, y);
    particle.velocity = Math.min(particle.velocity + GRAVITY, MAX_VELOCITY);
    const moveSteps = Math.max(1, Math.floor(particle.velocity));

    let curX = x;
    let curY = y;

    for (let step = 0; step < moveSteps; step++) {
      const moved = this.trySandStep(curX, curY);
      if (!moved) {
        this.grid.get(curX, curY).velocity = 1;
        break;
      }
      // Determine where the particle went
      if (this.grid.inBounds(curX, curY + 1) && this.grid.get(curX, curY + 1) === particle) {
        curY += 1;
      } else if (this.grid.inBounds(curX - 1, curY + 1) && this.grid.get(curX - 1, curY + 1) === particle) {
        curX -= 1;
        curY += 1;
      } else if (this.grid.inBounds(curX + 1, curY + 1) && this.grid.get(curX + 1, curY + 1) === particle) {
        curX += 1;
        curY += 1;
      } else {
        break;
      }
    }

    particle.updated = true;
  }

  private trySandStep(x: number, y: number): boolean {
    const below = y + 1;

    if (this.canSandOccupy(x, below)) {
      this.moveSand(x, y, x, below);
      return true;
    }

    const dir = Math.random() < 0.5 ? -1 : 1;
    if (this.canSandOccupy(x + dir, below)) {
      this.moveSand(x, y, x + dir, below);
      return true;
    }
    if (this.canSandOccupy(x - dir, below)) {
      this.moveSand(x, y, x - dir, below);
      return true;
    }

    return false;
  }

  private moveSand(fromX: number, fromY: number, toX: number, toY: number): void {
    // Sand displaces water by swapping
    this.grid.swap(fromX, fromY, toX, toY);
  }

  private canSandOccupy(x: number, y: number): boolean {
    if (!this.grid.inBounds(x, y)) return false;
    const target = this.grid.get(x, y).type;
    return target === ParticleType.Empty || target === ParticleType.Water;
  }

  private updateWater(x: number, y: number): void {
    const particle = this.grid.get(x, y);
    particle.velocity = Math.min(particle.velocity + GRAVITY, MAX_VELOCITY);
    const moveSteps = Math.max(1, Math.floor(particle.velocity));

    let curX = x;
    let curY = y;
    let fell = false;

    for (let step = 0; step < moveSteps; step++) {
      const below = curY + 1;

      if (this.grid.inBounds(curX, below) && this.grid.isEmpty(curX, below)) {
        this.grid.swap(curX, curY, curX, below);
        curY = below;
        fell = true;
        continue;
      }

      // Diagonal down
      const dir = Math.random() < 0.5 ? -1 : 1;
      if (this.grid.inBounds(curX + dir, below) && this.grid.isEmpty(curX + dir, below)) {
        this.grid.swap(curX, curY, curX + dir, below);
        curX += dir;
        curY = below;
        fell = true;
        continue;
      }
      if (this.grid.inBounds(curX - dir, below) && this.grid.isEmpty(curX - dir, below)) {
        this.grid.swap(curX, curY, curX - dir, below);
        curX -= dir;
        curY = below;
        fell = true;
        continue;
      }

      break;
    }

    if (!fell) {
      particle.velocity = 1;

      // Spread sideways
      const sdir = Math.random() < 0.5 ? -1 : 1;
      const spread = Math.floor(Math.random() * 4) + 1;
      for (let s = 1; s <= spread; s++) {
        const nx = curX + sdir * s;
        if (!this.grid.inBounds(nx, curY) || !this.grid.isEmpty(nx, curY)) break;
        if (s === spread || !this.grid.isEmpty(nx, curY)) {
          this.grid.swap(curX, curY, nx, curY);
          break;
        }
      }
    }

    particle.updated = true;
  }
}
