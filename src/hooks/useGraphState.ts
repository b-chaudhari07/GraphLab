import { useState, useMemo, useCallback } from 'react';
import type { Vertex, Edge, GraphConfig } from '../types/graph';
import type { CanvasMode, SelectionState } from '../types/visualization';
import { computeGraphMetrics } from '../utils/graphUtils';
import { PRESET_GRAPHS } from '../data/presetGraphs';
import {
  validateVertexLabel,
  validateEdgeConnection,
} from '../utils/validation';

export function useGraphState() {
  // Initial clean state: Empty graph with default configuration
  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [config, setConfig] = useState<GraphConfig>({
    isDirected: false,
    isWeighted: false,
    allowSelfLoops: false,
  });

  const [canvasMode, setCanvasMode] = useState<CanvasMode>('select');
  const [selection, setSelection] = useState<SelectionState>({
    selectedVertexId: null,
    selectedEdgeId: null,
    edgeSourceVertexId: null,
  });

  // User-facing validation feedback message state
  const [validationError, setValidationError] = useState<string | null>(null);

  const clearValidationError = useCallback(() => {
    setValidationError(null);
  }, []);

  // Calculate next auto-generated unique label (e.g., "1", "2", "3" avoiding duplicates)
  const getNextVertexLabel = useCallback(() => {
    let candidateNumber = vertices.length + 1;
    while (vertices.some((v) => v.label === `${candidateNumber}`)) {
      candidateNumber += 1;
    }
    return `${candidateNumber}`;
  }, [vertices]);

  // Add Vertex with validation
  const addVertex = useCallback(
    (x: number, y: number, customLabel?: string): Vertex | null => {
      const label = customLabel ? customLabel.trim() : getNextVertexLabel();

      // Validate label
      const validation = validateVertexLabel(label, vertices);
      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid vertex label.');
        return null;
      }

      setValidationError(null);
      const id = `v_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newVertex: Vertex = { id, label, x, y };

      setVertices((prev) => [...prev, newVertex]);
      return newVertex;
    },
    [vertices, getNextVertexLabel]
  );

  // Move Vertex
  const moveVertex = useCallback((id: string, x: number, y: number) => {
    setVertices((prev) => prev.map((v) => (v.id === id ? { ...v, x, y } : v)));
  }, []);

  // Add Edge with validation
  const addEdge = useCallback(
    (sourceId: string, targetId: string, weight?: number): Edge | null => {
      // Validate edge connection using validation utility
      const validation = validateEdgeConnection(
        sourceId,
        targetId,
        weight,
        vertices,
        edges,
        config
      );

      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid edge configuration.');
        return null;
      }

      setValidationError(null);
      const edgeId = `e_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newEdge: Edge = {
        id: edgeId,
        source: sourceId,
        target: targetId,
        weight: config.isWeighted ? (weight ?? 1) : undefined,
        isDirected: config.isDirected,
      };

      setEdges((prev) => [...prev, newEdge]);
      return newEdge;
    },
    [config, edges, vertices]
  );

  // Delete Vertex and cascade delete incident edges
  const deleteVertex = useCallback((id: string) => {
    setValidationError(null);
    setVertices((prev) => prev.filter((v) => v.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
    setSelection((prev) => ({
      selectedVertexId: prev.selectedVertexId === id ? null : prev.selectedVertexId,
      selectedEdgeId: prev.selectedEdgeId,
      edgeSourceVertexId: prev.edgeSourceVertexId === id ? null : prev.edgeSourceVertexId,
    }));
  }, []);

  // Delete Edge
  const deleteEdge = useCallback((id: string) => {
    setValidationError(null);
    setEdges((prev) => prev.filter((e) => e.id !== id));
    setSelection((prev) => ({
      ...prev,
      selectedEdgeId: prev.selectedEdgeId === id ? null : prev.selectedEdgeId,
    }));
  }, []);

  // Clear Canvas (removes all vertices & edges, preserves current config settings)
  const clearGraph = useCallback(() => {
    setValidationError(null);
    setVertices([]);
    setEdges([]);
    setSelection({ selectedVertexId: null, selectedEdgeId: null, edgeSourceVertexId: null });
  }, []);

  // Reset Graph (returns to clean initial state: 0 vertices, 0 edges, default config)
  const resetGraph = useCallback(() => {
    setValidationError(null);
    setVertices([]);
    setEdges([]);
    setConfig({
      isDirected: false,
      isWeighted: false,
      allowSelfLoops: false,
    });
    setCanvasMode('select');
    setSelection({ selectedVertexId: null, selectedEdgeId: null, edgeSourceVertexId: null });
  }, []);

  // Load Preset (the ONLY mechanism for loading Binary Tree, K4, Cycle C5, Weighted Digraph)
  const loadPreset = useCallback((presetId: string) => {
    setValidationError(null);
    const preset = PRESET_GRAPHS.find((p) => p.id === presetId);
    if (preset) {
      setVertices(preset.data.vertices);
      setEdges(preset.data.edges);
      setConfig(preset.data.config);
      setSelection({ selectedVertexId: null, selectedEdgeId: null, edgeSourceVertexId: null });
    }
  }, []);

  // Toggle Directed / Undirected
  const toggleDirected = useCallback((isDirected: boolean) => {
    setValidationError(null);
    setConfig((prev) => ({ ...prev, isDirected }));
    setEdges((prev) => prev.map((e) => ({ ...e, isDirected })));
  }, []);

  // Toggle Weighted / Unweighted
  const toggleWeighted = useCallback((isWeighted: boolean) => {
    setValidationError(null);
    setConfig((prev) => ({ ...prev, isWeighted }));
    setEdges((prev) =>
      prev.map((e) => ({
        ...e,
        weight: isWeighted ? (e.weight ?? 1) : undefined,
      }))
    );
  }, []);

  // Toggle Allow Self-Loops
  const toggleSelfLoops = useCallback((allowSelfLoops: boolean) => {
    setValidationError(null);
    setConfig((prev) => ({ ...prev, allowSelfLoops }));
    if (!allowSelfLoops) {
      setEdges((prev) => prev.filter((e) => e.source !== e.target));
    }
  }, []);

  // Compute graph metrics dynamically from canonical state
  const metrics = useMemo(() => {
    return computeGraphMetrics(vertices, edges, config);
  }, [vertices, edges, config]);

  return {
    vertices,
    edges,
    config,
    canvasMode,
    setCanvasMode,
    selection,
    setSelection,
    validationError,
    setValidationError,
    clearValidationError,
    addVertex,
    moveVertex,
    addEdge,
    deleteVertex,
    deleteEdge,
    clearGraph,
    resetGraph,
    loadPreset,
    toggleDirected,
    toggleWeighted,
    toggleSelfLoops,
    metrics,
  };
}
