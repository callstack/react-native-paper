import * as React from 'react';
import renderer from 'react-test-renderer';
import ActivityIndicator from '../ActivityIndicator.tsx';

it('renders indicator', () => {
  const tree = renderer.create(<ActivityIndicator animating />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders hidden indicator', () => {
  const tree = renderer
    .create(<ActivityIndicator animating={false} hidesWhenStopped />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders large indicator', () => {
  const tree = renderer.create(<ActivityIndicator size="large" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders colored indicator', () => {
  const tree = renderer.create(<ActivityIndicator color="#FF0000" />).toJSON();

  expect(tree).toMatchSnapshot();
});
