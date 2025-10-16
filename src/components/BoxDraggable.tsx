import { observer } from "mobx-react";
import React from "react";
import { DragEvent, DragService } from "../domain/DragPort";
import { useDragAdapter } from "../ui/drag/DragAdapterProvider";

export type BoxDraggableProps = {
  id: string;
  color: string;
  width: number;
  height: number;
  left: number;
  top: number;
  children?: React.ReactNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragStart?: () => void;
  onDragMove?: (position: { left: number; top: number }) => void;
  onDragEnd?: (position: { left: number; top: number }) => void;
  dragService?: DragService;
};

const BoxDraggable: React.FC<BoxDraggableProps> = ({
  id,
  color,
  width,
  height,
  left,
  top,
  children,
  isSelected,
  onSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
  dragService,
}) => {
  const nodeRef = React.useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [position, setPosition] = React.useState({ left, top });
  const positionRef = React.useRef({ left, top });
  const userSelectSnapshot = React.useRef<{ userSelect: string; webkitUserSelect: string }>({
    userSelect: "",
    webkitUserSelect: "",
  });
  const contextDragService = useDragAdapter();

  React.useEffect(() => {
    positionRef.current = { left, top };
    setPosition({ left, top });
  }, [left, top]);

  React.useEffect(() => {
    const element = nodeRef.current;
    const service = dragService ?? contextDragService;

    if (!element || !service.isSupported()) {
      return undefined;
    }

    const disableTextSelection = () => {
      const bodyStyle = document.body.style as CSSStyleDeclaration & { webkitUserSelect?: string };
      userSelectSnapshot.current = {
        userSelect: bodyStyle.userSelect,
        webkitUserSelect: bodyStyle.webkitUserSelect ?? "",
      };
      bodyStyle.userSelect = "none";
      if ("webkitUserSelect" in bodyStyle) {
        bodyStyle.webkitUserSelect = "none";
      }
    };

    const restoreTextSelection = () => {
      const bodyStyle = document.body.style as CSSStyleDeclaration & { webkitUserSelect?: string };
      bodyStyle.userSelect = userSelectSnapshot.current.userSelect;
      if ("webkitUserSelect" in bodyStyle) {
        bodyStyle.webkitUserSelect = userSelectSnapshot.current.webkitUserSelect;
      }
    };

    const instance = service.createInstance(element);

    instance.draggable({
      listeners: {
        start: () => {
          setIsDragging(true);
          disableTextSelection();
          onDragStart?.();
        },
        move: (event: DragEvent) => {
          setPosition((prevPosition) => {
            const next = {
              left: prevPosition.left + event.dx,
              top: prevPosition.top + event.dy,
            };
            positionRef.current = next;
            onDragMove?.(next);
            return next;
          });
        },
        end: () => {
          setIsDragging(false);
          restoreTextSelection();
          onDragEnd?.(positionRef.current);
        },
      },
    });

    return () => {
      restoreTextSelection();
      setIsDragging(false);
      instance.unset();
    };
  }, [contextDragService, dragService, onDragStart, onDragMove, onDragEnd]);

  return (
    <div
      ref={nodeRef}
      id={id}
      className={`box${isSelected ? " box--selected" : ""}`}
      style={{
        backgroundColor: color,
        width,
        height,
        transform: `translate(${position.left}px, ${position.top}px)`,
        userSelect: isDragging ? "none" : undefined,
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(id);
      }}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default observer(BoxDraggable);
