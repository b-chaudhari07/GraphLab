/**
 * Types for Algorithm Engine & Execution Architecture.
 * Designed strictly according to Discrete Mathematics (7MA206) Module V syllabus.
 */

export type SyllabusAlgorithmId =
  | 'bfs'
  | 'dfs'
  | 'kruskal'
  | 'prim'
  | 'euler'
  | 'hamiltonian'
  | 'coloring'
  | 'tree-traversal';

export interface AlgorithmInfo {
  id: SyllabusAlgorithmId;
  name: string;
  moduleSection: string; // "Module V — Graph and Trees"
  description: string;
  syllabusTopic: string;
  requiresStartVertex: boolean;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface AlgorithmConfig {
  selectedAlgorithmId: SyllabusAlgorithmId | null;
  startVertexId: string | null;
  animationSpeed: number; // Interval in ms (e.g. 1000ms)
}

export interface DataStructureSnapshot {
  queue?: string[];
  stack?: string[];
  visitedSet?: string[];
  colorMap?: Record<string, string>; // VertexId -> Color Name/Hex
  mstEdgeIds?: string[];
  vertexDegrees?: Record<string, number>;
  traversalOrder?: string[];
}

export interface AlgorithmStep {
  stepIndex: number;
  title: string;
  description: string;
  action: string;
  reason: string; // Discrete Math mathematical condition or rule justification
  activeVertexId?: string;
  visitedVertexIds?: string[];
  highlightEdgeIds?: string[];
  visitedEdgeIds?: string[];
  dataStructures?: DataStructureSnapshot;
}

export type ExecutionStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface AlgorithmExecutionState {
  status: ExecutionStatus;
  currentStepIndex: number;
  steps: AlgorithmStep[];
  config: AlgorithmConfig;
}
