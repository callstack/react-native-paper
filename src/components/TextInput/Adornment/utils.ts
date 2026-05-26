import type { ColorValue } from 'react-native';

import { tokens } from '../../../theme/tokens';
import { getStateLayer } from '../../../theme/utils/state';
import type { InternalTheme } from '../../../types';

const stateOpacity = tokens.md.sys.state.opacity;

type BaseProps = {
  theme: InternalTheme;
  disabled?: boolean;
};

export function getTextColor({ theme, disabled }: BaseProps) {
  return getStateLayer(
    theme,
    'onSurfaceVariant',
    disabled ? 'disabled' : 'enabled'
  );
}

export function getIconColor({
  theme,
  isTextInputFocused,
  disabled,
  customColor,
}: BaseProps & {
  isTextInputFocused: boolean;
  customColor?:
    | ColorValue
    | ((isTextInputFocused: boolean) => ColorValue | undefined);
}) {
  const color =
    typeof customColor === 'function'
      ? customColor(isTextInputFocused)
      : customColor ?? theme.colors.onSurfaceVariant;

  const opacity =
    disabled && !customColor ? stateOpacity.disabled : stateOpacity.enabled;

  return { color, opacity };
}
