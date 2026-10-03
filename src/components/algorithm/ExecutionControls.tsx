import React from 'react';
import type { ExecutionStatus } from '../../types/algorithm';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from 'lucide-react';

interface ExecutionControlsProps {
  status: ExecutionStatus;
  currentStepIndex: number;
  totalSteps: number;
  animationSpeed: number; // in ms
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onRestart: () => void;
  onSpeedChange: (speedMs: number) => void;
}

export const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  status,
  currentStepIndex,
  totalSteps,
  animationSpeed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onRestart,
  onSpeedChange,
}) => {
  const isRunning = status === 'running';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}
    >
      {/* Playback Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={onRestart}
          title="Restart Execution"
        >
          <RotateCcw size={14} />
        </button>

        <button
          className="btn btn-outline btn-sm"
          onClick={onStepBackward}
          disabled={currentStepIndex === 0}
          title="Previous Step"
        >
          <SkipBack size={14} />
        </button>

        {isRunning ? (
          <button
            className="btn btn-primary btn-sm"
            onClick={onPause}
            title="Pause Automatic Stepping"
            style={{ paddingLeft: 16, paddingRight: 16 }}
          >
            <Pause size={14} /> Pause
          </button>
        ) : (
          <button
            className="btn btn-success btn-sm"
            onClick={onPlay}
            title="Play Automatic Execution"
            style={{ paddingLeft: 16, paddingRight: 16 }}
          >
            <Play size={14} /> Play
          </button>
        )}

        <button
          className="btn btn-outline btn-sm"
          onClick={onStepForward}
          disabled={totalSteps === 0 || currentStepIndex >= totalSteps - 1}
          title="Next Step"
        >
          <SkipForward size={14} />
        </button>
      </div>

      {/* Step Counter Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, maxWidth: 400 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
          Step {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
        </span>
        <div
          style={{
            flex: 1,
            height: 6,
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${totalSteps > 1 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0}%`,
              backgroundColor: 'var(--accent-blue)',
              transition: 'width 0.2s ease',
            }}
          />
        </div>
      </div>

      {/* Animation Speed Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FastForward size={14} color="var(--text-secondary)" />
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Speed:</span>
        <select
          className="select-field"
          value={animationSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          style={{ padding: '4px 8px', fontSize: '0.8rem' }}
        >
          <option value={2000}>0.5x (Slow - 2s)</option>
          <option value={1000}>1.0x (Normal - 1s)</option>
          <option value={500}>2.0x (Fast - 0.5s)</option>
          <option value={200}>5.0x (Rapid - 0.2s)</option>
        </select>
      </div>
    </div>
  );
};
