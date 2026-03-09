import { ParticleType } from '../simulation';
import './Toolbar.css';

interface Props {
  selectedType: ParticleType;
  onSelectType: (type: ParticleType) => void;
  brushSize: number;
  onBrushSize: (size: number) => void;
  paused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
}

const MATERIAL_OPTIONS = [
  { type: ParticleType.Sand, label: 'Sand', icon: '⏳', color: '#d2b464' },
  { type: ParticleType.Water, label: 'Water', icon: '💧', color: '#1e64c8' },
  { type: ParticleType.Stone, label: 'Stone', icon: '🪨', color: '#828282' },
];

export default function Toolbar({
  selectedType,
  onSelectType,
  brushSize,
  onBrushSize,
  paused,
  onTogglePause,
  onReset,
}: Props) {
  return (
    <div className="toolbar">
      <h1 className="toolbar-title">🏖️ Particle Sim</h1>

      <div className="toolbar-section">
        <label className="toolbar-label">Material</label>
        <div className="material-buttons">
          {MATERIAL_OPTIONS.map(opt => (
            <button
              key={opt.type}
              className={`material-btn ${selectedType === opt.type ? 'active' : ''}`}
              onClick={() => onSelectType(opt.type)}
              style={{ '--mat-color': opt.color } as React.CSSProperties}
            >
              <span className="material-icon">{opt.icon}</span>
              <span className="material-label">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <label className="toolbar-label">
          Brush Size: {brushSize}
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={e => onBrushSize(Number(e.target.value))}
          className="brush-slider"
        />
      </div>

      <div className="toolbar-section toolbar-actions">
        <button className="action-btn" onClick={onTogglePause}>
          {paused ? '▶ Play' : '⏸ Pause'}
        </button>
        <button className="action-btn reset-btn" onClick={onReset}>
          🗑 Clear
        </button>
      </div>

      <div className="toolbar-help">
        <p>Click & drag to pour particles</p>
        <p>Scroll to change brush size</p>
      </div>
    </div>
  );
}
