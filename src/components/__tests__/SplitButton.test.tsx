import * as React from 'react';

import { expect, it, jest } from '@jest/globals';

import { fireEvent, render, screen, userEvent } from '../../test-utils';
import SplitButton from '../SplitButton/SplitButton';

const modes = ['filled', 'tonal', 'elevated', 'outlined'] as const;
const sizes = [
  'extra-small',
  'small',
  'medium',
  'large',
  'extra-large',
] as const;

const renderSplitButton = (
  props: Partial<React.ComponentProps<typeof SplitButton>> = {}
) =>
  render(
    <SplitButton
      label="Send"
      onPress={() => {}}
      onTrailingPress={() => {}}
      {...props}
    />
  );

it('renders the label text', async () => {
  await renderSplitButton();

  expect(screen.getByText('Send')).toBeOnTheScreen();
});

it.each(sizes)('matches the snapshot for the %s size', async (size) => {
  const { toJSON } = await renderSplitButton({ size });

  expect(toJSON()).toMatchSnapshot();
});

it.each(modes)('matches the snapshot in %s mode', async (mode) => {
  const { toJSON } = await renderSplitButton({ mode });

  expect(toJSON()).toMatchSnapshot();
});

it.each(modes)('matches the disabled snapshot in %s mode', async (mode) => {
  const { toJSON } = await renderSplitButton({ mode, disabled: true });

  expect(toJSON()).toMatchSnapshot();
});

it('matches the snapshot with a custom button color', async () => {
  const { toJSON } = await renderSplitButton({ buttonColor: 'purple' });

  expect(toJSON()).toMatchSnapshot();
});

it('applies the custom text color to the label', async () => {
  await renderSplitButton({ textColor: 'yellow' });

  expect(screen.getByText('Send')).toHaveStyle({ color: 'yellow' });
});

it('shows a progress indicator instead of the icon while loading', async () => {
  await renderSplitButton({ icon: 'send', loading: true });

  expect(screen.getByRole('progressbar')).toBeTruthy();
});

it('calls the leading press handler on its own press', async () => {
  const user = userEvent.setup();
  const handler = jest.fn();
  await renderSplitButton({ onPress: handler });

  await user.press(screen.getByLabelText('Send'));

  expect(handler).toHaveBeenCalledTimes(1);
});

it('calls the trailing press handler on its own press', async () => {
  const user = userEvent.setup();
  const handler = jest.fn();
  await renderSplitButton({ onTrailingPress: handler });

  await user.press(screen.getByLabelText('Show options'));

  expect(handler).toHaveBeenCalledTimes(1);
});

it('calls the leading press-in handler separately', async () => {
  const handler = jest.fn();
  await renderSplitButton({ onPressIn: handler });

  await fireEvent(screen.getByLabelText('Send'), 'onPressIn');

  expect(handler).toHaveBeenCalledTimes(1);
});

it('calls the trailing press-in handler separately', async () => {
  const handler = jest.fn();
  await renderSplitButton({ onTrailingPressIn: handler });

  await fireEvent(screen.getByLabelText('Show options'), 'onPressIn');

  expect(handler).toHaveBeenCalledTimes(1);
});

it('calls the leading press-out handler separately', async () => {
  const handler = jest.fn();
  await renderSplitButton({ onPressOut: handler });

  await fireEvent(screen.getByLabelText('Send'), 'onPressOut');

  expect(handler).toHaveBeenCalledTimes(1);
});

it('calls the trailing press-out handler separately', async () => {
  const handler = jest.fn();
  await renderSplitButton({ onTrailingPressOut: handler });

  await fireEvent(screen.getByLabelText('Show options'), 'onPressOut');

  expect(handler).toHaveBeenCalledTimes(1);
});

it('calls the leading long-press handler separately', async () => {
  const user = userEvent.setup();
  const handler = jest.fn();
  await renderSplitButton({ onLongPress: handler });

  await user.longPress(screen.getByLabelText('Send'));

  expect(handler).toHaveBeenCalledTimes(1);
});

it('calls the trailing long-press handler separately', async () => {
  const user = userEvent.setup();
  const handler = jest.fn();
  await renderSplitButton({ onTrailingLongPress: handler });

  await user.longPress(screen.getByLabelText('Show options'));

  expect(handler).toHaveBeenCalledTimes(1);
});

it('defaults the leading accessibility label to the label prop', async () => {
  await renderSplitButton();

  expect(screen.getByLabelText('Send')).toBeOnTheScreen();
});

it('defaults the trailing accessibility label to "Show options"', async () => {
  await renderSplitButton();

  expect(screen.getByLabelText('Show options')).toBeOnTheScreen();
});

it('marks the leading press target disabled when disabled', async () => {
  await renderSplitButton({ disabled: true });

  expect(screen.getByLabelText('Send')).toBeDisabled();
});

it('marks the trailing press target disabled when disabled', async () => {
  await renderSplitButton({ disabled: true });

  expect(screen.getByLabelText('Show options')).toBeDisabled();
});

it('does not affect the leading segment when the trailing segment is selected', async () => {
  const { toJSON } = await renderSplitButton({
    mode: 'filled',
    trailingAccessibilityState: { expanded: true },
  });

  expect(toJSON()).toMatchSnapshot();
});

it('hides the state layer when disabled, even if selected', async () => {
  const { toJSON } = await renderSplitButton({
    disabled: true,
    trailingAccessibilityState: { expanded: true },
  });

  expect(toJSON()).toMatchSnapshot();
});

it('passes buttonStyle and its own segment style to each container', async () => {
  const { toJSON } = await renderSplitButton({
    buttonStyle: { opacity: 0.9 },
    leadingButtonStyle: { minWidth: 120 },
    trailingButtonStyle: { minWidth: 64 },
  });

  expect(toJSON()).toMatchSnapshot();
});

it('passes labelStyle to the label', async () => {
  await renderSplitButton({ labelStyle: { fontSize: 18 } });

  expect(screen.getByText('Send')).toHaveStyle({ fontSize: 18 });
});

it('passes custom accessibility state to the leading button', async () => {
  await renderSplitButton({
    accessibilityState: { checked: true },
  });

  expect(screen.getByLabelText('Send')).toHaveProp(
    'accessibilityState',
    expect.objectContaining({ checked: true })
  );
});

it('merges trailing accessibility state with expanded state', async () => {
  await renderSplitButton({
    trailingAccessibilityState: { expanded: true },
  });

  expect(screen.getByLabelText('Show options')).toHaveProp(
    'accessibilityState',
    expect.objectContaining({ expanded: true })
  );
});

it('passes testID to the leading button', async () => {
  await renderSplitButton({ testID: 'split-button' });

  expect(screen.getByTestId('split-button')).toBeOnTheScreen();
});

it('passes trailingTestID to the trailing button', async () => {
  await renderSplitButton({ trailingTestID: 'split-button-trailing' });

  expect(screen.getByTestId('split-button-trailing')).toBeOnTheScreen();
});
