import { type GestureResponderEvent, Platform } from 'react-native';

import { afterEach, expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { fireEvent, render, screen } from '../../../test-utils';
import Checkbox from '../../Checkbox';

afterEach(() => {
  jest.restoreAllMocks();
});

it('renders unchecked', async () => {
  const tree = (
    await render(<Checkbox.Item status="unchecked" label="Unchecked Button" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render leading checkbox control', async () => {
  const tree = (
    await render(
      <Checkbox.Item
        label="Default with leading control"
        status={'unchecked'}
        position="leading"
      />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should have `accessibilityState={ checked: true }` when `status="checked"`', async () => {
  await render(<Checkbox.Item status="checked" label="Checked Button" />);

  expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(1);
});

it('should have `accessibilityState={ checked: false }` when `status="unchecked"', async () => {
  await render(<Checkbox.Item status="unchecked" label="Unchecked Button" />);

  expect(screen.getAllByRole('checkbox', { checked: false })).toHaveLength(1);
});

it('should have `accessibilityState={ checked: "mixed" }` when `status="indeterminate"`', async () => {
  await render(
    <Checkbox.Item status="indeterminate" label="Indeterminate Button" />
  );

  expect(screen.getAllByRole('checkbox', { checked: 'mixed' })).toHaveLength(1);
});

it('disables the row when the prop disabled is true', async () => {
  await render(
    <Checkbox.Item
      status="unchecked"
      label=""
      aria-label="some checkbox"
      disabled
    />
  );

  expect(screen.getByLabelText('some checkbox')).toBeDisabled();
});

it('should have maxFontSizeMultiplier set to 1.5 by default', async () => {
  const tree = (
    await render(
      <Checkbox.Item label="" testID="checkbox-item" status="unchecked" />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should execute onLongPress', async () => {
  const onLongPress = jest.fn();

  await render(
    <Checkbox.Item
      label="Item"
      status="unchecked"
      testID="checkbox-item"
      onLongPress={onLongPress}
    />
  );

  await userEvent.longPress(screen.getByTestId('checkbox-item'));

  expect(onLongPress).toHaveBeenCalledTimes(1);
});

it('toggles the row once on Space release on web', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  const onPress = jest.fn<(e: GestureResponderEvent) => void>();
  const preventDefault = jest.fn();
  await render(
    <Checkbox.Item label="Notify me" status="unchecked" onPress={onPress} />
  );
  const row = screen.getByRole('checkbox', { name: 'Notify me' });

  await fireEvent(row, 'keyDown', {
    nativeEvent: { key: ' ' },
    preventDefault,
  });

  expect(preventDefault).toHaveBeenCalled();
  expect(onPress).not.toHaveBeenCalled();

  await fireEvent(row, 'keyUp', { nativeEvent: { key: ' ' }, preventDefault });

  expect(onPress).toHaveBeenCalledTimes(1);
});

it('does not toggle a disabled row on Space', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  const onPress = jest.fn<(e: GestureResponderEvent) => void>();
  await render(
    <Checkbox.Item
      label="Notify me"
      status="unchecked"
      onPress={onPress}
      disabled
    />
  );
  const row = screen.getByRole('checkbox', { name: 'Notify me' });
  const space = { nativeEvent: { key: ' ' }, preventDefault: jest.fn() };

  await fireEvent(row, 'keyDown', space);
  await fireEvent(row, 'keyUp', space);

  expect(onPress).not.toHaveBeenCalled();
});
