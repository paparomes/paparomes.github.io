import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Line, Text, Group, Rect, TPointerEventInfo, TPointerEvent, Shadow, util } from "fabric";
import { supabase } from "@/integrations/supabase/client";

type TouchpointCard = {
  id: string;
  type: string;
  icon: string;
  left: number;
  top: number;
};

// Define a custom interface for the column overlay data
interface ColumnData {
  columnIndex: number;
}

// Define a custom type that extends Rect
interface ColumnOverlay extends Rect {
  data?: ColumnData;
}

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

      // Draw vertical grid lines and column overlays
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

        // Add invisible column overlay for snapping highlight
        const overlay = new Rect({
          left: columnWidth * index,
          top: headerHeight,
          width: columnWidth,
          height: height - headerHeight,
          fill: "#1A365D",
          opacity: 0,
          selectable: false,
          evented: false,
        }) as ColumnOverlay;

        // Set the data property using the set method
        overlay.set({ data: { columnIndex: index } });
        canvas.add(overlay);
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
    };

    const createTouchpointCard = (type: string, left: number, top: number) => {
      const cardWidth = 160;
      const cardHeight = 80;
      
      // Create card background with initial scale
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
        stroke: '#E2E8F0',
        scaleX: 0,
        scaleY: 0
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
        hasControls: false,
        scaleX: 0,
        scaleY: 0
      });

      // Add entrance animation
      group.animate({
        scaleX: 1,
        scaleY: 1
      }, {
        duration: 200,
        easing: util.ease.easeOutCubic
      });

      // Add hover effect
      group.on('mouseover', () => {
        background.set('shadow', new Shadow({
          color: 'rgba(0,0,0,0.15)',
          blur: 8,
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

      // Add dragging behavior
      group.on('moving', () => {
        const width = canvas.width || 0;
        const columnWidth = width / stages.length;
        const headerHeight = 60;
        
        // Vertical bounds
        const top = group.top || 0;
        if (top < headerHeight) {
          group.set('top', headerHeight);
        } else if (top + cardHeight > canvas.height!) {
          group.set('top', canvas.height! - cardHeight);
        }

        // Column snapping and highlighting
        const groupCenterX = (group.left || 0) + (cardWidth / 2);
        const columnIndex = Math.floor(groupCenterX / columnWidth);
        const targetColumnCenter = (columnIndex * columnWidth) + (columnWidth / 2);

        // Snap to column center
        if (Math.abs(groupCenterX - targetColumnCenter) < 50) {
          group.set('left', targetColumnCenter - (cardWidth / 2));
        }

        // Update column overlays
        canvas.getObjects().forEach(obj => {
          if (obj instanceof Rect && obj.data?.columnIndex !== undefined) {
            const isTargetColumn = obj.data.columnIndex === columnIndex;
            obj.set('opacity', isTargetColumn ? 0.05 : 0);
          }
        });

        canvas.renderAll();
      });

      // Reset column overlays after drag
      group.on('modified', () => {
        canvas.getObjects().forEach(obj => {
          if (obj instanceof Rect && obj.data?.columnIndex !== undefined) {
            obj.set('opacity', 0);
          }
        });
        canvas.renderAll();
      });

      // Handle delete button click
      deleteBtn.on('mousedown', (options: TPointerEventInfo<TPointerEvent>) => {
        if (options.e) {
          options.e.stopPropagation();
        }
        
        // Exit animation
        group.animate({
          scaleX: 0,
          scaleY: 0,
          opacity: 0
        }, {
          duration: 200,
          easing: util.ease.easeInCubic,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: () => {
            canvas.remove(group);
            canvas.renderAll();
          }
        });
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

    canvas.getElement().addEventListener('dragover', (e) => {
      e.preventDefault();
      canvas.getElement().style.cursor = 'copy';
    });
    
    canvas.getElement().addEventListener('dragleave', () => {
      canvas.getElement().style.cursor = 'default';
    });
    
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
