import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { AppbarLeadingButton, AppbarTrailingAction } from './types';
import type { Theme } from '../../types';
import AppbarBackIcon from '../Appbar/AppbarBackIcon';
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
      style={[styles.button, width === 'wide' && styles.wideButton, style]}
      theme={theme}
    />
  );
};

const hasEqualButtonProps = (
  previous: Props['button'],
  next: Props['button']
) => {
  if (previous === next) {
    return true;
  }

  const previousKeys = Object.keys(previous);
  const nextKeys = Object.keys(next);

  if (previousKeys.length !== nextKeys.length) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const previousRecord = previous as unknown as Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const nextRecord = next as unknown as Record<string, unknown>;

  return previousKeys.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(nextRecord, key) &&
      Object.is(previousRecord[key], nextRecord[key])
  );
};

const MemoizedAppbarButton = React.memo(
  AppbarButton,
  (previous, next) =>
    previous.leading === next.leading &&
    previous.theme === next.theme &&
    hasEqualButtonProps(previous.button, next.button)
);

const styles = StyleSheet.create({
  button: {
    margin: 4,
  },
  wideButton: {
    width: 56,
  },
});

export default MemoizedAppbarButton;
