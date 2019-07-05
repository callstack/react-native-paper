import * as React from 'react';
import renderer from 'react-test-renderer';
import Caption from '../../Typography/Caption.tsx';

it('renders caption with children as content', () => {
  const tree = renderer.create(<Caption>Caption content</Caption>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders caption applying style', () => {
  const tree = renderer
    .create(
      <Caption style={{ fontSize: 20, color: 'red' }}>
        Big and red caption
      </Caption>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
