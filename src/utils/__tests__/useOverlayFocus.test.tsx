import * as React from 'react';
import { AccessibilityInfo, Platform, View } from 'react-native';

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, fireEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { useOverlayFocus } from '../useOverlayFocus';

const sendAccessibilityEvent = jest.mocked(
  AccessibilityInfo.sendAccessibilityEvent
);

beforeEach(() => {
  sendAccessibilityEvent.mockClear();
});

const layoutEvent = {
  nativeEvent: { layout: { x: 0, y: 0, width: 100, height: 100 } },
};

type OverlayProps = {
  visible: boolean;
  contentRef: React.RefObject<React.ComponentRef<typeof View> | null>;
  initialFocusRef?: React.RefObject<React.ComponentRef<typeof View> | null>;
  restoreFocusRef?: React.RefObject<React.ComponentRef<typeof View> | null>;
};

/**
 * The content stays mounted whether or not the overlay is open, the way an
 * overlay that animates itself out does.
 */
const Overlay = ({
  visible,
  contentRef,
  initialFocusRef,
  restoreFocusRef,
}: OverlayProps) => {
  const { focusInitialTarget, restoreFocus } = useOverlayFocus({
    visible,
    containerRef: contentRef,
    initialFocusRef,
    restoreFocusRef,
  });

  React.useEffect(() => {
    if (!visible) {
      restoreFocus();
    }
  }, [restoreFocus, visible]);

  return (
    <View testID="content" ref={contentRef} onLayout={focusInitialTarget} />
  );
};

const layOutContent = async () => {
  await fireEvent(screen.getByTestId('content'), 'layout', layoutEvent);
};

/** Focus is handed back a tick after the overlay closes. */
const settle = async () => {
  await act(() => {
    jest.runOnlyPendingTimers();
  });
};

