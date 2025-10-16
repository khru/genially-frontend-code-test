import React from "react";
import { DragAdapter } from "../domain/DragPort";
import { createInteractDragAdapter } from "../infrastructure/InteractDragAdapter";

const defaultDragAdapter = createInteractDragAdapter();
const DragAdapterContext = React.createContext<DragAdapter>(defaultDragAdapter);

type DragAdapterProviderProps = {
  service?: DragAdapter;
  children: React.ReactNode;
};

const DragAdapterProvider: React.FC<DragAdapterProviderProps> = ({ service, children }) => {
  const value = React.useMemo(() => service ?? defaultDragAdapter, [service]);
  return <DragAdapterContext.Provider value={value}>{children}</DragAdapterContext.Provider>;
};

const useDragAdapter = (): DragAdapter => React.useContext(DragAdapterContext);

export { DragAdapterProvider, useDragAdapter, defaultDragAdapter };
