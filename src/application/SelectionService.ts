class SelectionService {
  select(id: string, current: string[]): string[] {
    if (current.includes(id)) {
      return current;
    }
    return [...current, id];
  }

  clear(_current: string[]): string[] {
    return [];
  }
}

export { SelectionService };
