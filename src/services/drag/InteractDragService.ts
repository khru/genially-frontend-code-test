import interact from "interactjs";
import { DragEvent, DragInstance, DragOptions, DragService } from "./DragService";

type InteractDragEvent = {
  dx?: number;
  dy?: number;
  target?: EventTarget | null;
  currentTarget?: EventTarget | null;
  [key: string]: unknown;
};

const mapDragEvent = (event: InteractDragEvent): DragEvent => {
  const { dx = 0, dy = 0, target } = event;
  return {
    dx,
    dy,
    target: (target as Element) ?? (event.currentTarget as Element),
    originalEvent: event,
  };
};

class InteractDragInstance implements DragInstance {
  private readonly interactable: ReturnType<typeof interact>;

  constructor(element: Element) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.interactable = interact(element);
  }

  draggable(options: DragOptions = {}): DragInstance {
    const { listeners, ...rest } = options;

    this.interactable.draggable({
      ...rest,
      listeners: {
        start: (event: InteractDragEvent) => {
          listeners?.start?.(mapDragEvent(event));
        },
        move: (event: InteractDragEvent) => {
          listeners?.move?.(mapDragEvent(event));
        },
        end: (event: InteractDragEvent) => {
          listeners?.end?.(mapDragEvent(event));
        },
      },
    });

    return this;
  }

  unset(): void {
    this.interactable.unset();
  }
}

class InteractDragService implements DragService {
  createInstance(element: Element): DragInstance {
    return new InteractDragInstance(element);
  }

  isSupported(): boolean {
    return typeof interact === "function";
  }
}

export const createInteractDragService = (): DragService => new InteractDragService();
