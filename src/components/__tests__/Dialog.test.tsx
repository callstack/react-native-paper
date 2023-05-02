import React from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  BackHandler as RNBackHandler,
  BackHandlerStatic as RNBackHandlerStatic,
} from 'react-native';

import { act, fireEvent, render } from '@testing-library/react-native';

import Dialog from '../../components/Dialog/Dialog';
import Button from '../Button/Button';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 44, left: 0, right: 0, top: 37 }),
}));

jest.mock('react-native/Libraries/Utilities/BackHandler', () =>
  // eslint-disable-next-line jest/no-mocks-import
  require('react-native/Libraries/Utilities/__mocks__/BackHandler')
);

interface BackHandlerStatic extends RNBackHandlerStatic {
  mockPressBack(): void;
}

const BackHandler = RNBackHandler as BackHandlerStatic;

describe('Dialog', () => {
  it('should render passed children', () => {
    const { getByTestId } = render(
      <Dialog visible testID="dialog">
        <Text>This is simple dialog</Text>
      </Dialog>
    );

    expect(getByTestId('dialog')).toHaveTextContent('This is simple dialog');
  });

  it('should call onDismiss when dismissable', () => {
    const onDismiss = jest.fn();
    const { getByTestId } = render(
      <Dialog visible onDismiss={onDismiss} dismissable testID="dialog">
        <Text>This is simple dialog</Text>
      </Dialog>
    );

    fireEvent.press(getByTestId('dialog-backdrop'));

    act(() => {
      jest.runAllTimers();
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should not call onDismiss when dismissable is false', () => {
    const onDismiss = jest.fn();
    const { getByTestId } = render(
      <Dialog visible onDismiss={onDismiss} dismissable={false} testID="dialog">
        <Text>This is simple dialog</Text>
      </Dialog>
    );

    fireEvent.press(getByTestId('dialog-backdrop'));

    act(() => {
      jest.runAllTimers();
    });
    expect(onDismiss).toHaveBeenCalledTimes(0);
  });

  it('should call onDismiss on Android back button when dismissable is false but dismissableBackButton is true', () => {
    Platform.OS = 'android';
    const onDismiss = jest.fn();
    const { getByTestId } = render(
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

    fireEvent.press(getByTestId('dialog-backdrop'));

    act(() => {
      jest.runAllTimers();
    });
    expect(onDismiss).toHaveBeenCalledTimes(0);

    act(() => {
      BackHandler.mockPressBack();
      jest.runAllTimers();
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should apply top margin to the first child if the dialog is V3', () => {
    const { getByTestId } = render(
      <Dialog visible={true}>
        <Dialog.Title testID="dialog-content">
          <Text>Test Dialog Content</Text>
        </Dialog.Title>
      </Dialog>
    );

    expect(getByTestId('dialog-content')).toHaveStyle({
      marginTop: 24,
    });
  });
});

describe('DialogActions', () => {
  it('should render passed children', () => {
    const { getByTestId } = render(
      <Dialog.Actions>
        <Button testID="button-cancel">Cancel</Button>
        <Button testID="button-ok">Ok</Button>
      </Dialog.Actions>
    );

    expect(getByTestId('button-cancel')).toBeDefined();
    expect(getByTestId('button-ok')).toBeDefined();
  });

  it('should apply default styles', () => {
    const { getByTestId } = render(
      <Dialog.Actions testID="dialog-actions">
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Dialog.Actions>
    );

    const dialogActionsContainer = getByTestId('dialog-actions');
    const dialogActionButtons = dialogActionsContainer.children;

    expect(dialogActionsContainer).toHaveStyle({
      paddingBottom: 24,
      paddingHorizontal: 24,
    });
    expect(dialogActionButtons[0]).toHaveStyle({ marginRight: 8 });
    expect(dialogActionButtons[1]).toHaveStyle({ marginRight: 0 });
  });

  it('should apply custom styles', () => {
    const { getByTestId } = render(
      <Dialog.Actions testID="dialog-actions">
        <Button style={styles.spacing}>Cancel</Button>
        <Button style={styles.noSpacing}>Ok</Button>
      </Dialog.Actions>
    );

    const dialogActionsContainer = getByTestId('dialog-actions');
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
