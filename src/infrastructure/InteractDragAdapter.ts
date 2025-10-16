import interact from "interactjs";
import { DragAdapter, DragEvent, DragInstance, DragOptions } from "../domain/DragPort";

const mapDragEvent = (event: unknown): DragEvent => {
  const typedEvent = event as {
    dx?: number;
    dy?: number;
    target?: EventTarget | null;
    currentTarget?: EventTarget | null;
  };
  const { dx = 0, dy = 0, target, currentTarget } = typedEvent;

  return {
    dx,
    dy,
    target: (target as Element) ?? (currentTarget as Element),
    originalEvent: event,
  };
};

class InteractDragAdapterInstance implements DragInstance {
  private readonly interactable: ReturnType<typeof interact>;

  constructor(element: Element) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.interactable = interact(element);
  }

  draggable(options: DragOptions = {}): DragInstance {
    const { listeners, modifiers, ...restOptions } = options;
    const providedModifiers = modifiers ? (Array.isArray(modifiers) ? modifiers : [modifiers]) : [];

    this.interactable.draggable({
      ...restOptions,
      modifiers: [
        ...providedModifiers,
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      listeners: {
        start: (event) => {
          listeners?.start?.(mapDragEvent(event));
        },
        move: (event) => {
          listeners?.move?.(mapDragEvent(event));
        },
        end: (event) => {
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

class InteractDragAdapter implements DragAdapter {
  createInstance(element: Element): DragInstance {
    return new InteractDragAdapterInstance(element);
  }

  isSupported(): boolean {
    return typeof interact === "function";
  }
}

const createInteractDragAdapter = (): DragAdapter => new InteractDragAdapter();

export { createInteractDragAdapter, InteractDragAdapter };
