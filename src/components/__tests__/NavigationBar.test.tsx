import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react-native';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import { Palette } from '../../theme/tokens';
import NavigationBar from '../NavigationBar/NavigationBar';
import {
  getActiveTintColor,
  getInactiveTintColor,
  getLabelColor,
} from '../NavigationBar/utils';

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

it('renders MD3 state layers on hover, focus and press', async () => {
  const navigationState = {
    index: 0,
    routes: [
      { key: 'a', title: 'Route: 0', focusedIcon: 'magnify', testID: 'tab-a' },
      { key: 'b', title: 'Route: 1', focusedIcon: 'camera', testID: 'tab-b' },
    ],
  };

  await render(
    <NavigationBar navigationState={navigationState} onTabPress={jest.fn()} />
  );

  const stateLayer = () => screen.getByTestId('tab-b-state-layer');

  // Idle: no visible state layer.
  expect(stateLayer()).toHaveStyle({ opacity: undefined });

  // Hovered: 8% state layer.
  await fireEvent(screen.getByTestId('tab-b'), 'hoverIn');
  expect(stateLayer()).toHaveStyle({ opacity: 0.08 });
  await fireEvent(screen.getByTestId('tab-b'), 'hoverOut');
  expect(stateLayer()).toHaveStyle({ opacity: undefined });

  // Focused: 10% state layer.
  await fireEvent(screen.getByTestId('tab-b'), 'focus');
  expect(stateLayer()).toHaveStyle({ opacity: 0.1 });
  await fireEvent(screen.getByTestId('tab-b'), 'blur');

  // Pressed: 10% state layer.
  await fireEvent(screen.getByTestId('tab-b'), 'pressIn');
  expect(stateLayer()).toHaveStyle({ opacity: 0.1 });
  await fireEvent(screen.getByTestId('tab-b'), 'pressOut');
  expect(stateLayer()).toHaveStyle({ opacity: undefined });
});

it('colors the focused tab label with secondary and others with onSurfaceVariant', async () => {
  const navigationState = {
    index: 0,
    routes: [
      { key: 'a', title: 'Alpha', focusedIcon: 'magnify' },
      { key: 'b', title: 'Beta', focusedIcon: 'camera' },
    ],
  };

  await render(
    <NavigationBar navigationState={navigationState} onTabPress={jest.fn()} />
  );

  expect(screen.getAllByText('Alpha').at(-1)).toHaveStyle({
    color: getTheme().colors.secondary,
  });
  expect(screen.getAllByText('Beta').at(-1)).toHaveStyle({
    color: getTheme().colors.onSurfaceVariant,
  });
});

it('renders the active indicator with the secondaryContainer color', async () => {
  const navigationState = {
    index: 0,
    routes: [
      { key: 'a', title: 'Alpha', focusedIcon: 'magnify', testID: 'tab-a' },
      { key: 'b', title: 'Beta', focusedIcon: 'camera', testID: 'tab-b' },
    ],
  };

  await render(
    <NavigationBar navigationState={navigationState} onTabPress={jest.fn()} />
  );

  expect(screen.getByTestId('tab-a-active-indicator')).toHaveStyle({
    backgroundColor: getTheme().colors.secondaryContainer,
  });
});

it('renders a badge for routes that define one', async () => {
  const navigationState = {
    index: 0,
    routes: [
      { key: 'a', title: 'Alpha', focusedIcon: 'magnify', badge: 3 },
      { key: 'b', title: 'Beta', focusedIcon: 'camera' },
    ],
  };

  await render(
    <NavigationBar navigationState={navigationState} onTabPress={jest.fn()} />
  );

  expect(screen.getByText('3')).toBeTruthy();
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
