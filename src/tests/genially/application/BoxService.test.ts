import { BoxFactory, DEFAULT_POSITION, Position } from "../../../domain/box/BoxFactory";
import { BoxService } from "../../../application/BoxService";

describe("BoxService", () => {
  let factory: BoxFactory;
  const defaultId = "default-id";
  const defaultColor = "#654321";

  beforeEach(() => {
    factory = new BoxFactory({
      idGenerator: () => defaultId,
      colorProvider: () => defaultColor,
    });
  });

  it("should return default box when requested then it delegates to the factory", () => {
    const service = new BoxService(factory);

    const dto = service.createDefaultBox();

    expect(dto.left).toBe(DEFAULT_POSITION.left);
    expect(dto.top).toBe(DEFAULT_POSITION.top);
  });

  it("should create a box at a position when coordinates are provided then it returns a dto", () => {
    const position: Position = { left: 10, top: 20 };
    const service = new BoxService(factory);

    const dto = service.createBoxAtPosition(position);

    expect(dto).toEqual({ id: defaultId, color: defaultColor, left: 10, top: 20 });
  });
});
