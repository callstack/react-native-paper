import type { InternalTheme } from '../../types';

export const getAccentColors = ({
  theme,
  hasError,
}: {
  theme: InternalTheme;
  hasError: boolean;
}) => {
  const color = hasError ? theme.colors.error : theme.colors.primary;

  return {
    selectionColor: color,
    cursorColor: color,
  };
};

export const getLabelColor = ({
  theme,
  status,
  isFocused,
  disabled,
}: {
  theme: InternalTheme;
  isFocused: boolean;
  status?: 'error' | 'disabled';
  disabled: boolean;
}) => {
  const {
    colors: { error, primary, onSurface, onSurfaceVariant },
  } = theme;

  if (disabled) {
    return onSurface;
  }

  if (status === 'error') {
    return error;
  }
  if (isFocused) {
    return primary;
  }
  return onSurfaceVariant;
};

export const getSupportingTextColor = ({
  theme,
  status,
  disabled,
}: {
  theme: InternalTheme;
  status?: 'error' | 'disabled';
  disabled: boolean;
}) => {
  const {
    colors: { error, onSurface, onSurfaceVariant },
  } = theme;

  if (disabled) {
    return onSurface;
  }

  if (status === 'error') {
    return error;
  }
  return onSurfaceVariant;
};

/**
 * Returns the solid background color for the filled field container, or
 * `undefined` when disabled. The disabled tint (`onSurface @ 0.04`) is rendered
 * as a separate overlay View whose alpha is applied via the `opacity` style;
 * keeping the alpha out of the color string is what makes the component safe
 * to use with `PlatformColor` values on Android.
 */
export const getFieldBackgroundColor = ({
  theme,
  disabled,
}: {
  theme: InternalTheme;
  disabled: boolean;
}): string | undefined => {
  if (disabled) {
    return undefined;
  }

  return theme.colors.surfaceContainerHighest;
};

export const getIconColor = ({
  theme,
  color,
  status,
}: {
  theme: InternalTheme;
  color?: string;
  status?: 'error' | 'disabled';
}) => {
  if (color) return color;
  if (status === 'error') return theme.colors.error;
  if (status === 'disabled') return theme.colors.onSurface;
  return theme.colors.onSurfaceVariant;
};
