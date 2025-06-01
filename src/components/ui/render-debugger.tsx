import { ReactNode, useLayoutEffect, useRef } from 'react';

export function RenderDebugger({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  const startTimeRef = useRef(0);
  const renderCountRef = useRef(0);
  const averageRenderTimeRef = useRef(0);
  const totalRenderTimeRef = useRef(0);

  useLayoutEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;
    renderCountRef.current += 1;
    totalRenderTimeRef.current += renderTime;

    // Calculate new average
    averageRenderTimeRef.current =
      totalRenderTimeRef.current / renderCountRef.current;

    console.log(
      `[RenderDebugger ${id}] Render #${renderCountRef.current} took ${renderTime.toFixed(2)}ms (avg: ${averageRenderTimeRef.current.toFixed(2)}ms)`,
    );

    return () => {
      // Start timing the next render during cleanup
      startTimeRef.current = performance.now();
    };
  });

  // Initial render timing
  if (startTimeRef.current === 0) {
    startTimeRef.current = performance.now();
  }

  return (
    <div onClick={(e) => e.stopPropagation()} className="relative">
      {children}
      <div className="absolute top-0 left-0 flex flex-col gap-1">
        <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-50">
          {`Render #${renderCountRef.current}`}
        </div>
        <div className="bg-blue-800 text-white text-xs px-2 py-1 rounded opacity-50">
          {`Avg: ${averageRenderTimeRef.current.toFixed(2)}ms`}
        </div>
      </div>
    </div>
  );
}
