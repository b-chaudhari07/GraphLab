import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useGraphState } from '../hooks/useGraphState';
import { useExecutionState } from '../hooks/useExecutionState';
import { Header } from '../components/layout/Header';
import { AboutModal } from '../components/layout/AboutModal';
import { GraphControls } from '../components/controls/GraphControls';
import { GraphCanvas } from '../components/graph/GraphCanvas';
import { AlgorithmPanel } from '../components/algorithm/AlgorithmPanel';
import { IsomorphismModal } from '../components/algorithm/IsomorphismModal';
import { ExecutionControls } from '../components/algorithm/ExecutionControls';
import { GraphInfoPanel } from '../components/panels/GraphInfoPanel';
import { MathExplanationPanel } from '../components/panels/MathExplanationPanel';
import { getAlgorithmById } from '../algorithms';
import { runAlgorithm } from '../algorithms/runner';
import type { HamiltonianMode } from '../types/algorithm';

export const GraphLabPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isIsomorphismOpen, setIsIsomorphismOpen] = useState<boolean>(false);
  const [hamiltonianMode, setHamiltonianMode] = useState<HamiltonianMode>('cycle');

  // Core Graph domain state & validation (Starts with clean empty canvas)
  const {
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
  } = useGraphState();

  // Execution engine state
  const {
    status,
    currentStepIndex,
    totalSteps,
    currentStep,
    config: executionConfig,
    play,
    pause,
    stepForward,
    stepBackward,
    restart,
    setAlgorithm,
    setStartVertex,
    setAnimationSpeed,
    loadSteps,
    resetExecution,
    syncWithVertices,
  } = useExecutionState();

  // Safety check: Invalidate deleted start vertex automatically when vertices change
  useEffect(() => {
    syncWithVertices(vertices);
  }, [vertices, syncWithVertices]);

  // Combined clear graph & reset execution state
  const handleClearGraph = () => {
    clearGraph();
    resetExecution();
  };

  // Combined reset graph & reset execution state (returns to clean initial state)
  const handleResetGraph = () => {
    resetGraph();
    resetExecution();
  };

  // Preset load replaces current graph cleanly
  const handleLoadPreset = (presetId: string) => {
    loadPreset(presetId);
    resetExecution();
  };

  // Run Algorithm Handler: Generates steps & automatically starts playback!
  const handleRunAlgorithm = useCallback(() => {
    if (!executionConfig.selectedAlgorithmId) return;

    if (executionConfig.selectedAlgorithmId === 'isomorphism') {
      setIsIsomorphismOpen(true);
      return;
    }

    const fullConfig = {
      ...executionConfig,
      hamiltonianMode,
    };

    const generatedSteps = runAlgorithm(fullConfig, { vertices, edges, config });

    if (generatedSteps.length > 0) {
      loadSteps(generatedSteps, true);
    }
  }, [executionConfig, hamiltonianMode, vertices, edges, config, loadSteps]);

  const selectedAlgo = getAlgorithmById(executionConfig.selectedAlgorithmId);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      {/* Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onReset={handleResetGraph}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main App Grid Area */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          height: 'calc(100vh - var(--header-height) - 140px)',
          overflow: 'hidden',
          padding: 12,
          gap: 12,
        }}
      >
        {/* Left Sidebar: Graph Builder & Validation */}
        <div style={{ width: 300, flexShrink: 0, height: '100%' }}>
          <GraphControls
            config={config}
            vertices={vertices}
            selectedVertexId={selection.selectedVertexId}
            selectedEdgeId={selection.selectedEdgeId}
            onToggleDirected={toggleDirected}
            onToggleWeighted={toggleWeighted}
            onToggleSelfLoops={toggleSelfLoops}
            onAddVertex={addVertex}
            onAddEdge={addEdge}
            onDeleteVertex={deleteVertex}
            onDeleteEdge={deleteEdge}
            onClearGraph={handleClearGraph}
            onResetGraph={handleResetGraph}
            onLoadPreset={handleLoadPreset}
            validationError={validationError}
            setValidationError={setValidationError}
          />
        </div>

        {/* Center Canvas Area */}
        <div
          className="panel"
          style={{
            flex: 1,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <GraphCanvas
            vertices={vertices}
            edges={edges}
            config={config}
            canvasMode={canvasMode}
            setCanvasMode={setCanvasMode}
            selection={selection}
            setSelection={setSelection}
            addVertex={addVertex}
            moveVertex={moveVertex}
            addEdge={addEdge}
            deleteVertex={deleteVertex}
            deleteEdge={deleteEdge}
            startVertexId={executionConfig.startVertexId}
            activeVertexId={currentStep?.activeVertexId}
            visitedVertexIds={currentStep?.visitedVertexIds}
            highlightEdgeIds={currentStep?.highlightEdgeIds}
            onLoadPreset={handleLoadPreset}
            validationError={validationError}
            clearValidationError={clearValidationError}
            setValidationError={setValidationError}
          />
        </div>

        {/* Right Sidebar: Algorithm Selector & Graph Metrics */}
        <div
          style={{
            width: 360,
            flexShrink: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ flex: '0 0 auto', maxHeight: '48%' }}>
            <AlgorithmPanel
              selectedAlgorithmId={executionConfig.selectedAlgorithmId}
              startVertexId={executionConfig.startVertexId}
              vertices={vertices}
              hamiltonianMode={hamiltonianMode}
              onSelectAlgorithm={setAlgorithm}
              onSelectStartVertex={setStartVertex}
              onSelectHamiltonianMode={setHamiltonianMode}
              onRunAlgorithm={handleRunAlgorithm}
              onOpenIsomorphismModal={() => setIsIsomorphismOpen(true)}
              isRunning={status === 'running'}
            />
          </div>

          <div style={{ flex: 1, minHeight: 0 }}>
            <GraphInfoPanel metrics={metrics} config={config} />
          </div>
        </div>
      </div>

      {/* Bottom Area: Execution Toolbar & Math Explanation */}
      <div
        style={{
          height: 130,
          display: 'flex',
          flexDirection: 'column',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <ExecutionControls
          status={status}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          animationSpeed={executionConfig.animationSpeed}
          onPlay={play}
          onPause={pause}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onRestart={restart}
          onSpeedChange={setAnimationSpeed}
        />

        <div style={{ flex: 1, minHeight: 0, padding: '0 12px 8px 12px' }}>
          <MathExplanationPanel
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            algorithmName={selectedAlgo?.name}
          />
        </div>
      </div>

      {/* Educational Information Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Dual Graph Isomorphism Comparison Modal */}
      <IsomorphismModal
        isOpen={isIsomorphismOpen}
        onClose={() => setIsIsomorphismOpen(false)}
        graphA={{ vertices, edges, config }}
      />
    </div>
  );
};
