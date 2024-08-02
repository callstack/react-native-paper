function findKey<T>(map: { [key: string]: T }, fn: (item: T) => boolean) {
  const keys = Object.keys(map)
  for (let i = 0; i < keys.length; i++) {
    if (fn(map[keys[i]])) {
      return keys[i]
    }
  }
}

function findIndex<T>(arr: T[], fn: (item: T) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i])) {
      return i
    }
  }
  return -1
}

function differenceBy(arr1: any[], arr2: any[], key: string) {
  const result: any[] = []
  arr1.forEach(item1 => {
    const keyValue = item1[key]
    if (!arr2.some(item2 => item2[key] === keyValue)) {
      result.push(item1)
    }
  })
  return result
}

export { findKey, findIndex, differenceBy }
