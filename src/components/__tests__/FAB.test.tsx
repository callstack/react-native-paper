import { Platform } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { fireEvent, userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import FAB from '../FAB';

it('renders FAB with default props', async () => {
  const tree = (await render(<FAB icon="plus" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with primary variant', async () => {
  const tree = (await render(<FAB icon="plus" variant="primary" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with secondary variant', async () => {
  const tree = (await render(<FAB icon="plus" variant="secondary" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with tertiary variant', async () => {
  const tree = (await render(<FAB icon="plus" variant="tertiary" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with tonalSecondary variant', async () => {
  const tree = (
    await render(<FAB icon="plus" variant="tonalSecondary" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with tonalTertiary variant', async () => {
  const tree = (
    await render(<FAB icon="plus" variant="tonalTertiary" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with aria-label', async () => {
  const tree = (
    await render(<FAB icon="plus" aria-label="Add item" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB medium size', async () => {
  const tree = (await render(<FAB icon="plus" size="medium" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB large size', async () => {
  const tree = (await render(<FAB icon="plus" size="large" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with containerColor override', async () => {
  const tree = (
    await render(<FAB icon="plus" containerColor="#ff5722" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with containerColor and contentColor overrides', async () => {
  const tree = (
    await render(
      <FAB icon="plus" containerColor="#ff5722" contentColor="#ffffff" />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB transitioning to not visible', async () => {
  const { rerender, toJSON } = await render(<FAB icon="plus" />);
  await rerender(<FAB icon="plus" visible={false} />);
  expect(toJSON()).toMatchSnapshot();
});

it('renders FAB transitioning to visible', async () => {
  const { rerender, toJSON } = await render(
    <FAB icon="plus" visible={false} />
  );
  await rerender(<FAB icon="plus" visible />);
  expect(toJSON()).toMatchSnapshot();
});

it('calls onPress when FAB is pressed', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();
  await render(<FAB icon="plus" aria-label="Add item" onPress={onPress} />);
  await user.press(screen.getByRole('button', { name: 'Add item' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('forwards event object to onPress', async () => {
  const onPress = jest.fn();
  await render(<FAB icon="plus" aria-label="Add item" onPress={onPress} />);
  await fireEvent(screen.getByRole('button', { name: 'Add item' }), 'onPress', {
    key: 'value',
  });
  expect(onPress).toHaveBeenCalledWith({ key: 'value' });
});

describe('without a touch handler', () => {
  describe.each(['ios', 'android'] as const)('on %s', (os) => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', os);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('keeps its label but is no image', async () => {
      await render(<FAB icon="star" aria-label="Favorite" />);

      expect(screen.getByLabelText('Favorite')).toBeOnTheScreen();
      expect(screen.queryByRole('img')).not.toBeOnTheScreen();
    });
  });

  // On web the dropped role renders role="presentation", which can't carry a
  // name, so the label would sit on an element that may not be announced
  describe('on web', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'web');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('is an image named by its label when it shows only an icon', async () => {
      await render(<FAB icon="star" aria-label="Favorite" />);

      expect(screen.getByRole('img', { name: 'Favorite' })).toBeOnTheScreen();
    });

    it('drops aria-selected from the image, which cannot carry it', async () => {
      await render(<FAB icon="star" aria-label="Favorite" aria-selected />);

      expect(screen.getByRole('img', { name: 'Favorite' })).not.toHaveProp(
        'aria-selected'
      );
    });

    it('stays a button with a touch handler', async () => {
      await render(
        <FAB icon="star" aria-label="Favorite" onPress={() => {}} />
      );

      expect(
        screen.getByRole('button', { name: 'Favorite' })
      ).toBeOnTheScreen();
    });

    it('stays a button while it reports a toggle state', async () => {
      await render(<FAB icon="star" aria-label="Favorite" aria-checked />);

      expect(
        screen.getByRole('button', { name: 'Favorite' })
      ).toBeOnTheScreen();
    });

    it('is no image when it shows a label', async () => {
      await render(<FAB.Extended icon="plus" label="New message" expanded />);

      expect(
        screen.queryByRole('img', { name: 'New message' })
      ).not.toBeOnTheScreen();
    });

    it('keeps a closed FAB.Menu trigger without onPress a disabled button', async () => {
      await render(
        <FAB.Menu
          expanded={false}
          onDismiss={() => {}}
          trigger={{ icon: 'plus', 'aria-label': 'Open actions' }}
          items={[
            { label: 'Send email', onPress: () => {} },
            { label: 'Set reminder', onPress: () => {} },
          ]}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Open actions' })
      ).toBeDisabled();
    });
  });
});
