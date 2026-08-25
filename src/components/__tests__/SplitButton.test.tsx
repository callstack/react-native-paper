import * as React from 'react';
import { StyleSheet } from 'react-native';

import { expect, it, jest } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { fireEvent, render, screen, userEvent } from '../../test-utils';
import SplitButton from '../SplitButton/SplitButton';

const styles = StyleSheet.create({
  leading: {
    minWidth: 120,
  },
  trailing: {
    minWidth: 64,
  },
  label: {
    fontSize: 18,
  },
});

const renderSplitButton = (
  props: Partial<React.ComponentProps<typeof SplitButton>> = {}
) =>
  render(
    <SplitButton
      testID="split-button"
      label="Send"
      onPress={() => {}}
      onTrailingPress={() => {}}
      {...props}
    />
  );

it('renders a filled split button by default', async () => {
  await renderSplitButton();

  expect(screen.getByTestId('split-button-label')).toHaveTextContent('Send');
  expect(screen.getByTestId('split-button-container')).toHaveStyle({
    height: 40,
  });
  expect(screen.getByTestId('split-button-leading-container')).toBeTruthy();
  expect(screen.getByTestId('split-button-trailing-container')).toBeTruthy();
});

it('calls leading and trailing press handlers separately', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();
  const onTrailingPress = jest.fn();
  await renderSplitButton({ onPress, onTrailingPress });

  await user.press(screen.getByTestId('split-button-leading'));
  await user.press(screen.getByTestId('split-button-trailing'));

  expect(onPress).toHaveBeenCalledTimes(1);
  expect(onTrailingPress).toHaveBeenCalledTimes(1);
});

it('calls leading and trailing press-in and press-out handlers separately', async () => {
  const onPressIn = jest.fn();
  const onPressOut = jest.fn();
  const onTrailingPressIn = jest.fn();
  const onTrailingPressOut = jest.fn();
  await renderSplitButton({
    onPressIn,
    onPressOut,
    onTrailingPressIn,
    onTrailingPressOut,
  });

  await fireEvent(screen.getByTestId('split-button-leading'), 'onPressIn');
  await fireEvent(screen.getByTestId('split-button-leading'), 'onPressOut');
  await fireEvent(screen.getByTestId('split-button-trailing'), 'onPressIn');
  await fireEvent(screen.getByTestId('split-button-trailing'), 'onPressOut');

  expect(onPressIn).toHaveBeenCalledTimes(1);
  expect(onPressOut).toHaveBeenCalledTimes(1);
  expect(onTrailingPressIn).toHaveBeenCalledTimes(1);
  expect(onTrailingPressOut).toHaveBeenCalledTimes(1);
});

it('dims the outline color for a disabled outlined split button', async () => {
  const theme = getTheme();
  await renderSplitButton({ mode: 'outlined', disabled: true });

  expect(screen.getByTestId('split-button-leading-container')).not.toHaveStyle({
    borderColor: theme.colors.outlineVariant,
  });
});

it('marks both press targets disabled when disabled', async () => {
  await renderSplitButton({ disabled: true });

  expect(screen.getByTestId('split-button-leading')).toBeDisabled();
  expect(screen.getByTestId('split-button-trailing')).toBeDisabled();
});

it('passes custom styles to the correct target', async () => {
  await renderSplitButton({
    leadingButtonStyle: styles.leading,
    trailingButtonStyle: styles.trailing,
    labelStyle: styles.label,
  });

  expect(screen.getByTestId('split-button-leading-container')).toHaveStyle(
    styles.leading
  );
  expect(screen.getByTestId('split-button-trailing-container')).toHaveStyle(
    styles.trailing
  );
  expect(screen.getByTestId('split-button-label')).toHaveStyle(styles.label);
});

it('merges trailing accessibility state with expanded state', async () => {
  await renderSplitButton({
    trailingAccessibilityState: { expanded: true },
  });

  expect(screen.getByTestId('split-button-trailing')).toHaveProp(
    'accessibilityState',
    expect.objectContaining({ expanded: true })
  );
});

it('does not add SplitButton test IDs unless testID is provided', async () => {
  await render(
    <SplitButton label="Send" onPress={() => {}} onTrailingPress={() => {}} />
  );

  expect(screen.queryByTestId('split-button-container')).toBeNull();
  expect(screen.queryByTestId('split-button-leading')).toBeNull();
  expect(screen.queryByTestId('split-button-trailing')).toBeNull();
});
