import * as React from 'react';
import { StyleSheet } from 'react-native';
import renderer from 'react-test-renderer';
import Caption from '../../Typography/Caption.tsx';
import { red500 } from '../../../styles/colors';

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
