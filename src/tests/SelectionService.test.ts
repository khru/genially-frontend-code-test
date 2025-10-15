import { SelectionService } from "../application/SelectionService";

describe("SelectionService", () => {
  it("should include box id when selecting a box then the id is tracked", () => {
    const service = new SelectionService();

    const selected = service.select("box-1", []);

    expect(selected).toEqual(["box-1"]);
  });

  it("should clear selection when requested then no ids remain", () => {
    const service = new SelectionService();

    const selected = service.clear(["box-1", "box-2"]);

    expect(selected).toHaveLength(0);
  });
});
