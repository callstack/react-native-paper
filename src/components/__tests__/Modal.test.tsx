import * as React from 'react';
import {
  Animated,
  BackHandler as RNBackHandler,
  BackHandlerStatic as RNBackHandlerStatic,
  Text,
} from 'react-native';

import { act, fireEvent, render } from '@testing-library/react-native';

import { MD3LightTheme } from '../../styles/themes';
import Modal from '../Modal';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 44, left: 0, right: 0, top: 37 }),
}));

interface BackHandlerStatic extends RNBackHandlerStatic {
  mockPressBack(): void;
}

const BackHandler = RNBackHandler as BackHandlerStatic;

jest.mock('react-native/Libraries/Utilities/BackHandler', () =>
  // eslint-disable-next-line jest/no-mocks-import
  require('react-native/Libraries/Utilities/__mocks__/BackHandler')
);

describe('Modal', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => setTimeout(callback, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
    (
      window.requestAnimationFrame as unknown as { mockRestore(): void }
    ).mockRestore();
  });

  describe('by default', () => {
    it('should render passed children', () => {
      const { getByTestId } = render(
        <Modal visible={true} testID="modal">
          <Text>Children</Text>
        </Modal>
      );

      expect(getByTestId('modal')).toHaveTextContent('Children');
    });

    it("should render a backdrop in default theme's color", () => {
      const { getByTestId } = render(
        <Modal visible={true} testID="modal">
          {null}
        </Modal>
      );

      expect(getByTestId('modal-backdrop')).toHaveStyle({
        backgroundColor: MD3LightTheme.colors.backdrop,
      });
    });

    it('should render a custom backdrop color if specified', () => {
      const { getByTestId } = render(
        <Modal
          visible={true}
          testID="modal"
          theme={{
            colors: {
              backdrop: 'transparent',
            },
          }}
        >
          {null}
        </Modal>
      );

      expect(getByTestId('modal-backdrop')).toHaveStyle({
        backgroundColor: 'transparent',
      });
    });

    it('should receive appropriate top and bottom insets', () => {
      const { getByTestId } = render(
        <Modal visible={true} testID="modal">
          {null}
        </Modal>
      );

      expect(getByTestId('modal-wrapper')).toHaveStyle({
        marginTop: 37,
        marginBottom: 44,
      });
    });
  });
  describe('when open', () => {
    describe('if backdrop touched', () => {
      it('should invoke the onDismiss function immediately', () => {
        const onDismiss = jest.fn();
        const { getByTestId } = render(
          <Modal testID="modal" visible onDismiss={onDismiss}>
            {null}
          </Modal>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        act(() => {
          fireEvent.press(getByTestId('modal-backdrop'));
        });

        expect(onDismiss).toHaveBeenCalled();

        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        act(() => {
          jest.runAllTimers();
        });

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });

        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });

    it('runs the closing animation if visible toggled', () => {
      const { getByTestId, queryByTestId, rerender } = render(
        <Modal testID="modal" visible onDismiss={() => {}}>
          {null}
        </Modal>
      );

      expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
        opacity: 1,
      });

      act(() => {
        fireEvent.press(getByTestId('modal-backdrop'));
      });

      rerender(
        <Modal testID="modal" visible={false} onDismiss={() => {}}>
          {null}
        </Modal>
      );

      expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
        opacity: 1,
      });

      expect(getByTestId('modal-backdrop')).toHaveStyle({
        opacity: 1,
      });

      expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
        opacity: 1,
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(queryByTestId('modal-surface-outer-layer')).not.toBeOnTheScreen();

      expect(queryByTestId('modal-backdrop')).not.toBeOnTheScreen();
    });

    describe('if closed via Android back button', () => {
      it('invokes onDismiss', async () => {
        const onDismiss = jest.fn();
        const { getByTestId } = render(
          <Modal testID="modal" visible onDismiss={onDismiss}>
            {null}
          </Modal>
        );

        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        act(() => {
          BackHandler.mockPressBack();
        });

        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        act(() => {
          jest.runAllTimers();
        });

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });

        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when open as non-dismissible modal', () => {
    describe('if closed via touching backdrop', () => {
      it('will run the animation but not fade out', async () => {
        const { getByTestId } = render(
          <Modal
            testID="modal"
            visible
            onDismiss={() => {}}
            dismissable={false}
          >
            {null}
          </Modal>
        );

        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        act(() => {
          fireEvent.press(getByTestId('modal-backdrop'));
        });

        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        act(() => {
          jest.runAllTimers();
        });

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });

        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });
      });

      it('should not invoke onDismiss', () => {
        const onDismiss = jest.fn();
        const { getByTestId } = render(
          <Modal
            testID="modal"
            visible
            onDismiss={onDismiss}
            dismissable={false}
          >
            {null}
          </Modal>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        act(() => {
          fireEvent.press(getByTestId('modal-backdrop'));
        });

        expect(onDismiss).not.toHaveBeenCalled();

        act(() => {
          jest.runAllTimers();
        });

        expect(onDismiss).not.toHaveBeenCalled();
      });
    });

    describe('if closed via Android back button', () => {
      it('will run the animation but not fade out', async () => {
        const { getByTestId } = render(
          <Modal
            testID="modal"
            visible
            onDismiss={() => {}}
            dismissable={false}
          >
            {null}
          </Modal>
        );

        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        act(() => {
          BackHandler.mockPressBack();
        });

        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        act(() => {
          jest.runAllTimers();
        });

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });

        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });
      });

      it('should not invoke onDismiss', () => {
        const onDismiss = jest.fn();

        render(
          <Modal
            testID="modal"
            visible
            onDismiss={onDismiss}
            dismissable={false}
          >
            {null}
          </Modal>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        act(() => {
          BackHandler.mockPressBack();
        });

        expect(onDismiss).not.toHaveBeenCalled();

        act(() => {
          jest.runAllTimers();
        });

        expect(onDismiss).not.toHaveBeenCalled();
      });
    });
  });

  describe('when visible prop changes', () => {
    describe('from false to true (closed to open)', () => {
      it('should run fade-in animation on opening', () => {
        const { queryByTestId, getByTestId, rerender } = render(
          <Modal testID="modal" visible={false}>
            {null}
          </Modal>
        );

        expect(queryByTestId('modal')).toBe(null);

        rerender(
          <Modal testID="modal" visible>
            {null}
          </Modal>
        );

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 0,
        });
        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 0,
        });

        act(() => {
          jest.runAllTimers();
        });

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });
        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });
      });
    });

    describe('from true to false (open to closed)', () => {
      it('should run fade-out animation on closing', async () => {
        const { queryByTestId, getByTestId, rerender } = render(
          <Modal testID="modal" visible>
            {null}
          </Modal>
        );

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });
        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        rerender(
          <Modal testID="modal" visible={false}>
            {null}
          </Modal>
        );

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });
        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        act(() => {
          jest.runAllTimers();
        });

        expect(queryByTestId('modal')).toBe(null);
      });

      it('should not invoke onDismiss', async () => {
        const onDismiss = jest.fn();

        const { rerender } = render(
          <Modal testID="modal" visible onDismiss={onDismiss}>
            {null}
          </Modal>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        rerender(
          <Modal testID="modal" visible={false} onDismiss={onDismiss}>
            {null}
          </Modal>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        act(() => {
          jest.runAllTimers();
        });

        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('should close even if the dialog is not dismissible', async () => {
        const { queryByTestId, getByTestId, rerender } = render(
          <Modal testID="modal" visible dismissable={false}>
            {null}
          </Modal>
        );

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });
        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        rerender(
          <Modal testID="modal" visible={false} dismissable={false}>
            {null}
          </Modal>
        );

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });
        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        act(() => {
          jest.runAllTimers();
        });

        expect(queryByTestId('modal')).toBe(null);
      });
    });
  });

  describe('when visible prop changes again during the open/close animation', () => {
    describe('while closing, back to true (visible)', () => {
      it('should keep the modal open', () => {
        const { getByTestId, rerender } = render(
          <Modal testID="modal" visible>
            {null}
          </Modal>
        );

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });
        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        rerender(
          <Modal testID="modal" visible={false}>
            {null}
          </Modal>
        );

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });
        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });

        act(() => {
          // Not a real seconds, this depends on how frequently
          // requestAnimationFrame is called
          jest.advanceTimersToNextTimer(1000);
        });

        rerender(
          <Modal testID="modal" visible>
            {null}
          </Modal>
        );

        act(() => {
          jest.runAllTimers();
        });

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 1,
        });
        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 1,
        });
      });
    });

    describe('while opening, back to false (hidden)', () => {
      it('should keep the modal closed', () => {
        const { queryByTestId, getByTestId, rerender } = render(
          <Modal testID="modal" visible={false}>
            {null}
          </Modal>
        );

        expect(queryByTestId('modal-backdrop')).toBe(null);

        rerender(
          <Modal testID="modal" visible>
            {null}
          </Modal>
        );

        expect(getByTestId('modal-backdrop')).toHaveStyle({
          opacity: 0,
        });
        expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
          opacity: 0,
        });

        act(() => {
          // Not a real seconds, this depends on how frequently
          // requestAnimationFrame is called
          jest.advanceTimersToNextTimer(1000);
        });

        expect(queryByTestId('modal-backdrop')).not.toBe(null);

        rerender(
          <Modal testID="modal" visible={false}>
            {null}
          </Modal>
        );

        act(() => {
          jest.runAllTimers();
        });

        expect(queryByTestId('modal-backdrop')).toBe(null);
      });
    });
  });

  it('animated value changes correctly', () => {
    const value = new Animated.Value(1);
    const { getByTestId } = render(
      <Modal
        visible={true}
        testID="modal"
        contentContainerStyle={[{ transform: [{ scale: value }] }]}
      >
        {null}
      </Modal>
    );
    expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
      transform: [{ scale: 1 }],
    });

    Animated.timing(value, {
      toValue: 1.5,
      useNativeDriver: false,
      duration: 200,
    }).start();

    act(() => {
      jest.runAllTimers();
    });

    expect(getByTestId('modal-surface-outer-layer')).toHaveStyle({
      transform: [{ scale: 1.5 }],
    });
  });
});
