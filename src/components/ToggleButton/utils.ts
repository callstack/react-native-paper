import color from 'color';

import { tokens } from '../../styles/themes/tokens';
import type { InternalTheme } from '../../types';

export const getToggleButtonColor = ({
  theme,
  checked,
}: {
  theme: InternalTheme;
  checked: boolean | null;
}) => {
  if (checked) {
    return color(theme.colors.onSecondaryContainer)
      .alpha(tokens.md.ref.stateOpacity.pressed)
      .rgb()
      .string();
  }
  return 'transparent';
};
