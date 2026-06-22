import { expect, it } from '@jest/globals';

import { render } from '../../test-utils';
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
