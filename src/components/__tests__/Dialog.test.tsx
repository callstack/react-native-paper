import type { ComponentProps } from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  BackHandler as RNBackHandler,
} from 'react-native';
import type { BackHandlerStatic as RNBackHandlerStatic } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, userEvent } from '@testing-library/react-native';

import Dialog from '../../components/Dialog/Dialog';
import { render, screen } from '../../test-utils';
import Button from '../Button/Button';
import Portal from '../Portal/Portal';

interface BackHandlerStatic extends RNBackHandlerStatic {
  mockPressBack(): void;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const BackHandler = RNBackHandler as BackHandlerStatic;

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

  it('invokes onDismiss on Android back button press when only dismissableBackButton is true', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    const onDismiss = jest.fn();

    await render(
      <Portal.Host>
        <Dialog
          visible
          onDismiss={onDismiss}
          dismissable={false}
          overlayTestID="backdrop"
          dismissableBackButton
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

    await act(() => {
      BackHandler.mockPressBack();
      jest.runAllTimers();
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not add a top margin to a title-first dialog', async () => {
    await render(
      <Portal.Host>
        <Dialog visible>
          <Dialog.Title testID="dialog-title">
            <Text>Test Dialog Content</Text>
          </Dialog.Title>
        </Dialog>
      </Portal.Host>
    );

    expect(screen.getByTestId('dialog-title')).toHaveStyle({
      marginTop: 0,
    });
  });

  it('should keep the bottom padding on a content-first dialog', async () => {
    await render(
      <Portal.Host>
        <Dialog visible>
          <Dialog.Content testID="dialog-content">
            <Text>Test Dialog Content</Text>
          </Dialog.Content>
        </Dialog>
      </Portal.Host>
    );

    expect(screen.getByTestId('dialog-content')).toHaveStyle({
      paddingBottom: 24,
    });
  });

  it('should not add a top padding to an icon-first dialog', async () => {
    await render(
      <Portal.Host>
        <Dialog visible>
          <Dialog.Icon icon="alert" testID="dialog-icon" />
        </Dialog>
      </Portal.Host>
    );

    expect(screen.getByTestId('dialog-icon')).toHaveStyle({
      paddingTop: 0,
    });
  });

  it('should preserve the icon-to-title spacing for an icon dialog', async () => {
    await render(
      <Portal.Host>
        <Dialog visible>
          <Dialog.Icon icon="alert" testID="dialog-icon" />
          <Dialog.Title testID="dialog-title">
            <Text>Test Dialog Content</Text>
          </Dialog.Title>
        </Dialog>
      </Portal.Host>
    );

    expect(screen.getByTestId('dialog-icon')).toHaveStyle({
      marginBottom: 16,
      paddingTop: 0,
    });
    expect(screen.getByTestId('dialog-title')).toHaveStyle({
      marginTop: 0,
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
        <Button testID="button-cancel">Cancel</Button>
        <Button testID="button-ok">Ok</Button>
      </Dialog.Actions>
    );

    const dialogActionsContainer = screen.getByTestId('dialog-actions');

    expect(dialogActionsContainer).toHaveStyle({
      paddingBottom: 24,
      paddingHorizontal: 24,
      columnGap: 8,
    });
  });

  it('does not inject button props into actions', async () => {
    const buttonProps = jest.fn();
    const ProbeButton = (props: ComponentProps<typeof Button>) => {
      buttonProps(props);

      return <Button {...props} />;
    };

    await render(
      <Dialog.Actions>
        <ProbeButton>Cancel</ProbeButton>
        <ProbeButton>Ok</ProbeButton>
      </Dialog.Actions>
    );

    const [cancelButtonProps] = buttonProps.mock.calls[0];
    const [okButtonProps] = buttonProps.mock.calls[1];

    expect(cancelButtonProps).not.toHaveProperty('compact');
    expect(cancelButtonProps).not.toHaveProperty('uppercase');
    expect(okButtonProps).not.toHaveProperty('compact');
    expect(okButtonProps).not.toHaveProperty('uppercase');
  });

  it('should not override custom button styles', async () => {
    const buttonProps = jest.fn();
    const ProbeButton = (props: ComponentProps<typeof Button>) => {
      buttonProps(props);

      return <Button {...props} />;
    };

    await render(
      <Dialog.Actions testID="dialog-actions">
        <ProbeButton style={styles.spacing}>Cancel</ProbeButton>
        <ProbeButton style={styles.noSpacing}>Ok</ProbeButton>
      </Dialog.Actions>
    );

    const [cancelButtonProps] = buttonProps.mock.calls[0];
    const [okButtonProps] = buttonProps.mock.calls[1];

    expect(cancelButtonProps).toHaveProperty('style', styles.spacing);
    expect(okButtonProps).toHaveProperty('style', styles.noSpacing);
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
