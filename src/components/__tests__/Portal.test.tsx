import { Text } from 'react-native';

import { expect, it, jest } from '@jest/globals';

import { LocaleProvider, useLocale } from '../../core/locale';
import PaperProvider from '../../core/PaperProvider';
import { useInternalTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
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

const PortalThemeContent = () => {
  const theme = useInternalTheme(undefined);
  const { direction } = useLocale();

  return <Text>{`${theme.animation.scale} ${direction}`}</Text>;
};

it('passes local theme overrides and locale to portal content and updates them', async () => {
  const { rerender } = await render(
    <Portal.Host>
      <LocaleProvider direction="rtl">
        <Portal theme={{ animation: { scale: 2 } }}>
          <PortalThemeContent />
        </Portal>
      </LocaleProvider>
    </Portal.Host>
  );

  expect(screen.getByText('2 rtl')).toBeOnTheScreen();

  await rerender(
    <Portal.Host>
      <LocaleProvider direction="ltr">
        <Portal theme={{ animation: { scale: 3 } }}>
          <PortalThemeContent />
        </Portal>
      </LocaleProvider>
    </Portal.Host>
  );

  expect(screen.getByText('3 ltr')).toBeOnTheScreen();
  expect(screen.queryByText('2 rtl')).not.toBeOnTheScreen();
});

const PortalReduceMotionContent = () => (
  <Text>{`reduce motion: ${useReduceMotion()}`}</Text>
);

it('passes the reduce motion preference to portal content', async () => {
  await render(
    <PaperProvider reduceMotion="on">
      <Portal>
        <PortalReduceMotionContent />
      </Portal>
    </PaperProvider>
  );

  expect(await screen.findByText('reduce motion: true')).toBeOnTheScreen();
});

it('renders portals in source order when mounted in the same commit', async () => {
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

it('stacks components mounted in the same commit in source order', async () => {
  await render(
    <Portal.Host>
      <Modal visible onDismiss={() => {}}>
        <Text testID="layer">modal</Text>
      </Modal>
      <Dialog visible onDismiss={() => {}}>
        <Text testID="layer">dialog</Text>
      </Dialog>
    </Portal.Host>
  );

  const layers = await screen.findAllByTestId('layer', {
    includeHiddenElements: true,
  });

  expect(layers).toHaveLength(2);
  expect(layers[0]).toHaveTextContent('modal');
  expect(layers[1]).toHaveTextContent('dialog');
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

it('keeps a portal opened on top of a modal reachable', async () => {
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

it('hides a modal that another modal was opened on top of', async () => {
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

it('makes the app content reachable again once the modal closes', async () => {
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
