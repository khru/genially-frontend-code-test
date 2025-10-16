import { CanvasStateRepository, CanvasStateSnapshot } from "../domain/CanvasStateRepository";

const STORAGE_KEY = "canvas-state";

const isLocalStorageAvailable = (storage: Storage | undefined): storage is Storage => {
  if (!storage) {
    return false;
  }

  try {
    const testKey = "__test__";
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

const sanitizeSnapshot = (snapshot: unknown): CanvasStateSnapshot | undefined => {
  if (!snapshot || typeof snapshot !== "object" || !("boxes" in snapshot)) {
    return undefined;
  }

  const boxes = (snapshot as { boxes: unknown }).boxes;
  if (!Array.isArray(boxes)) {
    return undefined;
  }

  const normalizedBoxes = boxes
    .map((box) => {
      if (!box || typeof box !== "object") {
        return undefined;
      }
      const candidate = box as Record<string, unknown>;
      const id = candidate.id;
      const width = candidate.width;
      const height = candidate.height;
      const color = candidate.color;
      const left = candidate.left;
      const top = candidate.top;

      if (
        typeof id === "string" &&
        typeof width === "number" &&
        typeof height === "number" &&
        typeof color === "string" &&
        typeof left === "number" &&
        typeof top === "number"
      ) {
        return { id, width, height, color, left, top };
      }
      return undefined;
    })
    .filter((box): box is CanvasStateSnapshot["boxes"][number] => Boolean(box));

  return { boxes: normalizedBoxes };
};

class LocalStorageCanvasStateRepository implements CanvasStateRepository {
  private readonly storage: Storage | undefined;

  constructor(storage?: Storage) {
    const candidate = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
    this.storage = isLocalStorageAvailable(candidate) ? candidate : undefined;
  }

  load(): CanvasStateSnapshot | undefined {
    if (!this.storage) {
      return undefined;
    }

    const raw = this.storage.getItem(STORAGE_KEY);
    if (!raw) {
      return undefined;
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      return sanitizeSnapshot(parsed);
    } catch (error) {
      console.error("Failed to parse canvas state from localStorage:", error);
      return undefined;
    }
  }

  save(snapshot: CanvasStateSnapshot): void {
    if (!this.storage) {
      return;
    }

    try {
      const payload = JSON.stringify(snapshot);
      this.storage.setItem(STORAGE_KEY, payload);
    } catch (error) {
      /* no-op */
    }
  }

  restore() {
    if (!this.storage) {
      return;
    }

    try {
      this.storage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* no-op */
    }
  }
}

const createLocalStorageCanvasStateRepository = (storage?: Storage): CanvasStateRepository =>
  new LocalStorageCanvasStateRepository(storage);

export { createLocalStorageCanvasStateRepository, LocalStorageCanvasStateRepository };
