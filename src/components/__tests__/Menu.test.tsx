import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { render, waitFor, screen } from '@testing-library/react-native';

import { getTheme } from '../../core/theming';
import { MD3Elevation } from '../../types';
import Button from '../Button/Button';
import Menu, { ELEVATION_LEVELS_MAP } from '../Menu/Menu';
import Portal from '../Portal/Portal';

const styles = StyleSheet.create({
  contentStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

it('renders visible menu', () => {
  const tree = render(
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
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders not visible menu', () => {
  const tree = render(
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
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders menu with content styles', () => {
  const tree = render(
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
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

([0, 1, 2, 3, 4, 5] as MD3Elevation[]).forEach((elevation) =>
  it(`renders menu with background color based on elevation value = ${elevation}`, () => {
    const theme = getTheme(false, true);

    const { getByTestId } = render(
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

    expect(getByTestId('menu-surface')).toHaveStyle({
      backgroundColor: theme.colors.elevation[ELEVATION_LEVELS_MAP[elevation]],
    });
  })
);

it('uses the default anchorPosition of top', async () => {
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

  render(makeMenu(false));

  jest
    .spyOn(View.prototype, 'measureInWindow')
    .mockImplementation((fn) => fn(100, 100, 80, 32));

  // You must update instead of creating directly and using it because
  // componentDidUpdate isn't called by default in jest. Forcing the update
  // than triggers measureInWindow, which is how Menu decides where to show
  // itself.
  screen.update(makeMenu(true));

  await waitFor(() => {
    const menu = screen.getByTestId('menu-view');
    expect(menu).toHaveStyle({
      position: 'absolute',
      left: 100,
      top: 100,
    });
  });
});

it('respects anchorPosition bottom', async () => {
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

  render(makeMenu(false));

  jest
    .spyOn(View.prototype, 'measureInWindow')
    .mockImplementation((fn) => fn(100, 100, 80, 32));

  screen.update(makeMenu(true));

  await waitFor(() => {
    const menu = screen.getByTestId('menu-view');
    expect(menu).toHaveStyle({
      position: 'absolute',
      left: 100,
      top: 132,
    });
  });
});

it('animated value changes correctly', () => {
  const value = new Animated.Value(1);
  const { getByTestId } = render(
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
  expect(getByTestId('menu-surface-outer-layer')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  jest.advanceTimersByTime(200);

  expect(getByTestId('menu-surface-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});

it('renders menu with mode "elevated"', () => {
  const { getByTestId } = render(
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

  const menuSurface = getByTestId('menu-surface');

  // Get flattened styles
  const styles = StyleSheet.flatten(menuSurface.props.style);

  expect(styles).toHaveProperty('shadowColor');
  expect(styles).toHaveProperty('shadowOpacity');
});

it('renders menu with mode "flat"', () => {
  const { getByTestId } = render(
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

  const menuSurface = getByTestId('menu-surface');

  // Get flattened styles
  const styles = StyleSheet.flatten(menuSurface.props.style);

  expect(styles).not.toHaveProperty('shadowColor');
  expect(styles).not.toHaveProperty('shadowOpacity');
});
