import * as React from 'react';
import { StyleSheet, Easing, Animated, Platform } from 'react-native';

import { fireEvent, render, act } from '@testing-library/react-native';
import color from 'color';

import { getTheme } from '../../core/theming';
import { red300 } from '../../styles/themes/v2/colors';
import { MD3Colors } from '../../styles/themes/v3/tokens';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import BottomNavigationRouteScreen from '../BottomNavigation/BottomNavigationRouteScreen';
import {
  getActiveTintColor,
  getInactiveTintColor,
  getLabelColor,
} from '../BottomNavigation/utils';

const styles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: red300,
  },
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      icon: { color: string; src: any };
    }
  }
}

type AnimatedTiming = (
  value: Animated.Value | Animated.ValueXY,
  config: Animated.TimingAnimationConfig
) => Animated.CompositeAnimation;

type AnimatedParallel = (animations: Array<Animated.CompositeAnimation>) => {
  start: (callback?: Animated.EndCallback) => void;
};

// Make sure any animation finishes before checking the snapshot results
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  const timing: AnimatedTiming = (value, config) => ({
    start: (callback) => {
      value.setValue(config.toValue as any);
      callback?.({ finished: true });
    },
    value,
    config,
    stop: () => {
      throw new Error('Not implemented');
    },
    reset: () => {
      throw new Error('Not implemented');
    },
  });
  RN.Animated.timing = timing;

  const parallel: AnimatedParallel = (animations) => ({
    start: (callback) => {
      const results = animations.map((animation) => {
        animation.start();
        return { finished: true };
      });
      callback?.({ finished: results.every((result) => result.finished) });
    },
  });

  RN.Animated.parallel = parallel;

  RN.Dimensions.get = () => ({
    fontScale: 1,
  });

  return RN;
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
}));

const icons = ['magnify', 'camera', 'inbox', 'heart', 'shopping-music'];

const createState = (index: number, length: number) => ({
  index,
  routes: Array.from({ length }, (_, i) => ({
    key: `key-${i}`,
    focusedIcon: icons[i],
    unfocusedIcon: undefined,
    title: `Route: ${i}`,
  })),
});

