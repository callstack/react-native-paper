import type { ComponentProps } from 'react';
import { Platform } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import { Palette } from '../../theme/tokens';
import NavigationBar from '../NavigationBar/NavigationBar';
import {
  getActiveTintColor,
  getInactiveTintColor,
  getLabelColor,
  getStateLayerColor,
} from '../NavigationBar/utils';

const icons = ['magnify', 'camera', 'inbox', 'heart', 'shopping-music'];

// `role="tab"` is only used outside iOS, where it is reported as a button.
const tabRole = Platform.OS === 'ios' ? 'button' : 'tab';

// The bar ignores pointer events until it has been laid out for the first
// time, so the interaction tests lay it out before touching a tab.
const renderLaidOutBar = async (
  props: ComponentProps<typeof NavigationBar>
) => {
  const utils = await render(
    <NavigationBar testID="navigation-bar" {...props} />
  );

  await fireEvent(screen.getByTestId('navigation-bar'), 'layout', {
    nativeEvent: { layout: { x: 0, y: 700, width: 393, height: 88 } },
  });

  return utils;
};

const createState = (index: number, length: number) => ({
  index,
  routes: Array.from({ length }, (_, i) => ({
    key: `key-${i}`,
    focusedIcon: icons[i],
    unfocusedIcon: undefined,
    title: `Route: ${i}`,
  })),
});

