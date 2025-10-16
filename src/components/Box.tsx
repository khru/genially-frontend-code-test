import { observer } from "mobx-react";
import React from "react";
import BoxDraggable, { BoxDraggableProps } from "./BoxDraggable";

type StoreInstance = typeof import("../stores/MainStore").default;
type BoxInstance = StoreInstance["boxes"][number];

export type BoxProps = BoxDraggableProps & {
  box: BoxInstance;
  onSelect: (id: string) => void;
  isSelected: boolean;
};

const Box: React.FC<BoxProps> = ({ box: _box, children, onSelect, isSelected, ...rest }) => (
  <BoxDraggable {...rest} onSelect={onSelect} isSelected={isSelected}>
    <div>{children || "Box"}</div>
  </BoxDraggable>
);

export default observer(Box);
