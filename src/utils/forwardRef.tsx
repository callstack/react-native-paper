import * as React from 'react';
import type {
  ForwardRefRenderFunction,
  PropsWithoutRef,
  RefAttributes,
  ForwardRefExoticComponent,
} from 'react';

export type ForwarRefComponent<T, P = {}> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

/**
 * TypeScript generated a large union of props from `ViewProps` in
 * `d.ts` files when using `React.forwardRef`. To prevent this
 * `ForwarRefComponent` was created and exported. Use this
 * `forwardRef` instead of `React.forwardRef` so you don't have to
 * import `ForwarRefComponent`.
 * More info: https://github.com/callstack/react-native-paper/pull/3603
 */
export const forwardRef: <T, P = {}>(
  render: ForwardRefRenderFunction<T, P>
) => ForwarRefComponent<T, P> = React.forwardRef;
