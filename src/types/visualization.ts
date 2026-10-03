/**
 * Types for SVG Graph Visualization and Interactive Canvas state.
 */

export type CanvasMode = 'select' | 'add-vertex' | 'add-edge' | 'delete';

export interface SelectionState {
  selectedVertexId: string | null;
  selectedEdgeId: string | null;
  edgeSourceVertexId: string | null; // For 2-click edge creation
}

export interface NodePosition {
  x: number;
  y: number;
}

export type ThemeMode = 'dark' | 'light';
