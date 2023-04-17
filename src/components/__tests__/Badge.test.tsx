import * as React from 'react';

import { render } from '@testing-library/react-native';

import { red500 } from '../../styles/themes/v2/colors';
import Badge from '../Badge';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.Dimensions.get = () => ({
    fontScale: 1,
  });

  return RN;
});

it('renders badge', () => {
  const tree = render(<Badge />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge with content', () => {
  const tree = render(<Badge>3</Badge>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in different size', () => {
  const tree = render(<Badge size={12}>3</Badge>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge as hidden', () => {
  const tree = render(
    <Badge visible={false} size={12}>
      3
    </Badge>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in different color', () => {
  const tree = render(
    <Badge style={{ backgroundColor: red500 }}>3</Badge>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
