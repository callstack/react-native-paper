import * as React from 'react';
import renderer from 'react-test-renderer';
import Searchbar from '../Searchbar.tsx';

it('renders with placeholder', () => {
  const tree = renderer.create(<Searchbar placeholder="Search" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders with text', () => {
  const tree = renderer
    .create(<Searchbar placeholder="Search" value="query" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
