import { Animated, StyleSheet, Text, View } from 'react-native';

import { expect, it, jest } from '@jest/globals';
import { act } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
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
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

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

// Regression test for https://github.com/callstack/react-native-paper/issues/4951
// Under the New Architecture (Fabric), Animated.timing fires its callback with
// `finished: false` even when the animation completes naturally.  The hide path
// in handleOnHidden gated `setHidden(true)` on `if (finished)`, so the Snackbar
// stayed mounted forever.  The fix removes that guard (mirrors the show-path fix
// from PR #4447).
it('unmounts after visible becomes false even when the hide animation reports finished:false (Fabric new arch)', async () => {
  // Arrange: mount visible Snackbar and settle the show animation.
  const view = await render(
    <Snackbar visible onDismiss={jest.fn()} testID="snack-bar">
      Snackbar content
    </Snackbar>
  );

  await act(() => {
    jest.advanceTimersByTime(300); // > 200 ms show animation
  });

  // Confirm the component is currently rendered.
  expect(view.toJSON()).not.toBeNull();

  // Override Animated.timing for the single hide-animation call to simulate
  // Fabric's behaviour: the animation plays to completion visually but the
  // callback receives { finished: false }.
  jest.spyOn(Animated, 'timing').mockImplementationOnce((value, config) => ({
    start: (callback?: Animated.EndCallback) => {
      setTimeout(() => {
        (value as Animated.Value).setValue(config.toValue as number);
        // Fabric new-arch bug: reports finished:false on a completed animation.
        callback?.({ finished: false });
      }, 0);
    },
    stop: () => {},
    reset: () => {},
  }));

  // Act: flip visible to false, which triggers handleOnHidden → the mocked
  // Animated.timing call → schedules the callback with { finished: false }.
  // rerender is async in @testing-library/react-native v14 and must be awaited
  // so useLayoutEffect runs and Animated.timing is called before the spy is gone.
  await view.rerender(
    <Snackbar visible={false} onDismiss={jest.fn()} testID="snack-bar">
      Snackbar content
    </Snackbar>
  );

  // Fire the hide-animation callback, then flush the microtask queue so that
  // React 19's concurrent scheduler can apply the setHidden(true) state update.
  await act(async () => {
    jest.advanceTimersByTime(200);
    await Promise.resolve();
  });

  jest.restoreAllMocks();

  // Assert: setHidden(true) must have been called unconditionally so the
  // component returns null and unmounts, regardless of the finished flag.
  expect(view.toJSON()).toBeNull();
});

it('animated value changes correctly', async () => {
  const value = new Animated.Value(1);
  await render(
    <Snackbar
      visible
      onDismiss={jest.fn()}
      testID="snack-bar"
      style={[{ transform: [{ scale: value }] }]}
    >
      Snackbar content
    </Snackbar>
  );
  expect(screen.getByTestId('snack-bar-outer-layer')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  await act(() => {
    jest.advanceTimersByTime(200);
  });
  expect(screen.getByTestId('snack-bar-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});