describe('useOverlayFocus', () => {
  describe('when the overlay opens', () => {
    it('moves focus to the overlay content', async () => {
      const contentRef = React.createRef<React.ComponentRef<typeof View>>();

      await render(<Overlay visible contentRef={contentRef} />);
      await layOutContent();

      expect(sendAccessibilityEvent).toHaveBeenCalledWith(
        contentRef.current,
        'focus'
      );
    });

    it('moves focus to the requested element instead of the content', async () => {
      const contentRef = React.createRef<React.ComponentRef<typeof View>>();
      const initialFocusRef =
        React.createRef<React.ComponentRef<typeof View>>();

      await render(
        <>
          <View testID="first-field" ref={initialFocusRef} />
          <Overlay
            visible
            contentRef={contentRef}
            initialFocusRef={initialFocusRef}
          />
        </>
      );
      await layOutContent();

      expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
      expect(sendAccessibilityEvent).toHaveBeenCalledWith(
        initialFocusRef.current,
        'focus'
      );
    });

    it('moves focus again when the overlay reopens', async () => {
      const contentRef = React.createRef<React.ComponentRef<typeof View>>();
      const restoreFocusRef =
        React.createRef<React.ComponentRef<typeof View>>();

      const { rerender } = await render(
        <>
          <View ref={restoreFocusRef} />
          <Overlay
            visible
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await layOutContent();

      await rerender(
        <>
          <View ref={restoreFocusRef} />
          <Overlay
            visible={false}
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await settle();
      sendAccessibilityEvent.mockClear();

      await rerender(
        <>
          <View ref={restoreFocusRef} />
          <Overlay
            visible
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await layOutContent();

      expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
      expect(sendAccessibilityEvent).toHaveBeenCalledWith(
        contentRef.current,
        'focus'
      );
    });
  });

  describe('while the overlay is closed', () => {
    it('leaves focus alone when the content lays out', async () => {
      const contentRef = React.createRef<React.ComponentRef<typeof View>>();

      await render(<Overlay visible={false} contentRef={contentRef} />);
      await layOutContent();

      expect(sendAccessibilityEvent).not.toHaveBeenCalled();
    });
  });

  describe('when the overlay closes', () => {
    it('moves focus back to the requested element', async () => {
      const contentRef = React.createRef<React.ComponentRef<typeof View>>();
      const restoreFocusRef =
        React.createRef<React.ComponentRef<typeof View>>();

      const { rerender } = await render(
        <>
          <View testID="trigger" ref={restoreFocusRef} />
          <Overlay
            visible
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await layOutContent();

      sendAccessibilityEvent.mockClear();

      await rerender(
        <>
          <View testID="trigger" ref={restoreFocusRef} />
          <Overlay
            visible={false}
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await settle();

      expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
      expect(sendAccessibilityEvent).toHaveBeenCalledWith(
        restoreFocusRef.current,
        'focus'
      );
    });

    it('moves focus back only once, however the overlay goes away', async () => {
      const contentRef = React.createRef<React.ComponentRef<typeof View>>();
      const restoreFocusRef =
        React.createRef<React.ComponentRef<typeof View>>();

      const { rerender, unmount } = await render(
        <>
          <View testID="trigger" ref={restoreFocusRef} />
          <Overlay
            visible
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await layOutContent();

      sendAccessibilityEvent.mockClear();

      await rerender(
        <>
          <View testID="trigger" ref={restoreFocusRef} />
          <Overlay
            visible={false}
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await settle();
      await unmount();
      await settle();

      expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
    });

    it('does not restore focus from an interrupted close', async () => {
      const contentRef = React.createRef<React.ComponentRef<typeof View>>();
      const restoreFocusRef =
        React.createRef<React.ComponentRef<typeof View>>();

      const { rerender } = await render(
        <>
          <View ref={restoreFocusRef} />
          <Overlay
            visible
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await layOutContent();
      sendAccessibilityEvent.mockClear();

      await rerender(
        <>
          <View ref={restoreFocusRef} />
          <Overlay
            visible={false}
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await rerender(
        <>
          <View ref={restoreFocusRef} />
          <Overlay
            visible
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await layOutContent();
      await settle();

      expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
      expect(sendAccessibilityEvent).toHaveBeenCalledWith(
        contentRef.current,
        'focus'
      );
    });

    it('moves focus back when an open overlay unmounts', async () => {
      const contentRef = React.createRef<React.ComponentRef<typeof View>>();
      const restoreFocusRef =
        React.createRef<React.ComponentRef<typeof View>>();

      const { rerender } = await render(
        <>
          <View ref={restoreFocusRef} />
          <Overlay
            visible
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await layOutContent();
      sendAccessibilityEvent.mockClear();

      await rerender(<View ref={restoreFocusRef} />);
      await settle();

      expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
      expect(sendAccessibilityEvent).toHaveBeenCalledWith(
        restoreFocusRef.current,
        'focus'
      );
    });

    it('leaves focus alone when no element was given to restore it to', async () => {
      const contentRef = React.createRef<React.ComponentRef<typeof View>>();

      const { rerender } = await render(
        <Overlay visible contentRef={contentRef} />
      );
      await layOutContent();

      sendAccessibilityEvent.mockClear();

      await rerender(<Overlay visible={false} contentRef={contentRef} />);
      await settle();

      expect(sendAccessibilityEvent).not.toHaveBeenCalled();
    });
  });

  describe('when the overlay never opened', () => {
    it('leaves focus alone as it goes away', async () => {
      const contentRef = React.createRef<React.ComponentRef<typeof View>>();
      const restoreFocusRef =
        React.createRef<React.ComponentRef<typeof View>>();

      const { unmount } = await render(
        <>
          <View testID="trigger" ref={restoreFocusRef} />
          <Overlay
            visible={false}
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await unmount();
      await settle();

      expect(sendAccessibilityEvent).not.toHaveBeenCalled();
    });

    it('leaves focus alone when it opens and closes without ever laying out', async () => {
      const contentRef = React.createRef<React.ComponentRef<typeof View>>();
      const restoreFocusRef =
        React.createRef<React.ComponentRef<typeof View>>();

      const { rerender } = await render(
        <>
          <View testID="trigger" ref={restoreFocusRef} />
          <Overlay
            visible
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );

      await rerender(
        <>
          <View testID="trigger" ref={restoreFocusRef} />
          <Overlay
            visible={false}
            contentRef={contentRef}
            restoreFocusRef={restoreFocusRef}
          />
        </>
      );
      await settle();

      expect(sendAccessibilityEvent).not.toHaveBeenCalled();
    });
  });

  describe('on the web', () => {
    // There is no DOM under the React Native preset, so the test supplies the
    // little of one that the hook touches.
    class FakeElement {
      inside: Array<FakeElement> = [];
      isTabbable = false;
      canTakeFocus = true;

      focus = jest.fn(() => {
        if (this.canTakeFocus) {
          setActiveElement(this);
        }
      });

      contains(element: unknown): boolean {
        return (
          element === this ||
          this.inside.some((child) => child.contains(element))
        );
      }

      querySelectorAll() {
        return this.inside.filter((child) => child.isTabbable);
      }

      getClientRects() {
        return [{}];
      }
    }

    let activeElement: FakeElement | null = null;
    let platform: { restore(): void };

    const setActiveElement = (element: FakeElement | null) => {
      activeElement = element;
    };

    beforeAll(() => {
      platform = jest.replaceProperty(Platform, 'OS', 'web');

      Object.defineProperty(global, 'HTMLElement', {
        configurable: true,
        value: FakeElement,
      });
      Object.defineProperty(global, 'getComputedStyle', {
        configurable: true,
        value: () => ({ visibility: 'visible' }),
      });
      Object.defineProperty(global, 'document', {
        configurable: true,
        value: {
          get activeElement() {
            return activeElement;
          },
        },
      });
    });

    afterAll(() => {
      platform.restore();
      delete (global as { document?: unknown }).document;
      delete (global as { HTMLElement?: unknown }).HTMLElement;
      delete (global as { getComputedStyle?: unknown }).getComputedStyle;
    });

    beforeEach(() => {
      activeElement = null;
    });

    type Handlers = ReturnType<typeof useOverlayFocus>;

    const renderOverlay = async ({
      container,
      initialFocusRef,
      restoreFocusRef,
    }: {
      container: FakeElement;
      initialFocusRef?: React.RefObject<FakeElement | null>;
      restoreFocusRef?: React.RefObject<FakeElement | null>;
    }) => {
      const handlers: { current?: Handlers } = {};

      const Harness = ({ visible }: { visible: boolean }) => {
        const containerRef = React.useRef<FakeElement | null>(container);

        handlers.current = useOverlayFocus({
          visible,
          containerRef,
          initialFocusRef,
          restoreFocusRef,
        });

        return null;
      };

      const { rerender } = await render(<Harness visible={false} />);

      return {
        open: () => rerender(<Harness visible />),
        close: () => rerender(<Harness visible={false} />),
        focusInitialTarget: () =>
          act(() => {
            handlers.current?.focusInitialTarget();
          }),
        restoreFocus: async () => {
          await act(() => {
            handlers.current?.restoreFocus();
          });
          await settle();
        },
      };
    };

    const createDialog = () => {
      const dialog = new FakeElement();
      const field = new FakeElement();
      const button = new FakeElement();

      field.isTabbable = true;
      button.isTabbable = true;
      dialog.inside = [field, button];

      return { dialog, field, button };
    };

    it('moves focus to the first element that can take it', async () => {
      const { dialog, field } = createDialog();
      const overlay = await renderOverlay({ container: dialog });

      await overlay.open();
      await overlay.focusInitialTarget();

      expect(activeElement).toBe(field);
    });

    it('moves focus to the content when nothing inside can take it', async () => {
      const dialog = new FakeElement();
      const overlay = await renderOverlay({ container: dialog });

      await overlay.open();
      await overlay.focusInitialTarget();

      expect(activeElement).toBe(dialog);
    });

    it('leaves focus where it is when something inside already has it', async () => {
      const { dialog, field, button } = createDialog();
      const overlay = await renderOverlay({ container: dialog });

      await overlay.open();
      // An `autoFocus` field has taken focus by the time the fade is over.
      button.focus();
      button.focus.mockClear();

      await overlay.focusInitialTarget();

      expect(activeElement).toBe(button);
      expect(field.focus).not.toHaveBeenCalled();
      expect(dialog.focus).not.toHaveBeenCalled();
    });

    it('still gives the invoker back after leaving focus where it was', async () => {
      const { dialog, button } = createDialog();
      const invoker = new FakeElement();

      invoker.focus();

      const overlay = await renderOverlay({ container: dialog });

      await overlay.open();
      button.focus();
      await overlay.focusInitialTarget();
      await overlay.close();
      await overlay.restoreFocus();

      expect(activeElement).toBe(invoker);
    });

    it('moves focus to the requested element even when something inside has it', async () => {
      const { dialog, button } = createDialog();
      const requested = new FakeElement();
      const initialFocusRef = { current: requested };
      const overlay = await renderOverlay({
        container: dialog,
        initialFocusRef,
      });

      await overlay.open();
      button.focus();

      await overlay.focusInitialTarget();

      expect(activeElement).toBe(requested);
    });

    it('gives focus back when the overlay closes before it moved any in', async () => {
      const { dialog } = createDialog();
      const invoker = new FakeElement();

      invoker.focus();

      const overlay = await renderOverlay({ container: dialog });

      await overlay.open();
      // Opening makes the page behind inert, which drops focus on the body.
      setActiveElement(null);

      await overlay.close();
      await overlay.restoreFocus();

      expect(activeElement).toBe(invoker);
    });

    it('leaves focus alone for an overlay that never opened', async () => {
      const { dialog } = createDialog();
      const invoker = new FakeElement();

      invoker.focus();
      invoker.focus.mockClear();

      const overlay = await renderOverlay({ container: dialog });

      await overlay.restoreFocus();

      expect(invoker.focus).not.toHaveBeenCalled();
    });
  });
});
