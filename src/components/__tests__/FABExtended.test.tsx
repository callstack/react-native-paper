import { expect, it, jest } from '@jest/globals';
import { fireEvent, userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import FAB from '../FAB';

it('renders extended FAB expanded', async () => {
  const tree = (
    await render(<FAB.Extended icon="plus" label="New message" expanded />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders extended FAB collapsed', async () => {
  const tree = (
    await render(
      <FAB.Extended icon="plus" label="New message" expanded={false} />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders extended FAB not visible', async () => {
  const tree = (
    await render(
      <FAB.Extended icon="plus" label="New message" expanded visible={false} />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders extended FAB medium size', async () => {
  const tree = (
    await render(
      <FAB.Extended icon="plus" label="New message" expanded size="medium" />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders extended FAB large size', async () => {
  const tree = (
    await render(
      <FAB.Extended icon="plus" label="New message" expanded size="large" />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders extended FAB transitioning to collapsed', async () => {
  const { rerender, toJSON } = await render(
    <FAB.Extended icon="plus" label="New message" expanded />
  );
  await rerender(
    <FAB.Extended icon="plus" label="New message" expanded={false} />
  );
  expect(toJSON()).toMatchSnapshot();
});

it('uses label as default aria-label', async () => {
  await render(
    <FAB.Extended
      icon="plus"
      label="New message"
      expanded
      testID="extended-fab"
    />
  );

  expect(screen.getByLabelText('New message')).toBeOnTheScreen();
});

it('respects explicit aria-label', async () => {
  await render(
    <FAB.Extended
      icon="plus"
      label="New message"
      expanded
      aria-label="Create new message"
      testID="extended-fab"
    />
  );

  expect(screen.getByLabelText('Create new message')).toBeOnTheScreen();
});

it('calls onPress when pressed', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();
  await render(
    <FAB.Extended
      icon="plus"
      label="New message"
      expanded
      onPress={onPress}
      testID="extended-fab"
    />
  );
  await user.press(screen.getByRole('button', { name: 'New message' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('forwards event object to onPress', async () => {
  const onPress = jest.fn();
  await render(
    <FAB.Extended
      icon="plus"
      label="New message"
      expanded
      onPress={onPress}
      testID="extended-fab"
    />
  );
  await fireEvent(
    screen.getByRole('button', { name: 'New message' }),
    'onPress',
    {
      key: 'value',
    }
  );
  expect(onPress).toHaveBeenCalledWith({ key: 'value' });
});
