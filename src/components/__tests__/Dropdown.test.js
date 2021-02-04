import * as React from 'react';
import renderer from 'react-test-renderer';
import Dropdown from '../Dropdown/Dropdown';
import Text from '../Typography/Text';

it('renders an empty dropdown', () => {
  const tree = renderer
    .create(<Dropdown placeholder="Nothing here!" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders dropdown with multiple options', () => {
  const tree = renderer.create(
    <Dropdown>
      <Dropdown.Option key={1} value={1} label="Option 1" />
      <Dropdown.Option key={2} value={2} label="Option 2" />
    </Dropdown>
  );

  expect(tree).toMatchSnapshot();
});

it('renders dropdown with custom content', () => {
  const tree = renderer.create(
    <Dropdown renderNoneOption={(props) => <Text {...props}>None</Text>}>
      <Dropdown.Option
        key={1}
        value={1}
        label="Option 1"
        render={(props) => <Text {...props}>Custom Text</Text>}
      />
    </Dropdown>
  );

  expect(tree).toMatchSnapshot();
});

it('throws an error when Dropdown.Option is used outside dropdown', () => {
  const render = () => {
    renderer.create(<Dropdown.Option key={1} value={1} label="Option1" />);
  };

  expect(render).toThrowErrorMatchingSnapshot();
});
