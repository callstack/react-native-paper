import * as React from 'react';
import { StyleSheet } from 'react-native';

import { render } from '@testing-library/react-native';

import Caption from '@/components/Typography/v2/Caption';
import { red500 } from '@/styles/themes/v2/colors';

const style = StyleSheet.create({
  caption: {
    fontSize: 20,
    color: red500,
  },
});

it('renders caption with children as content', () => {
  const tree = render(<Caption>Caption content</Caption>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders caption applying style', () => {
  const tree = render(
    <Caption style={style.caption}>Big and red caption</Caption>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
