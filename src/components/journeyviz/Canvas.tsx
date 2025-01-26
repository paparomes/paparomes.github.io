import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Line, Text, Group, Rect, Shadow } from "fabric";

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
  const headerHeight = 60;

  const getColumnBoundaries = (canvas: FabricCanvas) => {
    const width = canvas.width || 0;
    const columnWidth = width / stages.length;
    
    return stages.map((_, index) => ({
      start: columnWidth * index,
      end: columnWidth * (index + 1),
      center: columnWidth * index + (columnWidth / 2),
      width: columnWidth
    }));
  };

  const findClosestColumn = (x: number, boundaries: Array<{start: number, end: number, center: number}>) => {
    return boundaries.findIndex(({start, end}) => x >= start && x <= end);
  };

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
      const padding = 12;
      
      // Get column boundaries and snap position
      const boundaries = getColumnBoundaries(canvas);
      const columnIndex = findClosestColumn(left, boundaries);
      const column = boundaries[columnIndex];
      const snappedLeft = column.center - (cardWidth / 2);
      const adjustedTop = Math.max(headerHeight + padding, top);
      
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
        stroke: '#E2E8F0',
        scaleX: 0.9,
        scaleY: 0.9
      });

      // Create type label
      const label = new Text(type, {
        left: padding,
        top: padding,
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
        fontFamily: 'Inter',
        selectable: false
      });

      // Group all elements
      const group = new Group([background, label, deleteBtn], {
        left: snappedLeft,
        top: adjustedTop,
        subTargetCheck: true,
        hasControls: false,
        scaleX: 0.9,
        scaleY: 0.9
      });

      // Add movement constraints
      group.on('moving', (e) => {
        const obj = e.target;
        const boundaries = getColumnBoundaries(canvas);
        const columnIndex = findClosestColumn(obj.left! + (cardWidth / 2), boundaries);
        
        if (columnIndex !== -1) {
          const column = boundaries[columnIndex];
          obj.set({
            left: column.center - (cardWidth / 2)
          });
        }

        // Constrain vertical movement
        const minTop = headerHeight + padding;
        const maxTop = canvas.height! - cardHeight - padding;
        obj.set({
          top: Math.min(Math.max(obj.top!, minTop), maxTop)
        });
      });

      // Add entrance animation
      group.animate({
        scaleX: 1,
        scaleY: 1
      }, {
        duration: 200,
        easing: fabric.util.ease.easeOutCubic,
        onChange: canvas.renderAll.bind(canvas)
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

      // Handle delete button click
      deleteBtn.on('mousedown', (options) => {
        if (options.e) {
          options.e.stopPropagation();
        }
        group.animate({
          scaleX: 0,
          scaleY: 0,
          opacity: 0
        }, {
          duration: 200,
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

    let highlightRect: Rect | null = null;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      canvas.getElement().style.cursor = 'copy';

      const rect = canvas.getElement().getBoundingClientRect();
      const x = e.clientX - rect.left;
      
      const boundaries = getColumnBoundaries(canvas);
      const columnIndex = findClosestColumn(x, boundaries);
      
      if (columnIndex !== -1) {
        const column = boundaries[columnIndex];
        
        // Remove previous highlight
        if (highlightRect) {
          canvas.remove(highlightRect);
        }
        
        // Create new highlight
        highlightRect = new Rect({
          left: column.start,
          top: headerHeight,
          width: column.width,
          height: canvas.height! - headerHeight,
          fill: '#1A365D',
          opacity: 0.05,
          selectable: false,
          evented: false
        });
        
        canvas.add(highlightRect);
        canvas.renderAll();
      }
    };

    const handleDragLeave = () => {
      canvas.getElement().style.cursor = 'default';
      if (highlightRect) {
        canvas.remove(highlightRect);
        canvas.renderAll();
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      canvas.getElement().style.cursor = 'default';
      
      if (highlightRect) {
        canvas.remove(highlightRect);
      }
      
      const type = e.dataTransfer?.getData('text/plain');
      if (!type) return;

      const rect = canvas.getElement().getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      createTouchpointCard(type, x, y);
    };

    canvas.getElement().addEventListener('dragover', handleDragOver);
    canvas.getElement().addEventListener('dragleave', handleDragLeave);
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
      canvas.getElement().removeEventListener('dragover', handleDragOver);
      canvas.getElement().removeEventListener('dragleave', handleDragLeave);
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
