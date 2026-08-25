import { describe, expect, it } from '@jest/globals';

import { getAppbarHeight, getTrailingActionsWidth } from '../../AppbarV3/utils';

describe('getAppbarHeight', () => {
  it.each([
    { variant: 'search', subtitle: false, height: 64 },
    { variant: 'search', subtitle: true, height: 64 },
    { variant: 'small', subtitle: false, height: 64 },
    { variant: 'small', subtitle: true, height: 64 },
    { variant: 'medium-flexible', subtitle: false, height: 112 },
    { variant: 'medium-flexible', subtitle: true, height: 136 },
    { variant: 'large-flexible', subtitle: false, height: 120 },
    { variant: 'large-flexible', subtitle: true, height: 152 },
  ] as const)(
    'returns $height for $variant with subtitle=$subtitle',
    ({ variant, subtitle, height }) => {
      expect(getAppbarHeight(variant, subtitle)).toBe(height);
    }
  );
});

describe('getTrailingActionsWidth', () => {
  it('accounts for standard, filled, and wide filled actions', () => {
    expect(getTrailingActionsWidth([])).toBe(0);
    expect(
      getTrailingActionsWidth([
        { key: 'first', icon: 'star', 'aria-label': 'First' },
        { key: 'second', icon: 'heart', 'aria-label': 'Second' },
      ])
    ).toBe(96);
    expect(
      getTrailingActionsWidth([
        {
          key: 'filled',
          icon: 'star',
          'aria-label': 'Filled',
          variant: 'filled',
        },
      ])
    ).toBe(48);
    expect(
      getTrailingActionsWidth([
        {
          key: 'wide',
          icon: 'star',
          'aria-label': 'Wide',
          variant: 'tonal',
          width: 'wide',
        },
      ])
    ).toBe(64);
  });
});
