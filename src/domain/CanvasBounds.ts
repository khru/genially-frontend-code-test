import { Position } from "./BoxFactory";

export type CanvasBounds = {
  width: number;
  height: number;
};

export type BoxSize = {
  width: number;
  height: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const clampPositionWithinBounds = (position: Position, size: BoxSize, bounds: CanvasBounds): Position => {
  const maxLeft = Math.max(0, bounds.width - size.width);
  const maxTop = Math.max(0, bounds.height - size.height);

  return {
    left: clamp(position.left, 0, maxLeft),
    top: clamp(position.top, 0, maxTop),
  };
};
