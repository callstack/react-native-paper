import * as React from 'react';
import {
  AccessibilityInfo,
  BackHandler as RNBackHandler,
  Text,
  View,
} from 'react-native';
import type { BackHandlerStatic as RNBackHandlerStatic } from 'react-native';

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import { tokens } from '../../theme/tokens';
import Modal from '../Modal';
import Portal from '../Portal/Portal';

const scrimAlpha = tokens.md.sys.scrim.alpha;

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 44, left: 0, right: 0, top: 37 }),
}));

interface BackHandlerStatic extends RNBackHandlerStatic {
  mockPressBack(): void;
  exitApp: jest.Mock<() => void>;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const BackHandler = RNBackHandler as BackHandlerStatic;

const sendAccessibilityEvent = jest.mocked(
  AccessibilityInfo.sendAccessibilityEvent
);

// The modal queues its fade, and the fade finishing queues the focus move that
// follows it. Drained in passes so that tests need not count the steps.
const settle = async () => {
  for (let pass = 0; pass < 5; pass += 1) {
    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    if (jest.getTimerCount() === 0) {
      return;
    }
  }
};

describe('Modal', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => setTimeout(callback, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
    /* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
    (
      window.requestAnimationFrame as unknown as { mockRestore(): void }
    ).mockRestore();
    /* eslint-enable @typescript-eslint/no-unsafe-type-assertion */
  });

  // `exitApp` is one module-level `jest.fn` shared by every test in the file,
  // and nothing clears it globally.
  beforeEach(() => {
    BackHandler.exitApp.mockClear();
    sendAccessibilityEvent.mockClear();
  });

