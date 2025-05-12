import color from 'color';

import { tokens } from '../../styles/themes/v3/tokens';
import type { InternalTheme } from '../../types';

export const getToggleButtonColor = ({
  theme,
  checked,
}: {
  theme: InternalTheme;
  checked: boolean | null;
}) => {
  const {
    colors: { onSecondaryContainer },
  } = theme;

  if (checked) {
    return color(onSecondaryContainer)
      .alpha(tokens.md.ref.opacity.level2)
      .rgb()
      .string();
  }
  return 'transparent';
};
