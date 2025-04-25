class Comparation {
  hasEquals(list1: string[], list2: string[]): boolean {
    const set = new Set(list1);
    return list2.some((item) => set.has(item));
  }
}

export default new Comparation();
