import { expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
import DrawerItem from '../Drawer/DrawerItem';

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

it('grows with its label instead of clipping it at large text sizes', async () => {
  await render(<DrawerItem active label="Sign in" onPress={() => {}} />);

  const item = screen.getByRole('button', { name: 'Sign in' });

  expect(item).toHaveStyle({ minHeight: 56 });
  expect(item).not.toHaveStyle({ height: 56 });
});
