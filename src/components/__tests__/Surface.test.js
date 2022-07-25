import * as React from 'react';
import { render } from 'react-native-testing-library';
import Surface from '../Surface';

describe('Surface', () => {
  it('should properly render passed props', () => {
    const { getByTestId } = render(<Surface pointerEvents="box-none" />);
    expect(getByTestId('surface-container').props.pointerEvents).toBe(
      'box-none'
    );
  });
});
