import { Dimensions, Keyboard, StyleSheet, View } from 'react-native';

import { expect, it, jest } from '@jest/globals';
import { act, screen, waitFor } from '@testing-library/react-native';

import { render } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import type { Elevation } from '../../theme/types';
import Button from '../Button/Button';
import Menu from '../Menu/Menu';
import Portal from '../Portal/Portal';

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

const elevations: Elevation[] = [0, 1, 2, 3, 4, 5];

elevations.forEach((elevation) =>
  it(`renders menu with background color based on elevation value = ${elevation}`, async () => {
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

    expect(screen.getByTestId(testID)).toHaveStyle({
      backgroundColor: LightTheme.colors.elevation[`level${elevation}`],
    });
  })
);

it('uses the default anchorPosition of top', async () => {
  const testID = 'top-positioned-menu';
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
    .spyOn(View.prototype, 'measureInWindow')
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
