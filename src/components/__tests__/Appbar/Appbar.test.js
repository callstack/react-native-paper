import React from 'react';
import renderer from 'react-test-renderer';
import Appbar from '../../Appbar/Appbar';
import Searchbar from '../../Searchbar';

describe('Appbar', () => {
  it('does not pass any additional props to Searchbar', () => {
    const tree = renderer
      .create(
        <Appbar>
          <Searchbar placeholder="Search" />
        </Appbar>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
