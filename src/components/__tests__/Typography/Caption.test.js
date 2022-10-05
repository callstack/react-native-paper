import * as React from 'react';
import { StyleSheet } from 'react-native';

import renderer from 'react-test-renderer';

import { red500 } from '../../../styles/themes/v2/colors';
import Caption from '../../Typography/v2/Caption.tsx';

const style = StyleSheet.create({
  caption: {
    fontSize: 20,
    color: red500,
  },
});

it('renders caption with children as content', () => {
  const tree = renderer.create(<Caption>Caption content</Caption>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders caption applying style', () => {
  const tree = renderer
    .create(<Caption style={style.caption}>Big and red caption</Caption>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
