import { BoxColorService } from "../../../application/BoxColorService";

type Box = { id: string };

describe("BoxColorService", () => {
  let service: BoxColorService;
  const boxes: Box[] = [{ id: "box-1" }, { id: "box-2" }, { id: "box-3" }];

  const firstBox = boxes[0];
  const secondBox = boxes[1];
  const thirdBox = boxes[2];

  beforeEach(() => {
    service = new BoxColorService();
  });

  it("should hydrate the internal cache then expose targets ordered by selection", () => {
    service.hydrate(boxes, ["box-3", "box-1"]);

    const result = service.targetsForColor();
    const expectedBoxes = [thirdBox, firstBox];

    expect(result).toHaveLength(expectedBoxes.length);
    expect(result).toEqual(expect.arrayContaining(expectedBoxes));
    expect(result).toEqual(expect.not.arrayContaining([secondBox]));
  });

  it("should ignore ids that are not present when hydrating then no targets are returned", () => {
    service.hydrate(boxes, ["box-9"]);

    expect(service.targetsForColor()).toEqual([]);
  });

  it("should deduplicate ids when hydrating then each box appears only once in targets", () => {
    service.hydrate(boxes, ["box-1", "box-1", "box-2"]);

    const result = service.targetsForColor();
    const expectedBoxes = [firstBox, secondBox];

    expect(result).toHaveLength(expectedBoxes.length);
    expect(result).toEqual(expect.arrayContaining(expectedBoxes));
  });

  it("should refresh targets when rehydrating then it reflects the latest selection", () => {
    service.hydrate(boxes, ["box-1", "box-2"]);
    service.hydrate(boxes, ["box-3"]);

    const result = service.targetsForColor();
    const expectedBoxes = [thirdBox];

    expect(result).toEqual(expect.arrayContaining(expectedBoxes));
    expect(result).toEqual(expect.not.arrayContaining([firstBox, secondBox]));
  });
});
