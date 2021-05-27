import * as React from 'react';
import { Platform } from 'react-native';
import renderer from 'react-test-renderer';
import Checkbox from '../../Checkbox';

it('renders unchecked', () => {
  const tree = renderer
    .create(<Checkbox.Item status="unchecked" label="Unchecked Button" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render the iOS checkbox on different platforms', () => {
  Platform.OS = 'android';
  const tree = renderer
    .create(
      <Checkbox.Item status="unchecked" label="iOS Checkbox" mode="ios" />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render the Android checkbox on different platforms', () => {
  Platform.OS = 'ios';
  const tree = renderer
    .create(
      <Checkbox.Item status="unchecked" label="iOS Checkbox" mode="android" />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render leading checkbox control', () => {
  Platform.OS = 'ios';
  const tree = renderer
    .create(
      <Checkbox.Item
        label="Default with leading control"
        status={'unchecked'}
        mode="ios"
        position="leading"
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
