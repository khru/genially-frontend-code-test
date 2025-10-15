import { observer } from "mobx-react";
import React from "react";
import Box from "./Box";
import { MainStoreInstance } from "../stores/MainStore";
import { BoxInstance } from "../stores/models/Box";

type CanvasProps = {
  store: MainStoreInstance;
};

const Canvas: React.FC<CanvasProps> = ({ store }) => {
  return (
    <div className="canva">
      {store.boxes.map((box: BoxInstance) => (
        <Box
          id={box.id}
          key={box.id}
          color={box.color}
          left={box.left}
          top={box.top}
          width={box.width}
          height={box.height}
          box={box}
        />
      ))}
    </div>
  );
};

export default observer(Canvas);
