import { SelectionService } from "../../../application/SelectionService";

describe("SelectionService", () => {
  let service: SelectionService;

  beforeEach(() => {
    service = new SelectionService();
  });

  it("should track ids when selecting boxes then selection includes the new id", () => {
    service.select("box-1");

    expect(service.getSelection()).toEqual(["box-1"]);
    expect(service.isSelected("box-1")).toBe(true);
  });

  it("should ignore duplicates when selecting the same id then selection remains unique", () => {
    service.select("box-1");
    service.select("box-1");

    expect(service.getSelection()).toEqual(["box-1"]);
  });

  it("should clear the selection when requested then no ids remain", () => {
    service.select("box-1");
    service.clear();

    expect(service.getSelection()).toHaveLength(0);
  });

  it("should replace state when syncing from snapshot then the new ids are reflected", () => {
    service.replace(["box-2", "box-3"]);

    expect(service.getSelection()).toEqual(["box-2", "box-3"]);
    expect(service.isSelected("box-2")).toBe(true);
  });
});
