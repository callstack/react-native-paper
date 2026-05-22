import * as React from 'react';

import { fireEvent } from '@testing-library/react-native';

import { render } from '../../test-utils';
import FAB from '../FAB';

it('renders extended FAB expanded', () => {
  const tree = render(
    <FAB.Extended icon="plus" label="New message" expanded />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders extended FAB collapsed', () => {
  const tree = render(
    <FAB.Extended icon="plus" label="New message" expanded={false} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders extended FAB not visible', () => {
  const tree = render(
    <FAB.Extended icon="plus" label="New message" expanded visible={false} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders extended FAB medium size', () => {
  const tree = render(
    <FAB.Extended icon="plus" label="New message" expanded size="medium" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders extended FAB large size', () => {
  const tree = render(
    <FAB.Extended icon="plus" label="New message" expanded size="large" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders extended FAB transitioning to collapsed', () => {
  const { update, toJSON } = render(
    <FAB.Extended icon="plus" label="New message" expanded />
  );
  update(<FAB.Extended icon="plus" label="New message" expanded={false} />);
  expect(toJSON()).toMatchSnapshot();
});

it('uses label as default accessibilityLabel', () => {
  const { getByTestId } = render(
    <FAB.Extended
      icon="plus"
      label="New message"
      expanded
      testID="extended-fab"
    />
  );
  expect(getByTestId('extended-fab').props.accessibilityLabel).toBe(
    'New message'
  );
});

it('respects explicit accessibilityLabel', () => {
  const { getByTestId } = render(
    <FAB.Extended
      icon="plus"
      label="New message"
      expanded
      accessibilityLabel="Create new message"
      testID="extended-fab"
    />
  );
  expect(getByTestId('extended-fab').props.accessibilityLabel).toBe(
    'Create new message'
  );
});

it('calls onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <FAB.Extended
      icon="plus"
      label="New message"
      expanded
      onPress={onPress}
      testID="extended-fab"
    />
  );
  fireEvent.press(getByTestId('extended-fab'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('forwards event object to onPress', () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <FAB.Extended
      icon="plus"
      label="New message"
      expanded
      onPress={onPress}
      testID="extended-fab"
    />
  );
  fireEvent(getByTestId('extended-fab'), 'onPress', { key: 'value' });
  expect(onPress).toHaveBeenCalledWith({ key: 'value' });
});
