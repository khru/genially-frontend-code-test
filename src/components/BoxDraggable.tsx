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
};

const BoxDraggable: React.FC<BoxDraggableProps> = ({ id, color, width, height, left, top, children }) => {
  return (
    <div
      id={id}
      className="box"
      style={{
        backgroundColor: color,
        width,
        height,
        transform: `translate(${left}px, ${top}px)`,
      }}
    >
      {children}
    </div>
  );
};

export default observer(BoxDraggable);
