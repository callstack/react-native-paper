import * as React from 'react';
import renderer from 'react-test-renderer';
import Dropdown from '../Dropdown/Dropdown';

it('renders an empty dropdown', () => {
  const tree = renderer
    .create(<Dropdown placeholder="Nothing here!" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders dropdown with multiple options', () => {
  const tree = renderer.create(
    <Dropdown>
      <Dropdown.Option optionKey={1} value={1} title="Option 1" />
      <Dropdown.Option optionKey={2} value={2} title="Option 2" />
    </Dropdown>
  );

  expect(tree).toMatchSnapshot();
});

it('throws an error when Dropdown.Option is used outside dropdown', () => {
  const render = () => {
    renderer.create(
      <Dropdown.Option optionKey={1} value={1} title="Option1" />
    );
  };

  expect(render).toThrowErrorMatchingSnapshot();
});
