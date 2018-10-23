/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import Badge from '../Badge';
import { pink500 } from '../../styles/colors';

it('renders badge in top right corner by default', () => {
  const tree = renderer.create(<Badge value="3">Text</Badge>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in bottom right corner', () => {
  const tree = renderer
    .create(
      <Badge value="3" verticalPosition="bottom">
        Text
      </Badge>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in bottom left corner', () => {
  const tree = renderer
    .create(
      <Badge value="3" verticalPosition="bottom" horizontalPosition="left">
        Text
      </Badge>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in top left corner', () => {
  const tree = renderer
    .create(
      <Badge value="3" verticalPosition="top" horizontalPosition="left">
        Text
      </Badge>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in different color', () => {
  const tree = renderer
    .create(
      <Badge value="3" color={pink500}>
        Text
      </Badge>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in different size', () => {
  const tree = renderer
    .create(
      <Badge value="3" size={12}>
        Text
      </Badge>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
