import { observer } from "mobx-react";
import React from "react";
import BoxDraggable, { BoxDraggableProps } from "./BoxDraggable";
import { BoxInstance } from "../stores/models/Box";

export type BoxProps = BoxDraggableProps & {
  box: BoxInstance;
};

const Box: React.FC<BoxProps> = ({ box: _box, ...rest }) => (
  <BoxDraggable {...rest}>
    <div>Box</div>
  </BoxDraggable>
);

export default observer(Box);
