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
