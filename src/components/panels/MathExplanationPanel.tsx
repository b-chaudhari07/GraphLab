import React from 'react';
import type { AlgorithmStep } from '../../types/algorithm';
import { BookOpen, Info } from 'lucide-react';

interface MathExplanationPanelProps {
  currentStep: AlgorithmStep | null;
  currentStepIndex: number;
  totalSteps: number;
  algorithmName?: string;
}

export const MathExplanationPanel: React.FC<MathExplanationPanelProps> = ({
  currentStep,
  currentStepIndex,
  totalSteps,
  algorithmName = 'Selected Algorithm',
}) => {
  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span className="panel-title">
          <BookOpen size={16} color="var(--accent-cyan)" /> Discrete Math Explanation & Rule
        </span>
      </div>

      <div className="panel-content">
        {!currentStep || totalSteps === 0 ? (
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              backgroundColor: 'var(--bg-primary)',
              border: '1px border var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-blue)', fontWeight: 600 }}>
              <Info size={16} /> Ready for Execution
            </div>
            <p>
              Select an algorithm from the top right panel and click <strong>Play</strong> to observe step-by-step Discrete Mathematics proof execution and step justifications.
            </p>
            <div
              style={{
                marginTop: 4,
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: 8,
                borderRadius: 6,
                border: '1px dashed var(--border-color)',
              }}
            >
              <strong>Module V Standards:</strong> Every step will state the exact mathematical rule (e.g. Queue enqueue/dequeue in BFS, Cut property in Prim/Kruskal, Handshaking Lemma parity in Euler paths).
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Step Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="badge badge-purple">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
              <span className="badge badge-blue">{algorithmName}</span>
            </div>

            {/* Action Card */}
            <div
              style={{
                padding: 10,
                borderRadius: 6,
                backgroundColor: 'var(--bg-primary)',
                borderLeft: '3px solid var(--accent-amber)',
              }}
            >
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Action
              </span>
              <p style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                {currentStep.action}
              </p>
            </div>

            {/* Discrete Math Reason Card */}
            <div
              style={{
                padding: 10,
                borderRadius: 6,
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                Discrete Math Principle / Rule
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                {currentStep.reason}
              </p>
            </div>

            {/* Active Data Structures Display */}
            {currentStep.dataStructures && (
              <div
                style={{
                  padding: 10,
                  borderRadius: 6,
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  fontSize: '0.78rem',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Data Structures:</span>
                {currentStep.dataStructures.queue && (
                  <div>
                    Queue [FIFO]: <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>[{currentStep.dataStructures.queue.join(', ')}]</span>
                  </div>
                )}
                {currentStep.dataStructures.stack && (
                  <div>
                    Stack [LIFO]: <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>[{currentStep.dataStructures.stack.join(', ')}]</span>
                  </div>
                )}
                {currentStep.dataStructures.visitedSet && (
                  <div>
                    Visited Set: <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{'{'}{currentStep.dataStructures.visitedSet.join(', ')}{'}'}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
