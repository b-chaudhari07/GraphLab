import { useState, useEffect, useCallback } from 'react';
import type {
  AlgorithmConfig,
  AlgorithmStep,
  ExecutionStatus,
  SyllabusAlgorithmId,
} from '../types/algorithm';

export function useExecutionState() {
  const [config, setConfig] = useState<AlgorithmConfig>({
    selectedAlgorithmId: 'bfs',
    startVertexId: null,
    animationSpeed: 1000,
  });

  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);

  // Timer loop for automatic state transitions when running
  useEffect(() => {
    let timer: number | null = null;

    if (status === 'running' && steps.length > 0) {
      timer = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setStatus('completed');
            if (timer) clearInterval(timer);
            return prev;
          }
        });
      }, config.animationSpeed);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, steps.length, config.animationSpeed]);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setStatus('running');
  }, [steps.length, currentStepIndex]);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const stepForward = useCallback(() => {
    setStatus('paused');
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setStatus('paused');
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const restart = useCallback(() => {
    setStatus('idle');
    setCurrentStepIndex(0);
  }, []);

  const setAlgorithm = useCallback((algorithmId: SyllabusAlgorithmId | null) => {
    setConfig((prev) => ({ ...prev, selectedAlgorithmId: algorithmId }));
    setStatus('idle');
    setCurrentStepIndex(0);
    setSteps([]);
  }, []);

  const setStartVertex = useCallback((startVertexId: string | null) => {
    setConfig((prev) => ({ ...prev, startVertexId }));
    setStatus('idle');
    setCurrentStepIndex(0);
    setSteps([]);
  }, []);

  const setAnimationSpeed = useCallback((speedMs: number) => {
    setConfig((prev) => ({ ...prev, animationSpeed: speedMs }));
  }, []);

  const loadSteps = useCallback((newSteps: AlgorithmStep[]) => {
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setStatus('idle');
  }, []);

  const currentStep = steps[currentStepIndex] || null;

  return {
    status,
    currentStepIndex,
    totalSteps: steps.length,
    steps,
    currentStep,
    config,
    play,
    pause,
    stepForward,
    stepBackward,
    restart,
    setAlgorithm,
    setStartVertex,
    setAnimationSpeed,
    loadSteps,
  };
}
