import { Platform } from 'react-native';
import type { ColorValue, TextStyle } from 'react-native';

import { SearchbarTokens } from './tokens';
import type { InternalTheme } from '../../types';

export type SearchbarColors = {
  containerColor: ColorValue;
  inputColor: ColorValue;
  placeholderColor: ColorValue;
  leadingIconColor: ColorValue;
  trailingIconColor: ColorValue;
  cursorColor: ColorValue;
  dividerColor: ColorValue;
  resultsContainerColor: ColorValue;
};

/**
 * Resolve the Searchbar color-role tokens to concrete theme color values.
 * Note `inputColor` is `onSurface` and `placeholderColor` is
 * `onSurfaceVariant` — the MD3 spec order, fixing the legacy swap.
 */
export function getSearchbarColors(theme: InternalTheme): SearchbarColors {
  const t = SearchbarTokens;
  const c = theme.colors;
  return {
    containerColor: c[t.container],
    inputColor: c[t.input],
    placeholderColor: c[t.placeholder],
    leadingIconColor: c[t.leadingIcon],
    trailingIconColor: c[t.trailingIcon],
    cursorColor: c[t.cursor],
    dividerColor: c[t.divider],
    resultsContainerColor: c[t.resultsContainer],
  };
}

/**
 * Resolve the input font from the `bodyLarge` typescale, zeroing `lineHeight`
 * on iOS to avoid vertical clipping (mirrors the legacy behaviour).
 */
export function getSearchbarInputFont(theme: InternalTheme): TextStyle {
  const { bodyLarge } = theme.fonts;
  return {
    ...bodyLarge,
    lineHeight: Platform.select({
      ios: 0,
      default: bodyLarge.lineHeight,
    }),
  };
}
