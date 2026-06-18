import { Animated, Easing, Platform, StyleSheet } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent } from '@testing-library/react-native';

import { getTheme } from '../../core/theming';
import { render } from '../../test-utils';
import { Palette } from '../../theme/tokens';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import BottomNavigationRouteScreen from '../BottomNavigation/BottomNavigationRouteScreen';
import Icon from '../Icon';
import NavigationBar from '../NavigationBar/NavigationBar';
import {
  getActiveTintColor,
  getInactiveTintColor,
  getLabelColor,
} from '../NavigationBar/utils';

const styles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: Palette.error60,
  },
});

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

it('renders bottom navigation', () => {
  const tree = render(
    <BottomNavigation
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
      navigationState={createState(0, 5)}
      onIndexChange={onIndexChange}
      renderScene={({ route }) => route.title}
    />
  );
  // The active scene also renders the route title, so target the last match
  // (the tab label) to fire the tab press.
  // pressing same index as active navigation state does not call onIndexChange
  fireEvent(tree.getAllByText('Route: 0').at(-1)!, 'onPress');
  expect(onIndexChange).not.toHaveBeenCalled();

  fireEvent(tree.getAllByText('Route: 1').at(-1)!, 'onPress');
  expect(onIndexChange).toHaveBeenCalledTimes(1);
});

