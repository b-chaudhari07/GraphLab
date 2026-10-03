/**
 * Graph mathematical property calculators according to Discrete Mathematics (7MA206).
 * Module V: Graph and Trees.
 */

import type { Vertex, Edge, GraphConfig, GraphMetrics, VertexDegree, AdjacencyMatrix, AdjacencyList } from '../types/graph';

/**
 * Calculates vertex degree distributions for undirected and directed graphs.
 * - Undirected graph: Handshaking Lemma \sum deg(v) = 2|E|. Self-loop adds 2 to deg(v).
 * - Directed graph: in-degree, out-degree, and total degree = in-degree + out-degree. Self-loop adds 1 to in-degree & 1 to out-degree.
 */
export function calculateVertexDegrees(
  vertices: Vertex[],
  edges: Edge[],
  isDirected: boolean
): Record<string, VertexDegree> {
  const degrees: Record<string, VertexDegree> = {};

  vertices.forEach((v) => {
    degrees[v.id] = {
      vertexId: v.id,
      label: v.label,
      inDegree: 0,
      outDegree: 0,
      totalDegree: 0,
    };
  });

  edges.forEach((edge) => {
    const isSelfLoop = edge.source === edge.target;

    if (isDirected) {
      // Directed graph degree counting
      if (degrees[edge.source]) {
        degrees[edge.source].outDegree += 1;
      }
      if (degrees[edge.target]) {
        degrees[edge.target].inDegree += 1;
      }
    } else {
      // Undirected graph degree counting
      if (isSelfLoop) {
        if (degrees[edge.source]) {
          // Self-loop contributes +2 to total degree of an undirected vertex
          degrees[edge.source].totalDegree += 2;
          degrees[edge.source].inDegree += 1;
          degrees[edge.source].outDegree += 1;
        }
      } else {
        if (degrees[edge.source]) {
          degrees[edge.source].totalDegree += 1;
          degrees[edge.source].outDegree += 1;
        }
        if (degrees[edge.target]) {
          degrees[edge.target].totalDegree += 1;
          degrees[edge.target].inDegree += 1;
        }
      }
    }
  });

  // Calculate total degrees for directed graph
  vertices.forEach((v) => {
    const deg = degrees[v.id];
    if (isDirected) {
      deg.totalDegree = deg.inDegree + deg.outDegree;
    }
  });

  return degrees;
}

/**
 * Generates Adjacency Matrix representation.
 * - Matrix dimension: |V| x |V|
 * - Rows and columns indexed by current vertices
 * - Entry (i, j) represents edge from vertex i to vertex j (weight or 1)
 * - Symmetric for undirected graphs
 */
export function calculateAdjacencyMatrix(
  vertices: Vertex[],
  edges: Edge[],
  config: GraphConfig
): AdjacencyMatrix {
  const headers = vertices.map((v) => v.label);
  const n = vertices.length;

  // Initialize n x n matrix with 0
  const matrix: (number | string)[][] = Array.from({ length: n }, () => Array(n).fill(0));

  const vertexIndexMap: Record<string, number> = {};
  vertices.forEach((v, idx) => {
    vertexIndexMap[v.id] = idx;
  });

  edges.forEach((edge) => {
    const srcIdx = vertexIndexMap[edge.source];
    const tgtIdx = vertexIndexMap[edge.target];

    if (srcIdx !== undefined && tgtIdx !== undefined) {
      const val = config.isWeighted ? (edge.weight ?? 1) : 1;

      matrix[srcIdx][tgtIdx] = val;

      if (!config.isDirected) {
        matrix[tgtIdx][srcIdx] = val;
      }
    }
  });

  return { headers, matrix };
}

/**
 * Generates Adjacency List representation.
 * - Preserves directionality for directed graphs
 * - Preserves edge weights if graph is weighted
 * - Keys correspond to vertex labels
 */
export function calculateAdjacencyList(
  vertices: Vertex[],
  edges: Edge[],
  config: GraphConfig
): AdjacencyList {
  const adjList: AdjacencyList = {};

  vertices.forEach((v) => {
    adjList[v.label] = [];
  });

  const vertexMap: Record<string, Vertex> = {};
  vertices.forEach((v) => {
    vertexMap[v.id] = v;
  });

  edges.forEach((edge) => {
    const src = vertexMap[edge.source];
    const tgt = vertexMap[edge.target];
    const isSelfLoop = edge.source === edge.target;

    if (src && tgt) {
      adjList[src.label].push({
        targetId: tgt.id,
        targetLabel: tgt.label,
        weight: config.isWeighted ? edge.weight : undefined,
      });

      if (!config.isDirected && !isSelfLoop) {
        adjList[tgt.label].push({
          targetId: src.id,
          targetLabel: src.label,
          weight: config.isWeighted ? edge.weight : undefined,
        });
      }
    }
  });

  return adjList;
}

/**
 * Computes live graph metrics summary.
 */
export function computeGraphMetrics(
  vertices: Vertex[],
  edges: Edge[],
  config: GraphConfig
): GraphMetrics {
  const degrees = calculateVertexDegrees(vertices, edges, config.isDirected);
  const adjacencyMatrix = calculateAdjacencyMatrix(vertices, edges, config);
  const adjacencyList = calculateAdjacencyList(vertices, edges, config);

  const n = vertices.length;
  const m = edges.length;

  // Tree property check: Undirected, connected, and |E| = |V| - 1
  const isTree = !config.isDirected && n > 0 && m === n - 1;

  return {
    vertexCount: n,
    edgeCount: m,
    degrees,
    adjacencyMatrix,
    adjacencyList,
    isConnected: n > 0,
    isTree,
  };
}
