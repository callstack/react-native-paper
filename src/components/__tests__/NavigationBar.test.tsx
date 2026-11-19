import type { ComponentProps } from 'react';
import { Platform } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, userEvent } from '@testing-library/react-native';

import { LocaleProvider } from '../../core/locale';
import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import { Palette } from '../../theme/tokens';
import NavigationBar from '../NavigationBar/NavigationBar';
import { getStateLayerColor } from '../NavigationBar/utils';

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

  expect(screen.getByText('Alpha')).toBeOnTheScreen();
  expect(screen.getByText('Beta')).toBeOnTheScreen();
});

it('keeps stacked labels on one line', async () => {
  await render(
    <NavigationBar navigationState={createState(0, 3)} onTabPress={jest.fn()} />
  );

  expect(screen.getByText('Route: 0')).toHaveProp('numberOfLines', 1);
  expect(screen.getByText('Route: 0')).toHaveProp('ellipsizeMode', 'tail');
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

it('calls onTabPress after a long press when there is no onTabLongPress', async () => {
  const navigationState = createState(0, 3);
  const onTabPress = jest.fn();

  const user = userEvent.setup();
  await renderLaidOutBar({ navigationState, onTabPress });

  await user.longPress(screen.getByRole(tabRole, { name: 'Route: 1' }));

  expect(onTabPress).toHaveBeenCalledTimes(1);
  expect(onTabPress).toHaveBeenCalledWith({ route: navigationState.routes[1] });
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

it('gives the tabs equal widths again after a change from horizontal to stacked', async () => {
  const navigationState = createState(0, 3);

  await render(
    <NavigationBar
      navigationState={navigationState}
      onTabPress={jest.fn()}
      variant="horizontal"
    />
  );

  for (const tab of screen.getAllByRole(tabRole)) {
    expect(tab).not.toHaveStyle({ flex: 1 });
  }

  await screen.rerender(
    <NavigationBar
      navigationState={navigationState}
      onTabPress={jest.fn()}
      variant="stacked"
    />
  );

  for (const tab of screen.getAllByRole(tabRole)) {
    expect(tab).toHaveStyle({ flex: 1 });
  }
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

  expect(screen.getByText('Alpha')).toHaveStyle({
    color: LightTheme.colors.secondary,
  });
  expect(screen.getByText('Beta')).toHaveStyle({
    color: LightTheme.colors.onSurfaceVariant,
  });
});

it('colors the labels with activeColor and inactiveColor', async () => {
  await render(
    <NavigationBar
      navigationState={{
        index: 0,
        routes: [
          { key: 'a', title: 'Alpha', focusedIcon: 'magnify' },
          { key: 'b', title: 'Beta', focusedIcon: 'camera' },
        ],
      }}
      activeColor="#FBF7DB"
      inactiveColor="#853D4B"
      onTabPress={jest.fn()}
    />
  );

  expect(screen.getByText('Alpha')).toHaveStyle({ color: '#FBF7DB' });
  expect(screen.getByText('Beta')).toHaveStyle({ color: '#853D4B' });
});

it.each([
  {
    colors: {},
    active: LightTheme.colors.onSecondaryContainer,
    inactive: LightTheme.colors.onSurfaceVariant,
  },
  {
    colors: { activeColor: '#FBF7DB', inactiveColor: '#853D4B' },
    active: '#FBF7DB',
    inactive: '#853D4B',
  },
])(
  'passes the icon colors to renderIcon with $colors',
  async ({ colors, active, inactive }) => {
    const renderIcon = jest.fn(() => null);

    await render(
      <NavigationBar
        navigationState={createState(0, 2)}
        renderIcon={renderIcon}
        onTabPress={jest.fn()}
        {...colors}
      />
    );

    expect(renderIcon).toHaveBeenCalledWith(
      expect.objectContaining({ focused: true, color: active })
    );
    expect(renderIcon).toHaveBeenCalledWith(
      expect.objectContaining({ focused: false, color: inactive })
    );
  }
);

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

  expect(screen.getByText('3')).toBeOnTheScreen();
  expect(screen.getByRole(tabRole, { name: 'Alpha, 3' })).toBeSelected();
  expect(screen.getByRole(tabRole, { name: 'Beta' })).not.toBeSelected();
});

it('leaves a dot badge out of the accessible name', async () => {
  await render(
    <NavigationBar
      navigationState={{
        index: 0,
        routes: [
          { key: 'a', title: 'Alpha', focusedIcon: 'magnify', badge: true },
        ],
      }}
      onTabPress={jest.fn()}
    />
  );

  expect(screen.getByRole(tabRole, { name: 'Alpha' })).toBeOnTheScreen();
});

it('names an icon-only tab with its badge', async () => {
  await render(
    <NavigationBar
      navigationState={{
        index: 0,
        routes: [
          { key: 'a', title: 'Inbox', focusedIcon: 'inbox', badge: '99+' },
        ],
      }}
      labeled={false}
      onTabPress={jest.fn()}
    />
  );

  expect(screen.getByRole(tabRole, { name: 'Inbox, 99+' })).toBeOnTheScreen();
});

describe('on web', () => {
  // A stand-in for the DOM tab elements that React Native Web renders.
  class FakeTab {
    focus = jest.fn();
    parentElement: { querySelectorAll: () => FakeTab[] };

    constructor(siblings: FakeTab[]) {
      // eslint-disable-next-line testing-library/no-node-access -- The fake stands in for the DOM element that the bar reads its sibling tabs from.
      this.parentElement = { querySelectorAll: () => siblings };
    }
  }

  const key = (name: string, currentTarget?: FakeTab, repeat = false) => ({
    nativeEvent: { key: name, repeat },
    currentTarget,
    preventDefault: jest.fn(),
  });

  const createTabs = () => {
    const tabs: FakeTab[] = [];
    tabs.push(new FakeTab(tabs), new FakeTab(tabs), new FakeTab(tabs));
    return tabs;
  };

  const setUpWeb = () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    Object.defineProperty(globalThis, 'HTMLElement', {
      configurable: true,
      value: FakeTab,
    });
  };

  afterEach(() => {
    jest.restoreAllMocks();
    Reflect.deleteProperty(globalThis, 'HTMLElement');
  });

  it('makes only the selected tab a Tab stop', async () => {
    setUpWeb();
    await render(
      <NavigationBar
        navigationState={createState(1, 3)}
        onTabPress={jest.fn()}
      />
    );

    const [first, selected, last] = screen.getAllByRole('tab');

    expect(first).toHaveProp('tabIndex', -1);
    expect(selected).toHaveProp('tabIndex', 0);
    expect(last).toHaveProp('tabIndex', -1);
  });

  it('presses a tab once on Space release, even when Space is held', async () => {
    setUpWeb();
    const navigationState = createState(0, 3);
    const onTabPress = jest.fn();
    await render(
      <NavigationBar
        navigationState={navigationState}
        onTabPress={onTabPress}
      />
    );
    const tab = screen.getByRole('tab', { name: 'Route: 1' });
    const down = key(' ');

    await fireEvent(tab, 'keyDown', down);
    await fireEvent(tab, 'keyDown', key(' ', undefined, true));
    await fireEvent(tab, 'keyDown', key(' ', undefined, true));

    expect(down.preventDefault).toHaveBeenCalled();
    expect(onTabPress).not.toHaveBeenCalled();

    await fireEvent(tab, 'keyUp', key(' '));

    expect(onTabPress).toHaveBeenCalledTimes(1);
    expect(onTabPress).toHaveBeenCalledWith({
      route: navigationState.routes[1],
    });
  });

  it.each([
    { direction: 'ltr', name: 'ArrowRight', from: 0, to: 1 },
    { direction: 'ltr', name: 'ArrowLeft', from: 0, to: 2 },
    { direction: 'ltr', name: 'ArrowRight', from: 2, to: 0 },
    { direction: 'rtl', name: 'ArrowRight', from: 1, to: 0 },
    { direction: 'rtl', name: 'ArrowLeft', from: 1, to: 2 },
    { direction: 'ltr', name: 'Home', from: 2, to: 0 },
    { direction: 'ltr', name: 'End', from: 0, to: 2 },
  ] as const)(
    'moves focus from tab $from to tab $to on $name in $direction',
    async ({ direction, name, from, to }) => {
      setUpWeb();
      const onTabPress = jest.fn();
      await render(
        <LocaleProvider direction={direction}>
          <NavigationBar
            navigationState={createState(0, 3)}
            onTabPress={onTabPress}
          />
        </LocaleProvider>
      );
      const tabs = createTabs();
      const event = key(name, tabs[from]);

      await fireEvent(screen.getAllByRole('tab')[from], 'keyDown', event);

      expect(tabs[to].focus).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(onTabPress).not.toHaveBeenCalled();
    }
  );

  it('leaves other keys to the browser', async () => {
    setUpWeb();
    await render(
      <NavigationBar
        navigationState={createState(0, 3)}
        onTabPress={jest.fn()}
      />
    );
    const tabs = createTabs();
    const event = key('ArrowDown', tabs[0]);

    await fireEvent(screen.getAllByRole('tab')[0], 'keyDown', event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    for (const tab of tabs) {
      expect(tab.focus).not.toHaveBeenCalled();
    }
  });
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
