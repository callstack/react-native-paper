import { Text } from 'react-native';

import { expect, it, jest } from '@jest/globals';

import { render, screen } from '../../test-utils';
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
