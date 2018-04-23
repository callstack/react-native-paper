/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import ListItem from '../ListItem';

it('renders list item with title and description', () => {
  const tree = renderer
    .create(
      <ListItem title="First Item" description="Description for first item" />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with icon', () => {
  const tree = renderer
    .create(<ListItem title="First Item" icon="folder" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with avatar', () => {
  const tree = renderer
    .create(<ListItem title="First Item" avatar={<Text>GG</Text>} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with avatar and icon', () => {
  const tree = renderer
    .create(
      <ListItem
        title="First Item"
        description="Item description"
        icon="folder"
        avatar={<Text>GG</Text>}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
