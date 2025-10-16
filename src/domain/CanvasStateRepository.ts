export type SerializedBox = {
  id: string;
  width: number;
  height: number;
  color: string;
  left: number;
  top: number;
};

export type CanvasStateSnapshot = {
  boxes: SerializedBox[];
};

export interface CanvasStateRepository {
  load(): CanvasStateSnapshot | undefined;
  save(snapshot: CanvasStateSnapshot): void;
}
