import { observer } from "mobx-react";
import React from "react";
import Box from "./Box";

type StoreInstance = typeof import("../stores/MainStore").default;
type BoxInstance = StoreInstance["boxes"][number];

type CanvasProps = {
  store: StoreInstance;
};

const Canvas: React.FC<CanvasProps> = ({ store }) => {
  return (
    <div className="canva" data-testid="canvas" onClick={() => store.clearSelection()} role="presentation">
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
          isSelected={store.isBoxSelected(box.id)}
          onSelect={(id) => store.selectBox(id)}
        />
      ))}
    </div>
  );
};

export default observer(Canvas);
