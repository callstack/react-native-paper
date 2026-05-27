import type { ColorValue } from 'react-native';

import type { tokens } from '../tokens';

export type StateOpacityKey = keyof typeof tokens.md.sys.state.opacity;

export type StateLayer = {
  color: ColorValue;
  opacity: number;
};
