import { limitPositionWithinCanvas } from "../../../domain/CanvasPositionLimiter";
import { Position } from "../../../domain/BoxFactory";

const createPosition = (left: number, top: number): Position => ({ left, top });

describe("CanvasPositionLimiter", () => {
  it("returns the same position when no bounds are provided", () => {
    const position = createPosition(10, 20);

    expect(
      limitPositionWithinCanvas({
        position,
        size: { width: 50, height: 50 },
      }),
    ).toEqual(position);
  });

  it("clamps the position to the canvas edges when it exceeds the bounds", () => {
    const position = createPosition(180, 160);

    const constrained = limitPositionWithinCanvas({
      position,
      size: { width: 100, height: 80 },
      bounds: { width: 200, height: 150 },
    });

    expect(constrained).toEqual({ left: 100, top: 70 });
  });

  it("allows positions inside the bounds without modification", () => {
    const position = createPosition(40, 30);

    const constrained = limitPositionWithinCanvas({
      position,
      size: { width: 60, height: 40 },
      bounds: { width: 200, height: 150 },
    });

    expect(constrained).toEqual(position);
  });
});
