import type { TypescaleKey } from '../../theme/types';

export type VariantProp<T> =
  | (T extends string ? (string extends T ? never : T) : never)
  | TypescaleKey;
