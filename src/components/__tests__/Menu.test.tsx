import type { ComponentRef } from 'react';
import { Dimensions, Keyboard, Platform, StyleSheet, View } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, screen, waitFor } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';

import PaperProvider from '../../core/PaperProvider';
import { render } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import type { Elevation } from '../../theme/types';
import Button from '../Button/Button';
import Divider from '../Divider';
import Menu from '../Menu/Menu';
import Portal from '../Portal/Portal';

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

describe('web focus', () => {
  const PAST_ANIMATION_MS = 300;
  const focus = jest.fn();
  const originalPlatform = Platform.OS;
  const originalHTMLElement = Object.getOwnPropertyDescriptor(
    globalThis,
    'HTMLElement'
  );
  const originalDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    'document'
  );
  const originalQuerySelector = Object.getOwnPropertyDescriptor(
    View.prototype,
    'querySelector'
  );
  const originalMeasureInWindow = Object.getOwnPropertyDescriptor(
    View.prototype,
    'measureInWindow'
  );

  beforeEach(() => {
    Platform.OS = 'web';
    focus.mockClear();
    // Native View refs stand in for DOM elements in the native test renderer.
    Object.defineProperty(globalThis, 'HTMLElement', {
      configurable: true,
      value: View,
    });
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    });
    Object.defineProperty(View.prototype, 'querySelector', {
      configurable: true,
      value: () => ({ focus }),
    });
    const measureInWindow: ComponentRef<typeof View>['measureInWindow'] = (
      fn
    ) => fn(100, 100, 80, 32);
    Object.defineProperty(View.prototype, 'measureInWindow', {
      configurable: true,
      value: measureInWindow,
    });
  });

  afterEach(() => {
    Platform.OS = originalPlatform;
    for (const [target, key, descriptor] of [
      [globalThis, 'HTMLElement', originalHTMLElement],
      [globalThis, 'document', originalDocument],
      [View.prototype, 'querySelector', originalQuerySelector],
      [View.prototype, 'measureInWindow', originalMeasureInWindow],
    ] as const) {
      if (descriptor) {
        Object.defineProperty(target, key, descriptor);
      } else {
        Reflect.deleteProperty(target, key);
      }
    }
  });

  const makeMenu = (visible: boolean) => (
    <Portal.Host>
      <Menu visible={visible} anchor={<Button>Open menu</Button>}>
        <Menu.Item title="Undo" />
      </Menu>
    </Portal.Host>
  );

  it('does not move focus when mounted hidden', async () => {
    await render(makeMenu(false));
    await act(() => jest.advanceTimersByTime(PAST_ANIMATION_MS));
    expect(focus).not.toHaveBeenCalled();
  });

  it('moves focus when opened and restores it when closed', async () => {
    const { rerender } = await render(makeMenu(false));
    await rerender(makeMenu(true));
    await act(() => jest.advanceTimersByTime(PAST_ANIMATION_MS));
    expect(focus).toHaveBeenCalledTimes(1);
    await rerender(makeMenu(false));
    await act(() => jest.advanceTimersByTime(PAST_ANIMATION_MS));
    expect(focus).toHaveBeenCalledTimes(2);
  });

  it('moves focus when mounted visible', async () => {
    await render(makeMenu(true));
    await act(() => jest.advanceTimersByTime(PAST_ANIMATION_MS));
    expect(focus).toHaveBeenCalledTimes(1);
  });
});

