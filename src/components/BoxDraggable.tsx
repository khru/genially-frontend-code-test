import { observer } from "mobx-react";
import React from "react";

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
}) => {
  return (
    <div
      id={id}
      className={`box${isSelected ? " box--selected" : ""}`}
      style={{
        backgroundColor: color,
        width,
        height,
        transform: `translate(${left}px, ${top}px)`,
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
