import type { CSSProperties } from 'react';

export type CSSVars = CSSProperties & Record<`--${string}`, string>;
