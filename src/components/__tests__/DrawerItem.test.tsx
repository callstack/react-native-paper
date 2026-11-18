import { expect, it } from '@jest/globals';

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

it('insets destination content 28dp from both drawer edges', async () => {
  await render(<DrawerItem label="Example item" onPress={() => {}} />);

  expect(screen.getByRole('button')).toHaveStyle({ marginHorizontal: 12 });
  expect(screen.getByTestId('drawer-item-content')).toHaveStyle({
    marginHorizontal: 16,
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

it('renders an enabled destination at full opacity', async () => {
  await render(<DrawerItem label="Example item" onPress={() => {}} />);

  expect(screen.getByRole('button')).toHaveStyle({
    opacity: stateOpacity.enabled,
  });
});

it('dims a disabled destination', async () => {
  await render(<DrawerItem label="Example item" onPress={() => {}} disabled />);

  expect(screen.getByRole('button')).toHaveStyle({
    opacity: stateOpacity.disabled,
  });
});

it('dims the active indicator of a disabled destination', async () => {
  await render(
    <DrawerItem label="Example item" onPress={() => {}} active disabled />
  );

  expect(screen.getByRole('button')).toHaveStyle({
    backgroundColor: colors.secondaryContainer,
    opacity: stateOpacity.disabled,
  });
});
