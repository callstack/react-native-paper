import * as React from 'react';

import { render } from '@testing-library/react-native';

import Surface from '../Surface';

describe('Surface', () => {
  it('should properly render passed props', () => {
    const testID = 'surface-container';
    const { getByTestId } = render(
      <Surface pointerEvents="box-none" testID={testID} />
    );
    expect(getByTestId(testID).props.pointerEvents).toBe('box-none');
  });
});
