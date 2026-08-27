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

interface BackHandlerStatic extends RNBackHandlerStatic {
  mockPressBack(): void;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const BackHandler = RNBackHandler as BackHandlerStatic;

describe('Dialog', () => {
  it('should render passed content', async () => {
    await render(
      <Dialog visible testID="dialog" content="This is simple dialog" />
    );

    expect(screen.getByTestId('dialog')).toHaveTextContent(
      'This is simple dialog'
    );
  });

  it('should call onDismiss when dismissable', async () => {
    const onDismiss = jest.fn();
    await render(
      <Dialog
        visible
        onDismiss={onDismiss}
        dismissable
        testID="dialog"
        content="This is simple dialog"
      />
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
      <Dialog
        visible
        onDismiss={onDismiss}
        dismissable={false}
        testID="dialog"
        content="This is simple dialog"
      />
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
        content="This is simple dialog"
      />
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
      <Dialog
        visible
        title={<Text testID="dialog-title">This is simple dialog</Text>}
        content="This is simple dialog"
      />
    );

    const element = screen.getByTestId('dialog-title').parent;

    expect(element).toHaveStyle({
      marginTop: 24,
    });
  });

  it('should render content in a scroll area', async () => {
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
        content="This is simple dialog"
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
  it('should render passed actions', async () => {
    await render(
      <Dialog
        visible
        testID="dialog"
        content="This is simple dialog"
        actions={[
          { testID: 'button-cancel', label: 'Cancel' },
          { testID: 'button-ok', label: 'Ok' },
        ]}
      />
    );

    expect(screen.getByTestId('button-cancel')).toBeOnTheScreen();
    expect(screen.getByTestId('button-ok')).toBeOnTheScreen();
  });

  it('should apply default styles', async () => {
    await render(
      <Dialog
        visible
        testID="dialog"
        content="This is simple dialog"
        actions={[
          { testID: 'button-cancel', label: 'Cancel' },
          { testID: 'button-ok', label: 'Ok' },
        ]}
      />
    );

    const buttonCancelParent = screen.getByTestId('button-cancel').parent;
    const buttonOkParent = screen.getByTestId('button-ok').parent;

    expect(buttonCancelParent).toHaveStyle({ marginRight: 8 });
    expect(buttonOkParent).toHaveStyle({ marginRight: 0 });
  });

  it('should apply custom styles', async () => {
    await render(
      <Dialog
        visible
        testID="dialog"
        content="This is simple dialog"
        actions={[
          { testID: 'button-cancel', label: 'Cancel', style: styles.spacing },
          { testID: 'button-ok', label: 'Ok', style: styles.noSpacing },
        ]}
      />
    );

    const buttonCancel = screen.getByTestId('button-cancel').parent;
    const buttonOk = screen.getByTestId('button-ok').parent;

    expect(buttonCancel).toHaveStyle({ marginRight: 8 });
    expect(buttonOk).toHaveStyle({ marginRight: 0 });
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
