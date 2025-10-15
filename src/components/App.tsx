import { observer } from "mobx-react";
import React from "react";
import store from "../stores/MainStore";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";

const AppView: React.FC = () => {
  const handleAddBox = React.useCallback(() => {
    store.addBoxAtDefaultPosition();
  }, []);

  return (
    <div className="app">
      <Toolbar onAddBox={handleAddBox} />
      <Canvas store={store} />
    </div>
  );
};

const App: React.FC = observer(AppView);

export default App;
