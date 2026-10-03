import React from 'react';
import type { SyllabusAlgorithmId, HamiltonianMode } from '../../types/algorithm';
import type { Vertex } from '../../types/graph';
import { SYLLABUS_ALGORITHMS, getAlgorithmById } from '../../algorithms';
import { Cpu, Clock, HardDrive, Play, Network } from 'lucide-react';

interface AlgorithmPanelProps {
  selectedAlgorithmId: SyllabusAlgorithmId | null;
  startVertexId: string | null;
  vertices: Vertex[];
  hamiltonianMode?: HamiltonianMode;
  onSelectAlgorithm: (algorithmId: SyllabusAlgorithmId | null) => void;
  onSelectStartVertex: (vertexId: string | null) => void;
  onSelectHamiltonianMode?: (mode: HamiltonianMode) => void;
  onRunAlgorithm: () => void;
  onOpenIsomorphismModal?: () => void;
  isRunning?: boolean;
}

export const AlgorithmPanel: React.FC<AlgorithmPanelProps> = ({
  selectedAlgorithmId,
  startVertexId,
  vertices,
  hamiltonianMode = 'cycle',
  onSelectAlgorithm,
  onSelectStartVertex,
  onSelectHamiltonianMode,
  onRunAlgorithm,
  onOpenIsomorphismModal,
  isRunning = false,
}) => {
  const currentAlgorithm = getAlgorithmById(selectedAlgorithmId);

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span className="panel-title">
          <Cpu size={16} color="var(--accent-purple)" /> Syllabus Algorithms (7MA206)
        </span>
      </div>

      <div className="panel-content">
        {/* Algorithm Dropdown */}
        <div className="input-group">
          <label className="input-label">Select Graph Theory Algorithm</label>
          <select
            className="select-field"
            value={selectedAlgorithmId || ''}
            onChange={(e) => onSelectAlgorithm((e.target.value as SyllabusAlgorithmId) || null)}
          >
            {SYLLABUS_ALGORITHMS.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Start Vertex Selector */}
        {currentAlgorithm?.requiresStartVertex && (
          <div className="input-group">
            <label className="input-label" style={{ color: 'var(--accent-emerald)' }}>
              Dynamic Starting Vertex (Required)
            </label>
            <select
              className="select-field"
              value={startVertexId || ''}
              onChange={(e) => onSelectStartVertex(e.target.value || null)}
            >
              <option value="">-- Select Start Node --</option>
              {vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  Node {v.label} (ID: {v.id})
                </option>
              ))}
            </select>
            {vertices.length === 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>
                Please create or load graph nodes first.
              </span>
            )}
          </div>
        )}

        {/* Configuration for Hamiltonian Path vs Cycle */}
        {selectedAlgorithmId === 'hamiltonian' && onSelectHamiltonianMode && (
          <div className="input-group">
            <label className="input-label">Hamiltonian Target Mode</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className={`btn btn-sm ${hamiltonianMode === 'cycle' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => onSelectHamiltonianMode('cycle')}
                style={{ flex: 1 }}
              >
                Hamiltonian Cycle
              </button>
              <button
                className={`btn btn-sm ${hamiltonianMode === 'path' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => onSelectHamiltonianMode('path')}
                style={{ flex: 1 }}
              >
                Hamiltonian Path
              </button>
            </div>
          </div>
        )}

        {/* Configuration for Graph Isomorphism Dual Editor */}
        {selectedAlgorithmId === 'isomorphism' && onOpenIsomorphismModal && (
          <div className="input-group">
            <button
              className="btn btn-primary btn-sm"
              onClick={onOpenIsomorphismModal}
              style={{ width: '100%', marginTop: 4 }}
            >
              <Network size={14} /> Open Dual Graph Editor (Graph A & B)
            </button>
          </div>
        )}

        {/* Algorithm Information Card */}
        {currentAlgorithm && (
          <div
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentAlgorithm.name}
              </h4>
              <span className="badge badge-purple">7MA206</span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {currentAlgorithm.description}
            </p>

            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={12} /> Time Complexity: <strong style={{ color: 'var(--text-primary)' }}>{currentAlgorithm.timeComplexity}</strong>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <HardDrive size={12} /> Space Complexity: <strong style={{ color: 'var(--text-primary)' }}>{currentAlgorithm.spaceComplexity}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Run Action Button */}
        <div style={{ marginTop: 'auto', paddingTop: 8 }}>
          <button
            className="btn btn-success btn-sm"
            onClick={onRunAlgorithm}
            disabled={isRunning || vertices.length === 0}
            style={{ width: '100%', padding: '10px 14px', fontSize: '0.88rem', fontWeight: 600 }}
          >
            <Play size={16} /> Run {currentAlgorithm?.name || 'Algorithm'}
          </button>
        </div>
      </div>
    </div>
  );
};
