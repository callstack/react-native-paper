import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { waitFor } from '@testing-library/react-native';
import renderer from 'react-test-renderer';

import Button from '../Button/Button.tsx';
import Menu from '../Menu/Menu.tsx';
import Portal from '../Portal/Portal.tsx';

const styles = StyleSheet.create({
  contentStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

it('renders visible menu', () => {
  const tree = renderer
    .create(
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
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders not visible menu', () => {
  const tree = renderer
    .create(
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
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders menu with content styles', () => {
  const tree = renderer
    .create(
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
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('uses the default anchorPosition of top', async () => {
  function makeMenu(visible) {
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
          testID="menu"
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
          <Menu.Item onPress={jest.fn()} title="Redo" />
        </Menu>
      </Portal.Host>
    );
  }

  const tree = renderer.create(makeMenu(false));

  jest
    .spyOn(View.prototype, 'measureInWindow')
    .mockImplementation((fn) => fn(100, 100, 80, 32));

  // You must update instead of creating directly and using it because
  // componentDidUpdate isn't called by default in jest. Forcing the update
  // than triggers measureInWindow, which is how Menu decides where to show
  // itself.
  tree.update(makeMenu(true));

  // If someone has a better way to verify the location of a child on the
  // screen, please by all means let me know.
  await waitFor(() => {
    const menu = tree.root.findByProps({ accessibilityViewIsModal: true });
    expect(menu).toHaveProperty('_fiber.pendingProps.style', [
      {
        position: 'absolute',
      },
      {
        left: 100,
        top: 100,
      },
      undefined,
    ]);
  });
});

it('respects anchorPosition bottom', async () => {
  function makeMenu(visible) {
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
          testID="menu"
        >
          <Menu.Item onPress={jest.fn()} title="Undo" />
          <Menu.Item onPress={jest.fn()} title="Redo" />
        </Menu>
      </Portal.Host>
    );
  }

  const tree = renderer.create(makeMenu(false));

  jest
    .spyOn(View.prototype, 'measureInWindow')
    .mockImplementation((fn) => fn(100, 100, 80, 32));

  // See note from previous test about this update.
  tree.update(makeMenu(true));

  await waitFor(() => {
    const menu = tree.root.findByProps({ accessibilityViewIsModal: true });
    expect(menu).toHaveProperty('_fiber.pendingProps.style', [
      {
        position: 'absolute',
      },
      {
        left: 100,
        top: 132,
      },
      undefined,
    ]);
  });
});
