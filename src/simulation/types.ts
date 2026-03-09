export const ParticleType = {
  Empty: 0,
  Sand: 1,
  Water: 2,
  Stone: 3,
} as const;

export type ParticleType = (typeof ParticleType)[keyof typeof ParticleType];

export interface ParticleColors {
  base: [number, number, number];
  variation: number;
}

export const PARTICLE_COLORS: Record<ParticleType, ParticleColors> = {
  [ParticleType.Empty]: { base: [20, 20, 30], variation: 0 },
  [ParticleType.Sand]: { base: [210, 180, 100], variation: 30 },
  [ParticleType.Water]: { base: [30, 100, 200], variation: 20 },
  [ParticleType.Stone]: { base: [130, 130, 130], variation: 15 },
};

export interface Particle {
  type: ParticleType;
  color: [number, number, number];
  updated: boolean;
  velocity: number;
}

export function createParticle(type: ParticleType): Particle {
  const colors = PARTICLE_COLORS[type];
  const r = colors.base[0] + Math.floor((Math.random() - 0.5) * 2 * colors.variation);
  const g = colors.base[1] + Math.floor((Math.random() - 0.5) * 2 * colors.variation);
  const b = colors.base[2] + Math.floor((Math.random() - 0.5) * 2 * colors.variation);
  return {
    type,
    color: [
      Math.max(0, Math.min(255, r)),
      Math.max(0, Math.min(255, g)),
      Math.max(0, Math.min(255, b)),
    ],
    updated: false,
    velocity: 1,
  };
}
