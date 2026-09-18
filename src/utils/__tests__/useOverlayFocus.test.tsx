import * as React from 'react';
import { AccessibilityInfo, View } from 'react-native';

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
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
  contentRef: React.RefObject<View | null>;
  initialFocusRef?: React.RefObject<View | null>;
  restoreFocusRef?: React.RefObject<View | null>;
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
  const { focusInitialTarget } = useOverlayFocus({
    visible,
    containerRef: contentRef,
    initialFocusRef,
    restoreFocusRef,
  });

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
    jest.advanceTimersByTime(1);
  });
};

describe('useOverlayFocus', () => {
  describe('when the overlay opens', () => {
    it('moves focus to the overlay content', async () => {
      const contentRef = React.createRef<View>();

      await render(<Overlay visible contentRef={contentRef} />);
      await layOutContent();

      expect(sendAccessibilityEvent).toHaveBeenCalledWith(
        contentRef.current,
        'focus'
      );
    });

    it('moves focus to the requested element instead of the content', async () => {
      const contentRef = React.createRef<View>();
      const initialFocusRef = React.createRef<View>();

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

    it('moves focus once however often the content lays out', async () => {
      const contentRef = React.createRef<View>();

      await render(<Overlay visible contentRef={contentRef} />);
      await layOutContent();
      await layOutContent();
      await layOutContent();

      expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('while the overlay is closed', () => {
    it('leaves focus alone when the content lays out', async () => {
      const contentRef = React.createRef<View>();

      await render(<Overlay visible={false} contentRef={contentRef} />);
      await layOutContent();

      expect(sendAccessibilityEvent).not.toHaveBeenCalled();
    });
  });

  describe('when the overlay closes', () => {
    it('moves focus back to the requested element', async () => {
      const contentRef = React.createRef<View>();
      const restoreFocusRef = React.createRef<View>();

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
      const contentRef = React.createRef<View>();
      const restoreFocusRef = React.createRef<View>();

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

    it('leaves focus alone when no element was given to restore it to', async () => {
      const contentRef = React.createRef<View>();

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
      const contentRef = React.createRef<View>();
      const restoreFocusRef = React.createRef<View>();

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
      const contentRef = React.createRef<View>();
      const restoreFocusRef = React.createRef<View>();

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
});
