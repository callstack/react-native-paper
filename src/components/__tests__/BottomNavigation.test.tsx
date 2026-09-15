import { Keyboard, Platform, StyleSheet, Text } from 'react-native';
import type { KeyboardEvent } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import { Palette } from '../../theme/tokens';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import BottomNavigationRouteScreen from '../BottomNavigation/BottomNavigationRouteScreen';
import {
  getActiveTintColor,
  getInactiveTintColor,
  getItemRippleColor,
  getLabelColor,
  resolveItemLayout,
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

const layoutNavigationBar = async (
  testID = 'bottom-navigation-bar',
  width = 360
) => {
  await fireEvent(screen.getByTestId(testID), 'layout', {
    nativeEvent: {
      layout: { height: 64, width },
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
        navigationState={createState(0, 5)}
        onIndexChange={jest.fn()}
        renderScene={renderScene}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('calls onIndexChange', async () => {
  const onIndexChange = jest.fn();
  await render(
    <BottomNavigation
      testID="bottom-navigation"
      barTestID="bottom-navigation-bar"
      shifting
      navigationState={createState(0, 5)}
      onIndexChange={onIndexChange}
      renderScene={renderScene}
    />
  );

  await layoutNavigationBar();

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
      testID="bottom-navigation"
      barTestID="bottom-navigation-bar"
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
      testID="bottom-navigation"
      barTestID="bottom-navigation-bar"
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

it('does not crash when shifting is true and the number of tabs is less than 2', async () => {
  await render(
    <BottomNavigation
      shifting
      navigationState={createState(0, 1)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
    />
  );

  expect(screen.getAllByText('Route: 0').length).toBeGreaterThan(0);
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

it('renders a route screen', async () => {
  await render(
    <BottomNavigationRouteScreen index={0}>
      <Text>Visible</Text>
    </BottomNavigationRouteScreen>
  );

  expect(screen.getByTestId('RouteScreen: 0')).toBeOnTheScreen();
  expect(screen.getByText('Visible')).toBeOnTheScreen();
});

it('should have labelMaxFontSizeMultiplier passed to label', async () => {
  const labelMaxFontSizeMultiplier = 2;
  await render(
    <BottomNavigation
      shifting={false}
      labeled
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
  const { toJSON } = await render(
    <BottomNavigation
      testID="bottom-navigation"
      shifting={false}
      labeled
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
      barStyle={styles.backgroundColor}
    />
  );

  expect(toJSON()).toMatchSnapshot();
});

it('hides the bar above the keyboard without dropping consumer styles', async () => {
  let handleKeyboardShow: ((event: KeyboardEvent) => void) | undefined;
  const addKeyboardListener = Keyboard.addListener.bind(Keyboard);
  const keyboardListenerSpy = jest
    .spyOn(Keyboard, 'addListener')
    .mockImplementation((event, listener) => {
      if (event.endsWith('Show')) {
        handleKeyboardShow = listener;
      }

      return addKeyboardListener(event, listener);
    });

  await render(
    <BottomNavigation.Bar
      navigationState={createState(0, 3)}
      onTabPress={jest.fn()}
      keyboardHidesNavigationBar
      style={{ height: 96 }}
      testID="bottom-navigation"
    />
  );

  const navigation = screen.getByTestId('bottom-navigation');

  await fireEvent(navigation, 'layout', {
    nativeEvent: {
      layout: { height: 72, width: 360 },
    },
  });

  await act(() => {
    handleKeyboardShow?.({
      duration: 0,
      easing: 'keyboard',
      endCoordinates: {
        screenX: 0,
        screenY: 500,
        width: 360,
        height: 300,
      },
    });
    jest.runAllTimers();
  });

  expect(navigation).toHaveStyle({
    height: 96,
    position: 'absolute',
  });
  expect(navigation).toHaveStyle({ pointerEvents: 'none' });

  keyboardListenerSpy.mockRestore();
});

it('renders a single tab', async () => {
  await render(
    <BottomNavigation
      testID="bottom-navigation"
      shifting={false}
      navigationState={createState(0, 1)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
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

it('mounts a lazy screen after it becomes focused', async () => {
  const onIndexChange = jest.fn();
  const { rerender } = await render(
    <BottomNavigation
      barTestID="bottom-navigation-bar"
      navigationState={createState(0, 3)}
      onIndexChange={onIndexChange}
      renderScene={renderScene}
      getLazy={() => true}
    />
  );

  expect(screen.getByTestId('RouteScreen: 0')).toBeOnTheScreen();
  expect(screen.queryByTestId('RouteScreen: 1')).not.toBeOnTheScreen();

  await layoutNavigationBar();
  await userEvent.press(getTab(1));
  expect(onIndexChange).toHaveBeenCalledWith(1);

  await rerender(
    <BottomNavigation
      barTestID="bottom-navigation-bar"
      navigationState={createState(1, 3)}
      onIndexChange={onIndexChange}
      renderScene={renderScene}
      getLazy={() => true}
    />
  );

  expect(
    screen.getByTestId('RouteScreen: 0', { includeHiddenElements: true })
  ).toBeOnTheScreen();
  expect(
    screen.getByTestId('RouteScreen: 1', { includeHiddenElements: true })
  ).toBeOnTheScreen();
});

it('renders numeric and dot badges', async () => {
  await render(
    <BottomNavigation
      navigationState={{
        index: 0,
        routes: [
          { key: 'inbox', title: 'Inbox', focusedIcon: 'inbox', badge: 3 },
          {
            key: 'updates',
            title: 'Updates',
            focusedIcon: 'bell',
            badge: true,
          },
        ],
      }}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
    />
  );

  expect(screen.getByText('3')).toBeOnTheScreen();
  expect(screen.getAllByText('Inbox').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Updates').length).toBeGreaterThan(0);
});

it('renders horizontal items when itemLayout is horizontal', async () => {
  const tree = (
    await render(
      <BottomNavigation
        itemLayout="horizontal"
        navigationState={createState(0, 3)}
        onIndexChange={jest.fn()}
        renderScene={renderScene}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('applies maxTabBarWidth styling if compact prop is truthy', async () => {
  const { toJSON } = await render(
    <BottomNavigation
      testID="bottom-navigation"
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
      getLazy={({ route }) => route.key === 'key-2'}
      shifting={false}
      compact
    />
  );

  expect(toJSON()).toMatchSnapshot();
});

it('does not apply maxTabBarWidth styling if compact prop is falsy', async () => {
  const { toJSON } = await render(
    <BottomNavigation
      testID="bottom-navigation"
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={renderScene}
      getLazy={({ route }) => route.key === 'key-2'}
      shifting={false}
      compact={false}
    />
  );

  expect(toJSON()).toMatchSnapshot();
});

describe('getActiveTintColor', () => {
  it.each`
    activeColor  | expected
    ${'#FBF7DB'} | ${'#FBF7DB'}
    ${undefined} | ${Palette.secondary10}
  `(
    'returns $expected when activeColor: $activeColor',
    ({ activeColor, expected }) => {
      const result = getActiveTintColor({ activeColor, theme: LightTheme });
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
      const result = getInactiveTintColor({
        inactiveColor,
        theme: LightTheme,
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
      focused: true,
      onIndicator: true,
      expected: Palette.secondary10,
    },
    {
      tintColor: undefined,
      focused: false,
      expected: Palette.neutralVariant30,
    },
  ])(
    'returns $expected when tintColor: $tintColor, focused: $focused, onIndicator: $onIndicator',
    ({ tintColor, focused, onIndicator, expected }) => {
      const result = getLabelColor({
        tintColor: tintColor ?? '',
        hasColor: Boolean(tintColor),
        focused,
        onIndicator,
        theme: LightTheme,
      });
      expect(result).toBe(expected);
    }
  );
});

describe('resolveItemLayout', () => {
  it('keeps an explicit layout', () => {
    expect(resolveItemLayout({ itemLayout: 'horizontal', width: 320 })).toBe(
      'horizontal'
    );
    expect(resolveItemLayout({ itemLayout: 'vertical', width: 800 })).toBe(
      'vertical'
    );
  });

  it('uses horizontal items at the medium window width', () => {
    expect(resolveItemLayout({ itemLayout: 'auto', width: 600 })).toBe(
      'horizontal'
    );
    expect(resolveItemLayout({ itemLayout: 'auto', width: 360 })).toBe(
      'vertical'
    );
  });
});

it('uses a pressed state-layer color for the active item ripple', () => {
  expect(getItemRippleColor({ focused: true, theme: LightTheme })).toBe(
    'rgba(29, 25, 43, 0.1)'
  );
});

it('supports styles in bar', async () => {
  await render(
    <BottomNavigation.Bar
      navigationState={createState(0, 1)}
      onTabPress={jest.fn()}
      testID="bottom-navigation"
      style={{ transform: [{ scale: 1.5 }] }}
    />
  );

  expect(screen.getByTestId('bottom-navigation')).toHaveStyle({
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
