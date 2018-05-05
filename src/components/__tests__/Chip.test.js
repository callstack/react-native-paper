/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import Chip from '../Chip';

it('renders chip with onPress', () => {
  const tree = renderer
    .create(<Chip text="Example Chip" onPress={() => {}} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with icon', () => {
  const tree = renderer
    .create(<Chip text="Example Chip" icon="info" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders deletable chip', () => {
  const tree = renderer
    .create(<Chip text="Example Chip" icon="info" onDelete={() => {}} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
