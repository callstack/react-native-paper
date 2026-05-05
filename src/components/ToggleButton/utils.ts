import type { InternalTheme } from '../../types';

export const getToggleButtonColor = ({
  theme,
  checked,
}: {
  theme: InternalTheme;
  checked: boolean | null;
}) => {
  if (checked) {
    return theme.colors.surfaceContainerHighest;
  }
  return theme.colors.surfaceContainer;
};
