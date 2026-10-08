import * as React from 'react';
import { BackHandler as RNBackHandler, Platform, Text } from 'react-native';
import type { BackHandlerStatic as RNBackHandlerStatic } from 'react-native';

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
import { act, fireEvent } from '@testing-library/react-native';

import { LocaleProvider, useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import {
  ReduceMotionContext,
  useReduceMotion,
} from '../../theme/accessibility/ReduceMotionContext';
import Dialog from '../Dialog/Dialog';
import Modal from '../Modal';
import Portal from '../Portal/Portal';

jest.useRealTimers();

interface BackHandlerStatic extends RNBackHandlerStatic {
  mockPressBack(): void;
  exitApp: jest.Mock<() => void>;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const BackHandler = RNBackHandler as BackHandlerStatic;

it('renders portal with siblings', async () => {
  const { toJSON } = await render(
    <Portal.Host>
      <Text>Outside content</Text>
      <Portal>
        <Text testID="content">Portal content</Text>
      </Portal>
    </Portal.Host>
  );

  await screen.findByTestId('content');

  expect(toJSON()).toMatchSnapshot();
});

it('portal content reflects theme, direction, and reduced motion changes', async () => {
  const PortalContent = () => {
    const theme = useInternalTheme(undefined);
    const { direction } = useLocale();
    const reduceMotion = useReduceMotion();

    return (
      <Text>{`${theme.animation.scale} ${direction} ${reduceMotion}`}</Text>
    );
  };

  const { rerender } = await render(
    <Portal.Host>
      <ReduceMotionContext.Provider value={true}>
        <LocaleProvider direction="rtl">
          <Portal theme={{ animation: { scale: 2 } }}>
            <PortalContent />
          </Portal>
        </LocaleProvider>
      </ReduceMotionContext.Provider>
    </Portal.Host>
  );

  expect(screen.getByText('2 rtl true')).toBeOnTheScreen();

  await rerender(
    <Portal.Host>
      <ReduceMotionContext.Provider value={false}>
        <LocaleProvider direction="ltr">
          <Portal theme={{ animation: { scale: 3 } }}>
            <PortalContent />
          </Portal>
        </LocaleProvider>
      </ReduceMotionContext.Provider>
    </Portal.Host>
  );

  expect(screen.getByText('3 ltr false')).toBeOnTheScreen();
  expect(screen.queryByText('2 rtl true')).not.toBeOnTheScreen();
});

it('renders portals in source order when mounted together', async () => {
  await render(
    <Portal.Host>
      <Portal>
        <Text testID="portal-content">first</Text>
      </Portal>
      <Portal>
        <Text testID="portal-content">second</Text>
      </Portal>
      <Portal>
        <Text testID="portal-content">third</Text>
      </Portal>
    </Portal.Host>
  );

  const portals = await screen.findAllByTestId('portal-content');

  expect(portals).toHaveLength(3);
  expect(portals[0]).toHaveTextContent('first');
  expect(portals[1]).toHaveTextContent('second');
  expect(portals[2]).toHaveTextContent('third');
});

it('keeps dialog content accessible above a modal when both are visible', async () => {
  await render(
    <Portal.Host>
      <Modal visible onDismiss={() => {}}>
        <Text>modal content</Text>
      </Modal>
      <Dialog visible onDismiss={() => {}}>
        <Text>dialog content</Text>
      </Dialog>
    </Portal.Host>
  );

  expect(screen.getByText('dialog content')).toBeVisible();
  expect(
    screen.getByText('modal content', { includeHiddenElements: true })
  ).not.toBeVisible();
});

it('hides the app content from assistive technology while a modal is open', async () => {
  await render(
    <Portal.Host>
      <Text>page content</Text>
      <Portal modal>
        <Text>modal content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('modal content')).toBeVisible();

  const pageContent = screen.getByText('page content', {
    includeHiddenElements: true,
  });

  // Still mounted and painted - only hidden from assistive technology.
  expect(pageContent).toBeOnTheScreen();
  expect(pageContent).not.toBeVisible();
});

it('leaves the app content reachable for a portal that is not a modal', async () => {
  await render(
    <Portal.Host>
      <Text>page content</Text>
      <Portal>
        <Text>portal content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('portal content')).toBeVisible();
  expect(screen.getByText('page content')).toBeVisible();
});

it('keeps portal content accessible above a modal', async () => {
  await render(
    <Portal.Host>
      <Portal modal>
        <Text>dialog content</Text>
      </Portal>
      <Portal>
        <Text>menu content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('menu content')).toBeVisible();
  expect(screen.getByText('dialog content')).toBeVisible();
});

it('hides lower modal content from assistive technology', async () => {
  await render(
    <Portal.Host>
      <Portal modal>
        <Text>lower dialog</Text>
      </Portal>
      <Portal modal>
        <Text>upper dialog</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('upper dialog')).toBeVisible();
  expect(
    screen.getByText('lower dialog', { includeHiddenElements: true })
  ).not.toBeVisible();
});

it('restores access to app content when a portal stops being modal', async () => {
  const { rerender } = await render(
    <Portal.Host>
      <Text>page content</Text>
      <Portal modal>
        <Text>modal content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('modal content')).toBeVisible();
  expect(
    screen.getByText('page content', { includeHiddenElements: true })
  ).not.toBeVisible();

  await rerender(
    <Portal.Host>
      <Text>page content</Text>
      <Portal modal={false}>
        <Text>modal content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('page content')).toBeVisible();
});

it('makes the app content reachable again once the modal unmounts', async () => {
  const { rerender } = await render(
    <Portal.Host>
      <Text>page content</Text>
      <Portal modal>
        <Text>modal content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('modal content')).toBeVisible();
  expect(
    screen.getByText('page content', { includeHiddenElements: true })
  ).not.toBeVisible();

  await rerender(
    <Portal.Host>
      <Text>page content</Text>
    </Portal.Host>
  );

  expect(screen.queryByText('modal content')).not.toBeOnTheScreen();
  expect(screen.getByText('page content')).toBeVisible();
});

describe('onDismiss', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when the back button is pressed', () => {
    const pressBack = async () => {
      await act(() => {
        BackHandler.mockPressBack();
      });
    };

    it('closes only the topmost modal portal, then the one underneath on the next press', async () => {
      const onDismissLower = jest.fn();
      const onDismissUpper = jest.fn();

      const Portals = ({ upperOpen }: { upperOpen: boolean }) => (
        <Portal.Host>
          <Portal modal onDismiss={onDismissLower}>
            <Text>lower</Text>
          </Portal>
          {upperOpen ? (
            <Portal modal onDismiss={onDismissUpper}>
              <Text>upper</Text>
            </Portal>
          ) : null}
        </Portal.Host>
      );

      const { rerender } = await render(<Portals upperOpen />);

      await pressBack();

      expect(onDismissUpper).toHaveBeenCalledTimes(1);
      expect(onDismissLower).not.toHaveBeenCalled();

      await rerender(<Portals upperOpen={false} />);

      await pressBack();

      expect(onDismissLower).toHaveBeenCalledTimes(1);
      expect(onDismissUpper).toHaveBeenCalledTimes(1);
    });

    it('lets content inside a modal handle the press first, also after a modal above it closes', async () => {
      const onBackInside = jest.fn(() => true);
      const onDismissLower = jest.fn();

      const BackListener = () => {
        React.useEffect(() => {
          const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackInside
          );

          return () => subscription.remove();
        }, []);

        return <Text>search</Text>;
      };

      const Portals = ({ upperOpen }: { upperOpen: boolean }) => (
        <Portal.Host>
          <Portal modal onDismiss={onDismissLower}>
            <BackListener />
          </Portal>
          {upperOpen ? (
            <Portal modal onDismiss={() => {}}>
              <Text>upper</Text>
            </Portal>
          ) : null}
        </Portal.Host>
      );

      const { rerender } = await render(<Portals upperOpen={false} />);

      await pressBack();

      expect(onBackInside).toHaveBeenCalledTimes(1);

      await rerender(<Portals upperOpen />);
      await rerender(<Portals upperOpen={false} />);

      await pressBack();

      expect(onBackInside).toHaveBeenCalledTimes(2);
      expect(onDismissLower).not.toHaveBeenCalled();
    });

    it('picks the modal drawn on top, not the one that became modal last', async () => {
      const onDismissFirst = jest.fn();
      const onDismissSecond = jest.fn();

      const Portals = ({ firstOpen }: { firstOpen: boolean }) => (
        <Portal.Host>
          <Portal modal={firstOpen} onDismiss={onDismissFirst}>
            <Text>first</Text>
          </Portal>
          <Portal modal onDismiss={onDismissSecond}>
            <Text>second</Text>
          </Portal>
        </Portal.Host>
      );

      const { rerender } = await render(<Portals firstOpen={false} />);

      await rerender(<Portals firstOpen />);

      await pressBack();

      // Portals are drawn in the order they mounted, so the second one is on
      // top even though the first became modal after it.
      expect(onDismissSecond).toHaveBeenCalledTimes(1);
      expect(onDismissFirst).not.toHaveBeenCalled();
    });

    it('ignores portals above the modal that are not modal', async () => {
      const onDismissModal = jest.fn();
      const onDismissPortal = jest.fn();

      await render(
        <Portal.Host>
          <Portal modal onDismiss={onDismissModal}>
            <Text>dialog</Text>
          </Portal>
          <Portal onDismiss={onDismissPortal}>
            <Text>tooltip</Text>
          </Portal>
        </Portal.Host>
      );

      await pressBack();

      expect(onDismissModal).toHaveBeenCalledTimes(1);
      expect(onDismissPortal).not.toHaveBeenCalled();
    });

    it('gives the press to the modal underneath once the one above stops being modal', async () => {
      const onDismissLower = jest.fn();
      const onDismissUpper = jest.fn();

      const Portals = ({ upperModal }: { upperModal: boolean }) => (
        <Portal.Host>
          <Portal modal onDismiss={onDismissLower}>
            <Text>lower</Text>
          </Portal>
          <Portal modal={upperModal} onDismiss={onDismissUpper}>
            <Text>upper</Text>
          </Portal>
        </Portal.Host>
      );

      const { rerender } = await render(<Portals upperModal />);

      // E.g. a modal that is still fading out.
      await rerender(<Portals upperModal={false} />);

      await pressBack();

      expect(onDismissLower).toHaveBeenCalledTimes(1);
      expect(onDismissUpper).not.toHaveBeenCalled();
    });

    it('leaves the press alone when no modal is open', async () => {
      const onDismiss = jest.fn();

      await render(
        <Portal.Host>
          <Portal onDismiss={onDismiss}>
            <Text>tooltip</Text>
          </Portal>
        </Portal.Host>
      );

      await pressBack();

      expect(onDismiss).not.toHaveBeenCalled();
      expect(BackHandler.exitApp).toHaveBeenCalledTimes(1);
    });

    it("doesn't pass the press on from a modal without onDismiss", async () => {
      const onDismissLower = jest.fn();

      await render(
        <Portal.Host>
          <Portal modal onDismiss={onDismissLower}>
            <Text>lower</Text>
          </Portal>
          <Portal modal>
            <Text>upper</Text>
          </Portal>
        </Portal.Host>
      );

      await pressBack();

      expect(onDismissLower).not.toHaveBeenCalled();
      expect(BackHandler.exitApp).not.toHaveBeenCalled();
    });

    it('stops listening once the host unmounts', async () => {
      const onDismiss = jest.fn();

      const { unmount } = await render(
        <Portal.Host>
          <Portal modal onDismiss={onDismiss}>
            <Text>dialog</Text>
          </Portal>
        </Portal.Host>
      );

      await unmount();

      await pressBack();

      expect(onDismiss).not.toHaveBeenCalled();
      expect(BackHandler.exitApp).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the Escape key is pressed on the web', () => {
    type FakeKeyboardEvent = ReturnType<typeof createEvent>;
    type Listener = (event: FakeKeyboardEvent) => void;

    let platform: { restore(): void };
    let listeners = new Set<Listener>();

    beforeAll(() => {
      platform = jest.replaceProperty(Platform, 'OS', 'web');

      // There is no DOM under the React Native preset, and the portal host
      // only reaches for one on the web, so the test supplies what it touches.
      Object.defineProperty(global, 'document', {
        configurable: true,
        value: {
          addEventListener: (type: string, listener: Listener) => {
            if (type === 'keydown') {
              listeners.add(listener);
            }
          },
          removeEventListener: (type: string, listener: Listener) => {
            if (type === 'keydown') {
              listeners.delete(listener);
            }
          },
        },
      });
    });

    afterAll(() => {
      platform.restore();
      delete (global as { document?: unknown }).document;
    });

    beforeEach(() => {
      listeners = new Set();
    });

    const createEvent = ({
      isComposing = false,
    }: {
      isComposing?: boolean;
    }) => {
      const event = {
        key: 'Escape',
        isComposing,
        defaultPrevented: false,
        preventDefault: jest.fn(() => {
          event.defaultPrevented = true;
        }),
      };

      return event;
    };

    // Runs the key press the way a browser does: first the focused element
    // inside the modal, then the listeners on `document` as it bubbles up.
    const pressEscape = async ({
      onFocusedElementKeyDown,
      ...options
    }: {
      onFocusedElementKeyDown?: (event: FakeKeyboardEvent) => void;
      isComposing?: boolean;
    } = {}) => {
      const event = createEvent(options);

      await act(() => {
        onFocusedElementKeyDown?.(event);

        for (const listener of listeners) {
          listener(event);
        }
      });

      return event;
    };

    it('closes only the topmost modal portal', async () => {
      const onDismissLower = jest.fn();
      const onDismissUpper = jest.fn();

      await render(
        <Portal.Host>
          <Portal modal onDismiss={onDismissLower}>
            <Text>lower</Text>
          </Portal>
          <Portal modal onDismiss={onDismissUpper}>
            <Text>upper</Text>
          </Portal>
        </Portal.Host>
      );

      const event = await pressEscape();

      expect(onDismissUpper).toHaveBeenCalledTimes(1);
      expect(onDismissLower).not.toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('marks the key handled for a modal without onDismiss', async () => {
      const onDismissLower = jest.fn();

      await render(
        <Portal.Host>
          <Portal modal onDismiss={onDismissLower}>
            <Text>lower</Text>
          </Portal>
          <Portal modal>
            <Text>upper</Text>
          </Portal>
        </Portal.Host>
      );

      const event = await pressEscape();

      expect(onDismissLower).not.toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('stays open when an element inside the modal marks the key handled', async () => {
      const onDismiss = jest.fn();
      const onFocusedElementKeyDown = jest.fn((event: FakeKeyboardEvent) =>
        event.preventDefault()
      );

      await render(
        <Portal.Host>
          <Portal modal onDismiss={onDismiss}>
            <Text>dialog</Text>
          </Portal>
        </Portal.Host>
      );

      await pressEscape({ onFocusedElementKeyDown });

      expect(onFocusedElementKeyDown).toHaveBeenCalledTimes(1);
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('stays open while the user is composing text', async () => {
      const onDismiss = jest.fn();

      await render(
        <Portal.Host>
          <Portal modal onDismiss={onDismiss}>
            <Text>dialog</Text>
          </Portal>
        </Portal.Host>
      );

      const event = await pressEscape({ isComposing: true });

      expect(onDismiss).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('closes a Modal on Escape following dismissable, not dismissableOverlay', async () => {
      const onDismissBlocked = jest.fn();
      const onDismissAllowed = jest.fn();

      const { rerender } = await render(
        <Portal.Host>
          <Modal visible dismissable={false} onDismiss={onDismissBlocked}>
            <Text>blocked</Text>
          </Modal>
        </Portal.Host>
      );

      await pressEscape();

      expect(onDismissBlocked).not.toHaveBeenCalled();

      await rerender(
        <Portal.Host>
          <Modal
            visible
            dismissableOverlay={false}
            onDismiss={onDismissAllowed}
          >
            <Text>allowed</Text>
          </Modal>
        </Portal.Host>
      );

      await pressEscape();

      expect(onDismissAllowed).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the VoiceOver escape gesture is made', () => {
    const escapeFrom = async (text: string) => {
      await fireEvent(
        screen.getByText(text, { includeHiddenElements: true }),
        'accessibilityEscape'
      );
    };

    it('closes only the topmost modal portal', async () => {
      const onDismissLower = jest.fn();
      const onDismissUpper = jest.fn();

      await render(
        <Portal.Host>
          <Portal modal onDismiss={onDismissLower}>
            <Text>lower</Text>
          </Portal>
          <Portal modal onDismiss={onDismissUpper}>
            <Text>upper</Text>
          </Portal>
        </Portal.Host>
      );

      await escapeFrom('lower');

      expect(onDismissLower).not.toHaveBeenCalled();
      expect(onDismissUpper).not.toHaveBeenCalled();

      await escapeFrom('upper');

      expect(onDismissUpper).toHaveBeenCalledTimes(1);
      expect(onDismissLower).not.toHaveBeenCalled();
    });

    it("doesn't close a portal that is not modal", async () => {
      const onDismiss = jest.fn();

      await render(
        <Portal.Host>
          <Portal onDismiss={onDismiss}>
            <Text>popup</Text>
          </Portal>
        </Portal.Host>
      );

      await escapeFrom('popup');

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });
});
