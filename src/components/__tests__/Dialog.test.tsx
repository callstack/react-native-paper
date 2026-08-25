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

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
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

  it('should render a content', async () => {
    await render(
      <Dialog
        visible
        content="Content"
        actions={[{ onPress: jest.fn(), label: 'Ok' }]}
      />
    );

    expect(screen.getByText('Content')).toBeOnTheScreen();
  });

  it('should render string content in a scroll area', async () => {
    await render(
      <Dialog
        visible
        content="Scrollable content"
        scrollable
        scrollAreaProps={{ testID: 'dialog-scroll-area' }}
        scrollViewProps={{ testID: 'dialog-scroll-view' }}
        actions={[{ onPress: jest.fn(), label: 'Ok' }]}
      />
    );

    expect(screen.getByTestId('dialog-scroll-area')).toBeOnTheScreen();
    expect(screen.getByTestId('dialog-scroll-view')).toBeOnTheScreen();
    expect(screen.getByText('Scrollable content')).toBeOnTheScreen();
  });

  it('should render passed action', async () => {
    await render(
      <Dialog
        visible
        content="Content"
        actions={[
          {
            onPress: jest.fn(),
            label: 'Cancel',
            testID: 'cancel-btn',
          },
        ]}
      />
    );

    expect(screen.getByTestId('cancel-btn')).toBeOnTheScreen();
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
