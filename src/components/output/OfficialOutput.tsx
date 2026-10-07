import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, GripHorizontal, RotateCcw } from 'lucide-react';

interface OfficialOutputProps {
  title?: string;
  outputContent?: string | null;
  statusSuccess?: boolean;
}

export const OfficialOutput: React.FC<OfficialOutputProps> = ({
  title = 'OFFICIAL OUTPUT',
  outputContent,
  statusSuccess = true,
}) => {
  // Floating position & size state
  const [position, setPosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 340, height: 180 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number }>({
    mouseX: 0,
    mouseY: 0,
    startW: 340,
    startH: 180,
  });

  // Check screen width for mobile fallback
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set default initial position on screen
  useEffect(() => {
    if (position.x === null && position.y === null && !isMobile) {
      const defaultX = Math.max(20, window.innerWidth - 380);
      const defaultY = Math.max(20, window.innerHeight - 340);
      setPosition({ x: defaultX, y: defaultY });
    }
  }, [position.x, position.y, isMobile]);

  // Handle Dragging via Header
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    e.preventDefault();
    setIsDragging(true);

    const initialX = position.x ?? Math.max(20, window.innerWidth - 380);
    const initialY = position.y ?? Math.max(20, window.innerHeight - 340);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: initialX,
      startY: initialY,
    };
  };

  // Handle Resizing via Bottom-Right Handle
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: size.width,
      startH: size.height,
    };
  };

  // Global mousemove and mouseup listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartRef.current.mouseX;
        const deltaY = e.clientY - dragStartRef.current.mouseY;

        let newX = dragStartRef.current.startX + deltaX;
        let newY = dragStartRef.current.startY + deltaY;

        // Clamp inside window boundaries
        const maxX = Math.max(0, window.innerWidth - size.width - 20);
        const maxY = Math.max(0, window.innerHeight - size.height - 20);

        newX = Math.max(10, Math.min(newX, maxX));
        newY = Math.max(10, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartRef.current.mouseX;
        const deltaY = e.clientY - resizeStartRef.current.mouseY;

        let newW = resizeStartRef.current.startW + deltaX;
        let newH = resizeStartRef.current.startH + deltaY;

        // Min & Max dimensions
        newW = Math.max(280, Math.min(newW, 600));
        newH = Math.max(140, Math.min(newH, 420));

        setSize({ width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
      if (isResizing) setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, size.width, size.height]);

  // Reset Position & Size Control
  const handleResetPosition = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultX = Math.max(20, window.innerWidth - 380);
    const defaultY = Math.max(20, window.innerHeight - 340);
    setPosition({ x: defaultX, y: defaultY });
    setSize({ width: 340, height: 180 });
  }, []);

  // Mobile / Small Screen Inline Fallback
  if (isMobile) {
    return (
      <div
        style={{
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          padding: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>
          <Terminal size={14} color="#38bdf8" />
          <span>{title}</span>
        </div>
        <div style={{ flex: 1, backgroundColor: '#020617', borderRadius: 6, padding: '8px 10px', fontFamily: 'var(--mono)', fontSize: '0.8rem', color: statusSuccess ? '#34d399' : '#f87171', whiteSpace: 'pre-wrap', overflowY: 'auto' }}>
          {outputContent || <span style={{ color: '#475569', fontStyle: 'italic' }}>Run an algorithm to generate official output...</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x ?? undefined,
        top: position.y ?? undefined,
        right: position.x === null ? 24 : undefined,
        bottom: position.y === null ? 24 : undefined,
        width: size.width,
        height: size.height,
        zIndex: 100,
        backgroundColor: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 10,
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: isDragging || isResizing ? 'none' : 'auto',
      }}
    >
      {/* Header (Drag Handle) */}
      <div
        onMouseDown={handleHeaderMouseDown}
        style={{
          padding: '8px 12px',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} title="Drag to move panel">
          <GripHorizontal size={14} color="#64748b" />
          <Terminal size={14} color="#38bdf8" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.05em' }}>
            {title}
          </span>
        </div>

        {/* Reset Control Button */}
        <button
          onClick={handleResetPosition}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 2,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
          }}
          title="Reset position and size"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Output Content Terminal (Selectable and Copyable) */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#020617',
          padding: '10px 12px',
          fontFamily: 'var(--mono)',
          fontSize: '0.82rem',
          color: statusSuccess ? '#34d399' : '#f87171',
          whiteSpace: 'pre-wrap',
          overflowY: 'auto',
          lineHeight: 1.5,
          userSelect: 'text',
        }}
      >
        {outputContent || (
          <span style={{ color: '#475569', fontStyle: 'italic' }}>
            Run an algorithm or select a section to generate official output...
          </span>
        )}
      </div>

      {/* Resize Handle (Bottom-Right Corner) */}
      <div
        onMouseDown={handleResizeMouseDown}
        style={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: 14,
          height: 14,
          cursor: 'nwse-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.6,
        }}
        title="Drag to resize"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M7 1L1 7M7 4L4 7M7 7H7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};
