import { StyleSheet } from 'react-native';

import AppbarBackIcon from './AppbarBackIcon';
import type { AppbarLeadingButton, AppbarTrailingAction } from './types';
import type { Theme } from '../../types';
import IconButton from '../IconButton/IconButton';

type Props = {
  button: AppbarTrailingAction | AppbarLeadingButton;
  leading?: boolean;
  theme: Theme;
};

const AppbarButton = ({ button, leading = false, theme }: Props) => {
  const {
    color,
    key: _key,
    style,
    variant = 'standard',
    width,
    ...rest
  } = button;
  const { type: _type, ...buttonProps } = rest as typeof rest & {
    type?: 'back' | 'icon';
  };
  const isBackButton = 'type' in button && button.type === 'back';
  const mode =
    variant === 'filled'
      ? 'contained'
      : variant === 'tonal'
        ? 'contained-tonal'
        : undefined;
  const iconColor =
    color ??
    (mode
      ? undefined
      : leading
        ? theme.colors.onSurface
        : theme.colors.onSurfaceVariant);

  return (
    <IconButton
      {...buttonProps}
      icon={button.icon ?? AppbarBackIcon}
      aria-label={
        isBackButton ? (button['aria-label'] ?? 'Back') : button['aria-label']
      }
      iconColor={iconColor}
      mode={mode}
      selected={mode ? true : undefined}
      size={24}
      animated
      style={[width === 'wide' && styles.wideButton, style]}
      theme={theme}
    />
  );
};

const styles = StyleSheet.create({
  wideButton: {
    width: 56,
  },
});

export default AppbarButton;
