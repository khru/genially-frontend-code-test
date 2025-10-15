import { BoxColorService } from "../../../application/BoxColorService";

type Box = { id: string };

describe("BoxColorService", () => {
  let service: BoxColorService;
  const boxes: Box[] = [{ id: "box-1" }, { id: "box-2" }, { id: "box-3" }];

  beforeEach(() => {
    service = new BoxColorService();
  });

  it("should hydrate the internal cache then expose targets ordered by selection", () => {
    service.hydrate(boxes, ["box-3", "box-1"]);

    const result = service.targetsForColor();
    const expectedBoxes = [boxes[2], boxes[0]];

    expect(result).toHaveLength(expectedBoxes.length);
    expect(result).toEqual(expect.arrayContaining(expectedBoxes));
    expect(result).toEqual(expect.not.arrayContaining([boxes[1]]));
  });

  it("should ignore ids that are not present when hydrating then no targets are returned", () => {
    service.hydrate(boxes, ["box-9"]);

    expect(service.targetsForColor()).toEqual([]);
  });

  it("should deduplicate ids when hydrating then each box appears only once in targets", () => {
    service.hydrate(boxes, ["box-1", "box-1", "box-2"]);

    const result = service.targetsForColor();
    const expectedBoxes = [boxes[0], boxes[1]];

    expect(result).toHaveLength(expectedBoxes.length);
    expect(result).toEqual(expect.arrayContaining(expectedBoxes));
  });

  it("should refresh targets when rehydrating then it reflects the latest selection", () => {
    service.hydrate(boxes, ["box-1", "box-2"]);
    service.hydrate(boxes, ["box-3"]);

    const result = service.targetsForColor();
    const expectedBoxes = [boxes[2]];

    expect(result).toEqual(expect.arrayContaining(expectedBoxes));
    expect(result).toEqual(expect.not.arrayContaining([boxes[0], boxes[1]]));
  });
});
