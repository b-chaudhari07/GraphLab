import React, { useState } from 'react';
import type { GraphConfig, Vertex } from '../../types/graph';
import { PRESET_GRAPHS } from '../../data/presetGraphs';
import { Plus, Trash2, ArrowRightLeft, Hash, Layers, RefreshCw, Repeat } from 'lucide-react';
import { validateVertexLabel, validateEdgeWeight } from '../../utils/validation';

interface GraphControlsProps {
  config: GraphConfig;
  vertices: Vertex[];
  selectedVertexId: string | null;
  selectedEdgeId: string | null;
  onToggleDirected: (isDirected: boolean) => void;
  onToggleWeighted: (isWeighted: boolean) => void;
  onToggleSelfLoops: (allowSelfLoops: boolean) => void;
  onAddVertex: (x: number, y: number, label?: string) => Vertex | null;
  onAddEdge: (sourceId: string, targetId: string, weight?: number) => void;
  onDeleteVertex: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onClearGraph: () => void;
  onResetGraph: () => void;
  onLoadPreset: (presetId: string) => void;
  validationError: string | null;
  setValidationError: (msg: string | null) => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  config,
  vertices,
  selectedVertexId,
  selectedEdgeId,
  onToggleDirected,
  onToggleWeighted,
  onToggleSelfLoops,
  onAddVertex,
  onAddEdge,
  onDeleteVertex,
  onDeleteEdge,
  onClearGraph,
  onResetGraph,
  onLoadPreset,
  validationError,
  setValidationError,
}) => {
  // Form states for manual edge creation
  const [sourceVertexId, setSourceVertexId] = useState<string>('');
  const [targetVertexId, setTargetVertexId] = useState<string>('');
  const [edgeWeight, setEdgeWeight] = useState<string>('1');

  // Form state for vertex creation
  const [vertexLabel, setVertexLabel] = useState<string>('');

  const handleManualAddVertex = (e: React.FormEvent) => {
    e.preventDefault();
    const label = vertexLabel.trim();
    if (!label) {
      setValidationError('Vertex label cannot be empty or blank.');
      return;
    }

    const validation = validateVertexLabel(label, vertices);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid label.');
      return;
    }

    // Default canvas placement
    const x = Math.floor(250 + Math.random() * 300);
    const y = Math.floor(150 + Math.random() * 200);
    const result = onAddVertex(x, y, label);
    if (result) {
      setVertexLabel('');
    }
  };

  const handleManualAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceVertexId || !targetVertexId) {
      setValidationError('Both source and target vertices must be selected.');
      return;
    }

    let weight: number | undefined = undefined;
    if (config.isWeighted) {
      const weightVal = validateEdgeWeight(edgeWeight);
      if (!weightVal.isValid) {
        setValidationError(weightVal.error || 'Invalid edge weight.');
        return;
      }
      weight = parseFloat(edgeWeight);
    }

    onAddEdge(sourceVertexId, targetVertexId, weight);
  };

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span className="panel-title">
          <Layers size={16} color="var(--accent-blue)" /> Graph Controls & Builder
        </span>
      </div>

      <div className="panel-content">
        {/* Preset Selector */}
        <div className="input-group">
          <label className="input-label">Load Preset Sample Graph</label>
          <select
            className="select-field"
            onChange={(e) => {
              if (e.target.value) onLoadPreset(e.target.value);
            }}
            defaultValue=""
          >
            <option value="" disabled>-- Select Preset --</option>
            {PRESET_GRAPHS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Configuration Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="toggle-switch">
            <span className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowRightLeft size={14} /> Directed Graph
            </span>
            <input
              type="checkbox"
              checked={config.isDirected}
              onChange={(e) => onToggleDirected(e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
          </div>

          <div className="toggle-switch">
            <span className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Hash size={14} /> Weighted Edges
            </span>
            <input
              type="checkbox"
              checked={config.isWeighted}
              onChange={(e) => onToggleWeighted(e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
          </div>

          <div className="toggle-switch">
            <span className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Repeat size={14} /> Allow Self-Loops
            </span>
            <input
              type="checkbox"
              checked={config.allowSelfLoops}
              onChange={(e) => onToggleSelfLoops(e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Add Vertex Form */}
        <form onSubmit={handleManualAddVertex} className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
          <label className="input-label">Add New Vertex</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              className="input-field"
              placeholder={`Label (e.g. ${vertices.length + 1})`}
              value={vertexLabel}
              onChange={(e) => {
                setVertexLabel(e.target.value);
                if (validationError) setValidationError(null);
              }}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Plus size={14} /> Add
            </button>
          </div>
        </form>

        {/* Add Edge Form */}
        <form onSubmit={handleManualAddEdge} className="input-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
          <label className="input-label">Add Edge Connection</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <select
                className="select-field"
                value={sourceVertexId}
                onChange={(e) => {
                  setSourceVertexId(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                style={{ flex: 1 }}
              >
                <option value="">Source Node</option>
                {vertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    Node {v.label}
                  </option>
                ))}
              </select>

              <select
                className="select-field"
                value={targetVertexId}
                onChange={(e) => {
                  setTargetVertexId(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                style={{ flex: 1 }}
              >
                <option value="">Target Node</option>
                {vertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    Node {v.label}
                  </option>
                ))}
              </select>
            </div>

            {config.isWeighted && (
              <input
                type="number"
                step="any"
                className="input-field"
                placeholder="Edge Weight (e.g. 5)"
                value={edgeWeight}
                onChange={(e) => {
                  setEdgeWeight(e.target.value);
                  if (validationError) setValidationError(null);
                }}
              />
            )}

            <button
              type="submit"
              className="btn btn-outline btn-sm"
              disabled={!sourceVertexId || !targetVertexId || vertices.length < 1}
            >
              <Plus size={14} /> Connect Edge
            </button>
          </div>
        </form>

        {/* Selected Item Management */}
        {(selectedVertexId || selectedEdgeId) && (
          <div
            style={{
              padding: 10,
              borderRadius: 6,
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
              {selectedVertexId
                ? `Vertex "${vertices.find((v) => v.id === selectedVertexId)?.label}" Selected`
                : 'Edge Selected'}
            </span>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (selectedVertexId) onDeleteVertex(selectedVertexId);
                if (selectedEdgeId) onDeleteEdge(selectedEdgeId);
              }}
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        )}

        {/* Clear Canvas & Reset Actions */}
        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-color)', display: 'flex', gap: 6 }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
            onClick={onClearGraph}
            title="Remove all vertices and edges"
          >
            <Trash2 size={13} /> Clear Canvas
          </button>
          <button
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
            onClick={onResetGraph}
            title="Reset to clean initial state"
          >
            <RefreshCw size={13} /> Reset Graph
          </button>
        </div>
      </div>
    </div>
  );
};
