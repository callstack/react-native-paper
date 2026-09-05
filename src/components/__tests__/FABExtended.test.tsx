import { Platform } from 'react-native';

import { afterEach, expect, it, jest } from '@jest/globals';
import { fireEvent, screen, userEvent } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';

import { render } from '../../test-utils';
import FAB from '../FAB';

jest.mock('react-native-reanimated', () => {
  const ReanimatedModule = jest.requireActual<
    typeof import('react-native-reanimated')
  >('react-native-reanimated');

  return {
    __esModule: true,
    ...ReanimatedModule,
    default: ReanimatedModule.default,
    measure: jest.fn(),
  };
});

afterEach(() => {
  jest.mocked(Reanimated.measure).mockReset();
  jest.restoreAllMocks();
});

it('renders extended FAB expanded', async () => {
  const tree = (
    await render(<FAB.Extended icon="plus" label="New message" expanded />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('expands to fit the measured label width', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  jest.mocked(Reanimated.measure).mockReturnValue({
    x: 0,
    y: 0,
    width: 80,
    height: 20,
    pageX: 0,
    pageY: 0,
  });

  await render(
    <FAB.Extended
      icon="plus"
      label="New message"
      expanded
      style={{}}
      testID="extended-fab"
    />
  );
  await jest.runAllTimersAsync();

  expect(
    Reanimated.getAnimatedStyle(screen.getByTestId('extended-fab-container'))
  ).toMatchObject({ width: 144 });
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
  await render(<FAB.Extended icon="plus" label="New message" expanded />);
  expect(screen.getByRole('button', { name: 'New message' })).toBeTruthy();
});

it('respects explicit aria-label', async () => {
  await render(
    <FAB.Extended
      icon="plus"
      label="New message"
      expanded
      aria-label="Create new message"
    />
  );
  expect(
    screen.getByRole('button', { name: 'Create new message' })
  ).toBeTruthy();
});

it('calls onPress when pressed', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();
  await render(
    <FAB.Extended icon="plus" label="New message" expanded onPress={onPress} />
  );
  await user.press(screen.getByRole('button', { name: 'New message' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('forwards event object to onPress', async () => {
  const onPress = jest.fn();
  await render(
    <FAB.Extended icon="plus" label="New message" expanded onPress={onPress} />
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
