import React, { useState } from 'react';
import type { GraphMetrics, GraphConfig } from '../../types/graph';
import { BarChart3, Grid, List, Activity } from 'lucide-react';

interface GraphInfoPanelProps {
  metrics: GraphMetrics;
  config: GraphConfig;
}

export const GraphInfoPanel: React.FC<GraphInfoPanelProps> = ({ metrics, config }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'matrix' | 'list' | 'degrees'>('overview');

  return (
    <div className="panel" style={{ height: '100%' }}>
      {/* Panel Header */}
      <div className="panel-header" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'flex', gap: 4, width: '100%' }}>
          <button
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('overview')}
            style={{ flex: 1, fontSize: '0.75rem', padding: '6px 4px' }}
          >
            <Activity size={12} /> Summary
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'matrix' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('matrix')}
            style={{ flex: 1, fontSize: '0.75rem', padding: '6px 4px' }}
          >
            <Grid size={12} /> Matrix
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'list' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('list')}
            style={{ flex: 1, fontSize: '0.75rem', padding: '6px 4px' }}
          >
            <List size={12} /> List
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'degrees' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('degrees')}
            style={{ flex: 1, fontSize: '0.75rem', padding: '6px 4px' }}
          >
            <BarChart3 size={12} /> Degrees
          </button>
        </div>
      </div>

      <div className="panel-content">
        {metrics.vertexCount === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No vertices present in canvas. Add vertices to inspect Discrete Mathematics graph properties.
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Vertices |V|</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                      {metrics.vertexCount}
                    </h3>
                  </div>

                  <div
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Edges |E|</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                      {metrics.edgeCount}
                    </h3>
                  </div>
                </div>

                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Directionality:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {config.isDirected ? 'Directed Graph' : 'Undirected Graph'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Weighting:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {config.isWeighted ? 'Weighted Edges' : 'Unweighted'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tree Property (|E| = |V|-1):</span>
                    <strong style={{ color: metrics.isTree ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                      {metrics.isTree ? 'Tree Structure' : 'General Graph'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Adjacency Matrix Tab */}
            {activeTab === 'matrix' && (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.78rem',
                    textAlign: 'center',
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ padding: 4, borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        \
                      </th>
                      {metrics.adjacencyMatrix.headers.map((h, i) => (
                        <th
                          key={i}
                          style={{
                            padding: 4,
                            borderBottom: '1px solid var(--border-color)',
                            color: 'var(--accent-blue)',
                            fontWeight: 700,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.adjacencyMatrix.matrix.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td
                          style={{
                            padding: 4,
                            borderRight: '1px solid var(--border-color)',
                            color: 'var(--accent-blue)',
                            fontWeight: 700,
                          }}
                        >
                          {metrics.adjacencyMatrix.headers[rIdx]}
                        </td>
                        {row.map((val, cIdx) => (
                          <td
                            key={cIdx}
                            style={{
                              padding: 6,
                              backgroundColor: val !== 0 ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                              color: val !== 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                              fontWeight: val !== 0 ? 600 : 400,
                              borderRadius: 4,
                            }}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Adjacency List Tab */}
            {activeTab === 'list' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem' }}>
                {Object.entries(metrics.adjacencyList).map(([vertexLabel, neighbors]) => (
                  <div
                    key={vertexLabel}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: 'var(--accent-blue)',
                        minWidth: 24,
                      }}
                    >
                      {vertexLabel} :
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {neighbors.length === 0 ? (
                        <em style={{ color: 'var(--text-muted)' }}>None (Isolated)</em>
                      ) : (
                        neighbors
                          .map((n) => `${n.targetLabel}${n.weight !== undefined ? ` (w:${n.weight})` : ''}`)
                          .join(' → ')
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Degrees Tab */}
            {activeTab === 'degrees' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem' }}>
                {Object.values(metrics.degrees).map((deg) => (
                  <div
                    key={deg.vertexId}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Node {deg.label}
                    </span>
                    <div style={{ display: 'flex', gap: 10, fontSize: '0.75rem' }}>
                      {config.isDirected ? (
                        <>
                          <span style={{ color: 'var(--accent-cyan)' }}>In: {deg.inDegree}</span>
                          <span style={{ color: 'var(--accent-amber)' }}>Out: {deg.outDegree}</span>
                        </>
                      ) : (
                        <span style={{ color: 'var(--accent-purple)' }}>deg({deg.label}): {deg.totalDegree}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
