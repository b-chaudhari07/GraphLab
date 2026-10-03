/**
 * Domain types for GraphLab graph representation.
 * Discrete Mathematics (7MA206) - Module V: Graph and Trees
 */

export interface Vertex {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
}

export interface Edge {
  id: string;
  source: string; // Vertex ID
  target: string; // Vertex ID
  weight?: number;
  isDirected?: boolean;
  label?: string;
}

export interface GraphConfig {
  isDirected: boolean;
  isWeighted: boolean;
  allowSelfLoops: boolean;
}

export interface GraphData {
  vertices: Vertex[];
  edges: Edge[];
  config: GraphConfig;
}

export interface VertexDegree {
  vertexId: string;
  label: string;
  inDegree: number;
  outDegree: number;
  totalDegree: number;
}

export interface AdjacencyMatrix {
  headers: string[];
  matrix: (number | string)[][];
}

export interface AdjacencyListItem {
  targetId: string;
  targetLabel: string;
  weight?: number;
}

export type AdjacencyList = Record<string, AdjacencyListItem[]>;

export interface GraphMetrics {
  vertexCount: number;
  edgeCount: number;
  degrees: Record<string, VertexDegree>;
  adjacencyMatrix: AdjacencyMatrix;
  adjacencyList: AdjacencyList;
  isConnected: boolean;
  isTree: boolean;
}
