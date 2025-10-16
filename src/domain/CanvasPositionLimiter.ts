import { Position } from "./BoxFactory";
import { BoxSize, CanvasBounds, clampPositionWithinBounds } from "./CanvasBounds";

type LimitPositionParams = {
  position: Position;
  size: BoxSize;
  bounds?: CanvasBounds;
};

const limitPositionWithinCanvas = ({ position, size, bounds }: LimitPositionParams): Position => {
  if (!bounds) {
    return position;
  }

  return clampPositionWithinBounds(position, size, bounds);
};

export { limitPositionWithinCanvas };
export type { LimitPositionParams };
