import { BoxSelectionService } from "../../../application/BoxSelectionService";

type Box = { id: string };

describe("BoxSelectionService", () => {
  let service: BoxSelectionService;
  const boxes: Box[] = [{ id: "box-1" }, { id: "box-2" }, { id: "box-3" }];

  beforeEach(() => {
    service = new BoxSelectionService();
  });

  it("should hydrate the internal cache then expose the snapshot without duplicates", () => {
    service.hydrate(boxes, ["box-1", "box-2", "box-1"]);

    const expectedSelection = ["box-1", "box-2"];
    expect(service.snapshot()).toEqual(expectedSelection);
  });

  it("should append the id when selecting a new box then keep insertion order", () => {
    service.hydrate(boxes, ["box-1"]);

    const result = service.select("box-3");

    const expectedSelection = ["box-1", "box-3"];
    expect(result).toEqual(expectedSelection);
    expect(service.snapshot()).toEqual(expectedSelection);
  });

  it("should avoid duplicates when the same id is selected twice then selection remains unchanged", () => {
    service.hydrate(boxes, ["box-2"]);

    service.select("box-2");

    const expectedSelection = ["box-2"];
    expect(service.snapshot()).toEqual(expectedSelection);
  });

  it("should return an empty selection when clearing then the cache resets", () => {
    service.hydrate(boxes, ["box-1", "box-3"]);

    const result = service.clear();

    expect(result).toEqual([]);
    expect(service.snapshot()).toEqual([]);
  });

  it("should identify ids already selected then it mirrors the cached selection", () => {
    service.hydrate(boxes, ["box-1", "box-2"]);

    expect(service.isSelected("box-2")).toBe(true);
    expect(service.isSelected("box-3")).toBe(false);
  });

  it("should return only matching boxes when computing selectedBoxes then the list mirrors the selection order", () => {
    service.hydrate(boxes, ["box-3", "box-1"]);

    const result = service.selectedBoxes();
    const expectedBoxes = [boxes[2], boxes[0]];

    expect(result).toHaveLength(expectedBoxes.length);
    expect(result).toEqual(expect.arrayContaining(expectedBoxes));
    expect(result).toEqual(expect.not.arrayContaining([boxes[1]]));
  });

  it("should surface the last id when computing lastSelectedBox then it returns the matching box instance", () => {
    service.hydrate(boxes, ["box-1", "box-3"]);

    expect(service.lastSelectedBox()).toBe(boxes[2]);
  });
});
