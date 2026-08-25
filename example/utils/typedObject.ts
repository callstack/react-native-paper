/**
 * `Object.keys`, `Object.entries` and `Object.fromEntries` all widen keys to
 * `string`, which forces an assertion every time an example builds or iterates
 * over a known object literal. These wrappers keep the literal key types, so
 * call sites stay assertion-free.
 */

export const objectKeys = <T extends object>(object: T) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  Object.keys(object) as Array<keyof T>;

export const objectEntries = <T extends object>(object: T) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  Object.entries(object) as Array<[keyof T, T[keyof T]]>;

export const objectFromEntries = <Key extends PropertyKey, Value>(
  entries: Array<[Key, Value]>
) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  Object.fromEntries(entries) as Record<Key, Value>;
