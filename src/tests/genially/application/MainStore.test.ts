import { applySnapshot } from "mobx-state-tree";
import { createMainStore } from "../../../stores/MainStore";
import { CanvasStateRepository, CanvasStateSnapshot } from "../../../domain/CanvasStateRepository";

class InMemoryCanvasStateRepository implements CanvasStateRepository {
  private snapshot: CanvasStateSnapshot | undefined;

  load(): CanvasStateSnapshot | undefined {
    return this.snapshot ? { boxes: this.snapshot.boxes.map((box) => ({ ...box })) } : undefined;
  }

  save(snapshot: CanvasStateSnapshot): void {
    this.snapshot = { boxes: snapshot.boxes.map((box) => ({ ...box })) };
  }

  getState(): CanvasStateSnapshot | undefined {
    return this.snapshot ? { boxes: this.snapshot.boxes.map((box) => ({ ...box })) } : undefined;
  }
}

const createStore = (initialState?: CanvasStateSnapshot) => {
  const repository = new InMemoryCanvasStateRepository();
  if (initialState) {
    repository.save(initialState);
  }
  const store = createMainStore({ repository });
  return { store, repository };
};

describe("MainStore", () => {
  it("should create a box with provided coordinates when the store adds a positioned box then the dto reflects the position", () => {
    const { store } = createStore();
    applySnapshot(store, {
      boxes: [],
      selectedBoxIds: [],
    });

    store.addBoxAtPosition({ left: 42, top: 24 });

    const latestBox = store.boxes[store.boxes.length - 1];
    expect(latestBox.left).toBe(42);
    expect(latestBox.top).toBe(24);
  });

  it("should propagate the color to every selected box when the store updates selection color then all targets change", () => {
    const { store } = createStore();
    applySnapshot(store, {
      boxes: [
        { id: "box-1", color: "#111111", left: 0, top: 0 },
        { id: "box-2", color: "#222222", left: 10, top: 10 },
        { id: "box-3", color: "#333333", left: 20, top: 20 },
      ],
      selectedBoxIds: [],
    });

    store.selectBox("box-1");
    store.selectBox("box-3");

    store.updateSelectedBoxesColor("#abcdef");

    expect(store.boxes[0].color).toBe("#abcdef");
    expect(store.boxes[2].color).toBe("#abcdef");
    expect(store.boxes[1].color).toBe("#222222");
  });

  it("should return only selected boxes when querying the view then the list matches current selection", () => {
    const { store } = createStore();
    applySnapshot(store, {
      boxes: [
        { id: "box-1", color: "#111111", left: 0, top: 0 },
        { id: "box-2", color: "#222222", left: 10, top: 10 },
      ],
      selectedBoxIds: [],
    });

    store.selectBox("box-2");

    expect(store.selectedBoxes.map((box) => box.id)).toEqual(["box-2"]);
  });

  it("should surface the latest id when computing lastSelectedBox then the reference matches the last selection", () => {
    const { store } = createStore();
    applySnapshot(store, {
      boxes: [
        { id: "box-1", color: "#111111", left: 0, top: 0 },
        { id: "box-2", color: "#222222", left: 10, top: 10 },
      ],
      selectedBoxIds: [],
    });

    store.selectBox("box-1");
    store.selectBox("box-2");

    expect(store.lastSelectedBox?.id).toBe("box-2");
  });

  it("should clear tracking when the store clears the selection then no ids remain selected", () => {
    const { store } = createStore();
    applySnapshot(store, {
      boxes: [
        { id: "box-1", color: "#111111", left: 0, top: 0 },
        { id: "box-2", color: "#222222", left: 10, top: 10 },
      ],
      selectedBoxIds: [],
    });

    store.selectBox("box-1");
    store.clearSelection();

    expect(store.selectedBoxIds).toHaveLength(0);
    expect(store.isBoxSelected("box-1")).toBe(false);
  });

  it("should keep selection unique when the same box is selected twice then the ids array remains deduplicated", () => {
    const { store } = createStore();
    applySnapshot(store, {
      boxes: [{ id: "box-1", color: "#111111", left: 0, top: 0 }],
      selectedBoxIds: [],
    });

    store.selectBox("box-1");
    store.selectBox("box-1");

    expect(store.selectedBoxIds).toEqual(["box-1"]);
  });

  it("should persist the new position when the box moves then the store reflects the updated coordinates", () => {
    const { store } = createStore();
    applySnapshot(store, {
      boxes: [{ id: "box-1", color: "#111111", left: 5, top: 10 }],
      selectedBoxIds: [],
    });

    store.updateBoxPosition("box-1", { left: 20, top: 25 });

    expect(store.boxes[0].left).toBe(20);
    expect(store.boxes[0].top).toBe(25);
  });

  it("should remove selected boxes when requested then they no longer exist in the store", () => {
    const { store } = createStore();
    applySnapshot(store, {
      boxes: [
        { id: "box-1", color: "#111111", left: 0, top: 0 },
        { id: "box-2", color: "#222222", left: 10, top: 10 },
      ],
      selectedBoxIds: [],
    });

    store.selectBox("box-1");
    store.selectBox("box-2");
    store.removeSelectedBoxes();

    expect(store.boxes).toHaveLength(0);
    expect(store.selectedBoxIds).toHaveLength(0);
  });

  it("should hydrate boxes from the repository when the store is created", () => {
    const initialState: CanvasStateSnapshot = {
      boxes: [
        { id: "box-1", color: "#123456", left: 12, top: 34, width: 200, height: 100 },
        { id: "box-2", color: "#abcdef", left: 56, top: 78, width: 150, height: 120 },
      ],
    };

    const { store } = createStore(initialState);

    expect(store.boxes.map((box) => ({ id: box.id, color: box.color, left: box.left, top: box.top }))).toEqual([
      { id: "box-1", color: "#123456", left: 12, top: 34 },
      { id: "box-2", color: "#abcdef", left: 56, top: 78 },
    ]);
    expect(store.selectedBoxIds).toHaveLength(0);
  });

  it("should persist boxes to the repository when the store mutates", () => {
    const { store, repository } = createStore();

    store.addBoxAtDefaultPosition();
    store.selectBox(store.boxes[0].id);
    store.updateSelectedBoxesColor("#ffffff");

    const persisted = repository.getState();

    expect(persisted?.boxes).toHaveLength(store.boxes.length);
    expect(persisted?.boxes.map((box) => box.id)).toEqual(store.boxes.map((box) => box.id));
  });

  it("should clamp box positions to bounds when canvas dimensions are provided", () => {
    const { store } = createStore();

    applySnapshot(store, {
      boxes: [{ id: "box-1", color: "#111111", width: 200, height: 100, left: 0, top: 0 }],
      selectedBoxIds: [],
    });

    store.updateBoxPosition("box-1", { left: 400, top: 300 }, { width: 250, height: 220 });
    expect(store.boxes[0].left).toBe(50);
    expect(store.boxes[0].top).toBe(120);

    store.updateBoxPosition("box-1", { left: -40, top: -20 }, { width: 250, height: 220 });
    expect(store.boxes[0].left).toBe(0);
    expect(store.boxes[0].top).toBe(0);
  });
});
