import React from 'react';
import renderer from 'react-test-renderer';
import RadioButton from '../../RadioButton/RadioButton';

describe('RadioButtonGroup', () => {
  it('renders properly', () => {
    const tree = renderer
      .create(
        <RadioButton.Group value="first" onValueChange={() => {}}>
          <RadioButton value="first" />
        </RadioButton.Group>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
