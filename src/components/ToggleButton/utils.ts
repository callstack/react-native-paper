import color from 'color';
import { tokens } from '../../../src/styles/themes/v3/tokens';
import type { Theme } from '../../types';

export const getToggleButtonColor = ({
  theme,
  checked,
}: {
  theme: Theme;
  checked: boolean | null;
}) => {
  if (checked) {
    if (theme.isV3) {
      return color(theme.colors.onSecondaryContainer)
        .alpha(tokens.md.ref.opacity.level2)
        .rgb()
        .string();
    }
    return theme.dark ? 'rgba(255, 255, 255, .12)' : 'rgba(0, 0, 0, .08)';
  }
  return 'transparent';
};
