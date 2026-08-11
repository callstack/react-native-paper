import { expect, it } from '@jest/globals';

import { defaultThemes } from '../../core/theming';
import { fireEvent, render, screen } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import DrawerItem from '../Drawer/DrawerItem';

const { colors } = defaultThemes.light;
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
  await render(<DrawerItem active label="Active item" />);

  expect(screen.getByRole('button')).toHaveStyle({
    backgroundColor: colors.secondaryContainer,
  });
});

it('leaves an inactive destination without an indicator', async () => {
  await render(<DrawerItem label="Inactive item" />);

  expect(screen.getByRole('button')).toHaveStyle({
    backgroundColor: undefined,
  });
});

it('insets destination content 28dp from both drawer edges', async () => {
  await render(<DrawerItem label="Example item" />);

  // The 28dp of MD3 container padding is split between the active
  // indicator's inset from the drawer edge and the content's inset from
  // the indicator edge. `marginHorizontal` keeps both sides symmetric.
  expect(screen.getByRole('button')).toHaveStyle({ marginHorizontal: 12 });
  expect(screen.getByTestId('drawer-item-content')).toHaveStyle({
    marginHorizontal: 16,
  });
});

it('shows a focus indicator while focused', async () => {
  await render(<DrawerItem label="Example item" onPress={() => {}} />);

  expect(screen.queryByTestId('drawer-item-focus-ring')).toBeNull();

  await fireEvent(screen.getByRole('button'), 'focus');
  expect(screen.getByTestId('drawer-item-focus-ring')).toHaveStyle({
    borderColor: colors.secondary,
  });

  await fireEvent(screen.getByRole('button'), 'blur');
  expect(screen.queryByTestId('drawer-item-focus-ring')).toBeNull();
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

  // The active indicator is the destination's own background, so dimming the
  // destination dims the indicator, icon, label and trailing slot in one pass.
  expect(screen.getByRole('button')).toHaveStyle({
    backgroundColor: colors.secondaryContainer,
    opacity: stateOpacity.disabled,
  });
});
