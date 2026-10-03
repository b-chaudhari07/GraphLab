/**
 * Graph Validation Utilities for GraphLab.
 * Provides reusable, structured validation rules according to Discrete Mathematics (7MA206).
 */

import type { Vertex, Edge, GraphConfig } from '../types/graph';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a vertex label for emptiness and uniqueness.
 */
export function validateVertexLabel(
  label: string,
  existingVertices: Vertex[],
  ignoreVertexId?: string
): ValidationResult {
  const trimmed = label.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Vertex label cannot be empty or blank.',
    };
  }

  const isDuplicate = existingVertices.some(
    (v) => v.id !== ignoreVertexId && v.label.toLowerCase() === trimmed.toLowerCase()
  );

  if (isDuplicate) {
    return {
      isValid: false,
      error: `Vertex label "${trimmed}" already exists. Labels must be unique.`,
    };
  }

  return { isValid: true };
}

/**
 * Validates an edge weight input.
 */
export function validateEdgeWeight(weightInput: number | string | undefined): ValidationResult {
  if (weightInput === undefined || weightInput === '') {
    return {
      isValid: false,
      error: 'Edge weight is required for weighted graphs.',
    };
  }

  const num = typeof weightInput === 'number' ? weightInput : Number(weightInput);

  if (isNaN(num) || !isFinite(num)) {
    return {
      isValid: false,
      error: 'Edge weight must be a valid finite number.',
    };
  }

  return { isValid: true };
}

/**
 * Validates an edge connection before adding to graph.
 */
export function validateEdgeConnection(
  sourceId: string,
  targetId: string,
  weight: number | undefined,
  vertices: Vertex[],
  edges: Edge[],
  config: GraphConfig
): ValidationResult {
  // 1. Verify existence of source vertex
  const sourceVertex = vertices.find((v) => v.id === sourceId);
  if (!sourceVertex) {
    return {
      isValid: false,
      error: 'Source vertex does not exist.',
    };
  }

  // 2. Verify existence of target vertex
  const targetVertex = vertices.find((v) => v.id === targetId);
  if (!targetVertex) {
    return {
      isValid: false,
      error: 'Target vertex does not exist.',
    };
  }

  // 3. Self-loop validation
  const isSelfLoop = sourceId === targetId;
  if (isSelfLoop && !config.allowSelfLoops) {
    return {
      isValid: false,
      error: `Self-loops are disabled in the current graph configuration. Enable "Allow Self-Loops" in controls to connect Node ${sourceVertex.label} to itself.`,
    };
  }

  // 4. Duplicate edge validation
  const isDuplicate = edges.some((e) => {
    if (config.isDirected) {
      // Directed: Exact source -> target match is duplicate
      return e.source === sourceId && e.target === targetId;
    } else {
      // Undirected: A-B and B-A are identical edges
      return (
        (e.source === sourceId && e.target === targetId) ||
        (e.source === targetId && e.target === sourceId)
      );
    }
  });

  if (isDuplicate) {
    const symbol = config.isDirected ? '→' : '—';
    return {
      isValid: false,
      error: `Edge between Node ${sourceVertex.label} ${symbol} Node ${targetVertex.label} already exists. Duplicate edges are not permitted in simple graphs.`,
    };
  }

  // 5. Weight validation if graph is weighted
  if (config.isWeighted) {
    const weightValidation = validateEdgeWeight(weight);
    if (!weightValidation.isValid) {
      return weightValidation;
    }
  }

  return { isValid: true };
}
