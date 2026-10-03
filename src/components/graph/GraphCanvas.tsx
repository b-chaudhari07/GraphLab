import React, { useRef, useState, useCallback } from 'react';
import type { Vertex, Edge, GraphConfig } from '../../types/graph';
import type { CanvasMode, SelectionState } from '../../types/visualization';
import { SvgVertex } from './SvgVertex';
import { SvgEdge } from './SvgEdge';
import { MousePointer, PlusCircle, Share2, Trash2, RotateCcw } from 'lucide-react';

interface GraphCanvasProps {
  vertices: Vertex[];
  edges: Edge[];
  config: GraphConfig;
  canvasMode: CanvasMode;
  setCanvasMode: (mode: CanvasMode) => void;
  selection: SelectionState;
  setSelection: React.Dispatch<React.SetStateAction<SelectionState>>;
  addVertex: (x: number, y: number) => Vertex;
  moveVertex: (id: string, x: number, y: number) => void;
  addEdge: (sourceId: string, targetId: string, weight?: number) => Edge | null;
  deleteVertex: (id: string) => void;
  deleteEdge: (id: string) => void;
  startVertexId?: string | null;
  activeVertexId?: string;
  visitedVertexIds?: string[];
  highlightEdgeIds?: string[];
  onLoadPreset?: (presetId: string) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  vertices,
  edges,
  config,
  canvasMode,
  setCanvasMode,
  selection,
  setSelection,
  addVertex,
  moveVertex,
  addEdge,
  deleteVertex,
  deleteEdge,
  startVertexId,
  activeVertexId,
  visitedVertexIds = [],
  highlightEdgeIds = [],
  onLoadPreset,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingVertexId, setDraggingVertexId] = useState<string | null>(null);

  // Helper to convert mouse event to SVG relative coordinates
  const getSvgCoordinates = useCallback((e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  }, []);

  // Canvas click handler
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Prevent if clicking on vertex or edge
    if ((e.target as HTMLElement).tagName !== 'svg' && (e.target as HTMLElement).tagName !== 'rect') {
      return;
    }

    const { x, y } = getSvgCoordinates(e);

    if (canvasMode === 'add-vertex') {
      addVertex(x, y);
    } else if (canvasMode === 'select') {
      setSelection({ selectedVertexId: null, selectedEdgeId: null, edgeSourceVertexId: null });
    }
  };

  // Node mouse down (start drag or start edge)
  const handleVertexMouseDown = (e: React.MouseEvent, vertex: Vertex) => {
    e.stopPropagation();

    if (canvasMode === 'select') {
      setDraggingVertexId(vertex.id);
      setSelection((prev) => ({ ...prev, selectedVertexId: vertex.id, selectedEdgeId: null }));
    }
  };

  // Node click (selection / edge connection / deletion)
  const handleVertexClick = (e: React.MouseEvent, vertex: Vertex) => {
    e.stopPropagation();

    if (canvasMode === 'delete') {
      deleteVertex(vertex.id);
      return;
    }

    if (canvasMode === 'add-edge') {
      if (!selection.edgeSourceVertexId) {
        // Step 1: Select source node
        setSelection((prev) => ({ ...prev, edgeSourceVertexId: vertex.id }));
      } else {
        // Step 2: Select target node & complete edge
        const sourceId = selection.edgeSourceVertexId;
        const targetId = vertex.id;

        let weight: number | undefined = undefined;
        if (config.isWeighted) {
          const input = prompt(`Enter edge weight from node ${vertices.find(v=>v.id===sourceId)?.label} to node ${vertex.label}:`, '1');
          if (input !== null) {
            const parsed = parseFloat(input);
            weight = isNaN(parsed) ? 1 : parsed;
          } else {
            setSelection((prev) => ({ ...prev, edgeSourceVertexId: null }));
            return;
          }
        }

        addEdge(sourceId, targetId, weight);
        setSelection((prev) => ({ ...prev, edgeSourceVertexId: null }));
      }
    }
  };

  // Canvas mouse move for node dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingVertexId && canvasMode === 'select') {
      const { x, y } = getSvgCoordinates(e);
      // Constrain within padding
      const clampedX = Math.max(30, Math.min(x, (svgRef.current?.clientWidth || 800) - 30));
      const clampedY = Math.max(30, Math.min(y, (svgRef.current?.clientHeight || 600) - 30));
      moveVertex(draggingVertexId, clampedX, clampedY);
    }
  };

  const handleMouseUp = () => {
    setDraggingVertexId(null);
  };

  // Edge click
  const handleEdgeClick = (e: React.MouseEvent, edge: Edge) => {
    e.stopPropagation();
    if (canvasMode === 'delete') {
      deleteEdge(edge.id);
    } else {
      setSelection((prev) => ({ ...prev, selectedEdgeId: edge.id, selectedVertexId: null }));
    }
  };

  const vertexMap = React.useMemo(() => {
    const map = new Map<string, Vertex>();
    vertices.forEach((v) => map.set(v.id, v));
    return map;
  }, [vertices]);

  const sourceVertexForPendingEdge = selection.edgeSourceVertexId
    ? vertexMap.get(selection.edgeSourceVertexId)
    : null;

  return (
    <div className="canvas-container" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Canvas Tool Overlay */}
      <div
        className="canvas-toolbar"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          display: 'flex',
          gap: 6,
          backgroundColor: 'var(--bg-secondary)',
          padding: 6,
          borderRadius: 8,
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <button
          className={`btn btn-sm ${canvasMode === 'select' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            setCanvasMode('select');
            setSelection((prev) => ({ ...prev, edgeSourceVertexId: null }));
          }}
          title="Select / Drag Vertices"
        >
          <MousePointer size={14} /> Move / Select
        </button>
        <button
          className={`btn btn-sm ${canvasMode === 'add-vertex' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            setCanvasMode('add-vertex');
            setSelection((prev) => ({ ...prev, edgeSourceVertexId: null }));
          }}
          title="Click canvas to add new Vertex"
        >
          <PlusCircle size={14} /> Add Vertex
        </button>
        <button
          className={`btn btn-sm ${canvasMode === 'add-edge' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => {
            setCanvasMode('add-edge');
            setSelection((prev) => ({ ...prev, edgeSourceVertexId: null }));
          }}
          title="Click source vertex then target vertex to connect"
        >
          <Share2 size={14} /> Add Edge
        </button>
        <button
          className={`btn btn-sm ${canvasMode === 'delete' ? 'btn-danger' : 'btn-outline'}`}
          onClick={() => {
            setCanvasMode('delete');
            setSelection((prev) => ({ ...prev, edgeSourceVertexId: null }));
          }}
          title="Click node or edge to erase"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>

      {/* Pending Edge Helper Tooltip */}
      {canvasMode === 'add-edge' && sourceVertexForPendingEdge && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            padding: '6px 12px',
            backgroundColor: 'var(--accent-amber)',
            color: '#000',
            fontWeight: 600,
            borderRadius: 6,
            fontSize: '0.8rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          Connecting from Vertex {sourceVertexForPendingEdge.label} — Click target node to finish!
        </div>
      )}

      {/* SVG Canvas Area */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--bg-primary)',
          backgroundImage: `radial-gradient(var(--grid-dot) 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
          cursor: canvasMode === 'add-vertex' ? 'crosshair' : 'default',
        }}
      >
        {/* SVG Arrowhead Markers */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--edge-default)" />
          </marker>
          <marker
            id="arrowhead-selected"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--edge-selected)" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--edge-active)" />
          </marker>
        </defs>

        {/* Empty Canvas State */}
        {vertices.length === 0 && (
          <g transform="translate(400, 260)">
            <text
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize="18"
              fontWeight="600"
            >
              No graph created yet
            </text>
            <text
              y="28"
              textAnchor="middle"
              fill="var(--text-secondary)"
              fontSize="13"
            >
              Click "Add Vertex" or load a sample Discrete Mathematics graph below.
            </text>
          </g>
        )}

        {/* Render Edges */}
        {edges.map((edge) => {
          const src = vertexMap.get(edge.source);
          const tgt = vertexMap.get(edge.target);
          if (!src || !tgt) return null;

          return (
            <SvgEdge
              key={edge.id}
              edge={edge}
              sourceVertex={src}
              targetVertex={tgt}
              isSelected={selection.selectedEdgeId === edge.id}
              isVisited={false}
              isActive={highlightEdgeIds.includes(edge.id)}
              onClick={handleEdgeClick}
            />
          );
        })}

        {/* Render Vertices */}
        {vertices.map((vertex) => (
          <SvgVertex
            key={vertex.id}
            vertex={vertex}
            isSelected={selection.selectedVertexId === vertex.id || selection.edgeSourceVertexId === vertex.id}
            isStartNode={vertex.id === startVertexId}
            isVisited={visitedVertexIds.includes(vertex.id)}
            isActive={vertex.id === activeVertexId}
            onMouseDown={handleVertexMouseDown}
            onClick={handleVertexClick}
          />
        ))}
      </svg>

      {/* Empty State CTA Bar when vertices === 0 */}
      {vertices.length === 0 && onLoadPreset && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
          }}
        >
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onLoadPreset('binary-tree')}
          >
            <RotateCcw size={14} /> Load Binary Tree
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onLoadPreset('complete-k4')}
          >
            Load K4 Complete Graph
          </button>
        </div>
      )}
    </div>
  );
};
