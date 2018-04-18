/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import ListControl from '../List/ListControl';

it('renders list control with action, title and description', () => {
  const tree = renderer
    .create(
      <ListControl
        primaryAction={<Text>Action</Text>}
        title="First Item"
        description="Description for first item"
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list control with primary and secondary action', () => {
  const tree = renderer
    .create(
      <ListControl
        title="First Item"
        primaryAction={<Text>Action</Text>}
        secondaryAction={<Text>Action</Text>}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list control with children', () => {
  const tree = renderer
    .create(
      <ListControl title="First Item" primaryAction={<Text>Action</Text>}>
        <ListControl title="Subitem" />
      </ListControl>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
