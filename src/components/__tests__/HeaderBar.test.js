import * as React from 'react';
import renderer from 'react-test-renderer';
import HeaderBar from '../HeaderBar';

it('status bar with white background and dark text', async () => {
  const tree = renderer
    .create(<HeaderBar textColor="dark-content" backgroundColor="white" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('status bar with orange background and light text', () => {
  const tree = renderer
    .create(<HeaderBar textColor="light-content" backgroundColor="orange" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
