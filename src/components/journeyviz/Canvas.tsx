import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Line, Text, Group, Rect, TEvent, Shadow, TPointerEvent } from "fabric";
import { supabase } from "@/integrations/supabase/client";

type TouchpointCard = {
  id: string;
  type: string;
  icon: string;
  left: number;
  top: number;
};

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas>();

  const stages = ["Awareness", "Consideration", "Decision"];

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth - 256,
      height: window.innerHeight - 64,
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

    const createTouchpointCard = (type: string, left: number, top: number) => {
      const cardWidth = 160;
      const cardHeight = 80;
      
      // Create card background
      const background = new Rect({
        width: cardWidth,
        height: cardHeight,
        fill: 'white',
        rx: 8,
        ry: 8,
        shadow: new Shadow({
          color: 'rgba(0,0,0,0.1)',
          blur: 4,
          offsetX: 0,
          offsetY: 2
        }),
        strokeWidth: 1,
        stroke: '#E2E8F0'
      });

      // Create type label
      const label = new Text(type, {
        left: 12,
        top: 12,
        fontFamily: 'Inter',
        fontSize: 14,
        fill: '#1A365D'
      });

      // Create delete button
      const deleteBtn = new Text('×', {
        left: cardWidth - 24,
        top: 8,
        fontSize: 20,
        fill: '#94A3B8',
        fontFamily: 'Inter'
      });

      // Group all elements
      const group = new Group([background, label, deleteBtn], {
        left,
        top,
        subTargetCheck: true,
        hasControls: false
      });

      // Add hover effect
      group.on('mouseover', () => {
        background.set('shadow', new Shadow({
          color: 'rgba(0,0,0,0.1)',
          blur: 6,
          offsetX: 0,
          offsetY: 4
        }));
        deleteBtn.set('fill', '#64748B');
        canvas.renderAll();
      });

      group.on('mouseout', () => {
        background.set('shadow', new Shadow({
          color: 'rgba(0,0,0,0.1)',
          blur: 4,
          offsetX: 0,
          offsetY: 2
        }));
        deleteBtn.set('fill', '#94A3B8');
        canvas.renderAll();
      });

      // Handle delete button click
      deleteBtn.on('mousedown', (e: TEvent<MouseEvent>) => {
        if (e.e) {
          e.e.stopPropagation();
        }
        canvas.remove(group);
        canvas.renderAll();
      });

      canvas.add(group);
      canvas.renderAll();
    };

    // Handle dropped touchpoints
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer?.getData('text/plain');
      if (!type) return;

      const rect = canvas.getElement().getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      createTouchpointCard(type, x, y);
    };

    canvas.getElement().addEventListener('dragover', (e) => e.preventDefault());
    canvas.getElement().addEventListener('drop', handleDrop);

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
      canvas.getElement().removeEventListener('dragover', (e) => e.preventDefault());
      canvas.getElement().removeEventListener('drop', handleDrop);
      canvas.dispose();
    };
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <canvas ref={canvasRef} />
    </div>
  );
};