import React from 'react';
import { Terminal } from 'lucide-react';

interface OfficialOutputProps {
  title?: string;
  outputContent?: string | null;
  statusSuccess?: boolean;
}

export const OfficialOutput: React.FC<OfficialOutputProps> = ({
  title = 'Official Output',
  outputContent,
  statusSuccess = true,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 12,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 8,
          color: '#94a3b8',
          fontSize: '0.8rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        <Terminal size={14} color="#38bdf8" />
        <span>{title}</span>
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: '#020617',
          borderRadius: 6,
          padding: '10px 12px',
          fontFamily: 'var(--mono)',
          fontSize: '0.85rem',
          color: statusSuccess ? '#34d399' : '#f87171',
          whiteSpace: 'pre-wrap',
          overflowY: 'auto',
          lineHeight: 1.5,
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {outputContent || (
          <span style={{ color: '#475569', fontStyle: 'italic' }}>
            Run an algorithm or select a section to generate official output...
          </span>
        )}
      </div>
    </div>
  );
};
