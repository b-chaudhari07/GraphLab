import React from 'react';
import type { SyllabusAlgorithmId } from '../../types/algorithm';
import type { Vertex } from '../../types/graph';
import { SYLLABUS_ALGORITHMS, getAlgorithmById } from '../../algorithms';
import { Cpu, Clock, HardDrive, CheckCircle2 } from 'lucide-react';

interface AlgorithmPanelProps {
  selectedAlgorithmId: SyllabusAlgorithmId | null;
  startVertexId: string | null;
  vertices: Vertex[];
  onSelectAlgorithm: (algorithmId: SyllabusAlgorithmId | null) => void;
  onSelectStartVertex: (vertexId: string | null) => void;
}

export const AlgorithmPanel: React.FC<AlgorithmPanelProps> = ({
  selectedAlgorithmId,
  startVertexId,
  vertices,
  onSelectAlgorithm,
  onSelectStartVertex,
}) => {
  const currentAlgorithm = getAlgorithmById(selectedAlgorithmId);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">
          <Cpu size={16} color="var(--accent-purple)" /> Syllabus Algorithms (Module V)
        </span>
      </div>

      <div className="panel-content">
        {/* Algorithm Dropdown */}
        <div className="input-group">
          <label className="input-label">Select Discrete Math Algorithm</label>
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

        {/* Dynamic Start Vertex Dropdown */}
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

        {/* Algorithm Information Card */}
        {currentAlgorithm && (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentAlgorithm.name}
              </h4>
              <span className="badge badge-purple">7MA206</span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {currentAlgorithm.description}
            </p>

            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={12} /> Time Complexity: <strong style={{ color: 'var(--text-primary)' }}>{currentAlgorithm.timeComplexity}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <HardDrive size={12} /> Space Complexity: <strong style={{ color: 'var(--text-primary)' }}>{currentAlgorithm.spaceComplexity}</strong>
              </div>
            </div>

            <div
              style={{
                marginTop: 4,
                padding: '4px 8px',
                borderRadius: 4,
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--accent-emerald)',
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <CheckCircle2 size={12} /> Phase 1 Architecture Registered
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
