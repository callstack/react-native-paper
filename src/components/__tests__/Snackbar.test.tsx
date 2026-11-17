import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';

import { expect, it, jest } from '@jest/globals';
import * as Reanimated from 'react-native-reanimated';

import PaperProvider from '../../core/PaperProvider';
import { act, render } from '../../test-utils';
import { red200, white } from '../../theme/colors';
import Snackbar from '../Snackbar';

const styles = StyleSheet.create({
  snackContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconView: {
    backgroundColor: red200,
    padding: 15,
  },
  text: { color: white, marginLeft: 10, flexWrap: 'wrap', flexShrink: 1 },
});

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual<typeof import('react-native-safe-area-context')>(
    'react-native-safe-area-context'
  ),
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

jest.mock('react-native-reanimated', () => {
  const ReanimatedModule = jest.requireActual<
    typeof import('react-native-reanimated')
  >('react-native-reanimated');

  return {
    __esModule: true,
    ...ReanimatedModule,
    default: ReanimatedModule.default,
    withTiming: jest.fn(ReanimatedModule.withTiming),
  };
});

it('renders snackbar with content', async () => {
  const tree = (
    await render(
      <Snackbar visible onDismiss={jest.fn()}>
        Snackbar content
      </Snackbar>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders not visible snackbar with content wrapper but no actual content', async () => {
  const tree = (
    await render(
      <Snackbar visible={false} onDismiss={jest.fn()}>
        Snackbar content
      </Snackbar>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders snackbar with Text as a child', async () => {
  const tree = (
    await render(
      <Snackbar visible onDismiss={jest.fn()}>
        <Text>Snackbar content</Text>
      </Snackbar>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders snackbar with action button', async () => {
  const tree = (
    await render(
      <Snackbar
        visible
        onDismiss={() => {}}
        action={{ label: 'Undo', onPress: jest.fn() }}
      >
        Snackbar content
      </Snackbar>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders snackbar with View & Text as a child', async () => {
  const tree = (
    await render(
      <Snackbar visible onDismiss={jest.fn()}>
        <View style={styles.snackContent}>
          <View style={styles.iconView} />
          <Text style={styles.text}>
            Error Message which is veryyyyyyyyyyyy longggggggg Error Message
            which is veryyyyyyyyyyyy longggggggg
          </Text>
        </View>
      </Snackbar>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it.each([
  { reduceMotion: 'off', show: 200, hide: 100 },
  { reduceMotion: 'on', show: 0, hide: 0 },
] as const)(
  'appears in $show ms and disappears in $hide ms when reduceMotion is "$reduceMotion"',
  async ({ reduceMotion, show, hide }) => {
    const withTiming = jest.mocked(Reanimated.withTiming);
    const makeSnackbar = (visible: boolean) => (
      <PaperProvider reduceMotion={reduceMotion}>
        <Snackbar visible={visible} onDismiss={jest.fn()}>
          Snackbar content
        </Snackbar>
      </PaperProvider>
    );

    const { rerender } = await render(makeSnackbar(false));
    withTiming.mockClear();

    await rerender(makeSnackbar(true));
    await rerender(makeSnackbar(false));

    expect(withTiming.mock.calls.map(([, config]) => config?.duration)).toEqual(
      [show, hide]
    );
  }
);

it('keeps its dismiss timer when the OS reduce motion setting changes', async () => {
  const addEventListener = jest.mocked(AccessibilityInfo.addEventListener);
  const reduceMotionListeners = () =>
    addEventListener.mock.calls
      .filter(([eventName]) => eventName === 'reduceMotionChanged')
      .map(([, listener]) => listener);
  addEventListener.mockClear();
  const onDismiss = jest.fn();

  await render(
    <PaperProvider>
      <Snackbar visible duration={1000} onDismiss={onDismiss}>
        Snackbar content
      </Snackbar>
    </PaperProvider>
  );

  // The snackbar appears in 200 ms and is dismissed 1000 ms later.
  await act(() => {
    jest.advanceTimersByTime(800);
  });
  expect(reduceMotionListeners()).not.toHaveLength(0);

  for (const enabled of [true, false]) {
    await act(() => {
      reduceMotionListeners().forEach((listener) => listener(enabled));
    });
  }

  expect(onDismiss).not.toHaveBeenCalled();

  await act(() => {
    jest.advanceTimersByTime(500);
  });

  expect(onDismiss).toHaveBeenCalledTimes(1);
});
