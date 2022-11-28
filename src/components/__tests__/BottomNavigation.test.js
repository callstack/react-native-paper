import * as React from 'react';
import { StyleSheet, Easing, Animated, Platform } from 'react-native';

import { fireEvent, render } from '@testing-library/react-native';
import renderer from 'react-test-renderer';

import { red300 } from '../../styles/themes/v2/colors';
import BottomNavigation from '../BottomNavigation/BottomNavigation.tsx';
import BottomNavigationRouteScreen from '../BottomNavigation/BottomNavigationRouteScreen.tsx';

const styles = StyleSheet.create({
  labelColor: {
    color: red300,
  },
  backgroundColor: {
    backgroundColor: red300,
  },
});

// Make sure any animation finishes before checking the snapshot results
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  const mock = jest.fn(() => ({
    delay: () => jest.fn(),
    interpolate: () => jest.fn(),
    timing: () => jest.fn(),
    start: () => jest.fn(),
    stop: () => jest.fn(),
    reset: () => jest.fn(),
  }));

  RN.Animated.timing = (value, config) => ({
    start: (callback) => {
      value.setValue(config.toValue);
      callback && callback({ finished: true });
    },
    value,
    config,
  });

  RN.Animated.parallel = mock;

  RN.Dimensions.get = () => ({
    fontScale: 1,
  });

  return RN;
});

const icons = ['magnify', 'camera', 'inbox', 'heart', 'shopping-music'];

const createState = (index, length) => ({
  index,
  routes: Array.from({ length }, (_, i) => ({
    key: `key-${i}`,
    focusedIcon: icons[i],
    title: `Route: ${i}`,
  })),
});

it('renders shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <BottomNavigation
        shifting
        navigationState={createState(0, 5)}
        onIndexChange={jest.fn()}
        renderScene={({ route }) => route.title}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders bottom navigation with scene animation', () => {
  const tree = renderer
    .create(
      <BottomNavigation
        shifting
        sceneAnimationEnabled
        sceneAnimationType="shifting"
        sceneAnimationEasing={Easing.ease}
        navigationState={createState(0, 5)}
        onIndexChange={jest.fn()}
        renderScene={({ route }) => route.title}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('sceneAnimationEnabled matches animation requirements', () => {
  const ease = Easing.ease;

  const tree = render(
    <BottomNavigation
      shifting
      sceneAnimationEnabled
      sceneAnimationType="shifting"
      sceneAnimationEasing={ease}
      navigationState={createState(1, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
    />
  );
  fireEvent(tree.getByText('Route: 1'), 'onPress');

  expect(Animated.parallel).toHaveBeenLastCalledWith(
    expect.arrayContaining([
      expect.objectContaining({
        // ripple
        config: expect.objectContaining({ toValue: 1, duration: 400 }),
      }),
      expect.objectContaining({
        // previous position anims, shifting to the left
        config: expect.objectContaining({
          toValue: -1,
          duration: 150,
          easing: ease,
        }),
      }),
      expect.objectContaining({
        // active page visibility
        config: expect.objectContaining({
          toValue: 1,
          duration: 150,
          easing: ease,
        }),
      }),
      expect.objectContaining({
        // next position anims, shifting to the right
        config: expect.objectContaining({
          toValue: 1,
          duration: 150,
          easing: ease,
        }),
      }),
    ])
  );
});

it('calls onIndexChange', () => {
  const onIndexChange = jest.fn();
  const tree = render(
    <BottomNavigation
      shifting
      navigationState={createState(0, 5)}
      onIndexChange={onIndexChange}
      renderScene={({ route }) => route.title}
    />
  );
  // pressing same index as active navigation state does not call onIndexChange
  fireEvent(tree.getByText('Route: 0'), 'onPress');
  expect(onIndexChange).not.toHaveBeenCalled();

  fireEvent(tree.getByText('Route: 1'), 'onPress');
  expect(onIndexChange).toHaveBeenCalledTimes(1);
});

it('renders non-shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <BottomNavigation
        shifting={false}
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={({ route }) => route.title}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('does not crash when shifting is true and the number of tabs in the navigationState is less than 2', () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  render(
    <BottomNavigation
      shifting={true}
      navigationState={createState(0, 1)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
    />
  );

  expect(console.warn).toHaveBeenCalledWith(
    'BottomNavigation needs at least 2 tabs to run shifting animation'
  );

  jest.restoreAllMocks();
});

it('renders custom icon and label in shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <BottomNavigation
        shifting
        navigationState={createState(0, 5)}
        onIndexChange={jest.fn()}
        renderScene={({ route }) => route.title}
        renderIcon={({ route, color }) => (
          <icon color={color}>{route.icon}</icon>
        )}
        renderLabel={({ route, color }) => (
          <text color={color}>{route.label}</text>
        )}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label in non-shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <BottomNavigation
        shifting={false}
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={({ route }) => route.title}
        renderIcon={({ route, color }) => (
          <icon color={color}>{route.icon}</icon>
        )}
        renderLabel={({ route, color }) => (
          <text color={color}>{route.label}</text>
        )}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label with custom colors in shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <BottomNavigation
        shifting
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={({ route }) => route.title}
        activeColor="#FBF7DB"
        inactiveColor="#853D4B"
        barStyle={styles.labelColor}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label with custom colors in non-shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <BottomNavigation
        shifting={false}
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={({ route }) => route.title}
        activeColor="#FBF7DB"
        inactiveColor="#853D4B"
        barStyle={styles.labelColor}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('hides labels in shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <BottomNavigation
        shifting
        labeled={false}
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={({ route }) => route.title}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('hides labels in non-shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <BottomNavigation
        shifting={false}
        labeled={false}
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={({ route }) => route.title}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('should have appropriate display style according to the visibility on web', () => {
  const originalPlatform = Platform.OS;
  Platform.OS = 'web';

  const { getByTestId, rerender } = render(
    <BottomNavigationRouteScreen visibility={1} index={0} />
  );

  const wrapper = getByTestId('RouteScreen: 0');

  expect(wrapper).toHaveStyle({ display: 'flex' });

  rerender(<BottomNavigationRouteScreen visibility={0} index={0} />);
  expect(wrapper).toHaveStyle({ display: 'none' });

  Platform.OS = originalPlatform;
});

it('should have labelMaxFontSizeMultiplier passed to label', () => {
  const labelMaxFontSizeMultiplier = 2;
  const { getAllByText } = render(
    <BottomNavigation
      shifting={false}
      labeled={true}
      labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
    />
  );

  const label = getAllByText('Route: 0')[0];

  expect(label.props.maxFontSizeMultiplier).toBe(labelMaxFontSizeMultiplier);
});

it('renders custom background color passed to barStyle property', () => {
  const { getByTestId } = render(
    <BottomNavigation
      shifting={false}
      labeled={true}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      barStyle={styles.backgroundColor}
      testID={'bottom-navigation'}
    />
  );

  const wrapper = getByTestId('bottom-navigation-bar-content');
  expect(wrapper).toHaveStyle({ backgroundColor: red300 });
});

it('renders a single tab', () => {
  const { queryByTestId } = render(
    <BottomNavigation
      shifting={false}
      navigationState={createState(0, 1)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      testID={'bottom-navigation'}
    />
  );

  expect(queryByTestId('bottom-navigation')).not.toBeNull();
});

it('renders bottom navigation with getLazy', () => {
  const tree = render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      getLazy={({ route }) => route.key === 'key-2'}
    />
  );

  expect(tree).toMatchSnapshot();

  expect(tree.queryByTestId('RouteScreen: 2')).toBeNull();
});