  describe('by default', () => {
    it('should render passed children', async () => {
      await render(
        <Portal.Host>
          <Modal visible={true} testID="modal">
            <Text>Children</Text>
          </Modal>
        </Portal.Host>
      );

      expect(screen.getByTestId('modal')).toHaveTextContent('Children');
    });

    it("should render a backdrop in default theme's color", async () => {
      await render(
        <Portal.Host>
          <Modal visible={true} testID="modal">
            {null}
          </Modal>
        </Portal.Host>
      );

      expect(screen.getByLabelText('Close modal')).toHaveStyle({
        backgroundColor: LightTheme.colors.scrim,
      });
    });

    it('should render a custom backdrop color if specified', async () => {
      await render(
        <Portal.Host>
          <Modal
            visible={true}
            testID="modal"
            theme={{
              colors: {
                scrim: 'transparent',
              },
            }}
          >
            {null}
          </Modal>
        </Portal.Host>
      );

      expect(screen.getByLabelText('Close modal')).toHaveStyle({
        backgroundColor: 'transparent',
      });
    });

    it('should receive appropriate top and bottom insets', async () => {
      const { toJSON } = await render(
        <Portal.Host>
          <Modal visible={true} testID="modal">
            {null}
          </Modal>
        </Portal.Host>
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
  describe('when open', () => {
    describe('if backdrop touched', () => {
      it('should invoke the onDismiss function immediately', async () => {
        const onDismiss = jest.fn();
        const { toJSON } = await render(
          <Portal.Host>
            <Modal testID="modal" visible onDismiss={onDismiss}>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        await userEvent.press(screen.getByLabelText('Close modal'));

        expect(onDismiss).toHaveBeenCalled();

        expect(toJSON()).toMatchSnapshot();

        await act(() => {
          jest.runAllTimers();
        });

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });

        expect(toJSON()).toMatchSnapshot();

        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });

    it('runs the closing animation if visible toggled', async () => {
      const { rerender, toJSON } = await render(
        <Portal.Host>
          <Modal testID="modal" visible onDismiss={() => {}}>
            {null}
          </Modal>
        </Portal.Host>
      );

      expect(toJSON()).toMatchSnapshot();

      await userEvent.press(screen.getByLabelText('Close modal'));

      await rerender(
        <Portal.Host>
          <Modal testID="modal" visible={false} onDismiss={() => {}}>
            {null}
          </Modal>
        </Portal.Host>
      );

      expect(toJSON()).toMatchSnapshot();

      expect(screen.getByLabelText('Close modal')).toHaveStyle({
        opacity: scrimAlpha,
      });

      expect(toJSON()).toMatchSnapshot();

      await act(() => {
        jest.runAllTimers();
      });

      expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();
    });

    describe('if closed via Android back button', () => {
      it('invokes onDismiss', async () => {
        const onDismiss = jest.fn();
        const { toJSON } = await render(
          <Portal.Host>
            <Modal testID="modal" visible onDismiss={onDismiss}>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(toJSON()).toMatchSnapshot();

        await act(() => {
          BackHandler.mockPressBack();
        });

        expect(toJSON()).toMatchSnapshot();

        await act(() => {
          jest.runAllTimers();
        });

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });

        expect(toJSON()).toMatchSnapshot();

        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when open as non-dismissible modal', () => {
    describe('if closed via touching backdrop', () => {
      it('will run the animation but not fade out', async () => {
        const { toJSON } = await render(
          <Portal.Host>
            <Modal
              testID="modal"
              visible
              onDismiss={() => {}}
              dismissable={false}
            >
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(toJSON()).toMatchSnapshot();

        await userEvent.press(screen.getByLabelText('Close modal'));

        expect(toJSON()).toMatchSnapshot();

        await act(() => {
          jest.runAllTimers();
        });

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });

        expect(toJSON()).toMatchSnapshot();
      });

      it('should not invoke onDismiss', async () => {
        const onDismiss = jest.fn();
        await render(
          <Portal.Host>
            <Modal
              testID="modal"
              visible
              onDismiss={onDismiss}
              dismissable={false}
            >
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        await userEvent.press(screen.getByLabelText('Close modal'));

        expect(onDismiss).not.toHaveBeenCalled();

        await act(() => {
          jest.runAllTimers();
        });

        expect(onDismiss).not.toHaveBeenCalled();
      });
    });

    describe('if closed via Android back button', () => {
      it('will run the animation but not fade out', async () => {
        const { toJSON } = await render(
          <Portal.Host>
            <Modal
              testID="modal"
              visible
              onDismiss={() => {}}
              dismissable={false}
            >
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(toJSON()).toMatchSnapshot();

        await act(() => {
          BackHandler.mockPressBack();
        });

        expect(toJSON()).toMatchSnapshot();

        await act(() => {
          jest.runAllTimers();
        });

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });

        expect(toJSON()).toMatchSnapshot();
      });

      it('should not invoke onDismiss', async () => {
        const onDismiss = jest.fn();

        await render(
          <Portal.Host>
            <Modal
              testID="modal"
              visible
              onDismiss={onDismiss}
              dismissable={false}
            >
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        await act(() => {
          BackHandler.mockPressBack();
        });

        expect(onDismiss).not.toHaveBeenCalled();

        await act(() => {
          jest.runAllTimers();
        });

        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('should not let the press leave the screen behind it', async () => {
        await render(
          <Portal.Host>
            <Modal
              testID="modal"
              visible
              onDismiss={() => {}}
              dismissable={false}
            >
              {null}
            </Modal>
          </Portal.Host>
        );

        await act(() => {
          BackHandler.mockPressBack();
        });

        expect(BackHandler.exitApp).not.toHaveBeenCalled();
      });
    });
  });

  describe('when visible prop changes', () => {
    describe('from false to true (closed to open)', () => {
      it('should run fade-in animation on opening', async () => {
        const { rerender, toJSON } = await render(
          <Portal.Host>
            <Modal testID="modal" visible={false}>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();

        await rerender(
          <Portal.Host>
            <Modal testID="modal" visible>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: 0,
        });
        expect(toJSON()).toMatchSnapshot();

        await act(() => {
          jest.runAllTimers();
        });

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });
        expect(toJSON()).toMatchSnapshot();
      });
    });

    describe('from true to false (open to closed)', () => {
      it('should run fade-out animation on closing', async () => {
        const { rerender, toJSON } = await render(
          <Portal.Host>
            <Modal testID="modal" visible>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });
        expect(toJSON()).toMatchSnapshot();

        await rerender(
          <Portal.Host>
            <Modal testID="modal" visible={false}>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });
        expect(toJSON()).toMatchSnapshot();

        await act(() => {
          jest.runAllTimers();
        });

        expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();
      });

      it('should not invoke onDismiss', async () => {
        const onDismiss = jest.fn();

        const { rerender } = await render(
          <Portal.Host>
            <Modal testID="modal" visible onDismiss={onDismiss}>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        await rerender(
          <Portal.Host>
            <Modal testID="modal" visible={false} onDismiss={onDismiss}>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        await act(() => {
          jest.runAllTimers();
        });

        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('should close even if the dialog is not dismissible', async () => {
        const { rerender, toJSON } = await render(
          <Portal.Host>
            <Modal testID="modal" visible dismissable={false}>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });
        expect(toJSON()).toMatchSnapshot();

        await rerender(
          <Portal.Host>
            <Modal testID="modal" visible={false} dismissable={false}>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });
        expect(toJSON()).toMatchSnapshot();

        await act(() => {
          jest.runAllTimers();
        });

        expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();
      });
    });
  });

  describe('when it opens', () => {
    it('moves the screen reader into its content', async () => {
      await render(
        <Portal.Host>
          <Modal testID="modal" visible>
            <Text>Modal content</Text>
          </Modal>
        </Portal.Host>
      );

      await settle();

      expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
      expect(sendAccessibilityEvent).toHaveBeenCalledWith(
        expect.anything(),
        'focus'
      );
    });

    it('moves the screen reader to the element it was given instead', async () => {
      const initialFocusRef = React.createRef<View>();

      await render(
        <Portal.Host>
          <Modal testID="modal" visible initialFocusRef={initialFocusRef}>
            <View testID="first-field" ref={initialFocusRef} />
            <Text>Modal content</Text>
          </Modal>
        </Portal.Host>
      );

      await settle();

      expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
      expect(sendAccessibilityEvent).toHaveBeenCalledWith(
        initialFocusRef.current,
        'focus'
      );
    });
  });

  describe('when it closes', () => {
    it('sends the screen reader back to the control that opened it', async () => {
      const restoreFocusRef = React.createRef<View>();

      const { rerender } = await render(
        <Portal.Host>
          <View testID="trigger" ref={restoreFocusRef} />
          <Modal testID="modal" visible restoreFocusRef={restoreFocusRef}>
            <Text>Modal content</Text>
          </Modal>
        </Portal.Host>
      );

      await settle();

      sendAccessibilityEvent.mockClear();

      await rerender(
        <Portal.Host>
          <View testID="trigger" ref={restoreFocusRef} />
          <Modal
            testID="modal"
            visible={false}
            restoreFocusRef={restoreFocusRef}
          >
            <Text>Modal content</Text>
          </Modal>
        </Portal.Host>
      );
      await settle();

      expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
      expect(sendAccessibilityEvent).toHaveBeenCalledWith(
        restoreFocusRef.current,
        'focus'
      );
    });
  });

  describe('when visible prop changes again during the open/close animation', () => {
    describe('while closing, back to true (visible)', () => {
      it('should keep the modal open', async () => {
        const { rerender, toJSON } = await render(
          <Portal.Host>
            <Modal testID="modal" visible>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });
        expect(toJSON()).toMatchSnapshot();

        await rerender(
          <Portal.Host>
            <Modal testID="modal" visible={false}>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });
        expect(toJSON()).toMatchSnapshot();

        await act(() => {
          // Not a real seconds, this depends on how frequently
          // requestAnimationFrame is called
          jest.advanceTimersToNextTimer(1000);
        });

        await rerender(
          <Portal.Host>
            <Modal testID="modal" visible>
              {null}
            </Modal>
          </Portal.Host>
        );

        await act(() => {
          jest.runAllTimers();
        });

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });
        expect(toJSON()).toMatchSnapshot();
      });
    });

    describe('while opening, back to false (hidden)', () => {
      it('should keep the modal closed', async () => {
        const { rerender, toJSON } = await render(
          <Portal.Host>
            <Modal testID="modal" visible={false}>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(screen.queryByLabelText('Close modal')).not.toBeOnTheScreen();

        await rerender(
          <Portal.Host>
            <Modal testID="modal" visible>
              {null}
            </Modal>
          </Portal.Host>
        );

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: 0,
        });
        expect(toJSON()).toMatchSnapshot();

        await act(() => {
          // Not a real seconds, this depends on how frequently
          // requestAnimationFrame is called
          jest.advanceTimersToNextTimer(1000);
        });

        expect(screen.getByLabelText('Close modal')).toBeOnTheScreen();

        await rerender(
          <Portal.Host>
            <Modal testID="modal" visible={false}>
              {null}
            </Modal>
          </Portal.Host>
        );

        await act(() => {
          jest.runAllTimers();
        });

        expect(screen.queryByLabelText('Close modal')).not.toBeOnTheScreen();
      });
    });
  });
});
