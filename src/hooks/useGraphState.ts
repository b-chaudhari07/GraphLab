import { useState, useMemo, useCallback } from 'react';
import type { Vertex, Edge, GraphConfig } from '../types/graph';
import type { CanvasMode, SelectionState } from '../types/visualization';
import { computeGraphMetrics } from '../utils/graphUtils';
import { PRESET_GRAPHS } from '../data/presetGraphs';

export function useGraphState(initialPresetId: string = 'binary-tree') {
  const initialData = useMemo(() => {
    const preset = PRESET_GRAPHS.find((p) => p.id === initialPresetId) || PRESET_GRAPHS[0];
    return preset.data;
  }, [initialPresetId]);

  const [vertices, setVertices] = useState<Vertex[]>(initialData.vertices);
  const [edges, setEdges] = useState<Edge[]>(initialData.edges);
  const [config, setConfig] = useState<GraphConfig>(initialData.config);

  const [canvasMode, setCanvasMode] = useState<CanvasMode>('select');
  const [selection, setSelection] = useState<SelectionState>({
    selectedVertexId: null,
    selectedEdgeId: null,
    edgeSourceVertexId: null,
  });

  // Calculate next default label (1, 2, 3... or A, B, C...)
  const getNextVertexLabel = useCallback(() => {
    const count = vertices.length + 1;
    return `${count}`;
  }, [vertices.length]);

  // Add Vertex
  const addVertex = useCallback(
    (x: number, y: number, customLabel?: string) => {
      const id = `v_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const label = customLabel || getNextVertexLabel();
      const newVertex: Vertex = { id, label, x, y };

      setVertices((prev) => [...prev, newVertex]);
      return newVertex;
    },
    [getNextVertexLabel]
  );

  // Move Vertex
  const moveVertex = useCallback((id: string, x: number, y: number) => {
    setVertices((prev) => prev.map((v) => (v.id === id ? { ...v, x, y } : v)));
  }, []);

  // Add Edge
  const addEdge = useCallback(
    (sourceId: string, targetId: string, weight?: number) => {
      if (!config.allowSelfLoops && sourceId === targetId) {
        return null;
      }

      // Check duplicate edge
      const exists = edges.some(
        (e) =>
          (e.source === sourceId && e.target === targetId) ||
          (!config.isDirected && e.source === targetId && e.target === sourceId)
      );

      if (exists) return null;

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
    [config, edges]
  );

  // Delete Vertex and associated edges
  const deleteVertex = useCallback((id: string) => {
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
    setEdges((prev) => prev.filter((e) => e.id !== id));
    setSelection((prev) => ({
      ...prev,
      selectedEdgeId: prev.selectedEdgeId === id ? null : prev.selectedEdgeId,
    }));
  }, []);

  // Clear All
  const clearGraph = useCallback(() => {
    setVertices([]);
    setEdges([]);
    setSelection({ selectedVertexId: null, selectedEdgeId: null, edgeSourceVertexId: null });
  }, []);

  // Load Preset
  const loadPreset = useCallback((presetId: string) => {
    const preset = PRESET_GRAPHS.find((p) => p.id === presetId);
    if (preset) {
      setVertices(preset.data.vertices);
      setEdges(preset.data.edges);
      setConfig(preset.data.config);
      setSelection({ selectedVertexId: null, selectedEdgeId: null, edgeSourceVertexId: null });
    }
  }, []);

  // Toggle Directed
  const toggleDirected = useCallback((isDirected: boolean) => {
    setConfig((prev) => ({ ...prev, isDirected }));
    setEdges((prev) => prev.map((e) => ({ ...e, isDirected })));
  }, []);

  // Toggle Weighted
  const toggleWeighted = useCallback((isWeighted: boolean) => {
    setConfig((prev) => ({ ...prev, isWeighted }));
    setEdges((prev) =>
      prev.map((e) => ({
        ...e,
        weight: isWeighted ? (e.weight ?? 1) : undefined,
      }))
    );
  }, []);

  // Compute graph metrics dynamically
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
    addVertex,
    moveVertex,
    addEdge,
    deleteVertex,
    deleteEdge,
    clearGraph,
    loadPreset,
    toggleDirected,
    toggleWeighted,
    metrics,
  };
}
