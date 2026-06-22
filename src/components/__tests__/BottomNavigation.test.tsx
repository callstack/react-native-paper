import { Animated, Easing, Platform, StyleSheet, Text } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, userEvent } from '@testing-library/react-native';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import { Palette } from '../../theme/tokens';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import BottomNavigationRouteScreen from '../BottomNavigation/BottomNavigationRouteScreen';
import {
  getActiveTintColor,
  getInactiveTintColor,
  getLabelColor,
} from '../BottomNavigation/utils';
import Icon from '../Icon';

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

const renderScene = ({ route }: { route: { title: string } }) => (
  <Text>{route.title}</Text>
);

const getTab = (index: number) =>
  screen.getAllByRole(Platform.OS === 'ios' ? 'button' : 'tab')[index];

const layoutNavigationBar = async () => {
  await fireEvent(screen.getByTestId('bottom-navigation-bar'), 'layout', {
    nativeEvent: {
      layout: { height: 56, width: 360 },
    },
  });
};

it('renders shifting bottom navigation', async () => {
  const tree = (
    await render(
      <BottomNavigation
        shifting
        navigationState={createState(0, 5)}
        onIndexChange={jest.fn()}
        renderScene={renderScene}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders bottom navigation with scene animation', async () => {
  const tree = (
    await render(
      <BottomNavigation
        shifting
        sceneAnimationEnabled
        sceneAnimationType="shifting"
        sceneAnimationEasing={Easing.ease}
        navigationState={createState(0, 5)}
        onIndexChange={jest.fn()}
        renderScene={renderScene}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

// eslint-disable-next-line jest/no-disabled-tests
it.skip('sceneAnimationEnabled matches animation requirements', async () => {
  const ease = Easing.ease;

  await render(
    <BottomNavigation
      shifting
      sceneAnimationEnabled
      sceneAnimationType="shifting"
      sceneAnimationEasing={ease}
      navigationState={createState(1, 5)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
    />
  );

  // Simulate the button press
  await userEvent.press(screen.getAllByRole('button')[1]);

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

it('calls onIndexChange', async () => {
  const onIndexChange = jest.fn();
  await render(
    <BottomNavigation
      shifting
      navigationState={createState(0, 5)}
      onIndexChange={onIndexChange}
      renderScene={renderScene}
    />
  );

  await layoutNavigationBar();

  // pressing same index as active navigation state does not call onIndexChange
  await userEvent.press(getTab(0));
  expect(onIndexChange).not.toHaveBeenCalled();

  await userEvent.press(getTab(1));
  expect(onIndexChange).toHaveBeenCalledTimes(1);
});

it('calls onTabPress', async () => {
  const onTabPress = jest.fn();
  const onIndexChange = jest.fn();

  await render(
    <BottomNavigation
      shifting
      onTabPress={onTabPress}
      onIndexChange={onIndexChange}
      navigationState={createState(0, 5)}
      renderScene={renderScene}
    />
  );

  await layoutNavigationBar();

  await userEvent.press(getTab(1));
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

it('calls onTabLongPress', async () => {
  const onTabLongPress = jest.fn();
  const onIndexChange = jest.fn();

  await render(
    <BottomNavigation
      shifting
      onIndexChange={onIndexChange}
      onTabLongPress={onTabLongPress}
      navigationState={createState(0, 5)}
      renderScene={renderScene}
    />
  );

  await layoutNavigationBar();

  await userEvent.longPress(getTab(2));
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

it('renders non-shifting bottom navigation', async () => {
  const tree = (
    await render(
      <BottomNavigation
        shifting={false}
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={renderScene}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('does not crash when shifting is true and the number of tabs in the navigationState is less than 2', async () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  await render(
    <BottomNavigation
      shifting={true}
      navigationState={createState(0, 1)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
    />
  );

  expect(console.warn).toHaveBeenCalledWith(
    'BottomNavigation needs at least 2 tabs to run shifting animation'
  );

  jest.restoreAllMocks();
});

it('renders custom icon and label in shifting bottom navigation', async () => {
  const tree = (
    await render(
      <BottomNavigation
        shifting
        navigationState={createState(0, 5)}
        onIndexChange={jest.fn()}
        renderScene={renderScene}
        renderIcon={({ route, color }) => (
          <Icon color={color} source={route.unfocusedIcon} size={24} />
        )}
        renderLabel={({ route, color }) => (
          <Text
            style={{ color: typeof color === 'string' ? color : undefined }}
          >
            {route.title}
          </Text>
        )}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label in non-shifting bottom navigation', async () => {
  const tree = (
    await render(
      <BottomNavigation
        shifting={false}
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={renderScene}
        renderIcon={({ route, color }) => (
          <Icon color={color} source={route.unfocusedIcon} size={24} />
        )}
        renderLabel={({ route, color }) => (
          <Text
            style={{ color: typeof color === 'string' ? color : undefined }}
          >
            {route.title}
          </Text>
        )}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label with custom colors in shifting bottom navigation', async () => {
  const tree = (
    await render(
      <BottomNavigation
        shifting
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={renderScene}
        activeColor="#FBF7DB"
        inactiveColor="#853D4B"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label with custom colors in non-shifting bottom navigation', async () => {
  const tree = (
    await render(
      <BottomNavigation
        shifting={false}
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={renderScene}
        activeColor="#FBF7DB"
        inactiveColor="#853D4B"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('hides labels in shifting bottom navigation', async () => {
  const tree = (
    await render(
      <BottomNavigation
        shifting
        labeled={false}
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={renderScene}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('hides labels in non-shifting bottom navigation', async () => {
  const tree = (
    await render(
      <BottomNavigation
        shifting={false}
        labeled={false}
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={renderScene}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should have appropriate display style according to the visibility on web', async () => {
  const originalPlatform = Platform.OS;
  Platform.OS = 'web';

  const { rerender } = await render(
    <BottomNavigationRouteScreen visibility={1} index={0} />
  );

  const wrapper = screen.getByTestId('RouteScreen: 0');

  expect(wrapper).toHaveStyle({ display: 'flex' });

  await rerender(<BottomNavigationRouteScreen visibility={0} index={0} />);
  expect(wrapper).toHaveStyle({ display: 'none' });

  Platform.OS = originalPlatform;
});

it('should have labelMaxFontSizeMultiplier passed to label', async () => {
  const labelMaxFontSizeMultiplier = 2;
  await render(
    <BottomNavigation
      shifting={false}
      labeled={true}
      labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
    />
  );

  const label = screen.getAllByText('Route: 0').find(
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    (item) => item.props.maxFontSizeMultiplier === labelMaxFontSizeMultiplier
  );

  expect(label).toBeTruthy();
});

it('renders custom background color passed to barStyle property', async () => {
  await render(
    <BottomNavigation
      shifting={false}
      labeled={true}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
      barStyle={styles.backgroundColor}
      testID={'bottom-navigation'}
    />
  );

  const wrapper = screen.getByTestId('bottom-navigation-bar-content');
  expect(wrapper).toHaveStyle({ backgroundColor: Palette.error60 });
});

it('renders a single tab', async () => {
  await render(
    <BottomNavigation
      shifting={false}
      navigationState={createState(0, 1)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
      testID={'bottom-navigation'}
    />
  );

  expect(screen.getByTestId('bottom-navigation')).toBeOnTheScreen();
});

it('renders bottom navigation with getLazy', async () => {
  const view = await render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
      getLazy={({ route }) => route.key === 'key-2'}
    />
  );

  expect(view).toMatchSnapshot();

  expect(screen.queryByTestId('RouteScreen: 2')).not.toBeOnTheScreen();
});

it('applies maxTabBarWidth styling if compact prop is truthy', async () => {
  await render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
      getLazy={({ route }) => route.key === 'key-2'}
      shifting={false}
      testID="bottom-navigation"
      compact
    />
  );

  expect(
    screen.getByTestId('bottom-navigation-bar-content-wrapper')
  ).toHaveStyle({
    maxWidth: 480,
  });
});

it('does not apply maxTabBarWidth styling if compact prop is falsy', async () => {
  await render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
      getLazy={({ route }) => route.key === 'key-2'}
      shifting={false}
      testID="bottom-navigation"
      compact={false}
    />
  );

  expect(
    screen.getByTestId('bottom-navigation-bar-content-wrapper')
  ).not.toHaveStyle({
    maxWidth: 480,
  });
});

it('renders bar content when shifting is enabled', async () => {
  await render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
      getLazy={({ route }) => route.key === 'key-2'}
      testID="bottom-navigation"
      shifting
    />
  );

  expect(screen.getByTestId('bottom-navigation-bar-content')).toBeOnTheScreen();
});

it('does not render legacy ripple overlay when shifting is disabled', async () => {
  await render(
    <BottomNavigation
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
      getLazy={({ route }) => route.key === 'key-2'}
      testID="bottom-navigation"
      shifting={false}
    />
  );

  expect(
    screen.queryByTestId('bottom-navigation-bar-content-ripple')
  ).not.toBeOnTheScreen();
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
    { tintColor: undefined, focused: true, expected: Palette.neutral10 },
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

it('barStyle animated value changes correctly', async () => {
  const value = new Animated.Value(1);
  await render(
    <BottomNavigation
      navigationState={createState(0, 1)}
      onIndexChange={() => {}}
      renderScene={renderScene}
      testID={'bottom-navigation'}
      barStyle={[{ transform: [{ scale: value }] }]}
    />
  );
  expect(screen.getByTestId('bottom-navigation-bar-outer-layer')).toHaveStyle({
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
  expect(screen.getByTestId('bottom-navigation-bar-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});

it("allows customizing Route's type via generics", async () => {
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

  const tree = (
    await render(
      <BottomNavigation
        navigationState={state}
        onIndexChange={jest.fn()}
        getLabelText={({ route }) => route.customPropertyName}
        renderScene={({ route }) => <Text>{route.customPropertyName}</Text>}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
