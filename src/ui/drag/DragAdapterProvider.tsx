import React from "react";
import { DragService } from "../../domain/DragPort";
import { createInteractDragAdapter } from "../../infrastructure/drag/InteractDragAdapter";

const defaultDragAdapter = createInteractDragAdapter();
const DragAdapterContext = React.createContext<DragService>(defaultDragAdapter);

type DragAdapterProviderProps = {
  service?: DragService;
  children: React.ReactNode;
};

const DragAdapterProvider: React.FC<DragAdapterProviderProps> = ({ service, children }) => {
  const value = React.useMemo(() => service ?? defaultDragAdapter, [service]);
  return <DragAdapterContext.Provider value={value}>{children}</DragAdapterContext.Provider>;
};

const useDragAdapter = (): DragService => React.useContext(DragAdapterContext);

export { DragAdapterProvider, useDragAdapter, defaultDragAdapter };