it('renders shifting bottom navigation', () => {
  const tree = render(
    <BottomNavigation
      shifting
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders bottom navigation with scene animation', () => {
  const tree = render(
    <BottomNavigation
      shifting
      sceneAnimationEnabled
      sceneAnimationType="shifting"
      sceneAnimationEasing={Easing.ease}
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

// eslint-disable-next-line jest/no-disabled-tests
it.skip('sceneAnimationEnabled matches animation requirements', async () => {
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

  // Simulate the button press
  await act(async () => {
    fireEvent.press(tree.getByText('Route: 1'));
  });

  // Expect the calls to Animated.parallel
  expect(Animated.parallel).toHaveBeenCalledTimes(2);

  // Expect the first call to Animated.parallel
  expect(Animated.parallel).toHaveBeenCalledWith(
    expect.arrayContaining([
      expect.objectContaining({
        // ripple
        config: expect.objectContaining({ toValue: 1, duration: 400 }),
      }),
    ])
  );

  // Expect the second call to Animated.parallel
  expect(Animated.parallel).toHaveBeenCalledWith(
    expect.arrayContaining([
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

it('calls onTabPress', () => {
  const onTabPress = jest.fn();
  const onIndexChange = jest.fn();

  const tree = render(
    <BottomNavigation
      shifting
      onTabPress={onTabPress}
      onIndexChange={onIndexChange}
      navigationState={createState(0, 5)}
      renderScene={({ route }) => route.title}
    />
  );
  fireEvent(tree.getByText('Route: 1'), 'onPress');
  expect(onTabPress).toHaveBeenCalled();
  expect(onTabPress).toHaveBeenCalledTimes(1);
  expect(onTabPress).toHaveBeenLastCalledWith(
    expect.objectContaining({
      route: expect.objectContaining({
        key: 'key-1',
      }),
      defaultPrevented: expect.any(Boolean),
      preventDefault: expect.any(Function),
    })
  );
});

it('calls onTabLongPress', () => {
  const onTabLongPress = jest.fn();
  const onIndexChange = jest.fn();

  const tree = render(
    <BottomNavigation
      shifting
      onIndexChange={onIndexChange}
      onTabLongPress={onTabLongPress}
      navigationState={createState(0, 5)}
      renderScene={({ route }) => route.title}
    />
  );
  fireEvent(tree.getByText('Route: 2'), 'onLongPress');
  expect(onTabLongPress).toHaveBeenCalled();
  expect(onTabLongPress).toHaveBeenCalledTimes(1);
  expect(onTabLongPress).toHaveBeenLastCalledWith(
    expect.objectContaining({
      route: expect.objectContaining({
        key: 'key-2',
      }),
      defaultPrevented: expect.any(Boolean),
      preventDefault: expect.any(Function),
    })
  );
});

it('renders non-shifting bottom navigation', () => {
  const tree = render(
    <BottomNavigation
      shifting={false}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
    />
  ).toJSON();

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
  const tree = render(
    <BottomNavigation
      shifting
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      renderIcon={({ route, color }) => (
        <icon color={color} src={route.unfocusedIcon} />
      )}
      renderLabel={({ route, color }) => (
        <text color={color}>{route.title}</text>
      )}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label in non-shifting bottom navigation', () => {
  const tree = render(
    <BottomNavigation
      shifting={false}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      renderIcon={({ route, color }) => (
        <icon color={color} src={route.unfocusedIcon} />
      )}
      renderLabel={({ route, color }) => (
        <text color={color}>{route.title}</text>
      )}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label with custom colors in shifting bottom navigation', () => {
  const tree = render(
    <BottomNavigation
      shifting
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      activeColor="#FBF7DB"
      inactiveColor="#853D4B"
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label with custom colors in non-shifting bottom navigation', () => {
  const tree = render(
    <BottomNavigation
      shifting={false}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      activeColor="#FBF7DB"
      inactiveColor="#853D4B"
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('hides labels in shifting bottom navigation', () => {
  const tree = render(
    <BottomNavigation
      shifting
      labeled={false}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('hides labels in non-shifting bottom navigation', () => {
  const tree = render(
    <BottomNavigation
      shifting={false}
      labeled={false}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
    />
  ).toJSON();

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

it('applies maxTabBarWidth styling if compact prop is truthy', () => {
  const { getByTestId } = render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      getLazy={({ route }) => route.key === 'key-2'}
      shifting={false}
      testID="bottom-navigation"
      compact
    />
  );

  expect(getByTestId('bottom-navigation-bar-content-wrapper')).toHaveStyle({
    maxWidth: 480,
  });
});

it('does not apply maxTabBarWidth styling if compact prop is falsy', () => {
  const { getByTestId } = render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      getLazy={({ route }) => route.key === 'key-2'}
      shifting={false}
      testID="bottom-navigation"
      compact={false}
    />
  );

  expect(getByTestId('bottom-navigation-bar-content-wrapper')).not.toHaveStyle({
    maxWidth: 480,
  });
});

it('displays ripple animation view if shifting is truthy', () => {
  const { getByTestId } = render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      getLazy={({ route }) => route.key === 'key-2'}
      testID="bottom-navigation"
      theme={{ isV3: false }}
      shifting
    />
  );

  expect(getByTestId('bottom-navigation-bar-content-ripple')).toBeDefined();
});

it('does not display ripple animation view if shifting is falsy', () => {
  const { queryByTestId } = render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      getLazy={({ route }) => route.key === 'key-2'}
      testID="bottom-navigation"
      shifting={false}
    />
  );

  expect(queryByTestId('bottom-navigation-bar-content-ripple')).toBeNull();
});

describe('getActiveTintColor', () => {
  it.each`
    activeColor  | defaultColor | useV3    | expected
    ${'#FBF7DB'} | ${'#fff'}    | ${true}  | ${'#FBF7DB'}
    ${undefined} | ${'#fff'}    | ${true}  | ${MD3Colors.secondary10}
    ${undefined} | ${'#fff'}    | ${false} | ${'#fff'}
  `(
    'returns $expected when activeColor: $activeColor and useV3: $useV3',
    ({ activeColor, defaultColor, useV3, expected }) => {
      const theme = getTheme(false, useV3);
      const color = getActiveTintColor({ activeColor, defaultColor, theme });
      expect(color).toBe(expected);
    }
  );
});

describe('getInactiveTintColor', () => {
  it.each`
    inactiveColor | defaultColor | useV3    | expected
    ${'#853D4B'}  | ${'#fff'}    | ${true}  | ${'#853D4B'}
    ${undefined}  | ${'#fff'}    | ${true}  | ${MD3Colors.neutralVariant30}
    ${undefined}  | ${'#fff'}    | ${false} | ${color('#fff').alpha(0.5).rgb().string()}
  `(
    'returns $expected when inactiveColor: $inactiveColor and useV3: $useV3',
    ({ inactiveColor, defaultColor, useV3, expected }) => {
      const theme = getTheme(false, useV3);
      const color = getInactiveTintColor({
        inactiveColor,
        defaultColor,
        theme,
      });
      expect(color).toBe(expected);
    }
  );
});

describe('getLabelColor', () => {
  it.each`
    tintColor    | focused  | defaultColor | useV3    | expected
    ${'#FBF7DB'} | ${true}  | ${'#fff'}    | ${true}  | ${'#FBF7DB'}
    ${'#853D4B'} | ${true}  | ${'#fff'}    | ${true}  | ${'#853D4B'}
    ${undefined} | ${true}  | ${'#fff'}    | ${true}  | ${MD3Colors.neutral10}
    ${undefined} | ${false} | ${'#fff'}    | ${true}  | ${MD3Colors.neutralVariant30}
    ${undefined} | ${false} | ${'#fff'}    | ${false} | ${'#fff'}
    ${undefined} | ${true}  | ${'#fff'}    | ${false} | ${'#fff'}
  `(
    'returns $expected when tintColor: $tintColor, focused: $focused useV3: $useV3',
    ({ tintColor, focused, defaultColor, useV3, expected }) => {
      const theme = getTheme(false, useV3);
      const color = getLabelColor({
        tintColor,
        hasColor: Boolean(tintColor),
        focused,
        defaultColor,
        theme,
      });
      expect(color).toBe(expected);
    }
  );
});

it('barStyle animated value changes correctly', () => {
  const value = new Animated.Value(1);
  const { getByTestId } = render(
    <BottomNavigation
      navigationState={createState(0, 1)}
      onIndexChange={() => {}}
      renderScene={({ route }) => route.title}
      testID={'bottom-navigation'}
      barStyle={[{ transform: [{ scale: value }] }]}
    />
  );
  expect(getByTestId('bottom-navigation-bar-outer-layer')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  jest.advanceTimersByTime(200);

  expect(getByTestId('bottom-navigation-bar-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});

it("allows customizing Route's type via generics", () => {
  type CustomRoute = {
    key: string;
    customPropertyName: string;
  };

  type CustomState = {
    index: number;
    routes: CustomRoute[];
  };

  const state: CustomState = {
    index: 0,
    routes: [
      { key: 'a', customPropertyName: 'First' },
      { key: 'b', customPropertyName: 'Second' },
    ],
  };

  const tree = render(
    <BottomNavigation
      navigationState={state}
      onIndexChange={jest.fn()}
      getLabelText={({ route }) => route.customPropertyName}
      renderScene={({ route }) => route.customPropertyName}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
