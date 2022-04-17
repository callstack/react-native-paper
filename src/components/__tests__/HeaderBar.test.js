import * as React from 'react';
import renderer from 'react-test-renderer';
import HeaderBar from '../HeaderBar';

it('render header status bar with custom color', () => {
  const tree = renderer
    .create(
      <HeaderBar
        textColor="light-content"
        backgroundColor="green"
        networkActivity={true}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