it('calls onTabPress', () => {
  const onTabPress = jest.fn();
  const onIndexChange = jest.fn();

  const tree = render(
    <BottomNavigation
      onTabPress={onTabPress}
      onIndexChange={onIndexChange}
      navigationState={createState(0, 5)}
      renderScene={({ route }) => route.title}
    />
  );
  fireEvent(tree.getAllByText('Route: 1').at(-1)!, 'onPress');
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
      onIndexChange={onIndexChange}
      onTabLongPress={onTabLongPress}
      navigationState={createState(0, 5)}
      renderScene={({ route }) => route.title}
    />
  );
  fireEvent(tree.getAllByText('Route: 2').at(-1)!, 'onLongPress');
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

it('renders bottom navigation with three tabs', () => {
  const tree = render(
    <BottomNavigation
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('does not warn or crash when the deprecated shifting prop is passed with fewer than 2 tabs', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  const { getByTestId } = render(
    <BottomNavigation
      shifting={true}
      navigationState={createState(0, 1)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      testID="bottom-navigation"
    />
  );

  // `shifting` is a deprecated no-op, so it no longer warns about tab count.
  expect(getByTestId('bottom-navigation-bar')).toBeDefined();
  expect(warn).not.toHaveBeenCalled();

  jest.restoreAllMocks();
});

it('renders custom icon and label', () => {
  const tree = render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      renderIcon={({ route, color }) => (
        <Icon color={color} source={route.unfocusedIcon} size={24} />
      )}
      renderLabel={({ route, color }) => (
        <text color={typeof color === 'string' ? color : undefined}>
          {route.title}
        </text>
      )}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders with custom active and inactive colors', () => {
  const tree = render(
    <BottomNavigation
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      activeColor="#FBF7DB"
      inactiveColor="#853D4B"
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('hides labels when labeled is false', () => {
  const tree = render(
    <BottomNavigation
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
      labeled={true}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      barStyle={styles.backgroundColor}
      testID={'bottom-navigation'}
    />
  );

  const wrapper = getByTestId('bottom-navigation-bar-content');
  expect(wrapper).toHaveStyle({ backgroundColor: Palette.error60 });
});

it('renders a single tab', () => {
  const { queryByTestId } = render(
    <BottomNavigation
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
      testID="bottom-navigation"
      compact={false}
    />
  );

  expect(getByTestId('bottom-navigation-bar-content-wrapper')).not.toHaveStyle({
    maxWidth: 480,
  });
});

it('renders bar content', () => {
  const { getByTestId } = render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      getLazy={({ route }) => route.key === 'key-2'}
      testID="bottom-navigation"
    />
  );

  expect(getByTestId('bottom-navigation-bar-content')).toBeDefined();
});

it('does not render the legacy ripple overlay', () => {
  const { queryByTestId } = render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      getLazy={({ route }) => route.key === 'key-2'}
      testID="bottom-navigation"
    />
  );

  expect(queryByTestId('bottom-navigation-bar-content-ripple')).toBeNull();
});

it('renders tab labels when labeled', () => {
  const { getAllByText } = render(
    <NavigationBar
      navigationState={{
        index: 0,
        routes: [
          { key: 'a', title: 'Alpha', focusedIcon: 'magnify' },
          { key: 'b', title: 'Beta', focusedIcon: 'camera' },
        ],
      }}
      onTabPress={jest.fn()}
    />
  );

  // Each tab renders an active and inactive label layer, so both match.
  expect(getAllByText('Alpha').length).toBeGreaterThan(0);
  expect(getAllByText('Beta').length).toBeGreaterThan(0);
});

it('renders the horizontal (flexible) variant', () => {
  const tree = render(
    <NavigationBar
      navigationState={createState(0, 3)}
      onTabPress={jest.fn()}
      variant="horizontal"
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('falls back to icon-only when horizontal is combined with labeled=false', () => {
  const { queryByText } = render(
    <NavigationBar
      navigationState={createState(0, 3)}
      onTabPress={jest.fn()}
      variant="horizontal"
      labeled={false}
    />
  );

  // `horizontal` is a no-op without labels, so no label text is rendered.
  expect(queryByText('Route: 0')).toBeNull();
  expect(queryByText('Route: 1')).toBeNull();
});

it('renders MD3 state layers on hover, focus and press', () => {
  const navigationState = {
    index: 0,
    routes: [
      { key: 'a', title: 'Route: 0', focusedIcon: 'magnify', testID: 'tab-a' },
      { key: 'b', title: 'Route: 1', focusedIcon: 'camera', testID: 'tab-b' },
    ],
  };

  const { getByTestId } = render(
    <NavigationBar navigationState={navigationState} onTabPress={jest.fn()} />
  );

  const layerOpacity = () =>
    StyleSheet.flatten(getByTestId('tab-b-state-layer').props.style).opacity;

  // Idle: no visible state layer.
  expect(layerOpacity()).toBeUndefined();

  // Hovered: 8% state layer.
  fireEvent(getByTestId('tab-b'), 'hoverIn');
  expect(layerOpacity()).toBe(0.08);
  fireEvent(getByTestId('tab-b'), 'hoverOut');
  expect(layerOpacity()).toBeUndefined();

  // Focused: 10% state layer.
  fireEvent(getByTestId('tab-b'), 'focus');
  expect(layerOpacity()).toBe(0.1);
  fireEvent(getByTestId('tab-b'), 'blur');

  // Pressed: 10% state layer.
  fireEvent(getByTestId('tab-b'), 'pressIn');
  expect(layerOpacity()).toBe(0.1);
  fireEvent(getByTestId('tab-b'), 'pressOut');
  expect(layerOpacity()).toBeUndefined();
});

it('colors the focused tab label with secondary and others with onSurfaceVariant', () => {
  const navigationState = {
    index: 0,
    routes: [
      { key: 'a', title: 'Alpha', focusedIcon: 'magnify' },
      { key: 'b', title: 'Beta', focusedIcon: 'camera' },
    ],
  };

  const { getAllByText } = render(
    <NavigationBar navigationState={navigationState} onTabPress={jest.fn()} />
  );

  const colorsOf = (text: string) =>
    getAllByText(text).map(
      (node) => StyleSheet.flatten(node.props.style).color
    );

  expect(colorsOf('Alpha')).toContain(getTheme().colors.secondary);
  expect(colorsOf('Beta')).toContain(getTheme().colors.onSurfaceVariant);
});

it('renders the active indicator with the secondaryContainer color', () => {
  const navigationState = {
    index: 0,
    routes: [
      { key: 'a', title: 'Alpha', focusedIcon: 'magnify', testID: 'tab-a' },
      { key: 'b', title: 'Beta', focusedIcon: 'camera', testID: 'tab-b' },
    ],
  };

  const { getByTestId } = render(
    <NavigationBar navigationState={navigationState} onTabPress={jest.fn()} />
  );

  expect(
    StyleSheet.flatten(getByTestId('tab-a-active-indicator').props.style)
      .backgroundColor
  ).toBe(getTheme().colors.secondaryContainer);
});

it('renders a badge for routes that define one', () => {
  const navigationState = {
    index: 0,
    routes: [
      { key: 'a', title: 'Alpha', focusedIcon: 'magnify', badge: 3 },
      { key: 'b', title: 'Beta', focusedIcon: 'camera' },
    ],
  };

  const { getByText } = render(
    <NavigationBar navigationState={navigationState} onTabPress={jest.fn()} />
  );

  expect(getByText('3')).toBeTruthy();
});

describe('getActiveTintColor', () => {
  it.each`
    activeColor  | expected
    ${'#FBF7DB'} | ${'#FBF7DB'}
    ${undefined} | ${Palette.secondary10}
  `(
    'returns $expected when activeColor: $activeColor',
    ({ activeColor, expected }) => {
      const theme = getTheme(false);
      const result = getActiveTintColor({ activeColor, theme });
      expect(result).toBe(expected);
    }
  );
});

describe('getInactiveTintColor', () => {
  it.each`
    inactiveColor | expected
    ${'#853D4B'}  | ${'#853D4B'}
    ${undefined}  | ${Palette.neutralVariant30}
  `(
    'returns $expected when inactiveColor: $inactiveColor',
    ({ inactiveColor, expected }) => {
      const theme = getTheme(false);
      const result = getInactiveTintColor({
        inactiveColor,
        theme,
      });
      expect(result).toBe(expected);
    }
  );
});

describe('getLabelColor', () => {
  it.each([
    { tintColor: '#FBF7DB', focused: true, expected: '#FBF7DB' },
    { tintColor: '#853D4B', focused: true, expected: '#853D4B' },
    { tintColor: undefined, focused: true, expected: Palette.secondary40 },
    {
      tintColor: undefined,
      focused: false,
      expected: Palette.neutralVariant30,
    },
  ])(
    'returns $expected when tintColor: $tintColor, focused: $focused',
    ({ tintColor, focused, expected }) => {
      const theme = getTheme(false);
      const result = getLabelColor({
        tintColor: tintColor ?? '',
        hasColor: Boolean(tintColor),
        focused,
        theme,
      });
      expect(result).toBe(expected);
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

  act(() => {
    jest.advanceTimersByTime(200);
  });
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
