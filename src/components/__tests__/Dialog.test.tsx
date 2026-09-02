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
          <Button key="cancel" onPress={() => jest.fn()} testID="cancel-btn">
            Cancel
          </Button>,
        ]}
      />
    );

    expect(screen.getByTestId('cancel-btn')).toBeOnTheScreen();
  });

  it('should render passed content if no title or accessibilityLabel were passed', async () => {
    await render(
      <Dialog testID="dialog" visible content="This is simple dialog" />
    );

    expect(screen.getByTestId('dialog-surface')).toHaveAccessibleName(
      'This is simple dialog'
    );
  });

  it('should render passed title as a default accessibility label', async () => {
    await render(
      <Dialog
        testID="dialog"
        visible
        title="dialog-title"
        content="This is simple dialog"
      />
    );

    expect(screen.getByTestId('dialog-surface')).toHaveAccessibleName(
      'dialog-title'
    );
  });

  it('should render passed accessibility label', async () => {
    await render(
      <Dialog
        testID="dialog"
        visible
        content="This is simple dialog"
        aria-label="dialog-label"
      />
    );

    expect(screen.getByTestId('dialog-surface')).toHaveAccessibleName(
      'dialog-label'
    );
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
          <Button key="cancel" testID="button-cancel">
            Cancel
          </Button>,
          <Button key="ok" testID="button-ok">
            Ok
          </Button>,
        ]}
      />
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
    const dialogActionChildren = dialogActionsContainer.children;

    expect(dialogActionsContainer).toHaveStyle({
      paddingBottom: 24,
      paddingHorizontal: 24,
    });

    // We expect 3 children because Dialog.Actions puts <View style={{ width: 8 }} /> in between actions to add a proper styling
    expect(dialogActionChildren).toHaveLength(3);
    expect(dialogActionChildren[1]).toHaveStyle({ width: 8 });
  });

  it('should apply custom styles', async () => {
    await render(
      <Dialog.Actions testID="dialog-actions">
        <Button testID="button-cancel" style={styles.spacing}>
          Cancel
        </Button>
        <Button testID="button-ok" style={styles.noSpacing}>
          Ok
        </Button>
      </Dialog.Actions>
    );

    expect(screen.getByTestId('button-cancel-container')).toHaveStyle({
      margin: 10,
    });
    expect(screen.getByTestId('button-ok-container')).toHaveStyle({
      margin: 0,
    });
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
