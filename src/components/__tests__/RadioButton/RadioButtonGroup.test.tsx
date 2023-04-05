import React from 'react';

import { render } from '@testing-library/react-native';

import RadioButton from '../../RadioButton';

describe('RadioButtonGroup', () => {
  it('renders properly', () => {
    const tree = render(
      <RadioButton.Group value="first" onValueChange={() => {}}>
        <RadioButton value="first" />
      </RadioButton.Group>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
