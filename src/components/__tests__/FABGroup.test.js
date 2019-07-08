import React from 'react';
import renderer from 'react-test-renderer';
import FAB from '../FAB/FAB';

describe('FABGroup', () => {
  it('renders properly', () => {
    const tree = renderer
      .create(
        <FAB.Group open={false} icon="plus" visible={false}>
          <FAB small icon="plus" />
          <FAB small icon="star" label="Star" />
          <FAB small icon="email" label="Email" />
          <FAB small icon="bell" label="Remind" />
        </FAB.Group>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
