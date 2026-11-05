import { Text } from 'react-native';

import { expect, it, jest } from '@jest/globals';

import { LocaleProvider, useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import {
  ReduceMotionContext,
  useReduceMotion,
} from '../../theme/accessibility/ReduceMotionContext';
import Dialog from '../Dialog/Dialog';
import Modal from '../Modal';
import Portal from '../Portal/Portal';

jest.useRealTimers();

it('renders portal with siblings', async () => {
  const { toJSON } = await render(
    <Portal.Host>
      <Text>Outside content</Text>
      <Portal>
        <Text testID="content">Portal content</Text>
      </Portal>
    </Portal.Host>
  );

  await screen.findByTestId('content');

  expect(toJSON()).toMatchSnapshot();
});

it('portal content reflects theme, direction, and reduced motion changes', async () => {
  const PortalContent = () => {
    const theme = useInternalTheme(undefined);
    const { direction } = useLocale();
    const reduceMotion = useReduceMotion();

    return (
      <Text>{`${theme.animation.scale} ${direction} ${reduceMotion}`}</Text>
    );
  };

  const { rerender } = await render(
    <Portal.Host>
      <ReduceMotionContext.Provider value={true}>
        <LocaleProvider direction="rtl">
          <Portal theme={{ animation: { scale: 2 } }}>
            <PortalContent />
          </Portal>
        </LocaleProvider>
      </ReduceMotionContext.Provider>
    </Portal.Host>
  );

  expect(screen.getByText('2 rtl true')).toBeOnTheScreen();

  await rerender(
    <Portal.Host>
      <ReduceMotionContext.Provider value={false}>
        <LocaleProvider direction="ltr">
          <Portal theme={{ animation: { scale: 3 } }}>
            <PortalContent />
          </Portal>
        </LocaleProvider>
      </ReduceMotionContext.Provider>
    </Portal.Host>
  );

  expect(screen.getByText('3 ltr false')).toBeOnTheScreen();
  expect(screen.queryByText('2 rtl true')).not.toBeOnTheScreen();
});

it('renders portals in source order when mounted together', async () => {
  await render(
    <Portal.Host>
      <Portal>
        <Text testID="portal-content">first</Text>
      </Portal>
      <Portal>
        <Text testID="portal-content">second</Text>
      </Portal>
      <Portal>
        <Text testID="portal-content">third</Text>
      </Portal>
    </Portal.Host>
  );

  const portals = await screen.findAllByTestId('portal-content');

  expect(portals).toHaveLength(3);
  expect(portals[0]).toHaveTextContent('first');
  expect(portals[1]).toHaveTextContent('second');
  expect(portals[2]).toHaveTextContent('third');
});

it('keeps dialog content accessible above a modal when both are visible', async () => {
  await render(
    <Portal.Host>
      <Modal visible onDismiss={() => {}}>
        <Text>modal content</Text>
      </Modal>
      <Dialog visible onDismiss={() => {}}>
        <Text>dialog content</Text>
      </Dialog>
    </Portal.Host>
  );

  expect(screen.getByText('dialog content')).toBeVisible();
  expect(
    screen.getByText('modal content', { includeHiddenElements: true })
  ).not.toBeVisible();
});

it('hides the app content from assistive technology while a modal is open', async () => {
  await render(
    <Portal.Host>
      <Text>page content</Text>
      <Portal modal>
        <Text>modal content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('modal content')).toBeVisible();

  const pageContent = screen.getByText('page content', {
    includeHiddenElements: true,
  });

  // Still mounted and painted - only hidden from assistive technology.
  expect(pageContent).toBeOnTheScreen();
  expect(pageContent).not.toBeVisible();
});

it('leaves the app content reachable for a portal that is not a modal', async () => {
  await render(
    <Portal.Host>
      <Text>page content</Text>
      <Portal>
        <Text>portal content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('portal content')).toBeVisible();
  expect(screen.getByText('page content')).toBeVisible();
});

it('keeps portal content accessible above a modal', async () => {
  await render(
    <Portal.Host>
      <Portal modal>
        <Text>dialog content</Text>
      </Portal>
      <Portal>
        <Text>menu content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('menu content')).toBeVisible();
  expect(screen.getByText('dialog content')).toBeVisible();
});

it('hides lower modal content from assistive technology', async () => {
  await render(
    <Portal.Host>
      <Portal modal>
        <Text>lower dialog</Text>
      </Portal>
      <Portal modal>
        <Text>upper dialog</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('upper dialog')).toBeVisible();
  expect(
    screen.getByText('lower dialog', { includeHiddenElements: true })
  ).not.toBeVisible();
});

it('restores access to app content when a portal stops being modal', async () => {
  const { rerender } = await render(
    <Portal.Host>
      <Text>page content</Text>
      <Portal modal>
        <Text>modal content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('modal content')).toBeVisible();
  expect(
    screen.getByText('page content', { includeHiddenElements: true })
  ).not.toBeVisible();

  await rerender(
    <Portal.Host>
      <Text>page content</Text>
      <Portal modal={false}>
        <Text>modal content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('page content')).toBeVisible();
});

it('makes the app content reachable again once the modal unmounts', async () => {
  const { rerender } = await render(
    <Portal.Host>
      <Text>page content</Text>
      <Portal modal>
        <Text>modal content</Text>
      </Portal>
    </Portal.Host>
  );

  expect(screen.getByText('modal content')).toBeVisible();
  expect(
    screen.getByText('page content', { includeHiddenElements: true })
  ).not.toBeVisible();

  await rerender(
    <Portal.Host>
      <Text>page content</Text>
    </Portal.Host>
  );

  expect(screen.queryByText('modal content')).not.toBeOnTheScreen();
  expect(screen.getByText('page content')).toBeVisible();
});
