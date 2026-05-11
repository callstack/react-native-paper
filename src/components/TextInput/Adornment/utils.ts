import { tokens } from '../../../styles/themes/tokens';
import type { InternalTheme } from '../../../types';

const { stateOpacity } = tokens.md.ref;

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
};

export function getTextColor({ theme, disabled }: BaseProps) {
  return {
    color: theme.colors.onSurfaceVariant,
    opacity: disabled ? stateOpacity.disabled : stateOpacity.enabled,
  };
}

export function getIconColor({
  theme,
  isTextInputFocused,
  disabled,
  customColor,
}: BaseProps & {
  isTextInputFocused: boolean;
  customColor?: ((isTextInputFocused: boolean) => string | undefined) | string;
}) {
  const color =
    typeof customColor === 'function'
      ? customColor(isTextInputFocused)
      : customColor ?? theme.colors.onSurfaceVariant;

  const opacity =
    disabled && !customColor ? stateOpacity.disabled : stateOpacity.enabled;

  return { color, opacity };
}