it('renders visible menu', async () => {
  const tree = (
    await render(
      <Portal.Host>
        <Menu
          visible
          onDismiss={jest.fn()}
          anchor={<Button mode="outlined">Open menu</Button>}
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
          <Menu.Item onPress={jest.fn()} title="Redo" />
        </Menu>
      </Portal.Host>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders not visible menu', async () => {
  const tree = (
    await render(
      <Portal.Host>
        <Menu
          visible={false}
          onDismiss={jest.fn()}
          anchor={<Button mode="outlined">Open menu</Button>}
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
          <Menu.Item onPress={jest.fn()} title="Redo" />
        </Menu>
      </Portal.Host>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

const ViewPrototype: ComponentRef<typeof View> = View.prototype;

const elevations: Elevation[] = [0, 1, 2, 3, 4, 5];

elevations.forEach((elevation) =>
  it(`uses surfaceContainerLow fill independent of elevation value = ${elevation}`, async () => {
    const theme = LightTheme;
    const testID = 'menu-with-elevation';

    await render(
      <Portal.Host>
        <Menu
          visible
          onDismiss={jest.fn()}
          anchor={<Button mode="outlined">Open menu</Button>}
          elevation={elevation}
          mode="flat"
          testID={testID}
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
          <Menu.Item onPress={jest.fn()} title="Redo" />
        </Menu>
      </Portal.Host>
    );

    // C1: MD3 menu fill is surfaceContainerLow, not elevation.levelN
    // (level2 is surfaceContainer tones in this theme — a different color).
    expect(screen.getByTestId(testID)).toHaveStyle({
      backgroundColor: theme.colors.surfaceContainerLow,
    });
    expect(theme.colors.surfaceContainerLow).not.toBe(
      theme.colors.elevation.level2
    );
  })
);

it('uses corner.large for the menu surface', async () => {
  const theme = LightTheme;

  await render(
    <Portal.Host>
      <Menu
        visible
        testID="menu-surface"
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
      >
        <Menu.Item onPress={jest.fn()} title="Undo" />
      </Menu>
    </Portal.Host>
  );

  expect(screen.getByTestId('menu-surface')).toHaveStyle({
    borderRadius: theme.shapes.corner.large,
  });
});

it('uses tertiaryContainer for vibrant color scheme', async () => {
  const theme = LightTheme;

  await render(
    <Portal.Host>
      <Menu
        visible
        testID="menu-surface"
        colorScheme="vibrant"
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
      >
        <Menu.Item onPress={jest.fn()} title="Undo" />
      </Menu>
    </Portal.Host>
  );

  expect(screen.getByTestId('menu-surface')).toHaveStyle({
    backgroundColor: theme.colors.tertiaryContainer,
  });
});

it('inherits the vibrant color scheme for items rendered inside a wrapper', async () => {
  const theme = LightTheme;

  await render(
    <Portal.Host>
      <Menu
        visible
        colorScheme="vibrant"
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
      >
        <View>
          <Menu.Item onPress={jest.fn()} title="Undo" testID="wrapped-item" />
        </View>
      </Menu>
    </Portal.Host>
  );

  expect(screen.getByText('Undo')).toHaveStyle({
    color: theme.colors.onTertiaryContainer,
  });
});

it('rounds first and last item corners from child order', async () => {
  const theme = LightTheme;
  const radius = theme.shapes.corner.medium;

  await render(
    <Portal.Host>
      <Menu
        visible
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
      >
        <Menu.Item onPress={jest.fn()} title="First" testID="first-item" />
        <Menu.Item onPress={jest.fn()} title="Middle" testID="mid-item" />
        <Menu.Item onPress={jest.fn()} title="Last" testID="last-item" />
      </Menu>
    </Portal.Host>
  );

  expect(screen.getByTestId('first-item')).toHaveStyle({
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
  });
  expect(screen.getByTestId('last-item')).toHaveStyle({
    borderBottomLeftRadius: radius,
    borderBottomRightRadius: radius,
  });
  expect(screen.getByTestId('mid-item')).not.toHaveStyle({
    borderRadius: radius,
  });
});

it('applies medium corners from explicit roundedTop / roundedBottom props', async () => {
  const theme = LightTheme;
  const radius = theme.shapes.corner.medium;

  await render(
    <Portal.Host>
      <Menu
        visible
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
      >
        <Menu.Item
          onPress={jest.fn()}
          title="First"
          testID="first-item"
          roundedTop
        />
        <Menu.Item onPress={jest.fn()} title="Middle" testID="mid-item" />
        <Menu.Item
          onPress={jest.fn()}
          title="Last"
          testID="last-item"
          roundedBottom
        />
      </Menu>
    </Portal.Host>
  );

  expect(screen.getByTestId('first-item')).toHaveStyle({
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
  });
  expect(screen.getByTestId('last-item')).toHaveStyle({
    borderBottomLeftRadius: radius,
    borderBottomRightRadius: radius,
  });
  expect(screen.getByTestId('mid-item')).not.toHaveStyle({
    borderRadius: radius,
  });
});

it('inherits the vibrant color scheme without a React.Children walk', async () => {
  const theme = LightTheme;

  await render(
    <Portal.Host>
      <Menu
        visible
        colorScheme="vibrant"
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
      >
        <View>
          <Menu.Item onPress={jest.fn()} title="Undo" testID="nested-item" />
        </View>
      </Menu>
    </Portal.Host>
  );

  expect(screen.getByText('Undo')).toHaveStyle({
    color: theme.colors.onTertiaryContainer,
  });
});

it('still renders Divider between items', async () => {
  await render(
    <Portal.Host>
      <Menu
        visible
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
      >
        <Menu.Item onPress={jest.fn()} title="A" />
        <Divider testID="menu-divider" />
        <Menu.Item onPress={jest.fn()} title="B" />
      </Menu>
    </Portal.Host>
  );
  expect(screen.getByTestId('menu-divider')).toBeOnTheScreen();
});

it('uses the default anchorPosition of top', async () => {
  const testID = 'top-positioned-menu';
  const dimensionsSpy = jest.spyOn(Dimensions, 'get').mockReturnValue({
    width: 400,
    height: 800,
    scale: 2,
    fontScale: 2,
  });
  const measureSpy = jest
    .spyOn(ViewPrototype, 'measureInWindow')
    .mockImplementation((fn) => fn(100, 100, 80, 32));

  function makeMenu(visible: boolean) {
    return (
      <Portal.Host>
        <Menu
          visible={visible}
          onDismiss={jest.fn()}
          anchor={
            <Button mode="outlined" testID="anchor">
              Open menu
            </Button>
          }
          testID={testID}
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
          <Menu.Item onPress={jest.fn()} title="Redo" />
        </Menu>
      </Portal.Host>
    );
  }

  const { rerender, toJSON } = await render(makeMenu(false));

  // You must update instead of creating directly and using it because
  // componentDidUpdate isn't called by default in jest. Forcing the update
  // than triggers measureInWindow, which is how Menu decides where to show
  // itself.
  await act(async () => {
    await rerender(makeMenu(true));
    // Menu waits a tick for Portal refs to be up-to-date.
    await Promise.resolve();
  });

  await waitFor(() => {
    const json = JSON.stringify(toJSON());
    expect(json).toContain('"left":100');
    expect(json).toContain('"top":100');
  });

  expect(toJSON()).toMatchSnapshot();

  measureSpy.mockRestore();
  dimensionsSpy.mockRestore();
});

it('respects anchorPosition bottom', async () => {
  const testID = 'bottom-positioned-menu';
  const dimensionsSpy = jest.spyOn(Dimensions, 'get').mockReturnValue({
    width: 400,
    height: 800,
    scale: 2,
    fontScale: 2,
  });
  const measureSpy = jest
    .spyOn(ViewPrototype, 'measureInWindow')
    .mockImplementation((fn) => fn(100, 100, 80, 32));

  function makeMenu(visible: boolean) {
    return (
      <Portal.Host>
        <Menu
          visible={visible}
          onDismiss={jest.fn()}
          anchor={
            <Button mode="outlined" testID="anchor">
              Open menu
            </Button>
          }
          anchorPosition="bottom"
          testID={testID}
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
          <Menu.Item onPress={jest.fn()} title="Redo" />
        </Menu>
      </Portal.Host>
    );
  }

  const { rerender, toJSON } = await render(makeMenu(false));

  await act(async () => {
    await rerender(makeMenu(true));
    // Menu waits a tick for Portal refs to be up-to-date.
    await Promise.resolve();
  });

  await waitFor(() => {
    const json = JSON.stringify(toJSON());
    expect(json).toContain('"left":100');
    expect(json).toContain('"top":132');
  });

  expect(toJSON()).toMatchSnapshot();

  measureSpy.mockRestore();
  dimensionsSpy.mockRestore();
});

it('renders menu with mode "elevated"', async () => {
  const testID = 'elevated-menu';

  await render(
    <Portal.Host>
      <Menu
        visible
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
        mode="elevated"
        testID={testID}
      >
        <Menu.Item onPress={jest.fn()} title="Undo" />
        <Menu.Item onPress={jest.fn()} title="Redo" />
      </Menu>
    </Portal.Host>
  );

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  const styles = StyleSheet.flatten(screen.getByTestId(testID).props.style);

  expect(styles).toHaveProperty('shadowColor');
  expect(styles).toHaveProperty('shadowOpacity');
});

it('renders menu with mode "flat"', async () => {
  const testID = 'flat-menu';

  await render(
    <Portal.Host>
      <Menu
        visible
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
        mode="flat"
        testID={testID}
      >
        <Menu.Item onPress={jest.fn()} title="Undo" />
        <Menu.Item onPress={jest.fn()} title="Redo" />
      </Menu>
    </Portal.Host>
  );

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  const styles = StyleSheet.flatten(screen.getByTestId(testID).props.style);

  expect(styles).not.toHaveProperty('shadowColor');
  expect(styles).not.toHaveProperty('shadowOpacity');
});

it('accounts for a keyboard that is already open when the menu mounts', async () => {
  const testID = 'keyboard-aware-menu';
  const dimensionsSpy = jest.spyOn(Dimensions, 'get').mockReturnValue({
    width: 400,
    height: 800,
    scale: 2,
    fontScale: 2,
  });
  const keyboardMetricsSpy = jest.spyOn(Keyboard, 'metrics').mockReturnValue({
    screenX: 0,
    screenY: 500,
    width: 400,
    height: 300,
  });

  let measureCalls = 0;
  const measureSpy = jest
    .spyOn(ViewPrototype, 'measureInWindow')
    .mockImplementation((fn) => {
      measureCalls += 1;
      if (measureCalls % 2 === 1) {
        // Menu content is tall enough to overflow the remaining window.
        fn(100, 100, 200, 400);
      } else {
        fn(100, 100, 80, 32);
      }
    });

  function makeMenu(visible: boolean) {
    return (
      <Portal.Host>
        <Menu
          visible={visible}
          onDismiss={jest.fn()}
          anchor={
            <Button mode="outlined" testID="anchor">
              Open menu
            </Button>
          }
          testID={testID}
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
          <Menu.Item onPress={jest.fn()} title="Redo" />
        </Menu>
      </Portal.Host>
    );
  }

  const { rerender } = await render(makeMenu(false));

  await act(async () => {
    await rerender(makeMenu(true));
    await Promise.resolve();
  });

  await waitFor(() => {
    // eslint-disable-next-line no-restricted-syntax -- layout height is not otherwise exposed.
    const styles = StyleSheet.flatten(screen.getByTestId(testID).props.style);
    // Available height is window (800) minus keyboard (300) minus top (100) minus SCREEN_INDENT (8).
    expect(styles).toEqual(expect.objectContaining({ height: 392 }));
  });

  measureSpy.mockRestore();
  keyboardMetricsSpy.mockRestore();
  dimensionsSpy.mockRestore();
});
it('does not crash when Keyboard.metrics is unavailable (react-native-web)', async () => {
  const testID = 'no-metrics-menu';
  const original = Keyboard.metrics;
  // @ts-expect-error simulate react-native-web, where metrics doesn't exist
  Keyboard.metrics = undefined;

  const dimensionsSpy = jest.spyOn(Dimensions, 'get').mockReturnValue({
    width: 400,
    height: 800,
    scale: 2,
    fontScale: 2,
  });
  const measureSpy = jest
    .spyOn(ViewPrototype, 'measureInWindow')
    .mockImplementation((fn) => fn(100, 100, 80, 32));

  function makeMenu(visible: boolean) {
    // PaperProvider reduceMotion="on" is the real product path for reduce-motion.
    return (
      <Portal.Host>
        <Menu
          visible={visible}
          onDismiss={jest.fn()}
          anchor={<Button mode="outlined">Open menu</Button>}
          testID={testID}
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
        </Menu>
      </Portal.Host>
    );
  }

  try {
    const { rerender, toJSON } = await render(makeMenu(false));

    await act(async () => {
      await rerender(makeMenu(true));
      await Promise.resolve();
    });

    await waitFor(() => {
      const json = JSON.stringify(toJSON());
      expect(json).toContain('"left":100');
      expect(json).toContain('"top":100');
    });
  } finally {
    Keyboard.metrics = original;
    measureSpy.mockRestore();
    dimensionsSpy.mockRestore();
  }
});

it('scales in again when reopened at the same anchor', async () => {
  const testID = 'reopened-menu';
  const measureSpy = jest
    .spyOn(ViewPrototype, 'measureInWindow')
    .mockImplementation((fn) => fn(100, 100, 80, 32));

  function makeMenu(visible: boolean) {
    return (
      <Portal.Host>
        <Menu
          visible={visible}
          onDismiss={jest.fn()}
          anchor={<Button mode="outlined">Open menu</Button>}
          testID={testID}
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
        </Menu>
      </Portal.Host>
    );
  }

  const openAndSample = async () => {
    await act(async () => {
      await screen.rerender(makeMenu(true));
    });
    await act(() => jest.advanceTimersByTimeAsync(100));
    const style = Reanimated.getAnimatedStyle(screen.getByTestId(testID));
    await act(() => jest.advanceTimersByTimeAsync(500));
    return style;
  };

  try {
    await render(makeMenu(false));

    const firstOpen = await openAndSample();
    // Partway through the first open, the menu is still growing.
    expect(firstOpen).not.toMatchObject({
      transform: [{ scaleX: 1 }, { scaleY: 1 }],
    });

    await act(async () => {
      await screen.rerender(makeMenu(false));
    });
    await act(() => jest.advanceTimersByTimeAsync(500));
    expect(screen.queryByTestId(testID)).toBeNull();

    const secondOpen = await openAndSample();
    expect(secondOpen).toEqual(firstOpen);
  } finally {
    measureSpy.mockRestore();
  }
});

it.each([
  { reduceMotion: 'off', duration: 250 },
  { reduceMotion: 'on', duration: 0 },
] as const)(
  'opens and closes in $duration ms when reduceMotion is "$reduceMotion"',
  async ({ reduceMotion, duration }) => {
    const withTiming = jest.mocked(Reanimated.withTiming);
    const durations = () =>
      withTiming.mock.calls.map(([, config]) => config?.duration);
    const measureSpy = jest
      .spyOn(ViewPrototype, 'measureInWindow')
      .mockImplementation((fn) => fn(100, 100, 80, 32));

    function makeMenu(visible: boolean) {
      return (
        <PaperProvider reduceMotion={reduceMotion}>
          <Menu
            visible={visible}
            onDismiss={jest.fn()}
            anchor={<Button mode="outlined">Open menu</Button>}
          >
            <Menu.Item onPress={jest.fn()} title="Undo" />
          </Menu>
        </PaperProvider>
      );
    }

    try {
      const { rerender } = await render(makeMenu(false));
      // Earlier tests can leave a menu waiting for an animation frame to open.
      await act(async () => {
        await jest.runOnlyPendingTimersAsync();
      });
      withTiming.mockClear();

      await act(async () => {
        await rerender(makeMenu(true));
        // Menu waits a tick for Portal refs to be up-to-date.
        await Promise.resolve();
      });
      // The open animation starts on the next animation frame.
      await act(async () => {
        await jest.advanceTimersByTimeAsync(50);
      });

      // Width, height and opacity.
      expect(durations()).toEqual([duration, duration, duration]);

      withTiming.mockClear();
      await act(async () => {
        await rerender(makeMenu(false));
        await Promise.resolve();
      });

      expect(durations()).toEqual([duration]);
    } finally {
      measureSpy.mockRestore();
    }
  }
);
