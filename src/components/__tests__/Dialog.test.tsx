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

  it('should apply top margin to the first child if the dialog is V3', async () => {
    await render(
      <Dialog visible={true}>
        <Dialog.Title testID="dialog-content">
          <Text>Test Dialog Content</Text>
        </Dialog.Title>
      </Dialog>
    );

    expect(screen.getByTestId('dialog-content')).toHaveStyle({
      marginTop: 24,
    });
  });
});

describe('Dialog declarative API', () => {
  it('should render title and string content passed via props', async () => {
    await render(
      <Dialog
        visible
        testID="dialog"
        title="Delete item"
        content="Are you sure?"
      />
    );

    expect(screen.getByText('Delete item')).toBeOnTheScreen();
    expect(screen.getByText('Are you sure?')).toBeOnTheScreen();
  });

  it('should render action buttons passed via the actions prop', async () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    await render(
      <Dialog
        visible
        testID="dialog"
        title="Delete item"
        actions={[
          { label: 'Cancel', onPress: onCancel, testID: 'action-cancel' },
          { label: 'Delete', onPress: onConfirm, testID: 'action-delete' },
        ]}
      />
    );

    expect(screen.getByTestId('action-cancel')).toBeOnTheScreen();
    expect(screen.getByTestId('action-delete')).toBeOnTheScreen();

    await userEvent.press(screen.getByTestId('action-delete'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(0);
  });

  it('should accept a React node as content', async () => {
    await render(
      <Dialog visible testID="dialog" title="Title">
        <Dialog.Content>
          <Text testID="custom-content">Custom node</Text>
        </Dialog.Content>
      </Dialog>
    );

    expect(screen.getByTestId('custom-content')).toBeOnTheScreen();
  });

  it('should prefer children over declarative props and warn in dev', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await render(
      <Dialog visible testID="dialog" title="From prop">
        <Text testID="from-children">From children</Text>
      </Dialog>
    );

    expect(screen.getByTestId('dialog')).toHaveTextContent('From children');
    expect(screen.getByTestId('dialog')).not.toHaveTextContent('From prop');
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
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
      paddingBottom: 24,
      paddingHorizontal: 24,
    });
    expect(dialogActionButtons[0]).toHaveStyle({ marginRight: 8 });
    expect(dialogActionButtons[1]).toHaveStyle({ marginRight: 0 });
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
