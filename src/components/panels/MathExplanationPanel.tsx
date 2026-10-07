import React from 'react';
import type { AlgorithmStep } from '../../types/algorithm';
import { BookOpen, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

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
  const conclusion = currentStep?.dataStructures?.finalConclusion;

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header" style={{ padding: '8px 14px' }}>
        <span className="panel-title" style={{ fontSize: '0.8rem' }}>
          <BookOpen size={14} color="var(--accent-cyan)" /> Discrete Math Proof & Step Reason
        </span>
      </div>

      <div className="panel-content" style={{ padding: 12, gap: 10 }}>
        {!currentStep || totalSteps === 0 ? (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-blue)', fontWeight: 600 }}>
              <Info size={15} /> Ready for Execution
            </div>
            <p>
              Select a syllabus algorithm and click <strong>Run</strong> to observe step-by-step Discrete Mathematics proof execution.
            </p>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: 6,
                borderRadius: 4,
                border: '1px dashed var(--border-color)',
              }}
            >
              <strong>Module V Standards:</strong> Evaluates connectivity, Eulerian degree parities, Hamiltonian backtracking, and Tree traversals.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8rem' }}>
            {/* Step Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
              <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>{algorithmName}</span>
            </div>

            {/* Title & Action Card */}
            <div
              style={{
                padding: 8,
                borderRadius: 6,
                backgroundColor: 'var(--bg-primary)',
                borderLeft: '3px solid var(--accent-amber)',
              }}
            >
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                {currentStep.title}
              </span>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                {currentStep.action}
              </p>
            </div>

            {/* Discrete Math Reason Card */}
            <div
              style={{
                padding: 8,
                borderRadius: 6,
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                Discrete Math Principle / Rule
              </span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                {currentStep.reason}
              </p>
            </div>

            {/* Active Data Structures & Path Display */}
            {currentStep.dataStructures && (
              <div
                style={{
                  padding: 8,
                  borderRadius: 6,
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  fontSize: '0.75rem',
                }}
              >
                {currentStep.dataStructures.traversalPath && (
                  <div>
                    Path Sequence: <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{currentStep.dataStructures.traversalPath.join(' → ')}</span>
                  </div>
                )}
                {currentStep.dataStructures.visitedSet && (
                  <div>
                    Visited Set: <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{'{'}{currentStep.dataStructures.visitedSet.join(', ')}{'}'}</span>
                  </div>
                )}
                {currentStep.dataStructures.unreachableSet && currentStep.dataStructures.unreachableSet.length > 0 && (
                  <div>
                    Unreachable Vertices: <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>{'{'}{currentStep.dataStructures.unreachableSet.join(', ')}{'}'}</span>
                  </div>
                )}
              </div>
            )}

            {/* Final Conclusion Summary Card */}
            {conclusion && (
              <div
                style={{
                  padding: 10,
                  borderRadius: 6,
                  backgroundColor: conclusion.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                  border: `1px solid ${conclusion.success ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: conclusion.success ? 'var(--accent-emerald)' : 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {conclusion.success ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                  {conclusion.title}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>{conclusion.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
