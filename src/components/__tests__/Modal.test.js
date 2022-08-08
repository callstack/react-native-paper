import * as React from 'react';
import { render } from 'react-native-testing-library';
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

    expect(getByTestId('modal-backdrop').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: 'transparent' }),
      ])
    );
  });
});
