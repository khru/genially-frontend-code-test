export type DragEvent = {
  dx: number;
  dy: number;
  target: Element;
  originalEvent?: unknown;
};

export type DragListeners = {
  start?: (event: DragEvent) => void;
  move?: (event: DragEvent) => void;
  end?: (event: DragEvent) => void;
};

export type DragOptions = {
  listeners?: DragListeners;
  [key: string]: unknown;
};

export interface DragInstance {
  draggable(options?: DragOptions): DragInstance;
  unset(): void;
}

export interface DragAdapter {
  createInstance(element: Element): DragInstance;
  isSupported(): boolean;
}
