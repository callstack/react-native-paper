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
      <Portal>
        <Modal visible onDismiss={() => {}}>
          <Text testID="layer">modal</Text>
        </Modal>
      </Portal>
      <Portal>
        <Dialog visible onDismiss={() => {}}>
          <Text testID="layer">dialog</Text>
        </Dialog>
      </Portal>
    </Portal.Host>
  );

  const layers = await screen.findAllByTestId('layer');

  expect(layers).toHaveLength(2);
  expect(layers[0]).toHaveTextContent('modal');
  expect(layers[1]).toHaveTextContent('dialog');
});
