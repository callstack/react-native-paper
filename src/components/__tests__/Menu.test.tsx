import { Dimensions, Platform, StyleSheet, View } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, screen, waitFor } from '@testing-library/react-native';

import { render } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import type { Elevation } from '../../theme/types';
import Button from '../Button/Button';
import Menu from '../Menu/Menu';
import Portal from '../Portal/Portal';

describe('web focus', () => {
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
    const measureInWindow: View['measureInWindow'] = (fn) =>
      fn(100, 100, 80, 32);
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
    await act(() => jest.advanceTimersByTime(300));

    expect(focus).not.toHaveBeenCalled();
  });

  it('moves focus when opened and restores it when closed', async () => {
    const { rerender } = await render(makeMenu(false));
    await rerender(makeMenu(true));
    await act(() => jest.advanceTimersByTime(300));

    expect(focus).toHaveBeenCalledTimes(1);

    await rerender(makeMenu(false));
    await act(() => jest.advanceTimersByTime(300));

    expect(focus).toHaveBeenCalledTimes(2);
  });

  it('moves focus when mounted visible', async () => {
    await render(makeMenu(true));
    await act(() => jest.advanceTimersByTime(300));

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
