type BoxLike = { id: string };

class BoxColorService<T extends BoxLike = BoxLike> {
  private boxIndex: Map<string, T>;
  private targets: T[];

  constructor() {
    this.boxIndex = new Map();
    this.targets = [];
  }

  hydrate(boxes: readonly T[], selectedIds: readonly string[]): void {
    this.rebuildIndex(boxes);
    this.targets = [];

    const seen = new Set<string>();
    selectedIds.forEach((id) => {
      if (seen.has(id)) {
        return;
      }

      const box = this.boxIndex.get(id);
      if (!box) {
        return;
      }

      seen.add(id);
      this.targets.push(box);
    });
  }

  targetsForColor(): T[] {
    return [...this.targets];
  }

  private rebuildIndex(boxes: readonly T[]): void {
    this.boxIndex = new Map();
    boxes.forEach((box) => {
      if (!this.boxIndex.has(box.id)) {
        this.boxIndex.set(box.id, box);
      }
    });
  }
}

export { BoxColorService };
