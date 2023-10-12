export type DataObject = {
  [key: string]: string | DataObject;
};

export const getUniqueNestedKeys = (data: DataObject): string[] => {
  const keys: string[] = [];

  const traverseObject = (obj: DataObject) => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        traverseObject(value);
      } else {
        keys.push(key);
      }
    }
  };

  traverseObject(data);

  return [...new Set(keys)];
};

export const getMaxNestedLevel = (obj: DataObject): number => {
  let maxNestedLevel = 0;

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const nestedLevel = getMaxNestedLevel(obj[key] as DataObject) + 1;
      maxNestedLevel = Math.max(maxNestedLevel, nestedLevel);
    }
  }

  return maxNestedLevel;
};
