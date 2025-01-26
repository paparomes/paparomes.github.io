import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas>();

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth - 256, // Subtract sidebar width
      height: window.innerHeight - 64, // Subtract navbar height
      backgroundColor: "#F5F8FF",
    });

    fabricRef.current = canvas;

    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 256,
        height: window.innerHeight - 64,
      });
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