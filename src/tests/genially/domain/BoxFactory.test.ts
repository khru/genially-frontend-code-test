import { BoxFactory, DEFAULT_POSITION, Position } from "../../../domain/BoxFactory";

const createFactory = () =>
  new BoxFactory({
    idGenerator: () => "box-id",
    colorProvider: () => "#abcdef",
  });

describe("BoxFactory", () => {
  let factory: BoxFactory;
  beforeEach(() => {
    factory = createFactory();
  });

  it("should create a box when position is provided then the dto reflects the coordinates", () => {
    const position: Position = { left: 12, top: 24 };

    const dto = factory.create(position);

    expect(dto).toEqual({ id: "box-id", color: "#abcdef", left: 12, top: 24 });
  });

  it("should create a default box when no position is provided then the dto uses default coordinates", () => {
    const dto = factory.createDefault();

    expect(dto.left).toBe(DEFAULT_POSITION.left);
    expect(dto.top).toBe(DEFAULT_POSITION.top);
  });
});
