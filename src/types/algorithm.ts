/**
 * Types for Syllabus-Confirmed Algorithm Engine & Execution Architecture.
 * Course: Discrete Mathematics (7MA206) - Module V: Graph Theory & Trees
 */

export type SyllabusAlgorithmId =
  | 'connectivity'
  | 'eulerian'
  | 'hamiltonian';

export interface AlgorithmInfo {
  id: SyllabusAlgorithmId;
  name: string;
  moduleSection: string; // "Module V — Graph Theory & Trees"
  description: string;
  syllabusTopic: string;
  requiresStartVertex: boolean;
  supportsDirected: boolean;
  supportsWeighted: boolean;
  timeComplexity: string;
  spaceComplexity: string;
}

export type HamiltonianMode = 'path' | 'cycle';

export interface AlgorithmConfig {
  selectedAlgorithmId: SyllabusAlgorithmId | null;
  startVertexId: string | null;
  animationSpeed: number; // Interval in ms (e.g. 1000ms)
  hamiltonianMode?: HamiltonianMode;
}

export interface DataStructureSnapshot {
  queue?: string[];
  stack?: string[];
  visitedSet?: string[];
  unreachableSet?: string[];
  componentMap?: Record<string, number>;
  traversalPath?: string[];
  vertexDegrees?: Record<string, number>;
  resultSummary?: string;
  finalConclusion?: {
    success: boolean;
    title: string;
    message: string;
    details?: string[];
  };
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
