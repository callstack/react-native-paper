import type { InternalTheme } from 'src/types';

import type { black, white } from '../../styles/themes/v2/colors';

type BaseProps = {
  defaultColor: typeof black | typeof white;
  theme: InternalTheme;
};

export const getActiveTintColor = ({
  activeColor,
  theme,
}: BaseProps & {
  activeColor: string | undefined;
}) => {
  const {
    colors: { onSecondaryContainer },
  } = theme;
  if (typeof activeColor === 'string') {
    return activeColor;
  }

  return onSecondaryContainer;
};

export const getInactiveTintColor = ({
  inactiveColor,
  theme,
}: BaseProps & {
  inactiveColor: string | undefined;
}) => {
  const {
    colors: { onSurfaceVariant },
  } = theme;

  if (typeof inactiveColor === 'string') {
    return inactiveColor;
  }

  return onSurfaceVariant;
};

export const getLabelColor = ({
  tintColor,
  hasColor,
  focused,
  theme,
}: BaseProps & {
  tintColor: string;
  hasColor: boolean;
  focused: boolean;
}) => {
  const {
    colors: { onSurface, onSurfaceVariant },
  } = theme;

  if (hasColor) {
    return tintColor;
  }

  if (focused) {
    return onSurface;
  }

  return onSurfaceVariant;
};
