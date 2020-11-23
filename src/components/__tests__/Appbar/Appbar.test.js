import React from 'react';
import renderer from 'react-test-renderer';
import Appbar from '../../Appbar';
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

  it('passes additional props to AppbarBackAction, AppbarContent and AppbarAction', () => {
    const tree = renderer
      .create(
        <Appbar>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title="Examples" />
          <Appbar.Action icon="menu" onPress={() => {}} />
        </Appbar>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
