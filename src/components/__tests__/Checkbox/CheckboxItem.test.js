import * as React from 'react';
import { Platform } from 'react-native';

import { render } from '@testing-library/react-native';
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

it('should have `accessibilityState={ checked: true }` when `status="checked"`', () => {
  const { getAllByA11yState } = render(
    <Checkbox.Item status="checked" label="Checked Button" />
  );

  const elements = getAllByA11yState({ checked: true });
  expect(elements).toHaveLength(2);
});

it('should have `accessibilityState={ checked: false }` when `status="unchecked"', () => {
  const { getAllByA11yState } = render(
    <Checkbox.Item status="unchecked" label="Unchecked Button" />
  );

  const elements = getAllByA11yState({ checked: false });
  expect(elements).toHaveLength(2);
});

it('should have `accessibilityState={ checked: false }` when `status="indeterminate"', () => {
  const { getAllByA11yState } = render(
    <Checkbox.Item status="indeterminate" label="Indeterminate Button" />
  );

  const elements = getAllByA11yState({ checked: false });
  expect(elements).toHaveLength(2);
});

it('disables the row when the prop disabled is true', () => {
  const { getByLabelText } = render(
    <Checkbox.Item accessibilityLabel="some checkbox" disabled />
  );

  const touchable = getByLabelText('some checkbox');

  expect(touchable.props).toMatchObject({
    accessibilityState: { disabled: true },
  });
});
