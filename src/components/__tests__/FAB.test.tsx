import { expect, it, jest } from '@jest/globals';
import { fireEvent, screen, userEvent } from '@testing-library/react-native';

import { render } from '../../test-utils';
import FAB from '../FAB';

it('renders FAB with default props', async () => {
  const tree = (await render(<FAB icon="plus" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with primary variant', async () => {
  const tree = (await render(<FAB icon="plus" variant="primary" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with secondary variant', async () => {
  const tree = (await render(<FAB icon="plus" variant="secondary" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with tertiary variant', async () => {
  const tree = (await render(<FAB icon="plus" variant="tertiary" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with tonalSecondary variant', async () => {
  const tree = (
    await render(<FAB icon="plus" variant="tonalSecondary" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with tonalTertiary variant', async () => {
  const tree = (
    await render(<FAB icon="plus" variant="tonalTertiary" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB medium size', async () => {
  const tree = (await render(<FAB icon="plus" size="medium" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB large size', async () => {
  const tree = (await render(<FAB icon="plus" size="large" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with containerColor override', async () => {
  const tree = (
    await render(<FAB icon="plus" containerColor="#ff5722" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with containerColor and contentColor overrides', async () => {
  const tree = (
    await render(
      <FAB icon="plus" containerColor="#ff5722" contentColor="#ffffff" />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with aria-label', async () => {
  const tree = (
    await render(<FAB icon="plus" aria-label="Add item" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB transitioning to not visible', async () => {
  const { rerender, toJSON } = await render(<FAB icon="plus" />);
  await rerender(<FAB icon="plus" visible={false} />);
  expect(toJSON()).toMatchSnapshot();
});

it('renders FAB transitioning to visible', async () => {
  const { rerender, toJSON } = await render(
    <FAB icon="plus" visible={false} />
  );
  await rerender(<FAB icon="plus" visible />);
  expect(toJSON()).toMatchSnapshot();
});

it('calls onPress when FAB is pressed', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();
  await render(<FAB icon="plus" aria-label="Add item" onPress={onPress} />);
  await user.press(screen.getByRole('button', { name: 'Add item' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('forwards event object to onPress', async () => {
  const onPress = jest.fn();
  await render(<FAB icon="plus" aria-label="Add item" onPress={onPress} />);
  await fireEvent(screen.getByRole('button', { name: 'Add item' }), 'onPress', {
    key: 'value',
  });
  expect(onPress).toHaveBeenCalledWith({ key: 'value' });
});
