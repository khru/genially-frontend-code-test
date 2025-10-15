type BoxLike = { id: string };

class BoxSelectionService<T extends BoxLike = BoxLike> {
  private boxIndex: Map<string, T>;
  private selection: string[];

  constructor() {
    this.boxIndex = new Map();
    this.selection = [];
  }

  hydrate(boxes: readonly T[], selectedIds: readonly string[]): void {
    this.rebuildIndex(boxes);
    this.selection = [];

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
      this.selection.push(id);
    });
  }

  select(id: string): string[] {
    if (!this.boxIndex.has(id)) {
      return this.snapshot();
    }

    if (!this.selection.includes(id)) {
      this.selection = [...this.selection, id];
    }

    return this.snapshot();
  }

  clear(): string[] {
    this.selection = [];
    return this.snapshot();
  }

  snapshot(): string[] {
    return [...this.selection];
  }

  isSelected(id: string): boolean {
    return this.selection.includes(id);
  }

  selectedBoxes(): T[] {
    return this.selection.map((id) => this.boxIndex.get(id)).filter((box): box is T => Boolean(box));
  }

  lastSelectedBox(): T | undefined {
    const lastSelectedId = this.selection[this.selection.length - 1];
    if (!lastSelectedId) {
      return undefined;
    }

    return this.boxIndex.get(lastSelectedId);
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

export { BoxSelectionService };
