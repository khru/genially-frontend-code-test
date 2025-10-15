import { applySnapshot, getSnapshot } from "mobx-state-tree";
import store from "../../../stores/MainStore";

const BASE_SNAPSHOT = getSnapshot(store);

afterEach(() => {
  applySnapshot(store, BASE_SNAPSHOT);
});

describe("MainStore", () => {
  it("should create a box with provided coordinates when the store adds a positioned box then the dto reflects the position", () => {
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
    applySnapshot(store, {
      boxes: [{ id: "box-1", color: "#111111", left: 0, top: 0 }],
      selectedBoxIds: [],
    });

    store.selectBox("box-1");
    store.selectBox("box-1");

    expect(store.selectedBoxIds).toEqual(["box-1"]);
  });
});
