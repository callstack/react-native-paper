import * as React from 'react';

import { render } from '@testing-library/react-native';

import DrawerItem from '../Drawer/DrawerItem';

it('renders basic DrawerItem', () => {
  const tree = render(
    <DrawerItem onPress={() => {}} label="Example item" />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders DrawerItem with icon', () => {
  const tree = render(
    <DrawerItem icon="information" label="Example item" />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders active DrawerItem', () => {
  const tree = render(
    <DrawerItem icon="information" active label="Example item" />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
