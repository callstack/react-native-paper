import { Platform } from 'react-native';

import { expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { render, screen } from '../../../test-utils';
import RadioButton from '../../RadioButton';

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

it('can render the iOS radio button on different platforms', async () => {
  Platform.OS = 'android';
  const tree = (
    await render(
      <RadioButton.Item
        status="unchecked"
        label="iOS Radio button"
        mode="ios"
        value="ios"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render the Android radio button on different platforms', async () => {
  Platform.OS = 'ios';
  const tree = (
    await render(
      <RadioButton.Item
        status="unchecked"
        label="iOS Checkbox"
        mode="android"
        value="android"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render leading radio button control', async () => {
  Platform.OS = 'ios';
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

it('start-aligns the label with position="leading" in LTR and web RTL', async () => {
  const { Platform } = require('react-native');
  const { LocaleProvider } = require('../../../core/locale');

  await render(
    <RadioButton.Item
      label="Leading item"
      value="first"
      position="leading"
      status="checked"
      onPress={() => {}}
    />
  );
  expect(screen.getByText('Leading item')).toHaveStyle({ textAlign: 'left' });

  jest.replaceProperty(Platform, 'OS', 'web');
  await render(
    <LocaleProvider direction="rtl">
      <RadioButton.Item
        label="Leading RTL"
        value="first"
        position="leading"
        status="checked"
        onPress={() => {}}
      />
    </LocaleProvider>
  );
  expect(screen.getByText('Leading RTL')).toHaveStyle({ textAlign: 'right' });
});
