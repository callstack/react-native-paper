import type { InternalTheme } from '../../../types';

/**
 * Returns the raw outline color for an outlined field. The disabled state's
 * alpha is intentionally NOT baked in here — it is applied via the `opacity`
 * style on the (childless) outline View so the value can be a `PlatformColor`
 * on Android, which the `color` library cannot parse at runtime.
 */
export const getOutlineColor = ({
  theme,
  isFocused,
  disabled,
  hasError,
}: {
  theme: InternalTheme;
  isFocused: boolean;
  disabled: boolean;
  hasError: boolean;
}) => {
  const {
    colors: { outline, onSurface, primary, error },
  } = theme;

  let outlineColor = outline;

  if (isFocused) {
    outlineColor = primary;
  }

  if (disabled) {
    outlineColor = onSurface;
  }

  if (hasError) {
    outlineColor = error;
  }

  return outlineColor;
};
