import type { CSSProperties } from 'react';

/**
 * The vendored stylesheet reads its colours and images from linaria-generated
 * custom properties, which React's CSSProperties does not model.
 */
export type CSSVars = CSSProperties & Record<`--${string}`, string>;
