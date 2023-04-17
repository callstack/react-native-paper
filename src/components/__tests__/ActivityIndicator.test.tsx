import * as React from 'react';

import { render } from '@testing-library/react-native';

import ActivityIndicator from '../ActivityIndicator';

it('renders indicator', () => {
  const tree = render(<ActivityIndicator animating />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders hidden indicator', () => {
  const tree = render(
    <ActivityIndicator animating={false} hidesWhenStopped />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders large indicator', () => {
  const tree = render(<ActivityIndicator size="large" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders colored indicator', () => {
  const tree = render(<ActivityIndicator color="#FF0000" />).toJSON();

  expect(tree).toMatchSnapshot();
});
