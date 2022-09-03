import type { InternalTheme } from './src/types';

declare global {
  export type ReactNativePaperTheme = {} & InternalTheme;
}
