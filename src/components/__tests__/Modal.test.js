import * as React from 'react';

import { render } from '@testing-library/react-native';

import Modal from '../Modal';

describe('Modal', () => {
  it('should render custom backdrop color', () => {
    const { getByTestId } = render(
      <Modal
        visible={true}
        testID="modal"
        theme={{
          colors: {
            backdrop: 'transparent',
          },
        }}
      />
    );

    expect(getByTestId('modal-backdrop')).toHaveStyle({
      backgroundColor: 'transparent',
    });
  });
});
