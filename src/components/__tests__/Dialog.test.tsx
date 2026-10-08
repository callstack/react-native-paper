import { Text, StyleSheet, Platform } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, userEvent } from '@testing-library/react-native';

import Dialog from '../../components/Dialog/Dialog';
import { render, screen } from '../../test-utils';
import Button from '../Button/Button';
import Portal from '../Portal/Portal';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Dialog', () => {
  it('renders passed children', async () => {
    await render(
      <Portal.Host>
        <Dialog visible testID="dialog">
          <Text>This is simple dialog</Text>
        </Dialog>
      </Portal.Host>
    );

    expect(screen.getByTestId('dialog')).toHaveTextContent(
      'This is simple dialog'
    );
  });

  it('invokes onDismiss when the visually hidden dismiss button is pressed', async () => {
    const onDismiss = jest.fn();

    await render(
      <Portal.Host>
        <Dialog visible onDismiss={onDismiss} dismissable>
          <Text>This is simple dialog</Text>
        </Dialog>
      </Portal.Host>
    );

    await userEvent.press(screen.getByRole('button', { name: 'Close modal' }));

    await act(() => {
      jest.runAllTimers();
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not invoke onDismiss for a non-dismissible dialog when the backdrop is pressed', async () => {
    const onDismiss = jest.fn();

    await render(
      <Portal.Host>
        <Dialog
          visible
          onDismiss={onDismiss}
          dismissable={false}
          overlayTestID="backdrop"
        >
          <Text>This is simple dialog</Text>
        </Dialog>
      </Portal.Host>
    );

    await userEvent.press(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    );

    await act(() => {
      jest.runAllTimers();
    });

    expect(onDismiss).toHaveBeenCalledTimes(0);
  });

  it("doesn't invoke onDismiss when the overlay is pressed and dismissableOverlay is false", async () => {
    const onDismiss = jest.fn();

    await render(
      <Portal.Host>
        <Dialog
          visible
          onDismiss={onDismiss}
          overlayTestID="backdrop"
          dismissableOverlay={false}
        >
          <Text>This is simple dialog</Text>
        </Dialog>
      </Portal.Host>
    );

    await userEvent.press(
      screen.getByTestId('backdrop', { includeHiddenElements: true })
    );

    await act(() => {
      jest.runAllTimers();
    });

    expect(onDismiss).toHaveBeenCalledTimes(0);
  });

  it('applies top margin to the first child', async () => {
    await render(
      <Portal.Host>
        <Dialog visible>
          <Dialog.Title testID="dialog-content">
            <Text>Test Dialog Content</Text>
          </Dialog.Title>
        </Dialog>
      </Portal.Host>
    );

    expect(screen.getByTestId('dialog-content')).toHaveStyle({
      marginTop: 24,
    });
  });

  it('uses the title as the accessible name on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    await render(
      <Portal.Host>
        <Dialog visible>
          <Dialog.Title>Alert</Dialog.Title>
          <Text>This is simple dialog</Text>
        </Dialog>
      </Portal.Host>
    );

    expect(screen.getByLabelText('Alert')).toHaveProp('role', 'dialog');
  });

  it('uses aria-label over the title as the accessible name', async () => {
    await render(
      <Portal.Host>
        <Dialog visible aria-label="Confirm deletion">
          <Dialog.Title>Alert</Dialog.Title>
        </Dialog>
      </Portal.Host>
    );

    expect(screen.getByLabelText('Confirm deletion')).toHaveProp(
      'role',
      'dialog'
    );
    expect(screen.queryByLabelText('Alert')).not.toBeOnTheScreen();
  });
});

describe('DialogActions', () => {
  it('renders passed children', async () => {
    await render(
      <Dialog.Actions>
        <Button testID="button-cancel">Cancel</Button>
        <Button testID="button-ok">Ok</Button>
      </Dialog.Actions>
    );

    expect(screen.getByTestId('button-cancel')).toBeOnTheScreen();
    expect(screen.getByTestId('button-ok')).toBeOnTheScreen();
  });

  it('applies default styles', async () => {
    await render(
      <Dialog.Actions testID="dialog-actions">
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Dialog.Actions>
    );

    const dialogActionsContainer = screen.getByTestId('dialog-actions');
    const dialogActionButtons = dialogActionsContainer.children;

    expect(dialogActionsContainer).toHaveStyle({
      paddingBottom: 24,
      paddingHorizontal: 24,
    });
    expect(dialogActionButtons[0]).toHaveStyle({ marginRight: 8 });
    expect(dialogActionButtons[1]).toHaveStyle({ marginRight: 0 });
  });

  it('applies custom styles', async () => {
    await render(
      <Dialog.Actions testID="dialog-actions">
        <Button style={styles.spacing}>Cancel</Button>
        <Button style={styles.noSpacing}>Ok</Button>
      </Dialog.Actions>
    );

    const dialogActionsContainer = screen.getByTestId('dialog-actions');
    const dialogActionButtons = dialogActionsContainer.children;

    expect(dialogActionButtons[0]).toHaveStyle({ margin: 10 });
    expect(dialogActionButtons[1]).toHaveStyle({ margin: 0 });
  });
});

const styles = StyleSheet.create({
  spacing: {
    margin: 10,
  },
  noSpacing: {
    margin: 0,
  },
});
