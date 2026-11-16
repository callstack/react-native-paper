import { BackHandler as RNBackHandler, Platform } from 'react-native';

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import Button from '../Button/Button';
import Dialog from '../Dialog/Dialog';
import Menu from '../Menu/Menu';
import Portal from '../Portal/Portal';

jest.useRealTimers();

type BackHandlerStatic = typeof RNBackHandler & {
  mockPressBack(): void;
  exitApp: jest.Mock<() => void>;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const BackHandler = RNBackHandler as BackHandlerStatic;

const MenuInDialog = ({
  menuVisible = true,
  onDismissDialog,
  onDismissMenu,
}: {
  menuVisible?: boolean;
  onDismissDialog: () => void;
  onDismissMenu: () => void;
}) => (
  <Portal.Host>
    <Dialog visible onDismiss={onDismissDialog} aria-label="Dialog">
      <Dialog.Content>
        <Menu
          visible={menuVisible}
          onDismiss={onDismissMenu}
          anchor={<Button>Open menu</Button>}
        >
          <Menu.Item title="Item" />
        </Menu>
      </Dialog.Content>
    </Dialog>
  </Portal.Host>
);

describe('a menu inside a dialog', () => {
  beforeEach(() => {
    BackHandler.exitApp.mockClear();
  });

  describe('when the back button is pressed', () => {
    it('closes only the menu', async () => {
      const onDismissDialog = jest.fn();
      const onDismissMenu = jest.fn();

      await render(
        <MenuInDialog
          onDismissDialog={onDismissDialog}
          onDismissMenu={onDismissMenu}
        />
      );
      await screen.findByText('Item');

      await act(() => {
        BackHandler.mockPressBack();
      });

      expect(onDismissMenu).toHaveBeenCalledTimes(1);
      expect(onDismissDialog).not.toHaveBeenCalled();
    });

    it('closes the dialog once the menu has closed', async () => {
      const onDismissDialog = jest.fn();
      const onDismissMenu = jest.fn();

      const { rerender } = await render(
        <MenuInDialog
          onDismissDialog={onDismissDialog}
          onDismissMenu={onDismissMenu}
        />
      );
      await screen.findByText('Item');

      await rerender(
        <MenuInDialog
          menuVisible={false}
          onDismissDialog={onDismissDialog}
          onDismissMenu={onDismissMenu}
        />
      );

      await act(() => {
        BackHandler.mockPressBack();
      });

      expect(onDismissDialog).toHaveBeenCalledTimes(1);
      expect(onDismissMenu).not.toHaveBeenCalled();
    });
  });

  describe('when the Escape key is pressed on the web', () => {
    let platform: { restore(): void };
    let keyDownListeners = new Set<(event: unknown) => void>();

    beforeAll(() => {
      platform = jest.replaceProperty(Platform, 'OS', 'web');

      // There is no DOM under the React Native preset, and the overlays only
      // reach for one on the web, so the test supplies what they touch.
      Object.defineProperty(global, 'HTMLElement', {
        configurable: true,
        value: class {},
      });
      Object.defineProperty(global, 'document', {
        configurable: true,
        value: {
          activeElement: null,
          addEventListener: (
            type: string,
            listener: (event: unknown) => void,
            capture?: boolean
          ) => {
            if (type === 'keydown' && capture === true) {
              keyDownListeners.add(listener);
            }
          },
          removeEventListener: (
            _type: string,
            listener: (event: unknown) => void
          ) => {
            keyDownListeners.delete(listener);
          },
        },
      });
    });

    afterAll(() => {
      platform.restore();
      delete (global as { document?: unknown }).document;
      delete (global as { HTMLElement?: unknown }).HTMLElement;
    });

    beforeEach(() => {
      keyDownListeners = new Set();
    });

    afterEach(async () => {
      // Unmounting hands focus back from a timer, which needs the stubs above
      // and the web platform. Let it run before they are removed.
      await screen.unmount();
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    });

    const pressEscape = async () => {
      const event = {
        key: 'Escape',
        isComposing: false,
        defaultPrevented: false,
      };

      await act(() => {
        keyDownListeners.forEach((listener) => listener(event));
      });
      // The overlay waits until the key has been through the page.
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    };

    it('closes only the menu', async () => {
      const onDismissDialog = jest.fn();
      const onDismissMenu = jest.fn();

      await render(
        <MenuInDialog
          onDismissDialog={onDismissDialog}
          onDismissMenu={onDismissMenu}
        />
      );
      await screen.findByText('Item');

      await pressEscape();

      expect(onDismissMenu).toHaveBeenCalledTimes(1);
      expect(onDismissDialog).not.toHaveBeenCalled();
    });
  });
});
