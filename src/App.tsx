import { useState, useCallback } from 'react';
import { ParticleType } from './simulation';
import ParticleCanvas from './components/ParticleCanvas';
import Toolbar from './components/Toolbar';
import './App.css';

function App() {
  const [selectedType, setSelectedType] = useState<ParticleType>(ParticleType.Sand);
  const [brushSize, setBrushSize] = useState(5);
  const [paused, setPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = useCallback(() => {
    setResetKey(k => k + 1);
  }, []);

  const handleTogglePause = useCallback(() => {
    setPaused(p => !p);
  }, []);

  return (
    <div className="app">
      <Toolbar
        selectedType={selectedType}
        onSelectType={setSelectedType}
        brushSize={brushSize}
        onBrushSize={setBrushSize}
        paused={paused}
        onTogglePause={handleTogglePause}
        onReset={handleReset}
      />
      <ParticleCanvas
        key={resetKey}
        selectedType={selectedType}
        brushSize={brushSize}
        paused={paused}
        onReset={handleReset}
        onBrushSize={setBrushSize}
      />
    </div>
  );
}

export default App;
