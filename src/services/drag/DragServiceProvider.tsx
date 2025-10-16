import React from "react";
import { DragService } from "./DragService";
import { createInteractDragService } from "./InteractDragService";

const defaultDragService = createInteractDragService();

const DragServiceContext = React.createContext<DragService>(defaultDragService);

type DragServiceProviderProps = {
  service?: DragService;
  children: React.ReactNode;
};

const DragServiceProvider: React.FC<DragServiceProviderProps> = ({ service, children }) => {
  const value = React.useMemo(() => service ?? defaultDragService, [service]);

  return <DragServiceContext.Provider value={value}>{children}</DragServiceContext.Provider>;
};

const useDragService = (): DragService => React.useContext(DragServiceContext);

export { DragServiceProvider, useDragService, defaultDragService };
