import { StyleSheet, Text, View } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, userEvent } from '@testing-library/react-native';

import { render, screen } from '../../../test-utils';
import Portal from '../../Portal/Portal';
import Snackbar from '../../Snackbar/Snackbar';

const styles = StyleSheet.create({
  wrapper: { paddingBottom: 16 },
  message: { textAlign: 'center' },
  container: { margin: 12 },
});

const renderSnackbar = (
  props: Partial<React.ComponentProps<typeof Snackbar>> = {}
) =>
  render(
    <Portal.Host>
      <Snackbar
        visible
        onDismiss={jest.fn()}
        message="Snackbar content"
        // Keeps the auto-dismiss timer out of the way, so that tests asserting
        // on the rendered output don't dismiss the Snackbar on their own.
        duration={Infinity}
        {...props}
      />
    </Portal.Host>
  );

/**
 * Flushes the enter animation and the work scheduled from its callback, so that
 * assertions and snapshots run against the shown state.
 */
const settle = async () => {
  await act(() => {
    jest.runAllTimers();
  });
  await act(async () => {
    await Promise.resolve();
  });
};

describe('Snackbar', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  it('renders the message', async () => {
    await renderSnackbar();
    await settle();

    expect(screen.getByText('Snackbar content')).toBeOnTheScreen();
  });

  it('renders nothing while it is not visible', async () => {
    await renderSnackbar({ visible: false });

    expect(screen.queryByText('Snackbar content')).toBeNull();
  });

  it('renders a message with an action and a close icon button', async () => {
    const tree = (
      await renderSnackbar({
        action: { label: 'Undo', onPress: jest.fn() },
        onIconPress: jest.fn(),
        elevation: 3,
        wrapperStyle: styles.wrapper,
        messageStyle: styles.message,
        style: styles.container,
        testID: 'snackbar',
      })
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('dismisses itself when its action is pressed', async () => {
    const onPress = jest.fn();
    const onDismiss = jest.fn();

    await renderSnackbar({ onDismiss, action: { label: 'Undo', onPress } });
    await settle();

    await userEvent.press(screen.getByRole('button', { name: 'Undo' }));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('ignores a second press on the action after it was pressed once', async () => {
    const onPress = jest.fn();
    const onDismiss = jest.fn();

    const { rerender } = await renderSnackbar({
      onDismiss,
      action: { label: 'Undo', onPress },
    });
    await settle();

    await userEvent.press(screen.getByRole('button', { name: 'Undo' }));

    await rerender(
      <Portal.Host>
        <Snackbar
          visible={false}
          onDismiss={onDismiss}
          message="Snackbar content"
          duration={Infinity}
          action={{ label: 'Undo', onPress }}
        />
      </Portal.Host>
    );

    await userEvent.press(screen.getByRole('button', { name: 'Undo' }));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('exposes the accessibility label of the action', async () => {
    await renderSnackbar({
      action: {
        label: 'Undo',
        onPress: jest.fn(),
        accessibilityLabel: 'Undo changes',
      },
    });
    await settle();

    expect(
      screen.getByRole('button', { name: 'Undo changes' })
    ).toBeOnTheScreen();
  });

  it('falls back to the action label when it has no accessibility label', async () => {
    await renderSnackbar({ action: { label: 'Undo', onPress: jest.fn() } });
    await settle();

    expect(screen.getByRole('button', { name: 'Undo' })).toBeOnTheScreen();
  });

  it('renders a close icon button only when onIconPress is set', async () => {
    const { unmount } = await renderSnackbar();
    await settle();

    expect(screen.queryByRole('button', { name: 'Close icon' })).toBeNull();

    await unmount();

    await renderSnackbar({ onIconPress: jest.fn() });
    await settle();

    expect(
      screen.getByRole('button', { name: 'Close icon' })
    ).toBeOnTheScreen();
  });

  it('invokes onIconPress when the close icon button is pressed', async () => {
    const onIconPress = jest.fn();

    await renderSnackbar({ onIconPress });
    await settle();

    await userEvent.press(screen.getByRole('button', { name: 'Close icon' }));

    expect(onIconPress).toHaveBeenCalledTimes(1);
  });

  it('announces the message to assistive technology', async () => {
    await renderSnackbar({ testID: 'snackbar' });
    await settle();

    expect(screen.getByTestId('snackbar')).toHaveProp('aria-live', 'polite');
  });

  it('invokes onDismiss once the duration has elapsed', async () => {
    const onDismiss = jest.fn();

    await renderSnackbar({ onDismiss, duration: 1000 });

    expect(onDismiss).not.toHaveBeenCalled();

    await settle();

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss on its own when the duration is infinite', async () => {
    const onDismiss = jest.fn();

    await renderSnackbar({ onDismiss });
    await settle();

    expect(onDismiss).not.toHaveBeenCalled();
    expect(screen.getByText('Snackbar content')).toBeOnTheScreen();
  });

  it('removes itself from the tree after being dismissed', async () => {
    const { rerender } = await renderSnackbar();
    await settle();

    await rerender(
      <Portal.Host>
        <Snackbar
          visible={false}
          onDismiss={jest.fn()}
          message="Snackbar content"
          duration={Infinity}
        />
      </Portal.Host>
    );

    await settle();

    expect(screen.queryByText('Snackbar content')).toBeNull();
  });

  it('keeps itself mounted when visible turns true again during the exit animation', async () => {
    const onDismiss = jest.fn();
    const { rerender } = await renderSnackbar({
      onDismiss,
      duration: 1000,
      testID: 'snackbar',
    });
    await settle();

    expect(onDismiss).toHaveBeenCalledTimes(1);

    await rerender(
      <Portal.Host>
        <Snackbar
          visible={false}
          onDismiss={onDismiss}
          message="Snackbar content"
          duration={1000}
          testID="snackbar"
        />
      </Portal.Host>
    );

    await rerender(
      <Portal.Host>
        <Snackbar
          visible
          onDismiss={onDismiss}
          message="Snackbar content"
          duration={1000}
          testID="snackbar"
        />
      </Portal.Host>
    );

    expect(screen.getByTestId('snackbar')).toBeOnTheScreen();

    await settle();

    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it('renders next to its siblings when portal is false', async () => {
    await render(
      <View>
        <Text>Sibling</Text>
        <Snackbar
          visible
          portal={false}
          onDismiss={jest.fn()}
          message="Snackbar content"
          duration={Infinity}
          testID="snackbar"
        />
      </View>
    );
    await settle();

    expect(screen.getByText('Sibling')).toBeOnTheScreen();
    expect(screen.getByTestId('snackbar')).toBeOnTheScreen();
  });

  it('renders in the portal host above sibling content by default', async () => {
    await render(
      <Portal.Host>
        <Text>Sibling</Text>
        <Snackbar
          visible
          onDismiss={jest.fn()}
          message="Snackbar content"
          duration={Infinity}
          testID="snackbar"
        />
      </Portal.Host>
    );
    await settle();

    const tree = screen.toJSON();
    const serialized = JSON.stringify(tree);

    expect(serialized.indexOf('Sibling')).toBeLessThan(
      serialized.indexOf('Snackbar content')
    );
    expect(screen.getByTestId('snackbar')).toBeOnTheScreen();
  });

  it('stacks the action under a multiline message when the action is too wide', async () => {
    await renderSnackbar({
      message: 'Snackbar with longer message which does not fit in one line',
      action: { label: 'Toggle theme', onPress: jest.fn() },
      testID: 'snackbar',
    });
    await settle();

    await fireEvent(
      screen.getByText(/Snackbar with longer message/),
      'textLayout',
      {
        nativeEvent: {
          lines: [{ text: 'line 1' }, { text: 'line 2' }],
        },
      }
    );
    await fireEvent(screen.getByTestId('snackbar-actions'), 'layout', {
      nativeEvent: { layout: { width: 160, height: 40, x: 0, y: 0 } },
    });

    expect(screen.getByTestId('snackbar')).toHaveStyle({
      flexDirection: 'column',
    });
  });
});
