import { BackHandler as RNBackHandler, Platform, Text } from 'react-native';
import type { BackHandlerStatic as RNBackHandlerStatic } from 'react-native';

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act } from '@testing-library/react-native';

import Modal from '../../components/Modal';
import Portal from '../../components/Portal/Portal';
import { render, screen } from '../../test-utils';
import { useOverlayDismiss } from '../useOverlayDismiss';

interface BackHandlerStatic extends RNBackHandlerStatic {
  mockPressBack(): void;
  exitApp: jest.Mock<() => void>;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const BackHandler = RNBackHandler as BackHandlerStatic;

const Probe = ({
  label,
  visible,
  dismissable = true,
  onDismiss,
}: {
  label: string;
  visible: boolean;
  dismissable?: boolean;
  onDismiss?: () => void;
}) => {
  useOverlayDismiss({ enabled: visible, dismissable, onDismiss });

  return visible ? <Text>{label}</Text> : null;
};

const pressBack = async () => {
  await act(() => {
    BackHandler.mockPressBack();
  });
};

describe('useOverlayDismiss', () => {
  beforeEach(() => {
    BackHandler.exitApp.mockClear();
  });

  describe('when the back button is pressed', () => {
    it('closes the overlay that opened last', async () => {
      const onDismissFirst = jest.fn();
      const onDismissSecond = jest.fn();

      const { rerender } = await render(
        <>
          <Probe label="first" visible onDismiss={onDismissFirst} />
          <Probe label="second" visible={false} onDismiss={onDismissSecond} />
        </>
      );

      await rerender(
        <>
          <Probe label="first" visible onDismiss={onDismissFirst} />
          <Probe label="second" visible onDismiss={onDismissSecond} />
        </>
      );

      await pressBack();

      expect(onDismissSecond).toHaveBeenCalledTimes(1);
      expect(onDismissFirst).not.toHaveBeenCalled();
    });

    it('closes one overlay per press instead of all of them at once', async () => {
      const onDismissFirst = jest.fn();
      const onDismissSecond = jest.fn();

      const { rerender } = await render(
        <>
          <Probe label="first" visible onDismiss={onDismissFirst} />
          <Probe label="second" visible onDismiss={onDismissSecond} />
        </>
      );

      await pressBack();

      expect(onDismissSecond).toHaveBeenCalledTimes(1);
      expect(onDismissFirst).not.toHaveBeenCalled();

      await rerender(
        <>
          <Probe label="first" visible onDismiss={onDismissFirst} />
          <Probe label="second" visible={false} onDismiss={onDismissSecond} />
        </>
      );

      await pressBack();

      expect(onDismissFirst).toHaveBeenCalledTimes(1);
      expect(onDismissSecond).toHaveBeenCalledTimes(1);
    });

    it('gives the press back to the overlay underneath when the one above unmounts', async () => {
      const onDismissFirst = jest.fn();
      const onDismissSecond = jest.fn();

      const { rerender } = await render(
        <>
          <Probe label="first" visible onDismiss={onDismissFirst} />
          <Probe label="second" visible onDismiss={onDismissSecond} />
        </>
      );

      await rerender(
        <Probe label="first" visible onDismiss={onDismissFirst} />
      );

      await pressBack();

      expect(onDismissFirst).toHaveBeenCalledTimes(1);
      expect(onDismissSecond).not.toHaveBeenCalled();
    });

    it('leaves the press alone for an overlay that is mounted but closed', async () => {
      const onDismiss = jest.fn();

      await render(
        <Probe label="closed" visible={false} onDismiss={onDismiss} />
      );

      await pressBack();

      expect(onDismiss).not.toHaveBeenCalled();
      expect(BackHandler.exitApp).toHaveBeenCalledTimes(1);
    });

    it('absorbs the press without closing anything when the overlay may not be dismissed', async () => {
      const onDismissFirst = jest.fn();
      const onDismissBlocking = jest.fn();

      await render(
        <>
          <Probe label="first" visible onDismiss={onDismissFirst} />
          <Probe
            label="blocking"
            visible
            dismissable={false}
            onDismiss={onDismissBlocking}
          />
        </>
      );

      await pressBack();

      expect(onDismissBlocking).not.toHaveBeenCalled();
      // Neither the overlay underneath nor the screen behind it: an overlay
      // the user may not dismiss still keeps the back button from leaving.
      expect(onDismissFirst).not.toHaveBeenCalled();
      expect(BackHandler.exitApp).not.toHaveBeenCalled();
    });

    it('takes the press from a modal once something else opens over it', async () => {
      const onDismissModal = jest.fn();
      const onDismissProbe = jest.fn();

      const Overlays = ({ probeVisible }: { probeVisible: boolean }) => (
        <Portal.Host>
          <Modal visible onDismiss={onDismissModal}>
            <Text>modal</Text>
          </Modal>
          <Probe
            label="probe"
            visible={probeVisible}
            onDismiss={onDismissProbe}
          />
        </Portal.Host>
      );

      const { rerender } = await render(<Overlays probeVisible={false} />);

      await act(() => {
        jest.runAllTimers();
      });

      await rerender(<Overlays probeVisible />);

      // An open modal hides its siblings from assistive technology, so the
      // probe is on screen but not reachable by an accessibility query.
      expect(
        screen.getByText('probe', { includeHiddenElements: true })
      ).toBeOnTheScreen();

      await pressBack();

      expect(onDismissProbe).toHaveBeenCalledTimes(1);
      expect(onDismissModal).not.toHaveBeenCalled();
    });
  });

  describe('when the Escape key is pressed on the web', () => {
    let platform: { restore(): void };
    let keyDownListeners = new Set<(event: unknown) => void>();

    beforeAll(() => {
      platform = jest.replaceProperty(Platform, 'OS', 'web');

      // There is no DOM under the React Native preset, and the hook only
      // reaches for one on the web, so the test supplies what it touches.
      Object.defineProperty(global, 'document', {
        configurable: true,
        value: {
          addEventListener: (
            type: string,
            listener: (event: unknown) => void,
            capture?: boolean
          ) => {
            if (type === 'keydown' && capture === true) {
              keyDownListeners.add(listener);
            }
          },
          removeEventListener: (
            _type: string,
            listener: (event: unknown) => void
          ) => {
            keyDownListeners.delete(listener);
          },
        },
      });
    });

    afterAll(() => {
      platform.restore();
      delete (global as { document?: unknown }).document;
    });

    beforeEach(() => {
      keyDownListeners = new Set();
    });

    const pressEscape = async ({ defaultPrevented = false } = {}) => {
      const event = {
        key: 'Escape',
        defaultPrevented,
        preventDefault: jest.fn(),
        stopImmediatePropagation: jest.fn(),
      };

      await act(() => {
        keyDownListeners.forEach((listener) => listener(event));
      });

      return event;
    };

    it('closes the overlay that opened last', async () => {
      const onDismissFirst = jest.fn();
      const onDismissSecond = jest.fn();

      await render(
        <>
          <Probe label="first" visible onDismiss={onDismissFirst} />
          <Probe label="second" visible onDismiss={onDismissSecond} />
        </>
      );

      const event = await pressEscape();

      expect(onDismissSecond).toHaveBeenCalledTimes(1);
      expect(onDismissFirst).not.toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(1);
    });

    it('absorbs the key without closing anything when the overlay may not be dismissed', async () => {
      const onDismiss = jest.fn();

      await render(
        <Probe
          label="blocking"
          visible
          dismissable={false}
          onDismiss={onDismiss}
        />
      );

      const event = await pressEscape();

      expect(onDismiss).not.toHaveBeenCalled();
      expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(1);
    });

    it('stays out of the way once something nearer the key press handled it', async () => {
      const onDismiss = jest.fn();

      await render(<Probe label="only" visible onDismiss={onDismiss} />);

      const event = await pressEscape({ defaultPrevented: true });

      expect(onDismiss).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});
