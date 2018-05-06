/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import Chip from '../Chip';

it('renders chip with onPress', () => {
  const tree = renderer
    .create(<Chip onPress={() => {}}>Example Chip</Chip>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with icon', () => {
  const tree = renderer.create(<Chip icon="info">Example Chip</Chip>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders deletable chip', () => {
  const tree = renderer
    .create(
      <Chip icon="info" onDelete={() => {}}>
        Example Chip
      </Chip>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
