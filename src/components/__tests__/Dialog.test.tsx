import type { ComponentProps } from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  BackHandler as RNBackHandler,
} from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, userEvent } from '@testing-library/react-native';

import Dialog from '../../components/Dialog/Dialog';
import { render, screen } from '../../test-utils';
import Button from '../Button/Button';
import Portal from '../Portal/Portal';

type BackHandlerStatic = typeof RNBackHandler & {
  mockPressBack(): void;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const BackHandler = RNBackHandler as BackHandlerStatic;

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Dialog', () => {
  it('should render passed content', async () => {
    await render(
      <Portal.Host>
        <Dialog visible testID="dialog" content="This is simple dialog" />
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
        <Dialog
          visible
          onDismiss={onDismiss}
          dismissable
          content="This is simple dialog"
        />
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
          content="This is simple dialog"
        />
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
          content="This is simple dialog"
        />
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
        <Dialog
          visible
          title={<Text testID="dialog-title">This is simple dialog</Text>}
          content="This is simple dialog"
        />
      </Portal.Host>
    );

    const element = screen.getByTestId('dialog-title').parent;

    expect(element).toHaveStyle({
      marginTop: 24,
    });
  });

  it('adds a top padding to an icon-first dialog', async () => {
    await render(
      <Portal.Host>
        <Dialog
          visible
          icon={() => <Text testID="dialog-icon">Icon</Text>}
          title="Alert"
          content="This is simple dialog"
        />
      </Portal.Host>
    );

    const element = screen.getByTestId('dialog-icon').parent;

    expect(element).toHaveStyle({ paddingTop: 24 });
  });

  it('should keep the bottom padding on a content-first dialog', async () => {
    await render(
      <Portal.Host>
        <Dialog
          visible
          content={<Text>Test Dialog Content</Text>}
          contentProps={{ testID: 'dialog-content' }}
        />
      </Portal.Host>
    );

    expect(screen.getByTestId('dialog-content')).toHaveStyle({
      paddingBottom: 24,
    });
  });

  it('uses the title as the accessible name on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    await render(
      <Portal.Host>
        <Dialog visible title="Alert" content="This is simple dialog" />
      </Portal.Host>
    );

    expect(screen.getByLabelText('Alert')).toHaveProp('role', 'dialog');
  });

  it('uses aria-label over the title as the accessible name', async () => {
    await render(
      <Portal.Host>
        <Dialog
          visible
          aria-label="Confirm deletion"
          title="Alert"
          content="This is simple dialog"
        />
      </Portal.Host>
    );

    expect(screen.getByLabelText('Confirm deletion')).toHaveProp(
      'role',
      'dialog'
    );
    expect(screen.queryByLabelText('Alert')).not.toBeOnTheScreen();
  });

  it('labels the dialog by a non-string title on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    await render(
      <Portal.Host>
        <Dialog
          visible
          title={<Text>Custom title</Text>}
          content="This is simple dialog"
        />
      </Portal.Host>
    );

    // No `aria-label` fallback exists for a node title, so the name can only
    // come from `aria-labelledby` pointing at the rendered title.
    expect(screen.getByLabelText('Custom title')).toHaveProp('role', 'dialog');
  });

  it('prefers an explicit aria-labelledby over the title on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    await render(
      <Portal.Host>
        <Text nativeID="external-heading">External heading</Text>
        <Dialog
          visible
          aria-labelledby="external-heading"
          title={<Text>Custom title</Text>}
          content="This is simple dialog"
        />
      </Portal.Host>
    );

    expect(screen.getByLabelText('External heading')).toHaveProp(
      'role',
      'dialog'
    );
    expect(screen.queryByLabelText('Custom title')).not.toBeOnTheScreen();
  });

  it('prefers aria-label over the title when both are set on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    await render(
      <Portal.Host>
        <Dialog
          visible
          aria-label="Confirm deletion"
          title={<Text>Custom title</Text>}
          content="This is simple dialog"
        />
      </Portal.Host>
    );

    expect(screen.getByLabelText('Confirm deletion')).toHaveProp(
      'role',
      'dialog'
    );
    expect(screen.queryByLabelText('Custom title')).not.toBeOnTheScreen();
  });

  it('prefers an explicit aria-labelledby over a string title on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    await render(
      <Portal.Host>
        <Text nativeID="external-heading">External heading</Text>
        <Dialog
          visible
          aria-labelledby="external-heading"
          title="Alert"
          content="This is simple dialog"
        />
      </Portal.Host>
    );

    expect(screen.getByLabelText('External heading')).toHaveProp(
      'role',
      'dialog'
    );
  });

  it('ignores aria-labelledby and uses a string title on native', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    await render(
      <Portal.Host>
        <Dialog
          visible
          aria-labelledby="external-heading"
          title="Alert"
          content="This is simple dialog"
        />
      </Portal.Host>
    );

    expect(screen.getByLabelText('Alert')).toHaveProp('role', 'dialog');
  });

  it('prefers aria-labelledby over aria-label on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    await render(
      <Portal.Host>
        <Text nativeID="external-heading">External heading</Text>
        <Dialog
          visible
          aria-label="Confirm deletion"
          aria-labelledby="external-heading"
          title="Alert"
          content="This is simple dialog"
        />
      </Portal.Host>
    );

    expect(screen.getByLabelText('External heading')).toHaveProp(
      'role',
      'dialog'
    );
  });

  it('ignores aria-labelledby and uses aria-label on native', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    await render(
      <Portal.Host>
        <Dialog
          visible
          aria-label="Confirm deletion"
          aria-labelledby="external-heading"
          title="Alert"
          content="This is simple dialog"
        />
      </Portal.Host>
    );

    expect(screen.getByLabelText('Confirm deletion')).toHaveProp(
      'role',
      'dialog'
    );
    expect(screen.queryByLabelText('Alert')).not.toBeOnTheScreen();
  });

  it('uses the title as aria-label on native', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    await render(
      <Portal.Host>
        <Dialog visible title="Alert" content="This is simple dialog" />
      </Portal.Host>
    );

    expect(screen.getByLabelText('Alert')).toHaveProp('role', 'dialog');
  });

  it('should render a content', async () => {
    await render(
      <Portal.Host>
        <Dialog
          visible
          content="Content"
          actions={[
            <Button key="ok" onPress={jest.fn()}>
              Ok
            </Button>,
          ]}
        />
      </Portal.Host>
    );

    expect(screen.getByText('Content')).toBeOnTheScreen();
  });

  it('should render string content in a scroll area', async () => {
    await render(
      <Portal.Host>
        <Dialog
          visible
          content="Scrollable content"
          scrollable
          scrollAreaProps={{ testID: 'dialog-scroll-area' }}
          scrollViewProps={{ testID: 'dialog-scroll-view' }}
        />
      </Portal.Host>
    );

    expect(screen.getByTestId('dialog-scroll-area')).toBeOnTheScreen();
    expect(screen.getByTestId('dialog-scroll-view')).toBeOnTheScreen();
    expect(screen.getByText('Scrollable content')).toBeOnTheScreen();
  });

  it('should render passed action', async () => {
    await render(
      <Portal.Host>
        <Dialog
          visible
          content="This is simple dialog"
          actions={[
            <Button key="cancel" onPress={() => jest.fn()} testID="cancel-btn">
              Cancel
            </Button>,
          ]}
        />
      </Portal.Host>
    );

    expect(screen.getByTestId('cancel-btn')).toBeOnTheScreen();
  });
});

describe('DialogActions', () => {
  it('should render passed actions', async () => {
    await render(
      <Portal.Host>
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
      </Portal.Host>
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
