import React from 'react';
import type { Edge, Vertex } from '../../types/graph';
import { getAdjustedEdgeEndpoints, getCurvedEdgePath, getSelfLoopPath } from '../../utils/geometry';

interface SvgEdgeProps {
  edge: Edge;
  sourceVertex: Vertex;
  targetVertex: Vertex;
  isDualEdge?: boolean; // True if reverse edge B -> A also exists in directed graph
  isSelected?: boolean;
  isVisited?: boolean;
  isActive?: boolean;
  onClick: (e: React.MouseEvent, edge: Edge) => void;
}

export const SvgEdge: React.FC<SvgEdgeProps> = ({
  edge,
  sourceVertex,
  targetVertex,
  isDualEdge,
  isSelected,
  isVisited,
  isActive,
  onClick,
}) => {
  const isSelfLoop = edge.source === edge.target;

  let strokeColor = 'var(--edge-default)';
  let strokeWidth = 2;

  if (isSelected) {
    strokeColor = 'var(--edge-selected)';
    strokeWidth = 3.5;
  } else if (isActive) {
    strokeColor = 'var(--edge-active)';
    strokeWidth = 3.5;
  } else if (isVisited) {
    strokeColor = 'var(--edge-visited)';
    strokeWidth = 3;
  }

  // Case 1: Self-loop
  if (isSelfLoop) {
    const { path, labelPos } = getSelfLoopPath({ x: sourceVertex.x, y: sourceVertex.y });
    return (
      <g onClick={(e) => onClick(e, edge)} style={{ cursor: 'pointer' }}>
        <path
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          markerEnd={edge.isDirected ? 'url(#arrowhead)' : undefined}
        />
        {edge.weight !== undefined && (
          <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
            <rect
              x="-14"
              y="-10"
              width="28"
              height="20"
              rx="4"
              fill="var(--bg-secondary)"
              stroke={strokeColor}
              strokeWidth="1"
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--text-primary)"
              fontSize="11"
              fontWeight="600"
            >
              {edge.weight}
            </text>
          </g>
        )}
      </g>
    );
  }

  // Case 2: Dual directed edge (A -> B and B -> A both exist) -> Render curved Bezier arc
  if (edge.isDirected && isDualEdge) {
    const { path, labelPos } = getCurvedEdgePath(
      { x: sourceVertex.x, y: sourceVertex.y },
      { x: targetVertex.x, y: targetVertex.y }
    );

    return (
      <g onClick={(e) => onClick(e, edge)} style={{ cursor: 'pointer' }}>
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth="16"
        />
        <path
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={isActive ? '6 4' : undefined}
          markerEnd={`url(#arrowhead${isSelected ? '-selected' : isActive ? '-active' : ''})`}
          style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
        >
          {isActive && (
            <animate
              attributeName="stroke-dashoffset"
              values="20;0"
              dur="0.8s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {edge.weight !== undefined && (
          <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
            <rect
              x="-14"
              y="-10"
              width="28"
              height="20"
              rx="4"
              fill="var(--bg-secondary)"
              stroke={strokeColor}
              strokeWidth="1"
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--text-primary)"
              fontSize="11"
              fontWeight="600"
            >
              {edge.weight}
            </text>
          </g>
        )}
      </g>
    );
  }

  // Case 3: Standard straight line edge
  const { start, end, mid } = getAdjustedEdgeEndpoints(
    { x: sourceVertex.x, y: sourceVertex.y },
    { x: targetVertex.x, y: targetVertex.y }
  );

  return (
    <g onClick={(e) => onClick(e, edge)} style={{ cursor: 'pointer' }}>
      {/* Invisible wider stroke for easy click target */}
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="transparent"
        strokeWidth="16"
      />

      {/* Main Edge Line */}
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={isActive ? '6 4' : undefined}
        markerEnd={edge.isDirected ? `url(#arrowhead${isSelected ? '-selected' : isActive ? '-active' : ''})` : undefined}
        style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
      >
        {isActive && (
          <animate
            attributeName="stroke-dashoffset"
            values="20;0"
            dur="0.8s"
            repeatCount="indefinite"
          />
        )}
      </line>

      {/* Weight Label Badge */}
      {edge.weight !== undefined && (
        <g transform={`translate(${mid.x}, ${mid.y})`}>
          <rect
            x="-14"
            y="-10"
            width="28"
            height="20"
            rx="4"
            fill="var(--bg-secondary)"
            stroke={strokeColor}
            strokeWidth="1"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--text-primary)"
            fontSize="11"
            fontWeight="600"
          >
            {edge.weight}
          </text>
        </g>
      )}
    </g>
  );
};
