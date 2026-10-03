import React, { useState } from 'react';
import type { GraphConfig, Vertex, Edge } from '../../types/graph';
import { PRESET_GRAPHS } from '../../data/presetGraphs';
import { Plus, Trash2, ArrowRightLeft, Hash, Layers, RefreshCw } from 'lucide-react';

interface GraphControlsProps {
  config: GraphConfig;
  vertices: Vertex[];
  edges?: Edge[];
  selectedVertexId: string | null;
  selectedEdgeId: string | null;
  onToggleDirected: (isDirected: boolean) => void;
  onToggleWeighted: (isWeighted: boolean) => void;
  onAddVertex: (x: number, y: number, label?: string) => void;
  onAddEdge: (sourceId: string, targetId: string, weight?: number) => void;
  onDeleteVertex: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onClearGraph: () => void;
  onLoadPreset: (presetId: string) => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  config,
  vertices,
  selectedVertexId,
  selectedEdgeId,
  onToggleDirected,
  onToggleWeighted,
  onAddVertex,
  onAddEdge,
  onDeleteVertex,
  onDeleteEdge,
  onClearGraph,
  onLoadPreset,
}) => {
  // Form states for manual edge creation
  const [sourceVertexId, setSourceVertexId] = useState<string>('');
  const [targetVertexId, setTargetVertexId] = useState<string>('');
  const [edgeWeight, setEdgeWeight] = useState<string>('1');

  // Form state for vertex creation
  const [vertexLabel, setVertexLabel] = useState<string>('');

  const handleManualAddVertex = (e: React.FormEvent) => {
    e.preventDefault();
    // Default canvas center positioning for manually typed vertex
    const x = Math.floor(250 + Math.random() * 300);
    const y = Math.floor(150 + Math.random() * 200);
    onAddVertex(x, y, vertexLabel.trim() || undefined);
    setVertexLabel('');
  };

  const handleManualAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceVertexId || !targetVertexId) return;

    const weight = config.isWeighted ? parseFloat(edgeWeight) || 1 : undefined;
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
          <label className="input-label">Load Preset Discrete Math Graph</label>
          <select
            className="select-field"
            onChange={(e) => onLoadPreset(e.target.value)}
            defaultValue="binary-tree"
          >
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
              onChange={(e) => setVertexLabel(e.target.value)}
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
                onChange={(e) => setSourceVertexId(e.target.value)}
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
                onChange={(e) => setTargetVertexId(e.target.value)}
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
                className="input-field"
                placeholder="Edge Weight"
                value={edgeWeight}
                onChange={(e) => setEdgeWeight(e.target.value)}
              />
            )}

            <button
              type="submit"
              className="btn btn-outline btn-sm"
              disabled={!sourceVertexId || !targetVertexId}
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

        {/* Clear Canvas Action */}
        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={onClearGraph}>
            <RefreshCw size={14} /> Clear Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
