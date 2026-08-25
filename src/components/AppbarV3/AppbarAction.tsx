import { StyleSheet } from 'react-native';

import type {
  AppbarAction as AppbarActionConfig,
  AppbarLeadingAction,
} from './types';
import type { Theme } from '../../types';
import AppbarBackIcon from '../Appbar/AppbarBackIcon';
import IconButton from '../IconButton/IconButton';

type Props = {
  action: AppbarActionConfig | AppbarLeadingAction;
  leading?: boolean;
  theme: Theme;
};

const AppbarAction = ({ action, leading = false, theme }: Props) => {
  const {
    color,
    key: _key,
    style,
    variant = 'standard',
    width,
    ...rest
  } = action;
  const { type: _type, ...buttonProps } = rest as typeof rest & {
    type?: 'back' | 'icon';
  };
  const isBackAction = 'type' in action && action.type === 'back';
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
      icon={action.icon ?? AppbarBackIcon}
      aria-label={
        isBackAction ? (action['aria-label'] ?? 'Back') : action['aria-label']
      }
      iconColor={iconColor}
      mode={mode}
      selected={mode ? true : undefined}
      size={24}
      animated
      style={[styles.action, width === 'wide' && styles.wideAction, style]}
      theme={theme}
    />
  );
};

const styles = StyleSheet.create({
  action: {
    margin: 4,
  },
  wideAction: {
    width: 56,
  },
});

export default AppbarAction;
