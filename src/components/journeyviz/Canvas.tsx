import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Line, Text, Group, Rect, TPointerEventInfo, TPointerEvent, Shadow, util, RectProps } from "fabric";

// Define interfaces and types
interface ColumnData {
  columnIndex: number;
}

// Extend RectProps for our custom properties
interface CustomRectProps extends RectProps {
  data?: ColumnData;
}

// Create a custom class that extends Rect
class CustomRect extends Rect {
  data?: ColumnData;
  
  constructor(options: Partial<RectProps> & { data?: ColumnData }) {
    super(options);
    this.data = options.data;
  }
}

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
  const headerHeight = 60;
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
        const overlay = new CustomRect({
          top: headerHeight,
          left: columnWidth * index,
          width: columnWidth,
          height: height - headerHeight,
          fill: "#1A365D",
          opacity: 0,
          selectable: false,
          evented: false,
          data: { columnIndex: index }
        });

        canvas.add(overlay);
      });

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
      const width = canvas.width || 0;
      const columnWidth = width / stages.length;
      
      // Find nearest column center
      const columnIndex = Math.min(
        stages.length - 1,
        Math.max(0, Math.round(left / columnWidth))
      );
      const columnCenterX = (columnIndex * columnWidth) + (columnWidth / 2);
      const snappedLeft = columnCenterX - (cardWidth / 2);
      
      // Constrain vertical position
      const snappedTop = Math.max(
        headerHeight + 10,
        Math.min(top, (canvas.height || 0) - cardHeight - 10)
      );
    
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
        left: snappedLeft,
        top: snappedTop,  // Use the calculated snappedTop here
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
        easing: util.ease.easeOutCubic,
        onChange: canvas.renderAll.bind(canvas)
      });

      // Add hover effect
      const updateShadow = (isHover: boolean) => {
        background.set('shadow', new Shadow({
          color: isHover ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.1)',
          blur: isHover ? 8 : 4,
          offsetX: 0,
          offsetY: isHover ? 4 : 2
        }));
        deleteBtn.set('fill', isHover ? '#64748B' : '#94A3B8');
        canvas.renderAll();
      };

      group.on('mouseover', () => updateShadow(true));
      group.on('mouseout', () => updateShadow(false));

      // Add dragging behavior
      const updateColumnHighlight = (columnIndex: number) => {
        canvas.getObjects().forEach(obj => {
          if (obj instanceof CustomRect && obj.data?.columnIndex !== undefined) {
            obj.set('opacity', obj.data.columnIndex === columnIndex ? 0.05 : 0);
          }
        });
      };

      group.on('moving', () => {
        const groupCenterX = (group.left || 0) + (cardWidth / 2);
        const columnIndex = Math.floor(groupCenterX / columnWidth);
        const targetColumnCenter = (columnIndex * columnWidth) + (columnWidth / 2);

        // Snap to column center
        if (Math.abs(groupCenterX - targetColumnCenter) < 50) {
          group.set('left', targetColumnCenter - (cardWidth / 2));
        }

        // Constrain vertical movement
        const currentTop = group.top || 0;
        group.set('top', Math.max(
          headerHeight,
          Math.min(currentTop, (canvas.height || 0) - cardHeight)
        ));

        updateColumnHighlight(columnIndex);
        canvas.renderAll();
      });

      // Reset column overlays after drag
      group.on('modified', () => {
        updateColumnHighlight(-1);
      });

      // Handle delete button click
      deleteBtn.on('mousedown', (options: TPointerEventInfo<TPointerEvent>) => {
        if (options.e) {
          options.e.stopPropagation();
        }
        
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

    // Event handlers
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      canvas.getElement().style.cursor = 'copy';
    };

    const handleDragLeave = () => {
      canvas.getElement().style.cursor = 'default';
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      canvas.getElement().style.cursor = 'default';
      
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
      const element = canvas.getElement();
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
      canvas.dispose();
    };
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <canvas ref={canvasRef} />
    </div>
  );
};