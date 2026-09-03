import { Animated, Dimensions, StyleSheet, View } from 'react-native';

import { expect, it, jest } from '@jest/globals';
import { act, screen, waitFor } from '@testing-library/react-native';

import { getTheme } from '../../core/theming';
import { render } from '../../test-utils';
import { shadowLayers } from '../../theme/tokens/sys/elevation';
import type { Elevation } from '../../types';
import Button from '../Button/Button';
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
  it(`renders menu with background color based on elevation value = ${elevation}`, async () => {
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

    expect(screen.getByTestId('menu')).toHaveStyle({
      backgroundColor: theme.colors.elevation[`level${elevation}`],
    });
  })
);

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

it('animated value changes correctly', async () => {
  const value = new Animated.Value(1);
  const { toJSON } = await render(
    <Portal.Host>
      <Menu
        visible
        onDismiss={jest.fn()}
        anchor={<Button mode="outlined">Open menu</Button>}
        testID="menu"
        contentStyle={[{ transform: [{ scale: value }] }]}
      >
        <Menu.Item onPress={jest.fn()} title="Test" />
      </Menu>
    </Portal.Host>
  );
  expect(toJSON()).toMatchSnapshot();

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  await act(() => {
    jest.advanceTimersByTime(200);
  });
  expect(toJSON()).toMatchSnapshot();
});

const menuContentShadow = {
  shadowColor: getTheme().colors.shadow,
  shadowOpacity: shadowLayers[1].shadowOpacity,
  shadowOffset: { width: 0, height: shadowLayers[1].height[2] },
  shadowRadius: shadowLayers[1].shadowRadius[2],
};

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

  expect(screen.getByTestId('menu')).toHaveStyle(menuContentShadow);
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

  expect(screen.getByTestId('menu')).not.toHaveStyle(menuContentShadow);
});
