import React from 'react';
import renderer from 'react-test-renderer';
import { render } from 'react-native-testing-library';
import Card from '../../Card/Card';

describe('Card', () => {
  it('renders an outlined card', () => {
    const tree = renderer.create(<Card mode="outlined" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders with a custom theme', () => {
    const { getByA11yLabel } = render(
      <Card
        mode="outlined"
        accessibilityLabel="card"
        theme={{ colors: { surface: '#0000FF' } }}
      />
    );

    expect(getByA11yLabel('card').props.style.backgroundColor).toEqual(
      '#0000FF'
    );
  });
});
