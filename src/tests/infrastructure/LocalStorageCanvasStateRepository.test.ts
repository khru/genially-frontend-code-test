import { createLocalStorageCanvasStateRepository } from "../../infrastructure/LocalStorageCanvasStateRepository";

describe("LocalStorageCanvasStateRepository", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should persist snapshots to localStorage", () => {
    const repository = createLocalStorageCanvasStateRepository(window.localStorage);
    const snapshot = {
      boxes: [{ id: "box-1", width: 200, height: 100, color: "#123456", left: 10, top: 20 }],
    };

    repository.save(snapshot);

    const stored = window.localStorage.getItem("canvas-state") ?? "{}";
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored)).toEqual(snapshot);
  });

  it("should hydrate a sanitized snapshot from localStorage", () => {
    const boxes = [
      { id: "box-1", width: 200, height: 100, color: "#ffffff", left: 1, top: 2 },
      { id: "box-2", width: 150, height: 120, color: "#000000", left: 3, top: 4 },
    ];
    window.localStorage.setItem(
      "canvas-state",
      JSON.stringify({
        boxes: boxes,
      }),
    );

    const repository = createLocalStorageCanvasStateRepository(window.localStorage);

    expect(repository.load()).toEqual({
      boxes: boxes,
    });
  });

  it("should return undefined when the stored data is invalid", () => {
    window.localStorage.setItem("canvas-state", "not-json");

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const repository = createLocalStorageCanvasStateRepository(window.localStorage);

    expect(repository.load()).toBeUndefined();
    consoleErrorSpy.mockRestore();
  });
});
