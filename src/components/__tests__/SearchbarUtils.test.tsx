import { describe, expect, it } from '@jest/globals';

import { LightTheme } from '../../theme/schemes';
import { getSearchbarColors, getSearchbarInputFont } from '../Searchbar/utils';

describe('getSearchbarColors', () => {
  it('resolves the MD3 color roles, with input/placeholder in spec order', () => {
    const theme = LightTheme;
    expect(getSearchbarColors(theme)).toEqual({
      containerColor: theme.colors.surfaceContainerHigh,
      inputColor: theme.colors.onSurface,
      placeholderColor: theme.colors.onSurfaceVariant,
      leadingIconColor: theme.colors.onSurface,
      trailingIconColor: theme.colors.onSurfaceVariant,
      cursorColor: theme.colors.primary,
      dividerColor: theme.colors.outline,
      resultsContainerColor: theme.colors.surfaceContainerHigh,
    });
  });
});

describe('getSearchbarInputFont', () => {
  it('uses the bodyLarge typescale with lineHeight zeroed on iOS', () => {
    const theme = LightTheme;
    expect(getSearchbarInputFont(theme)).toEqual({
      ...theme.fonts.bodyLarge,
      lineHeight: 0,
    });
  });
});
