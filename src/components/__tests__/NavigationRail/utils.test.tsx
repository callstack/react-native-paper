import { describe, expect, it } from '@jest/globals';

import { getTheme } from '../../../core/theming';
import {
  clampExpandedWidth,
  resolveItemColors,
} from '../../NavigationRail/utils';

describe('resolveItemColors', () => {
  const theme = getTheme();

  it('returns inactive colors by default', () => {
    expect(resolveItemColors({ theme })).toMatchObject({
      icon: theme.colors.onSurfaceVariant,
      label: theme.colors.onSurfaceVariant,
      indicator: theme.colors.secondaryContainer,
    });
  });

  it('uses secondary for the active collapsed label and the icon color when expanded', () => {
    expect(resolveItemColors({ theme, active: true })).toMatchObject({
      icon: theme.colors.onSecondaryContainer,
      label: theme.colors.secondary,
      expandedLabel: theme.colors.onSecondaryContainer,
    });
  });
});

describe('clampExpandedWidth', () => {
  it('keeps widths inside the spec range', () => {
    expect(clampExpandedWidth(100)).toBe(220);
    expect(clampExpandedWidth(300)).toBe(300);
    expect(clampExpandedWidth(1000)).toBe(360);
  });
});
