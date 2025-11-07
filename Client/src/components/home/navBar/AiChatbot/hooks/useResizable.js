import { useRef, useCallback } from 'react';

export const useResizable = (dimensions, setDimensions) => {
  const resizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startDimensions = useRef({ width: 420, height: 600 });

  const handleMouseDown = useCallback((e) => {
    resizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startDimensions.current = { ...dimensions };
  }, [dimensions]);

  const handleMouseMove = useCallback((e) => {
    if (!resizing.current) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    const newWidth = Math.min(
      Math.max(startDimensions.current.width - deltaX, 350),
      window.innerWidth * 0.96
    );
    const newHeight = Math.min(
      Math.max(startDimensions.current.height - deltaY, 450),
      window.innerHeight * 0.94
    );
    setDimensions({ width: newWidth, height: newHeight });
  }, [setDimensions]);

  const handleMouseUp = useCallback(() => {
    resizing.current = false;
  }, []);

  return {
    resizing: resizing.current,
    startPos,
    startDimensions,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};