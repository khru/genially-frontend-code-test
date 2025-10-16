import { DragEvent, DragListeners, DragOptions, DragService, DragInstance } from "../../services/drag";

type ListenerMap = Map<Element, DragListeners>;

class MockDragInstance implements DragInstance {
  private readonly element: Element;
  private readonly listenersMap: ListenerMap;

  constructor(element: Element, listenersMap: ListenerMap) {
    this.element = element;
    this.listenersMap = listenersMap;
  }

  draggable(options: DragOptions = {}): DragInstance {
    if (options.listeners) {
      this.listenersMap.set(this.element, options.listeners);
    }
    return this;
  }

  unset(): void {
    this.listenersMap.delete(this.element);
  }
}

class MockDragService implements DragService {
  private readonly listenersMap: ListenerMap;

  constructor(listenersMap: ListenerMap) {
    this.listenersMap = listenersMap;
  }

  createInstance(element: Element): DragInstance {
    return new MockDragInstance(element, this.listenersMap);
  }

  isSupported(): boolean {
    return true;
  }
}

const trigger = (listeners: DragListeners | undefined, type: keyof DragListeners, event: DragEvent) => {
  const handler = listeners?.[type];
  if (handler) {
    handler(event);
  }
};

export const createMockDragService = () => {
  const listenersMap: ListenerMap = new Map();
  const service = new MockDragService(listenersMap);

  return {
    service,
    triggerStart(element: Element, event: DragEvent) {
      trigger(listenersMap.get(element), "start", event);
    },
    triggerMove(element: Element, event: DragEvent) {
      trigger(listenersMap.get(element), "move", event);
    },
    triggerEnd(element: Element, event: DragEvent) {
      trigger(listenersMap.get(element), "end", event);
    },
    hasListeners(element: Element): boolean {
      return listenersMap.has(element);
    },
    reset() {
      listenersMap.clear();
    },
  };
};
