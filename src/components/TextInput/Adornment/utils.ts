import { tokens } from '../../../styles/themes/tokens';
import type { InternalTheme } from '../../../types';

const { stateOpacity } = tokens.md.ref;

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
};

export function getTextColor({ theme, disabled }: BaseProps) {
  if (disabled) {
    return {
      color: theme.colors.onSurfaceVariant,
      opacity: stateOpacity.disabled,
    };
  }
  return {
    color: theme.colors.onSurfaceVariant,
    opacity: stateOpacity.enabled,
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
  if (typeof customColor === 'function') {
    return {
      color: customColor(isTextInputFocused),
      opacity: stateOpacity.enabled,
    };
  }
  if (customColor) {
    return { color: customColor, opacity: stateOpacity.enabled };
  }

  if (disabled) {
    return {
      color: theme.colors.onSurfaceVariant,
      opacity: stateOpacity.disabled,
    };
  }

  return {
    color: theme.colors.onSurfaceVariant,
    opacity: stateOpacity.enabled,
  };
}
