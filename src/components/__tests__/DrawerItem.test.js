/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import DrawerItem from '../Drawer/DrawerItem';

it('renders basic DrawerItem', () => {
  const tree = renderer
    .create(<DrawerItem onPress={() => {}} label="Example item" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders DrawerItem with icon', () => {
  const tree = renderer
    .create(<DrawerItem icon="info" label="Example item" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders active DrawerItem', () => {
  const tree = renderer
    .create(<DrawerItem icon="info" active label="Example item" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
