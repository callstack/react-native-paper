import { Platform } from 'react-native';

import { afterEach, expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { fireEvent, render, screen } from '../../../test-utils';
import RadioButton from '../../RadioButton';

afterEach(() => {
  jest.restoreAllMocks();
});

it('renders unchecked', async () => {
  const tree = (
    await render(
      <RadioButton.Item
        status="unchecked"
        label="Unchecked Button"
        value="unchecked"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render leading radio button control', async () => {
  const tree = (
    await render(
      <RadioButton.Item
        label="Default with leading control"
        status={'unchecked'}
        value="iOS"
        position="leading"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('exposes a single radio a11y node per item', async () => {
  await render(
    <RadioButton.Item label="Item" value="first" status="checked" />
  );

  // The inner control is visual-only, so only the row is a radio.
  expect(screen.queryAllByRole('radio')).toHaveLength(1);
});

it('should execute onLongPress', async () => {
  const onLongPress = jest.fn();

  await render(
    <RadioButton.Item
      label="Item"
      value="android"
      testID="radio-button-item"
      onLongPress={onLongPress}
    />
  );

  await userEvent.longPress(screen.getByTestId('radio-button-item'));

  expect(onLongPress).toHaveBeenCalledTimes(1);
});

it('selects the row in a group on Space release on web', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  const onValueChange = jest.fn<(value: string) => void>();
  const preventDefault = jest.fn();
  await render(
    <RadioButton.Group value="first" onValueChange={onValueChange}>
      <RadioButton.Item label="First" value="first" />
      <RadioButton.Item label="Second" value="second" />
    </RadioButton.Group>
  );
  const row = screen.getByRole('radio', { name: 'Second' });

  await fireEvent(row, 'keyDown', {
    nativeEvent: { key: ' ' },
    preventDefault,
  });

  expect(preventDefault).toHaveBeenCalled();
  expect(onValueChange).not.toHaveBeenCalled();

  await fireEvent(row, 'keyUp', { nativeEvent: { key: ' ' }, preventDefault });

  expect(onValueChange).toHaveBeenCalledTimes(1);
  expect(onValueChange).toHaveBeenCalledWith('second');
});

it('ignores Space on a disabled row on web', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  const onValueChange = jest.fn<(value: string) => void>();
  const space = { nativeEvent: { key: ' ' }, preventDefault: jest.fn() };
  await render(
    <RadioButton.Group value="first" onValueChange={onValueChange}>
      <RadioButton.Item label="Second" value="second" disabled />
    </RadioButton.Group>
  );
  const row = screen.getByRole('radio', { name: 'Second' });

  await fireEvent(row, 'keyDown', space);
  await fireEvent(row, 'keyUp', space);

  expect(space.preventDefault).not.toHaveBeenCalled();
  expect(onValueChange).not.toHaveBeenCalled();
});
