import * as React from 'react';
import { Platform } from 'react-native';

import { act, fireEvent, render } from '@testing-library/react-native';

import RadioButton from '../../RadioButton';

it('renders unchecked', () => {
  const tree = render(
    <RadioButton.Item
      status="unchecked"
      label="Unchecked Button"
      value="unchecked"
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render the iOS radio button on different platforms', () => {
  Platform.OS = 'android';
  const tree = render(
    <RadioButton.Item
      status="unchecked"
      label="iOS Radio button"
      mode="ios"
      value="ios"
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render the Android radio button on different platforms', () => {
  Platform.OS = 'ios';
  const tree = render(
    <RadioButton.Item
      status="unchecked"
      label="iOS Checkbox"
      mode="android"
      value="android"
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render leading radio button control', () => {
  Platform.OS = 'ios';
  const tree = render(
    <RadioButton.Item
      label="Default with leading control"
      status={'unchecked'}
      value="iOS"
      position="leading"
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should execute onLongPress', () => {
  const onLongPress = jest.fn();

  const { getByTestId } = render(
    <RadioButton.Item
      label="Item"
      value="android"
      testID="radio-button-item"
      onLongPress={onLongPress}
    />
  );

  act(() => {
    fireEvent(getByTestId('radio-button-item'), 'longPress', { key: 'value' });
  });

  expect(onLongPress).toHaveBeenCalledTimes(1);
});
