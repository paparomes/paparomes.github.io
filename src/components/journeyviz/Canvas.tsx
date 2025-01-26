import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Line, Text } from "fabric";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas>();

  const stages = ["Awareness", "Consideration", "Decision"];

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth - 256, // Subtract sidebar width
      height: window.innerHeight - 64, // Subtract navbar height
      backgroundColor: "#F5F8FF",
    });

    fabricRef.current = canvas;

    // Draw timeline grid
    const drawTimelineGrid = () => {
      const width = canvas.width || 0;
      const height = canvas.height || 0;
      const columnWidth = width / stages.length;
      const headerHeight = 60;
      const padding = 20;

      // Draw vertical grid lines
      stages.forEach((_, index) => {
        if (index > 0) {
          const line = new Line([columnWidth * index, 0, columnWidth * index, height], {
            stroke: "#1A365D",
            opacity: 0.1,
            selectable: false,
            evented: false,
          });
          canvas.add(line);
        }
      });

      // Draw header separator line
      const headerLine = new Line([0, headerHeight, width, headerHeight], {
        stroke: "#1A365D",
        opacity: 0.2,
        selectable: false,
        evented: false,
      });
      canvas.add(headerLine);

      // Add stage titles
      stages.forEach((stage, index) => {
        const text = new Text(stage, {
          left: columnWidth * index + padding,
          top: padding,
          fontFamily: "Inter",
          fontSize: 16,
          fill: "#1A365D",
          fontWeight: "600",
          selectable: false,
          evented: false,
        });
        canvas.add(text);
      });

      canvas.renderAll();
    };

    drawTimelineGrid();

    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 256,
        height: window.innerHeight - 64,
      });
      canvas.clear();
      canvas.backgroundColor = "#F5F8FF";
      drawTimelineGrid();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <canvas ref={canvasRef} />
    </div>
  );
};