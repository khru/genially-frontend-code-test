import { BoxFactory, DEFAULT_POSITION, Position } from "../domain/box/BoxFactory";
import { BoxService } from "../application/BoxService";

describe("BoxService", () => {
  it("should return default box when requested then it delegates to the factory", () => {
    // Given
    const factory = new BoxFactory({
      idGenerator: () => "default-id",
      colorProvider: () => "#123456",
    });
    const service = new BoxService(factory);

    // When
    const dto = service.createDefaultBox();

    // Then
    expect(dto.left).toBe(DEFAULT_POSITION.left);
    expect(dto.top).toBe(DEFAULT_POSITION.top);
  });

  it("should create a box at a position when coordinates are provided then it returns a dto", () => {
    // Given
    const position: Position = { left: 10, top: 20 };
    const factory = new BoxFactory({
      idGenerator: () => "pos-id",
      colorProvider: () => "#654321",
    });
    const service = new BoxService(factory);

    // When
    const dto = service.createBoxAtPosition(position);

    // Then
    expect(dto).toEqual({ id: "pos-id", color: "#654321", left: 10, top: 20 });
  });
});
