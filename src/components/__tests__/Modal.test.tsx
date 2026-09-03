import { Animated, BackHandler as RNBackHandler, Text } from 'react-native';
import type { BackHandlerStatic as RNBackHandlerStatic } from 'react-native';

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { act, userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import { tokens } from '../../theme/tokens';
import Modal from '../Modal';

const scrimAlpha = tokens.md.sys.scrim.alpha;

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 44, left: 0, right: 0, top: 37 }),
}));

interface BackHandlerStatic extends RNBackHandlerStatic {
  mockPressBack(): void;
}

const BackHandler = RNBackHandler as BackHandlerStatic;

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
    it('should render passed children', async () => {
      await render(
        <Modal visible={true} testID="modal">
          <Text>Children</Text>
        </Modal>
      );

      expect(screen.getByTestId('modal')).toHaveTextContent('Children');
    });

    it("should render a backdrop in default theme's color", async () => {
      await render(
        <Modal visible={true} testID="modal">
          {null}
        </Modal>
      );

      expect(screen.getByLabelText('Close modal')).toHaveStyle({
        backgroundColor: LightTheme.colors.scrim,
      });
    });

    it('should render a custom backdrop color if specified', async () => {
      await render(
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
      );

      expect(screen.getByLabelText('Close modal')).toHaveStyle({
        backgroundColor: 'transparent',
      });
    });

    it('should receive appropriate top and bottom insets', async () => {
      const { toJSON } = await render(
        <Modal visible={true} testID="modal">
          {null}
        </Modal>
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
  describe('when open', () => {
    describe('if backdrop touched', () => {
      it('should invoke the onDismiss function immediately', async () => {
        const onDismiss = jest.fn();
        const { toJSON } = await render(
          <Modal testID="modal" visible onDismiss={onDismiss}>
            {null}
          </Modal>
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
        <Modal testID="modal" visible onDismiss={() => {}}>
          {null}
        </Modal>
      );

      expect(toJSON()).toMatchSnapshot();

      await userEvent.press(screen.getByLabelText('Close modal'));

      await rerender(
        <Modal testID="modal" visible={false} onDismiss={() => {}}>
          {null}
        </Modal>
      );

      expect(toJSON()).toMatchSnapshot();

      expect(screen.getByLabelText('Close modal')).toHaveStyle({
        opacity: scrimAlpha,
      });

      expect(toJSON()).toMatchSnapshot();

      await act(() => {
        jest.runAllTimers();
      });

      expect(toJSON()).toBeNull();
    });

    describe('if closed via Android back button', () => {
      it('invokes onDismiss', async () => {
        const onDismiss = jest.fn();
        const { toJSON } = await render(
          <Modal testID="modal" visible onDismiss={onDismiss}>
            {null}
          </Modal>
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
          <Modal
            testID="modal"
            visible
            onDismiss={() => {}}
            dismissable={false}
          >
            {null}
          </Modal>
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
          <Modal
            testID="modal"
            visible
            onDismiss={() => {}}
            dismissable={false}
          >
            {null}
          </Modal>
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

        await act(() => {
          BackHandler.mockPressBack();
        });

        expect(onDismiss).not.toHaveBeenCalled();

        await act(() => {
          jest.runAllTimers();
        });

        expect(onDismiss).not.toHaveBeenCalled();
      });
    });
  });

  describe('when visible prop changes', () => {
    describe('from false to true (closed to open)', () => {
      it('should run fade-in animation on opening', async () => {
        const { rerender, toJSON } = await render(
          <Modal testID="modal" visible={false}>
            {null}
          </Modal>
        );

        expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();

        await rerender(
          <Modal testID="modal" visible>
            {null}
          </Modal>
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
          <Modal testID="modal" visible>
            {null}
          </Modal>
        );

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });
        expect(toJSON()).toMatchSnapshot();

        await rerender(
          <Modal testID="modal" visible={false}>
            {null}
          </Modal>
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
          <Modal testID="modal" visible onDismiss={onDismiss}>
            {null}
          </Modal>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        await rerender(
          <Modal testID="modal" visible={false} onDismiss={onDismiss}>
            {null}
          </Modal>
        );

        expect(onDismiss).not.toHaveBeenCalled();

        await act(() => {
          jest.runAllTimers();
        });

        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('should close even if the dialog is not dismissible', async () => {
        const { rerender, toJSON } = await render(
          <Modal testID="modal" visible dismissable={false}>
            {null}
          </Modal>
        );

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });
        expect(toJSON()).toMatchSnapshot();

        await rerender(
          <Modal testID="modal" visible={false} dismissable={false}>
            {null}
          </Modal>
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

  describe('when visible prop changes again during the open/close animation', () => {
    describe('while closing, back to true (visible)', () => {
      it('should keep the modal open', async () => {
        const { rerender, toJSON } = await render(
          <Modal testID="modal" visible>
            {null}
          </Modal>
        );

        expect(screen.getByLabelText('Close modal')).toHaveStyle({
          opacity: scrimAlpha,
        });
        expect(toJSON()).toMatchSnapshot();

        await rerender(
          <Modal testID="modal" visible={false}>
            {null}
          </Modal>
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
          <Modal testID="modal" visible>
            {null}
          </Modal>
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
          <Modal testID="modal" visible={false}>
            {null}
          </Modal>
        );

        expect(screen.queryByLabelText('Close modal')).not.toBeOnTheScreen();

        await rerender(
          <Modal testID="modal" visible>
            {null}
          </Modal>
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
          <Modal testID="modal" visible={false}>
            {null}
          </Modal>
        );

        await act(() => {
          jest.runAllTimers();
        });

        expect(screen.queryByLabelText('Close modal')).not.toBeOnTheScreen();
      });
    });
  });

  it('animated value changes correctly', async () => {
    const value = new Animated.Value(1);
    const { toJSON } = await render(
      <Modal
        visible={true}
        testID="modal"
        contentContainerStyle={[{ transform: [{ scale: value }] }]}
      >
        {null}
      </Modal>
    );
    expect(toJSON()).toMatchSnapshot();

    Animated.timing(value, {
      toValue: 1.5,
      useNativeDriver: false,
      duration: 200,
    }).start();

    await act(() => {
      jest.runAllTimers();
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
