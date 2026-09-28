import { BackHandler as RNBackHandler, Text } from 'react-native';
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
import { act, fireEvent, userEvent } from '@testing-library/react-native';

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

  beforeEach(() => {
    BackHandler.exitApp.mockClear();
  });

  it('renders passed children', async () => {
    await render(
      <Portal.Host>
        <Modal visible testID="modal" overlayTestID="backdrop">
          <Text>Children</Text>
        </Modal>
      </Portal.Host>
    );

    expect(screen.getByTestId('modal')).toHaveTextContent('Children');
  });

  it("renders a backdrop in default theme's color", async () => {
    await render(
      <Portal.Host>
        <Modal visible testID="modal" overlayTestID="backdrop">
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      backgroundColor: LightTheme.colors.scrim,
    });
  });

  it('renders a custom backdrop color if specified', async () => {
    await render(
      <Portal.Host>
        <Modal
          visible
          testID="modal"
          overlayTestID="backdrop"
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

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      backgroundColor: 'transparent',
    });
  });

  it('receives appropriate top and bottom insets', async () => {
    const { toJSON } = await render(
      <Portal.Host>
        <Modal visible testID="modal" overlayTestID="backdrop">
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('exposes the modal as a dialog with an accessible name', async () => {
    await render(
      <Portal.Host>
        <Modal visible aria-label="Example modal">
          <Text>Modal content</Text>
        </Modal>
      </Portal.Host>
    );

    // Role queries only match accessibility elements, and the dialog
    // container must not be one or it would swallow its children on iOS.
    expect(screen.getByLabelText('Example modal')).toHaveProp('role', 'dialog');
  });

  it('hides the backdrop from assistive technology', async () => {
    await render(
      <Portal.Host>
        <Modal visible testID="modal" overlayTestID="backdrop">
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(screen.queryByTestId('backdrop')).not.toBeOnTheScreen();
    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toBeOnTheScreen();
  });

  it('invokes onDismiss immediately when the backdrop is pressed', async () => {
    const onDismiss = jest.fn();

    const { toJSON } = await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible
          onDismiss={onDismiss}
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(onDismiss).not.toHaveBeenCalled();

    await userEvent.press(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    );

    expect(onDismiss).toHaveBeenCalled();

    expect(toJSON()).toMatchSnapshot();

    await act(() => {
      jest.runAllTimers();
    });

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });

    expect(toJSON()).toMatchSnapshot();

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('runs the closing animation when visible changes to false after dismissing', async () => {
    const { rerender, toJSON } = await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible
          onDismiss={() => {}}
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(toJSON()).toMatchSnapshot();

    await userEvent.press(screen.getByRole('button', { name: 'Close modal' }));

    await rerender(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible={false}
          onDismiss={() => {}}
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(toJSON()).toMatchSnapshot();

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });

    expect(toJSON()).toMatchSnapshot();

    await act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();
  });

  it('invokes onDismiss when the visually hidden dismiss button is pressed', async () => {
    const onDismiss = jest.fn();

    await render(
      <Portal.Host>
        <Modal
          visible
          onDismiss={onDismiss}
          dismissAccessibilityLabel="Dismiss dialog"
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    await userEvent.press(
      screen.getByRole('button', { name: 'Dismiss dialog' })
    );

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('invokes onDismiss on the accessibility escape gesture', async () => {
    const onDismiss = jest.fn();

    await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible
          onDismiss={onDismiss}
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    await fireEvent(screen.getByTestId('modal'), 'accessibilityEscape');

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('invokes onDismiss when the Android back button is pressed', async () => {
    const onDismiss = jest.fn();

    const { toJSON } = await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible
          onDismiss={onDismiss}
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

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });

    expect(toJSON()).toMatchSnapshot();

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not invoke onDismiss on Android back button press when dismissableBackButton is false', async () => {
    const onDismiss = jest.fn();

    await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible
          onDismiss={onDismiss}
          dismissableBackButton={false}
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    await act(() => {
      BackHandler.mockPressBack();
      jest.runAllTimers();
    });

    expect(onDismiss).not.toHaveBeenCalled();

    await userEvent.press(screen.getByRole('button', { name: 'Close modal' }));

    await act(() => {
      jest.runAllTimers();
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render the visually hidden dismiss button for a non-dismissible modal', async () => {
    await render(
      <Portal.Host>
        <Modal visible dismissable={false} onDismiss={() => {}}>
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(
      screen.queryByRole('button', { name: 'Close modal' })
    ).not.toBeOnTheScreen();
  });

  it('keeps a non-dismissible modal visible when the backdrop is pressed', async () => {
    const { toJSON } = await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible
          onDismiss={() => {}}
          dismissable={false}
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(toJSON()).toMatchSnapshot();

    await userEvent.press(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    );

    expect(toJSON()).toMatchSnapshot();

    await act(() => {
      jest.runAllTimers();
    });

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });

    expect(toJSON()).toMatchSnapshot();
  });

  it('does not invoke onDismiss for a non-dismissible modal when the backdrop is pressed', async () => {
    const onDismiss = jest.fn();

    await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible
          onDismiss={onDismiss}
          dismissable={false}
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(onDismiss).not.toHaveBeenCalled();

    await userEvent.press(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    );

    expect(onDismiss).not.toHaveBeenCalled();

    await act(() => {
      jest.runAllTimers();
    });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('keeps a non-dismissible modal on screen on the accessibility escape gesture', async () => {
    const onDismiss = jest.fn();

    await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible
          onDismiss={onDismiss}
          dismissable={false}
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    await fireEvent(screen.getByTestId('modal'), 'accessibilityEscape');

    expect(onDismiss).not.toHaveBeenCalled();
    expect(screen.getByTestId('modal')).toBeOnTheScreen();
  });

  it('keeps a non-dismissible modal visible when the Android back button is pressed', async () => {
    const { toJSON } = await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
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

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });

    expect(toJSON()).toMatchSnapshot();
  });

  it('does not invoke onDismiss for a non-dismissible modal when the Android back button is pressed', async () => {
    const onDismiss = jest.fn();

    await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
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

  it('absorbs the Android back button for a non-dismissible modal', async () => {
    await render(
      <Portal.Host>
        <Modal visible dismissable={false}>
          {null}
        </Modal>
      </Portal.Host>
    );

    await act(() => {
      BackHandler.mockPressBack();
    });

    expect(BackHandler.exitApp).not.toHaveBeenCalled();
  });

  it('runs the fade-in animation when visible changes from false to true', async () => {
    const { rerender, toJSON } = await render(
      <Portal.Host>
        <Modal testID="modal" overlayTestID="backdrop" visible={false}>
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();

    await rerender(
      <Portal.Host>
        <Modal testID="modal" overlayTestID="backdrop" visible>
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: 0,
    });
    expect(toJSON()).toMatchSnapshot();

    await act(() => {
      jest.runAllTimers();
    });

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });
    expect(toJSON()).toMatchSnapshot();
  });

  it('runs the fade-out animation when visible changes from true to false', async () => {
    const { rerender, toJSON } = await render(
      <Portal.Host>
        <Modal testID="modal" overlayTestID="backdrop" visible>
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });
    expect(toJSON()).toMatchSnapshot();

    await rerender(
      <Portal.Host>
        <Modal testID="modal" overlayTestID="backdrop" visible={false}>
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });
    expect(toJSON()).toMatchSnapshot();

    await act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();
  });

  it('does not invoke onDismiss when visible changes from true to false', async () => {
    const onDismiss = jest.fn();

    const { rerender } = await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible
          onDismiss={onDismiss}
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(onDismiss).not.toHaveBeenCalled();

    await rerender(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible={false}
          onDismiss={onDismiss}
        >
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

  it('closes a non-dismissible modal when visible changes from true to false', async () => {
    const { rerender, toJSON } = await render(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible
          dismissable={false}
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });
    expect(toJSON()).toMatchSnapshot();

    await rerender(
      <Portal.Host>
        <Modal
          testID="modal"
          overlayTestID="backdrop"
          visible={false}
          dismissable={false}
        >
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });
    expect(toJSON()).toMatchSnapshot();

    await act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();
  });

  it('keeps the modal open when visible changes back to true while closing', async () => {
    const { rerender, toJSON } = await render(
      <Portal.Host>
        <Modal testID="modal" overlayTestID="backdrop" visible>
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });
    expect(toJSON()).toMatchSnapshot();

    await rerender(
      <Portal.Host>
        <Modal testID="modal" overlayTestID="backdrop" visible={false}>
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
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
        <Modal testID="modal" overlayTestID="backdrop" visible>
          {null}
        </Modal>
      </Portal.Host>
    );

    await act(() => {
      jest.runAllTimers();
    });

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: scrimAlpha,
    });
    expect(toJSON()).toMatchSnapshot();
  });

  it('keeps the modal closed when visible changes back to false while opening', async () => {
    const { rerender, toJSON } = await render(
      <Portal.Host>
        <Modal testID="modal" overlayTestID="backdrop" visible={false}>
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();

    await rerender(
      <Portal.Host>
        <Modal testID="modal" overlayTestID="backdrop" visible>
          {null}
        </Modal>
      </Portal.Host>
    );

    expect(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    ).toHaveStyle({
      opacity: 0,
    });
    expect(toJSON()).toMatchSnapshot();

    await act(() => {
      // Not a real seconds, this depends on how frequently
      // requestAnimationFrame is called
      jest.advanceTimersToNextTimer(1000);
    });

    expect(screen.getByTestId('modal')).toBeOnTheScreen();

    await rerender(
      <Portal.Host>
        <Modal testID="modal" overlayTestID="backdrop" visible={false}>
          {null}
        </Modal>
      </Portal.Host>
    );

    await act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByTestId('modal')).not.toBeOnTheScreen();
  });
});
