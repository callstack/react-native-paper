export const filterByQuery = <T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string[]
) => {
  const search = query.trim().toLowerCase();

  if (!search) {
    return items;
  }

  return items.filter((item) =>
    getSearchableText(item).some((text) => text.toLowerCase().includes(search))
  );
};
