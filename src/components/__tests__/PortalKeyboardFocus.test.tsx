import { Platform } from 'react-native';

import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
import Button from '../Button/Button';
import Card from '../Card/Card';
import Chip from '../Chip/Chip';
import Dialog from '../Dialog/Dialog';
import Portal from '../Portal/Portal';

const noop = () => {};

const okAction = (
  <Button key="ok" mode="text" onPress={noop} testID="ok">
    OK
  </Button>
);

describe('on Android', () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    Platform.OS = 'android';
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it('takes the buttons behind an open dialog out of keyboard focus', async () => {
    await render(
      <Portal.Host>
        <Button onPress={noop} testID="behind">
          Behind
        </Button>
        <Dialog visible onDismiss={noop} title="Alert" actions={[okAction]} />
      </Portal.Host>
    );

    const behind = screen.getByTestId('behind', {
      includeHiddenElements: true,
    });

    // `accessible` makes a view keyboard focusable on Android, and
    // `focusable` lets Enter press it.
    expect(behind).toHaveProp('accessible', false);
    expect(behind).toHaveProp('focusable', false);
  });

  it("keeps the dialog's own buttons in keyboard focus", async () => {
    await render(
      <Portal.Host>
        <Button onPress={noop}>Behind</Button>
        <Dialog visible onDismiss={noop} title="Alert" actions={[okAction]} />
      </Portal.Host>
    );

    const ok = screen.getByTestId('ok');

    expect(ok).toHaveProp('accessible', true);
    expect(ok).toHaveProp('focusable', true);
  });

  it('covers Paper controls that render their own pressable', async () => {
    await render(
      <Portal.Host>
        <Chip onPress={noop} testID="chip">
          Chip
        </Chip>
        <Card onPress={noop} testID="card">
          <Card.Title title="Card" />
        </Card>
        <Dialog visible onDismiss={noop} title="Alert" />
      </Portal.Host>
    );

    for (const testID of ['chip', 'card']) {
      const control = screen.getByTestId(testID, {
        includeHiddenElements: true,
      });

      expect(control).toHaveProp('focusable', false);
    }
  });

  it('gives the buttons behind keyboard focus back once the dialog is gone', async () => {
    const { rerender } = await render(
      <Portal.Host>
        <Button onPress={noop} testID="behind">
          Behind
        </Button>
        <Dialog visible onDismiss={noop} title="Alert" actions={[okAction]} />
      </Portal.Host>
    );

    await rerender(
      <Portal.Host>
        <Button onPress={noop} testID="behind">
          Behind
        </Button>
      </Portal.Host>
    );

    const behind = screen.getByTestId('behind');

    expect(behind).toHaveProp('accessible', true);
    expect(behind).toHaveProp('focusable', true);
  });

  it('takes a dialog under another dialog out of keyboard focus', async () => {
    await render(
      <Portal.Host>
        <Dialog
          visible
          onDismiss={noop}
          title="Lower"
          actions={[
            <Button key="lower" onPress={noop} testID="lower">
              Lower
            </Button>,
          ]}
        />
        <Dialog
          visible
          onDismiss={noop}
          title="Upper"
          actions={[
            <Button key="upper" onPress={noop} testID="upper">
              Upper
            </Button>,
          ]}
        />
      </Portal.Host>
    );

    expect(
      screen.getByTestId('lower', { includeHiddenElements: true })
    ).toHaveProp('focusable', false);
    expect(screen.getByTestId('upper')).toHaveProp('focusable', true);
  });

  it('covers a Portal.Host nested in the content behind the dialog', async () => {
    await render(
      <Portal.Host>
        <Portal.Host>
          <Button onPress={noop} testID="nested">
            Nested
          </Button>
        </Portal.Host>
        <Dialog visible onDismiss={noop} title="Alert" />
      </Portal.Host>
    );

    expect(
      screen.getByTestId('nested', { includeHiddenElements: true })
    ).toHaveProp('focusable', false);
  });

  it('leaves the content behind a portal that is not a modal in keyboard focus', async () => {
    await render(
      <Portal.Host>
        <Button onPress={noop} testID="behind">
          Behind
        </Button>
        <Portal>
          <Button onPress={noop}>Menu item</Button>
        </Portal>
      </Portal.Host>
    );

    expect(screen.getByTestId('behind')).toHaveProp('focusable', true);
  });
});

it('leaves keyboard focus behind a dialog to the platform on iOS', async () => {
  const originalOS = Platform.OS;
  Platform.OS = 'ios';

  try {
    await render(
      <Portal.Host>
        <Button onPress={noop} testID="behind">
          Behind
        </Button>
        <Dialog visible onDismiss={noop} title="Alert" />
      </Portal.Host>
    );

    const behind = screen.getByTestId('behind', {
      includeHiddenElements: true,
    });

    expect(behind).toHaveProp('accessible', true);
    expect(behind).toHaveProp('focusable', true);
  } finally {
    Platform.OS = originalOS;
  }
});
