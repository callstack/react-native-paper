import React from 'react';
import renderer from 'react-test-renderer';
import AppbarAction from '../../Appbar/AppbarAction';

describe('ApAppbarActionpbar', () => {
  it('defaults its colors to colors.typography.secondary', () => {
    const tree = renderer.create(<AppbarAction icon="add-a-photo" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('accepts a color as props', () => {
    const tree = renderer
      .create(<AppbarAction icon="add-a-photo" color="#fff" />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
