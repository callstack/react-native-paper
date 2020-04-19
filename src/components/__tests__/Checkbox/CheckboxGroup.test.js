import React from 'react';
import renderer from 'react-test-renderer';
import Checkbox from '../../Checkbox/Checkbox';

describe('CheckboxGroup', () => {
  it('renders properly', () => {
    const tree = renderer
      .create(
        <Checkbox.Group>
          <Checkbox status="checked" />
        </Checkbox.Group>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
