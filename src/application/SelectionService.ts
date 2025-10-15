class SelectionService {
  private selectedIds: Set<string>;

  constructor(initialSelection: string[] = []) {
    this.selectedIds = new Set(initialSelection);
  }

  select(id: string): void {
    this.selectedIds.add(id);
  }

  clear(): void {
    this.selectedIds.clear();
  }

  replace(ids: string[]): void {
    this.selectedIds = new Set(ids);
  }

  getSelection(): string[] {
    return Array.from(this.selectedIds);
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }
}

export { SelectionService };
