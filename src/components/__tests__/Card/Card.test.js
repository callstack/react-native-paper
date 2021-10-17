import React from 'react';
import renderer from 'react-test-renderer';
import Card from '../../Card/Card';

describe('Card', () => {
  it('renders an outlined card', () => {
    const tree = renderer.create(<Card mode="outlined" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
