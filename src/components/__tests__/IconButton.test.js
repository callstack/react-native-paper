/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import IconButton from '../IconButton';
import { pink500 } from '../../styles/colors';

it('renders icon button by default', () => {
  const tree = renderer.create(<IconButton icon="add-a-photo" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with color', () => {
  const tree = renderer
    .create(<IconButton icon="add-a-photo" color={pink500} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with size', () => {
  const tree = renderer
    .create(<IconButton icon="add-a-photo" size={30} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled icon button', () => {
  const tree = renderer
    .create(<IconButton icon="add-a-photo" disabled />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
