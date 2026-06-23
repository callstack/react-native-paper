import {
  Text,
  StyleSheet,
  Platform,
  BackHandler as RNBackHandler,
} from 'react-native';
import type { BackHandlerStatic as RNBackHandlerStatic } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { act, userEvent } from '@testing-library/react-native';

import Dialog from '../../components/Dialog/Dialog';
import { render, screen } from '../../test-utils';
import Button from '../Button/Button';

interface BackHandlerStatic extends RNBackHandlerStatic {
  mockPressBack(): void;
}

const BackHandler = RNBackHandler as BackHandlerStatic;

describe('Dialog', () => {
  it('should render passed children', async () => {
    await render(
      <Dialog visible testID="dialog">
        <Text>This is simple dialog</Text>
      </Dialog>
    );

    expect(screen.getByTestId('dialog')).toHaveTextContent(
      'This is simple dialog'
    );
  });

  it('should call onDismiss when dismissable', async () => {
    const onDismiss = jest.fn();
    await render(
      <Dialog visible onDismiss={onDismiss} dismissable testID="dialog">
        <Text>This is simple dialog</Text>
      </Dialog>
    );

    await userEvent.press(screen.getByTestId('dialog-backdrop'));

    await act(() => {
      jest.runAllTimers();
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should not call onDismiss when dismissable is false', async () => {
    const onDismiss = jest.fn();
    await render(
      <Dialog visible onDismiss={onDismiss} dismissable={false} testID="dialog">
        <Text>This is simple dialog</Text>
      </Dialog>
    );

    await userEvent.press(screen.getByTestId('dialog-backdrop'));

    await act(() => {
      jest.runAllTimers();
    });
    expect(onDismiss).toHaveBeenCalledTimes(0);
  });

  it('should call onDismiss on Android back button when dismissable is false but dismissableBackButton is true', async () => {
    Platform.OS = 'android';
    const onDismiss = jest.fn();
    await render(
      <Dialog
        visible
        onDismiss={onDismiss}
        dismissable={false}
        dismissableBackButton
        testID="dialog"
      >
        <Text>This is simple dialog</Text>
      </Dialog>
    );

    await userEvent.press(screen.getByTestId('dialog-backdrop'));

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

  it('should apply top spacing to the dialog surface for a title-first dialog', async () => {
    await render(
      <Dialog visible={true} testID="dialog">
        <Dialog.Title testID="dialog-title">
          <Text>Test Dialog Content</Text>
        </Dialog.Title>
      </Dialog>
    );

    expect(screen.getByTestId('dialog-surface')).toHaveStyle({
      paddingTop: 24,
    });
    expect(screen.getByTestId('dialog-title')).toHaveStyle({
      marginTop: 0,
    });
  });

  it('should apply top spacing to the dialog surface for a content-first dialog', async () => {
    await render(
      <Dialog visible={true} testID="dialog">
        <Dialog.Content testID="dialog-content">
          <Text>Test Dialog Content</Text>
        </Dialog.Content>
      </Dialog>
    );

    expect(screen.getByTestId('dialog-surface')).toHaveStyle({
      paddingTop: 24,
    });
    expect(screen.getByTestId('dialog-content')).toHaveStyle({
      paddingBottom: 24,
    });
  });

  it('should apply top spacing to the dialog surface for an icon-first dialog', async () => {
    await render(
      <Dialog visible={true} testID="dialog">
        <Dialog.Icon icon="alert" testID="dialog-icon" />
      </Dialog>
    );

    expect(screen.getByTestId('dialog-surface')).toHaveStyle({
      paddingTop: 24,
    });
    expect(screen.getByTestId('dialog-icon')).toHaveStyle({
      paddingTop: 0,
    });
  });
});

describe('DialogActions', () => {
  it('should render passed children', async () => {
    await render(
      <Dialog.Actions>
        <Button testID="button-cancel">Cancel</Button>
        <Button testID="button-ok">Ok</Button>
      </Dialog.Actions>
    );

    expect(screen.getByTestId('button-cancel')).toBeOnTheScreen();
    expect(screen.getByTestId('button-ok')).toBeOnTheScreen();
  });

  it('should apply default styles', async () => {
    await render(
      <Dialog.Actions testID="dialog-actions">
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Dialog.Actions>
    );

    const dialogActionsContainer = screen.getByTestId('dialog-actions');
    const dialogActionButtons = dialogActionsContainer.children;

    expect(dialogActionsContainer).toHaveStyle({
      gap: 8,
      paddingBottom: 24,
      paddingHorizontal: 24,
    });
    expect(dialogActionButtons[0]).not.toHaveStyle({ marginRight: 8 });
    expect(dialogActionButtons[1]).not.toHaveStyle({ marginRight: 0 });
  });

  it('should not inject button props into actions', async () => {
    await render(
      <Dialog.Actions testID="dialog-actions">
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Dialog.Actions>
    );

    const dialogActionsContainer = screen.getByTestId('dialog-actions');
    const [cancelButton, okButton] = dialogActionsContainer.props.children;

    expect(cancelButton.props.compact).toBeUndefined();
    expect(cancelButton.props.uppercase).toBeUndefined();
    expect(okButton.props.compact).toBeUndefined();
    expect(okButton.props.uppercase).toBeUndefined();
  });

  it('should apply custom styles', async () => {
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
