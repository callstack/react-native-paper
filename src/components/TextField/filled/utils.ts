import type { InternalTheme } from '../../../types';

/**
 * Returns the raw outline color for a filled field. The disabled state's
 * alpha is intentionally NOT baked in here — it is applied via the `opacity`
 * style on the (childless) outline View so the value can be a `PlatformColor`
 * on Android, which the `color` library cannot parse at runtime.
 */
export const getOutlineColor = ({
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
    colors: { error, onSurface, primary, outline },
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
  return outline;
};
