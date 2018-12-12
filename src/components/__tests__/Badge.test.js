/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import Badge from '../Badge';
import { red500 } from '../../styles/colors';

// Make sure any animation finishes before checking the snapshot results
jest.mock('Animated', () => {
  const ActualAnimated = jest.requireActual('Animated');

  return {
    ...ActualAnimated,
    timing: (value, config) => ({
      start: callback => {
        value.setValue(config.toValue);
        callback && callback({ finished: true });
      },
    }),
  };
});

it('renders no badge', () => {
  // $FlowFixMe
  const tree = renderer.create(<Badge value={null}>Text</Badge>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders numeric badge', () => {
  const tree = renderer.create(<Badge value={3}>Text</Badge>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in top right corner by default', () => {
  const defaultTree = renderer.create(<Badge value="3">Text</Badge>).toJSON();
  const tree = renderer
    .create(
      <Badge value="3" verticalPosition="top" horizontalPosition="right">
        Text
      </Badge>
    )
    .toJSON();

  expect(defaultTree).toEqual(tree);
});

it('renders badge in top right corner', () => {
  const tree = renderer
    .create(
      <Badge value="3" verticalPosition="top" horizontalPosition="right">
        Text
      </Badge>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in bottom right corner', () => {
  const tree = renderer
    .create(
      <Badge value="3" verticalPosition="bottom" horizontalPosition="right">
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
      <Badge value="3" style={{ backgroundColor: red500 }}>
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
