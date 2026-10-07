import React from 'react';
import type { Vertex, Edge, GraphConfig } from '../../types/graph';
import { X, List, Grid } from 'lucide-react';

interface AdjacencyOverlayModalProps {
  isOpen: boolean;
  type: 'list' | 'matrix' | null;
  onClose: () => void;
  vertices: Vertex[];
  edges: Edge[];
  config: GraphConfig;
}

export const AdjacencyOverlayModal: React.FC<AdjacencyOverlayModalProps> = ({
  isOpen,
  type,
  onClose,
  vertices,
  edges,
  config,
}) => {
  if (!isOpen || !type) return null;

  // Build Adjacency Matrix
  const n = vertices.length;
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const vIndexMap = new Map<string, number>();
  vertices.forEach((v, i) => vIndexMap.set(v.id, i));

  edges.forEach((e) => {
    const uIdx = vIndexMap.get(e.source);
    const vIdx = vIndexMap.get(e.target);
    if (uIdx !== undefined && vIdx !== undefined) {
      matrix[uIdx][vIdx] = e.weight ?? 1;
      if (!config.isDirected && e.source !== e.target) {
        matrix[vIdx][uIdx] = e.weight ?? 1;
      }
    }
  });

  // Build Adjacency List
  const adjListMap = new Map<string, string[]>();
  vertices.forEach((v) => adjListMap.set(v.id, []));

  edges.forEach((e) => {
    const sNode = vertices.find((v) => v.id === e.source);
    const tNode = vertices.find((v) => v.id === e.target);
    if (sNode && tNode) {
      const weightStr = config.isWeighted ? ` (w=${e.weight ?? 1})` : '';
      adjListMap.get(sNode.id)?.push(`${tNode.label}${weightStr}`);
      if (!config.isDirected && sNode.id !== tNode.id) {
        adjListMap.get(tNode.id)?.push(`${sNode.label}${weightStr}`);
      }
    }
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: type === 'matrix' ? 560 : 420,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {type === 'list' ? <List size={18} color="var(--accent-blue)" /> : <Grid size={18} color="var(--accent-purple)" />}
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              {type === 'list' ? 'Adjacency List' : 'Adjacency Matrix'}
            </h3>
          </div>
          <button className="btn btn-outline btn-sm btn-icon" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 16, maxHeight: '60vh', overflowY: 'auto' }}>
          {vertices.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Graph is empty (0 vertices).</p>
          ) : type === 'list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
              {vertices.map((v) => {
                const neighbors = adjListMap.get(v.id) || [];
                return (
                  <div
                    key={v.id}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <strong style={{ color: 'var(--accent-blue)', width: 24 }}>{v.label}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {neighbors.length > 0 ? neighbors.join(', ') : '∅ (No edges)'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                }}
              >
                <thead>
                  <tr>
                    <th style={{ padding: 8, borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}></th>
                    {vertices.map((v) => (
                      <th key={v.id} style={{ padding: 8, borderBottom: '2px solid var(--border-color)', color: 'var(--accent-purple)' }}>
                        {v.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vertices.map((v, i) => (
                    <tr key={v.id}>
                      <td style={{ padding: 8, fontWeight: 700, color: 'var(--accent-purple)', borderRight: '2px solid var(--border-color)' }}>
                        {v.label}
                      </td>
                      {vertices.map((_, j) => (
                        <td
                          key={j}
                          style={{
                            padding: 8,
                            backgroundColor: matrix[i][j] > 0 ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                            color: matrix[i][j] > 0 ? 'var(--accent-purple)' : 'var(--text-muted)',
                            fontWeight: matrix[i][j] > 0 ? 600 : 400,
                          }}
                        >
                          {matrix[i][j]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
