import React from 'react';
import type { Vertex } from '../../types/graph';
import { VERTEX_RADIUS } from '../../utils/geometry';

interface SvgVertexProps {
  vertex: Vertex;
  isSelected?: boolean;
  isStartNode?: boolean;
  isVisited?: boolean;
  isActive?: boolean;
  customColor?: string;
  onMouseDown: (e: React.MouseEvent, vertex: Vertex) => void;
  onClick: (e: React.MouseEvent, vertex: Vertex) => void;
}

export const SvgVertex: React.FC<SvgVertexProps> = ({
  vertex,
  isSelected,
  isStartNode,
  isVisited,
  isActive,
  customColor,
  onMouseDown,
  onClick,
}) => {
  // Determine fill & stroke classes based on state
  let bgFill = 'var(--vertex-default-bg)';
  let strokeColor = 'var(--vertex-default-stroke)';
  let textColor = 'var(--vertex-default-text)';

  if (isSelected) {
    bgFill = 'var(--vertex-selected-bg)';
    strokeColor = 'var(--vertex-selected-stroke)';
  } else if (isStartNode) {
    bgFill = 'var(--vertex-start-bg)';
    strokeColor = 'var(--vertex-start-stroke)';
  } else if (isActive) {
    bgFill = 'var(--vertex-active-bg)';
    strokeColor = 'var(--vertex-active-stroke)';
  } else if (isVisited) {
    bgFill = 'var(--vertex-visited-bg)';
    strokeColor = 'var(--vertex-visited-stroke)';
  }

  if (customColor) {
    bgFill = customColor;
    strokeColor = '#ffffff';
  }

  return (
    <g
      transform={`translate(${vertex.x}, ${vertex.y})`}
      onMouseDown={(e) => onMouseDown(e, vertex)}
      onClick={(e) => onClick(e, vertex)}
      style={{ cursor: 'pointer', userSelect: 'none' }}
      className="vertex-group"
    >
      {/* Active state pulse glow ring */}
      {isActive && (
        <circle
          r={VERTEX_RADIUS + 8}
          fill="none"
          stroke="var(--accent-amber)"
          strokeWidth="2.5"
          opacity="0.8"
        >
          <animate
            attributeName="r"
            values={`${VERTEX_RADIUS + 4};${VERTEX_RADIUS + 12};${VERTEX_RADIUS + 4}`}
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9;0.3;0.9"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Outer Selection Ring */}
      {isSelected && (
        <circle
          r={VERTEX_RADIUS + 5}
          fill="none"
          stroke="var(--accent-blue)"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />
      )}

      {/* Main Node Circle */}
      <circle
        r={VERTEX_RADIUS}
        fill={bgFill}
        stroke={strokeColor}
        strokeWidth={isSelected || isActive ? 3 : 2}
        style={{ transition: 'all 0.2s ease' }}
      />

      {/* Node Label Text */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        fontSize="14"
        fontWeight="600"
        pointerEvents="none"
      >
        {vertex.label}
      </text>

      {/* Start Node Badge */}
      {isStartNode && (
        <text
          x="0"
          y={-VERTEX_RADIUS - 8}
          textAnchor="middle"
          fill="var(--accent-emerald)"
          fontSize="10"
          fontWeight="700"
        >
          START
        </text>
      )}
    </g>
  );
};
