import { Animated, Dimensions, StyleSheet, View } from 'react-native';

import { expect, it, jest } from '@jest/globals';
import { act, screen, waitFor } from '@testing-library/react-native';

import PaperProvider from '../../core/PaperProvider';
import { getTheme } from '../../core/theming';
import { render } from '../../test-utils';
import type { Elevation } from '../../types';
import Button from '../Button/Button';
import Divider from '../Divider';
import Menu from '../Menu/Menu';
import Portal from '../Portal/Portal';

const styles = StyleSheet.create({
  contentStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
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

it('renders menu with content styles', async () => {
  const tree = (
    await render(
      <Portal.Host>
        <Menu
          visible
          onDismiss={jest.fn()}
          anchor={<Button mode="outlined">Open menu</Button>}
          contentStyle={styles.contentStyle}
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
          <Menu.Item onPress={jest.fn()} title="Redo" />
        </Menu>
      </Portal.Host>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

([0, 1, 2, 3, 4, 5] as Elevation[]).forEach((elevation) =>
  it(`uses surfaceContainerLow fill independent of elevation value = ${elevation}`, async () => {
    const theme = getTheme();

    await render(
      <Portal.Host>
        <Menu
          visible
          onDismiss={jest.fn()}
          anchor={<Button mode="outlined">Open menu</Button>}
          elevation={elevation}
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
          <Menu.Item onPress={jest.fn()} title="Redo" />
        </Menu>
      </Portal.Host>
    );

    // C1: MD3 menu fill is surfaceContainerLow, not elevation.levelN
    // (level2 is surfaceContainer tones in this theme — a different color).
    expect(screen.getByTestId('menu-surface')).toHaveStyle({
      backgroundColor: theme.colors.surfaceContainerLow,
    });
    expect(theme.colors.surfaceContainerLow).not.toBe(
      theme.colors.elevation.level2
    );
  })
);

it('uses corner.large for the menu surface', async () => {
  const theme = getTheme();

  await render(
    <Portal.Host>
      <Menu
        visible
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
  const theme = getTheme();

  await render(
    <Portal.Host>
      <Menu
        visible
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

it('applies first/last medium corners via layout context (no cloneElement props required)', async () => {
  const theme = getTheme();
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
  // Middle item is not fully rounded on all corners
  expect(screen.getByTestId('mid-item')).not.toHaveStyle({
    borderRadius: radius,
  });
});

it('renders Menu.Section groups with M3 group gap', async () => {
  await render(
    <Portal.Host>
      <Menu
        visible
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
      >
        <Menu.Section title="Edit" testID="sec-edit">
          <Menu.Item onPress={jest.fn()} title="Cut" />
        </Menu.Section>
        <Menu.Section title="Share" testID="sec-share">
          <Menu.Item onPress={jest.fn()} title="Share" />
        </Menu.Section>
      </Menu>
    </Portal.Host>
  );

  expect(screen.getByTestId('sec-edit-title')).toHaveTextContent('Edit');
  expect(screen.getByTestId('sec-share-title')).toHaveTextContent('Share');
  expect(screen.getByTestId('menu-section-gap')).toHaveStyle({
    marginTop: 8,
  });
  // Divider still a valid composition sibling
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
  const dimensionsSpy = jest.spyOn(Dimensions, 'get').mockReturnValue({
    width: 400,
    height: 800,
    scale: 2,
    fontScale: 2,
  });
  const measureSpy = jest
    .spyOn(View.prototype, 'measureInWindow')
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
          contentStyle={styles.contentStyle}
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
          <Menu.Item onPress={jest.fn()} title="Redo" />
        </Menu>
      </Portal.Host>
    );
  }

  const { rerender } = await render(makeMenu(false));

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
    const menu = screen.getByTestId('menu-view');
    expect(menu).toHaveStyle({
      position: 'absolute',
      left: 100,
      top: 100,
    });
  });

  measureSpy.mockRestore();
  dimensionsSpy.mockRestore();
});

it('respects anchorPosition bottom', async () => {
  const dimensionsSpy = jest.spyOn(Dimensions, 'get').mockReturnValue({
    width: 400,
    height: 800,
    scale: 2,
    fontScale: 2,
  });
  const measureSpy = jest
    .spyOn(View.prototype, 'measureInWindow')
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
          contentStyle={styles.contentStyle}
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
    // Menu waits a tick for Portal refs to be up-to-date.
    await Promise.resolve();
  });

  await waitFor(() => {
    const menu = screen.getByTestId('menu-view');
    expect(menu).toHaveStyle({
      position: 'absolute',
      left: 100,
      top: 132,
    });
  });

  measureSpy.mockRestore();
  dimensionsSpy.mockRestore();
});

it('snaps open without spring when reduce-motion is enabled', async () => {
  const dimensionsSpy = jest.spyOn(Dimensions, 'get').mockReturnValue({
    width: 400,
    height: 800,
    scale: 2,
    fontScale: 2,
  });
  const measureSpy = jest
    .spyOn(View.prototype, 'measureInWindow')
    .mockImplementation((fn) => fn(100, 100, 80, 32));

  function makeMenu(visible: boolean) {
    // PaperProvider reduceMotion="on" is the real product path for reduce-motion.
    return (
      <PaperProvider reduceMotion="on">
        <Menu
          visible={visible}
          onDismiss={jest.fn()}
          anchor={
            <Button mode="outlined" testID="anchor">
              Open menu
            </Button>
          }
          testID="menu"
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
        </Menu>
      </PaperProvider>
    );
  }

  const { rerender } = await render(makeMenu(false));

  await act(async () => {
    await rerender(makeMenu(true));
    await Promise.resolve();
    jest.runOnlyPendingTimers();
    await Promise.resolve();
  });

  // Reduce-motion path must still position the menu and mount the surface.
  await waitFor(() => {
    expect(screen.getByTestId('menu-view')).toHaveStyle({
      position: 'absolute',
      left: 100,
      top: 100,
    });
  });

  expect(screen.getByTestId('menu-surface')).toBeOnTheScreen();

  measureSpy.mockRestore();
  dimensionsSpy.mockRestore();
});

it('applies animated contentStyle transform on the menu surface', async () => {
  // Drive the real Menu + contentStyle path. Animated host-style updates from
  // setValue are not reliably visible via toHaveStyle under the RN Jest
  // environment (same limitation as other Surface consumers), so we re-render
  // with a new Animated.Value after the driver advances the first value.
  const initial = new Animated.Value(1);
  const advanced = new Animated.Value(1);

  const makeUi = (scale: Animated.Value) => (
    <Portal.Host>
      <Menu
        visible
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
        testID="menu"
        contentStyle={[{ transform: [{ scale }] }]}
      >
        <Menu.Item onPress={jest.fn()} title="Test" />
      </Menu>
    </Portal.Host>
  );

  const { rerender } = await render(makeUi(initial));
  expect(screen.getByTestId('menu-surface-outer-layer')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(advanced, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  await act(() => {
    jest.advanceTimersByTime(200);
  });

  // Animation driver (jest Animated.timing stub) must update the value.
  expect(
    (advanced as Animated.Value & { __getValue: () => number }).__getValue()
  ).toBe(1.5);

  // Re-mount contentStyle with the advanced value so Surface's render-time
  // flatten reflects 1.5 on the real menu surface outer layer.
  await act(async () => {
    await rerender(makeUi(advanced));
  });

  expect(screen.getByTestId('menu-surface-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});

it('renders menu with mode "elevated"', async () => {
  await render(
    <Portal.Host>
      <Menu
        visible
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
        mode="elevated"
      >
        <Menu.Item onPress={jest.fn()} title="Undo" />
        <Menu.Item onPress={jest.fn()} title="Redo" />
      </Menu>
    </Portal.Host>
  );

  const menuSurface = screen.getByTestId('menu-surface');

  // Get flattened styles
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  const styles = StyleSheet.flatten(menuSurface.props.style);

  expect(styles).toHaveProperty('shadowColor');
  expect(styles).toHaveProperty('shadowOpacity');
});

it('renders menu with mode "flat"', async () => {
  await render(
    <Portal.Host>
      <Menu
        visible
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
        mode="flat"
      >
        <Menu.Item onPress={jest.fn()} title="Undo" />
        <Menu.Item onPress={jest.fn()} title="Redo" />
      </Menu>
    </Portal.Host>
  );

  const menuSurface = screen.getByTestId('menu-surface');

  // Get flattened styles
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  const styles = StyleSheet.flatten(menuSurface.props.style);

  expect(styles).not.toHaveProperty('shadowColor');
  expect(styles).not.toHaveProperty('shadowOpacity');
});
