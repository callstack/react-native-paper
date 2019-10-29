import * as React from 'react';
import renderer from 'react-test-renderer';
import DrawerItem from '../Drawer/DrawerItem.tsx';

it('renders basic DrawerItem', () => {
  const tree = renderer
    .create(<DrawerItem onPress={() => {}} label="Example item" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders DrawerItem with icon', () => {
  const tree = renderer
    .create(<DrawerItem icon="information" label="Example item" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders active DrawerItem', () => {
  const tree = renderer
    .create(<DrawerItem icon="information" active label="Example item" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
