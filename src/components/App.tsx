import { observer } from "mobx-react";
import React from "react";
import store from "../stores/MainStore";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";

const AppView: React.FC = () => {
  const handleAddBox = React.useCallback(() => {
    store.addBoxAtDefaultPosition();
  }, []);

  const handleRemoveBox = React.useCallback(() => {
    store.removeSelectedBoxes();
  }, []);

  const handleColorChange = React.useCallback((color: string) => {
    store.updateSelectedBoxesColor(color);
  }, []);

  const handleResetChange = React.useCallback(() => {
    store.reset();
  }, []);

  const selectionCount = store.selectedBoxIds.length;
  const hasSelection = selectionCount > 0;
  const selectionLabel = hasSelection
    ? `${selectionCount} box${selectionCount > 1 ? "es" : ""} selected`
    : "No boxes selected";
  const selectedColor = store.lastSelectedBox?.color ?? "#000000";

  return (
    <div className="app">
      <Toolbar
        onAddBox={handleAddBox}
        onRemoveBox={handleRemoveBox}
        onReset={handleResetChange}
        colorValue={selectedColor}
        onChangeColor={handleColorChange}
        isColorPickerDisabled={!hasSelection}
        selectionLabel={selectionLabel}
      />
      <Canvas store={store} />
    </div>
  );
};

const App: React.FC = observer(AppView);

export default App;
