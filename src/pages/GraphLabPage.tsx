import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useGraphState } from '../hooks/useGraphState';
import { useExecutionState } from '../hooks/useExecutionState';
import { Header } from '../components/layout/Header';
import { AboutModal } from '../components/layout/AboutModal';
import { GraphControls } from '../components/controls/GraphControls';
import { GraphCanvas } from '../components/graph/GraphCanvas';
import { AlgorithmPanel } from '../components/algorithm/AlgorithmPanel';
import { ExecutionControls } from '../components/algorithm/ExecutionControls';
import { GraphInfoPanel } from '../components/panels/GraphInfoPanel';
import { MathExplanationPanel } from '../components/panels/MathExplanationPanel';
import { getAlgorithmById } from '../algorithms';

export const GraphLabPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Core Graph domain state
  const {
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
  } = useGraphState('binary-tree');

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
  } = useExecutionState();

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
        onReset={clearGraph}
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
        {/* Left Sidebar: Graph Builder */}
        <div style={{ width: 300, flexShrink: 0, height: '100%' }}>
          <GraphControls
            config={config}
            vertices={vertices}
            edges={edges}
            selectedVertexId={selection.selectedVertexId}
            selectedEdgeId={selection.selectedEdgeId}
            onToggleDirected={toggleDirected}
            onToggleWeighted={toggleWeighted}
            onAddVertex={addVertex}
            onAddEdge={addEdge}
            onDeleteVertex={deleteVertex}
            onDeleteEdge={deleteEdge}
            onClearGraph={clearGraph}
            onLoadPreset={loadPreset}
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
            onLoadPreset={loadPreset}
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
          <div style={{ flex: '0 0 auto', maxHeight: '45%' }}>
            <AlgorithmPanel
              selectedAlgorithmId={executionConfig.selectedAlgorithmId}
              startVertexId={executionConfig.startVertexId}
              vertices={vertices}
              onSelectAlgorithm={setAlgorithm}
              onSelectStartVertex={setStartVertex}
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
    </div>
  );
};
