import { fireEvent } from '@testing-library/react-native';

import { render } from '../../test-utils';
import FAB from '../FAB';

it('renders FAB with default props', () => {
  const tree = render(<FAB icon="plus" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with primary variant', () => {
  const tree = render(<FAB icon="plus" variant="primary" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with secondary variant', () => {
  const tree = render(<FAB icon="plus" variant="secondary" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with tertiary variant', () => {
  const tree = render(<FAB icon="plus" variant="tertiary" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with tonalSecondary variant', () => {
  const tree = render(<FAB icon="plus" variant="tonalSecondary" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with tonalTertiary variant', () => {
  const tree = render(<FAB icon="plus" variant="tonalTertiary" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB medium size', () => {
  const tree = render(<FAB icon="plus" size="medium" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB large size', () => {
  const tree = render(<FAB icon="plus" size="large" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with containerColor override', () => {
  const tree = render(<FAB icon="plus" containerColor="#ff5722" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with containerColor and contentColor overrides', () => {
  const tree = render(
    <FAB icon="plus" containerColor="#ff5722" contentColor="#ffffff" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with accessibilityLabel', () => {
  const tree = render(
    <FAB icon="plus" accessibilityLabel="Add item" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB transitioning to not visible', () => {
  const { update, toJSON } = render(<FAB icon="plus" />);
  update(<FAB icon="plus" visible={false} />);
  expect(toJSON()).toMatchSnapshot();
});

it('renders FAB transitioning to visible', () => {
  const { update, toJSON } = render(<FAB icon="plus" visible={false} />);
  update(<FAB icon="plus" visible />);
  expect(toJSON()).toMatchSnapshot();
});

it('calls onPress when FAB is pressed', () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <FAB icon="plus" onPress={onPress} testID="fab" />
  );
  fireEvent.press(getByTestId('fab'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('forwards event object to onPress', () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <FAB icon="plus" onPress={onPress} testID="fab" />
  );
  fireEvent(getByTestId('fab'), 'onPress', { key: 'value' });
  expect(onPress).toHaveBeenCalledWith({ key: 'value' });
});
