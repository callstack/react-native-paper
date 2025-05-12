import type { InternalTheme } from 'src/types';

type BaseProps = {
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
