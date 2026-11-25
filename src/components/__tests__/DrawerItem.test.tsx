import { Platform } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { fireEvent, render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import { tokens } from '../../theme/tokens';
import DrawerItem from '../Drawer/DrawerItem';

const { colors } = LightTheme;
const stateOpacity = tokens.md.sys.state.opacity;

it('renders basic DrawerItem', async () => {
  const tree = (
    await render(<DrawerItem onPress={() => {}} label="Example item" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders DrawerItem with icon', async () => {
  const tree = (
    await render(<DrawerItem icon="information" label="Example item" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders active DrawerItem', async () => {
  const tree = (
    await render(<DrawerItem icon="information" active label="Example item" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('emphasizes the label of the active destination', async () => {
  await render(<DrawerItem active label="Active item" />);

  expect(screen.getByText('Active item')).toHaveStyle({ fontWeight: '700' });
});

it('does not emphasize the label of an inactive destination', async () => {
  await render(<DrawerItem label="Inactive item" />);

  expect(screen.getByText('Inactive item')).toHaveStyle({ fontWeight: '500' });
});

it('marks the active destination with a filled indicator', async () => {
  await render(<DrawerItem active label="Active item" onPress={() => {}} />);

  expect(screen.getByRole('button')).toHaveStyle({
    backgroundColor: colors.secondaryContainer,
  });
});

it('leaves an inactive destination without an indicator', async () => {
  await render(<DrawerItem label="Inactive item" onPress={() => {}} />);

  expect(screen.getByRole('button')).toHaveStyle({
    backgroundColor: undefined,
  });
});

it('strengthens the label of an inactive destination while focused', async () => {
  await render(<DrawerItem label="Example item" onPress={() => {}} />);

  expect(screen.getByText('Example item')).toHaveStyle({
    color: colors.onSurfaceVariant,
  });

  await fireEvent(screen.getByRole('button'), 'focus');
  expect(screen.getByText('Example item')).toHaveStyle({
    color: colors.onSurface,
  });
});

it('keeps the label of an active destination while focused', async () => {
  await render(<DrawerItem label="Example item" active onPress={() => {}} />);

  await fireEvent(screen.getByRole('button'), 'focus');
  expect(screen.getByText('Example item')).toHaveStyle({
    color: colors.onSecondaryContainer,
  });
});

it('renders a disabled active DrawerItem', async () => {
  const tree = (
    await render(
      <DrawerItem
        icon="information"
        active
        disabled
        label="Example item"
        onPress={() => {}}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('keeps the active indicator of a disabled destination undimmed', async () => {
  await render(
    <DrawerItem label="Example item" onPress={() => {}} active disabled />
  );

  const indicator = screen.getByRole('button');
  expect(indicator).toHaveStyle({
    backgroundColor: colors.secondaryContainer,
  });
  expect(indicator).not.toHaveStyle({ opacity: stateOpacity.disabled });
});

it('does not strengthen the label of a disabled destination on focus', async () => {
  await render(<DrawerItem label="Example item" onPress={() => {}} disabled />);

  await fireEvent(screen.getByRole('button'), 'focus');
  expect(screen.getByText('Example item')).toHaveStyle({
    color: colors.onSurfaceVariant,
  });
});

// Drives Pressability itself, so the press is held until released.
const touch = {
  nativeEvent: { touches: [], changedTouches: [], identifier: 1 },
  currentTarget: { measure: () => {} },
  persist: () => {},
};

it('strengthens the label of an inactive destination while hovered', async () => {
  await render(<DrawerItem label="Example item" onPress={() => {}} />);

  await fireEvent(screen.getByRole('button'), 'hoverIn');
  expect(screen.getByText('Example item')).toHaveStyle({
    color: colors.onSurface,
  });

  await fireEvent(screen.getByRole('button'), 'hoverOut');
  expect(screen.getByText('Example item')).toHaveStyle({
    color: colors.onSurfaceVariant,
  });
});

it('strengthens the label of an inactive destination while pressed', async () => {
  await render(<DrawerItem label="Example item" onPress={() => {}} />);

  await fireEvent(screen.getByRole('button'), 'responderGrant', touch);
  expect(screen.getByText('Example item')).toHaveStyle({
    color: colors.onSurface,
  });
});

it('does not strengthen the label of a disabled destination on hover', async () => {
  await render(<DrawerItem label="Example item" onPress={() => {}} disabled />);

  await fireEvent(screen.getByRole('button'), 'hoverIn');
  expect(screen.getByText('Example item')).toHaveStyle({
    color: colors.onSurfaceVariant,
  });
});

describe('active destination', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(['ios', 'android'] as const)(
    'is a selected button on %s',
    async (os) => {
      jest.replaceProperty(Platform, 'OS', os);
      await render(<DrawerItem label="Inbox" active onPress={() => {}} />);

      expect(screen.getByRole('button', { name: 'Inbox' })).toBeSelected();
    }
  );

  it('is a button marked as the current page on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(<DrawerItem label="Inbox" active onPress={() => {}} />);

    const destination = screen.getByRole('button', { name: 'Inbox' });
    expect(destination).toHaveProp('aria-current', 'page');
    expect(destination).not.toHaveProp('aria-selected');
  });

  it('does not mark an inactive destination as the current page on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(<DrawerItem label="Inbox" onPress={() => {}} />);

    expect(screen.getByRole('button', { name: 'Inbox' })).not.toHaveProp(
      'aria-current',
      'page'
    );
  });
});
