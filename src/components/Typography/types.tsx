import type { MD3TypescaleKey } from '../../types';

export type VariantProp<T> =
  | (T extends string ? (string extends T ? never : T) : never)
  | keyof typeof MD3TypescaleKey;
