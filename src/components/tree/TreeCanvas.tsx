import React from 'react';
import type { TreeData } from '../../tree/types';
import { ZoomIn, ZoomOut, Maximize2, Settings, List, Grid } from 'lucide-react';

interface TreeCanvasProps {
  tree: TreeData;
  activeNodeId?: string | null;
  visitedNodeIds?: string[];
  onOpenAdjacency?: (type: 'list' | 'matrix') => void;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  tree,
  activeNodeId,
  visitedNodeIds = [],
  onOpenAdjacency,
}) => {
  const nodeMap = new Map();
  tree.nodes.forEach((n) => nodeMap.set(n.id, n));

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Corner Action Overlay Shortcuts */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          zIndex: 10,
          display: 'flex',
          gap: 8,
        }}
      >
        {onOpenAdjacency && (
          <>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onOpenAdjacency('list')}
              style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', fontSize: '0.78rem' }}
            >
              <List size={14} /> Show as List
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onOpenAdjacency('matrix')}
              style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(8px)', fontSize: '0.78rem' }}
            >
              <Grid size={14} /> Show as Matrix
            </button>
          </>
        )}
      </div>

      {/* Canvas Tool Controls (Zoom/Fit/Settings) */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 8,
          padding: 4,
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <button className="btn btn-outline btn-sm btn-icon" title="Zoom In">
          <ZoomIn size={14} />
        </button>
        <button className="btn btn-outline btn-sm btn-icon" title="Zoom Out">
          <ZoomOut size={14} />
        </button>
        <button className="btn btn-outline btn-sm btn-icon" title="Fit to Screen">
          <Maximize2 size={14} />
        </button>
        <button className="btn btn-outline btn-sm btn-icon" title="Canvas Settings">
          <Settings size={14} />
        </button>
      </div>

      {/* SVG Canvas Content */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 320"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        {/* Render Tree Edges */}
        {tree.nodes.map((node) => {
          const edgesToRender = [];
          if (node.leftId && nodeMap.has(node.leftId)) {
            edgesToRender.push(nodeMap.get(node.leftId));
          }
          if (node.rightId && nodeMap.has(node.rightId)) {
            edgesToRender.push(nodeMap.get(node.rightId));
          }

          return edgesToRender.map((targetNode) => (
            <line
              key={`edge-${node.id}-${targetNode.id}`}
              x1={node.x}
              y1={node.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke="var(--edge-default)"
              strokeWidth="2"
            />
          ));
        })}

        {/* Render Tree Nodes */}
        {tree.nodes.map((node) => {
          const isActive = activeNodeId === node.id;
          const isVisited = visitedNodeIds.includes(node.id);

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              {/* Active Pulse Aura */}
              {isActive && (
                <circle
                  r="28"
                  fill="rgba(59, 130, 246, 0.25)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  style={{ animation: 'pulse 1.5s infinite' }}
                />
              )}

              {/* Node Circle */}
              <circle
                r="20"
                fill={isActive ? 'var(--accent-blue)' : isVisited ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-secondary)'}
                stroke={isActive ? 'var(--accent-blue)' : isVisited ? 'var(--accent-blue)' : 'var(--border-color)'}
                strokeWidth={isActive ? '3' : '2'}
              />

              {/* Node Label */}
              <text
                textAnchor="middle"
                dy=".35em"
                fontSize="15"
                fontWeight="600"
                fill={isActive ? '#ffffff' : 'var(--text-primary)'}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