it('renders tab labels when labeled', async () => {
  await render(
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

  // Each tab renders a single label (no cross-fade layers).
  expect(screen.getAllByText('Alpha').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Beta').length).toBeGreaterThan(0);
});

it('exposes the tabs pattern through accessibility roles', async () => {
  await render(
    <NavigationBar
      navigationState={{
        index: 0,
        routes: [
          {
            key: 'a',
            title: 'Alpha',
            focusedIcon: 'magnify',
            'aria-label': 'Alpha destination',
          },
          { key: 'b', title: 'Beta', focusedIcon: 'camera' },
        ],
      }}
      onTabPress={jest.fn()}
    />
  );

  // The `tablist` container is a group, not an accessibility element (making it
  // one would swallow the tabs on iOS), so it is not queryable. Its role is
  // covered by the structural snapshots.
  expect(screen.getAllByRole(tabRole)).toHaveLength(2);
  expect(
    screen.getByRole(tabRole, { name: 'Alpha destination' })
  ).toBeSelected();
  expect(screen.getByRole(tabRole, { name: 'Beta' })).not.toBeSelected();
});

it('names icon-only tabs with the label text', async () => {
  await render(
    <NavigationBar
      navigationState={{
        index: 0,
        routes: [
          { key: 'a', title: 'Alpha', focusedIcon: 'magnify' },
          { key: 'b', title: 'Beta', focusedIcon: 'camera' },
        ],
      }}
      labeled={false}
      onTabPress={jest.fn()}
    />
  );

  // No label is rendered, but the accessible name still identifies the tab.
  expect(screen.queryByText('Alpha')).toBeNull();
  expect(screen.getByRole(tabRole, { name: 'Alpha' })).toBeTruthy();
  expect(screen.getByRole(tabRole, { name: 'Beta' })).toBeTruthy();
});

it('keeps an explicit aria-label over the label text', async () => {
  await render(
    <NavigationBar
      navigationState={{
        index: 0,
        routes: [
          {
            key: 'a',
            title: 'Alpha',
            focusedIcon: 'magnify',
            'aria-label': 'Alpha destination',
          },
        ],
      }}
      labeled={false}
      onTabPress={jest.fn()}
    />
  );

  expect(screen.getByRole(tabRole, { name: 'Alpha destination' })).toBeTruthy();
});

it('calls onTabPress with the pressed route', async () => {
  const navigationState = createState(0, 3);
  const onTabPress = jest.fn();

  const user = userEvent.setup();
  await renderLaidOutBar({ navigationState, onTabPress });

  await user.press(screen.getByRole(tabRole, { name: 'Route: 1' }));

  expect(onTabPress).toHaveBeenCalledTimes(1);
  expect(onTabPress).toHaveBeenCalledWith({ route: navigationState.routes[1] });
});

it('calls onTabLongPress with the pressed route', async () => {
  const navigationState = createState(0, 3);
  const onTabLongPress = jest.fn();

  const user = userEvent.setup();
  await renderLaidOutBar({
    navigationState,
    onTabPress: jest.fn(),
    onTabLongPress,
  });

  await user.longPress(screen.getByRole(tabRole, { name: 'Route: 1' }));

  expect(onTabLongPress).toHaveBeenCalledTimes(1);
  expect(onTabLongPress).toHaveBeenCalledWith({
    route: navigationState.routes[1],
  });
});

it('renders the horizontal (flexible) variant', async () => {
  const tree = (
    await render(
      <NavigationBar
        navigationState={createState(0, 3)}
        onTabPress={jest.fn()}
        variant="horizontal"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('truncates a long label instead of growing past the tab in the horizontal variant', async () => {
  await render(
    <NavigationBar
      navigationState={createState(0, 3)}
      onTabPress={jest.fn()}
      variant="horizontal"
    />
  );

  expect(screen.getByText('Route: 0')).toHaveProp('numberOfLines', 1);
  expect(screen.getByText('Route: 0')).toHaveProp('ellipsizeMode', 'tail');
});

it('falls back to icon-only when horizontal is combined with labeled=false', async () => {
  await render(
    <NavigationBar
      navigationState={createState(0, 3)}
      onTabPress={jest.fn()}
      variant="horizontal"
      labeled={false}
    />
  );

  // `horizontal` is a no-op without labels, so no label text is rendered.
  expect(screen.queryByText('Route: 0')).toBeNull();
  expect(screen.queryByText('Route: 1')).toBeNull();
});

it('renders the MD3 state layer for hover, focus and press', async () => {
  await render(
    <NavigationBar
      navigationState={{
        index: 0,
        routes: [
          { key: 'a', title: 'Route: 0', focusedIcon: 'magnify' },
          { key: 'b', title: 'Route: 1', focusedIcon: 'camera', testID: 'tab' },
        ],
      }}
      onTabPress={jest.fn()}
    />
  );

  const tab = () => screen.getByTestId('tab').toJSON();

  expect(tab()).toMatchSnapshot('idle');

  await fireEvent(screen.getByTestId('tab'), 'hoverIn');
  expect(tab()).toMatchSnapshot('hovered');
  await fireEvent(screen.getByTestId('tab'), 'hoverOut');

  await fireEvent(screen.getByTestId('tab'), 'focus');
  expect(tab()).toMatchSnapshot('focused');
  await fireEvent(screen.getByTestId('tab'), 'blur');

  await fireEvent(screen.getByTestId('tab'), 'pressIn');
  expect(tab()).toMatchSnapshot('pressed');
  await fireEvent(screen.getByTestId('tab'), 'pressOut');

  expect(tab()).toMatchSnapshot('released');
});

it('only shows the focus state layer for keyboard focus on web', async () => {
  const platform = Platform.OS;
  Platform.OS = 'web';

  try {
    await render(
      <NavigationBar
        navigationState={{
          index: 0,
          routes: [
            { key: 'a', title: 'Route: 0', focusedIcon: 'magnify' },
            {
              key: 'b',
              title: 'Route: 1',
              focusedIcon: 'camera',
              testID: 'tab',
            },
          ],
        }}
        onTabPress={jest.fn()}
      />
    );

    const tab = () => screen.getByTestId('tab').toJSON();

    await fireEvent(screen.getByTestId('tab'), 'hoverIn');
    await fireEvent(screen.getByTestId('tab'), 'focus', {
      currentTarget: { matches: () => false },
    });
    // Focus from a pointer keeps the hover layer only.
    expect(tab()).toMatchSnapshot('pointer-focus');

    await fireEvent(screen.getByTestId('tab'), 'focus', {
      currentTarget: { matches: () => true },
    });
    // Keyboard focus swaps it for the focus layer.
    expect(tab()).toMatchSnapshot('keyboard-focus');
  } finally {
    await screen.unmount();
    Platform.OS = platform;
  }
});

it('applies the default container color to the bar', async () => {
  await render(
    <NavigationBar
      navigationState={createState(0, 2)}
      onTabPress={jest.fn()}
      testID="navigation-bar"
    />
  );

  expect(screen.getByTestId('navigation-bar')).toHaveStyle({
    backgroundColor: LightTheme.colors.surfaceContainer,
  });
});

it('lets the consumer style override the bar', async () => {
  await render(
    <NavigationBar
      navigationState={createState(0, 3)}
      onTabPress={jest.fn()}
      style={{
        position: 'absolute',
        top: 12,
        flex: 1,
        backgroundColor: Palette.error40,
      }}
      testID="navigation-bar"
    />
  );

  // Everything lands on the bar itself, so no layout key can end up on an
  // inner wrapper.
  expect(screen.getByTestId('navigation-bar')).toHaveStyle({
    position: 'absolute',
    top: 12,
    flex: 1,
    backgroundColor: Palette.error40,
  });
});

it('colors the focused tab label with secondary and others with onSurfaceVariant', async () => {
  await render(
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

  expect(screen.getAllByText('Alpha').at(-1)).toHaveStyle({
    color: LightTheme.colors.secondary,
  });
  expect(screen.getAllByText('Beta').at(-1)).toHaveStyle({
    color: LightTheme.colors.onSurfaceVariant,
  });
});

it('renders a badge for routes that define one', async () => {
  await render(
    <NavigationBar
      navigationState={{
        index: 0,
        routes: [
          { key: 'a', title: 'Alpha', focusedIcon: 'magnify', badge: 3 },
          { key: 'b', title: 'Beta', focusedIcon: 'camera' },
        ],
      }}
      onTabPress={jest.fn()}
    />
  );

  expect(screen.getByText('3')).toBeTruthy();
  expect(screen.getByRole(tabRole, { name: /Alpha/ })).toBeSelected();
});

describe('getActiveTintColor', () => {
  it.each`
    activeColor  | expected
    ${'#FBF7DB'} | ${'#FBF7DB'}
    ${undefined} | ${Palette.secondary10}
  `(
    'returns $expected when activeColor: $activeColor',
    ({ activeColor, expected }) => {
      const theme = LightTheme;
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
      const theme = LightTheme;
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
      const theme = LightTheme;
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

describe('getStateLayerColor', () => {
  const stateLayerColor = LightTheme.colors.onSecondaryContainer;

  it.each([
    {
      state: 'resting',
      pressed: false,
      keyboardFocused: false,
      hovered: false,
      opacity: null,
    },
    {
      state: 'pressed',
      pressed: true,
      keyboardFocused: false,
      hovered: false,
      opacity: 0.1,
    },
    {
      state: 'keyboard focused',
      pressed: false,
      keyboardFocused: true,
      hovered: false,
      opacity: 0.1,
    },
    {
      state: 'hovered',
      pressed: false,
      keyboardFocused: false,
      hovered: true,
      opacity: 0.08,
    },
    {
      state: 'pressed over hovered',
      pressed: true,
      keyboardFocused: false,
      hovered: true,
      opacity: 0.1,
    },
    {
      state: 'keyboard focused over hovered',
      pressed: false,
      keyboardFocused: true,
      hovered: true,
      opacity: 0.1,
    },
  ])(
    'resolves the $state state layer with opacity $opacity',
    ({ pressed, keyboardFocused, hovered, opacity }) => {
      expect(
        getStateLayerColor({
          theme: LightTheme,
          pressed,
          keyboardFocused,
          hovered,
        })
      ).toEqual(
        opacity === null ? null : { backgroundColor: stateLayerColor, opacity }
      );
    }
  );
});
