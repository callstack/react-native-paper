import * as React from 'react';

import { render } from '@testing-library/react-native';

import Modal from '../Modal';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 44, left: 0, right: 0, top: 37 }),
}));

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

  it('should receive appropriate top and bottom insets', () => {
    const { getByTestId } = render(<Modal visible={true} testID="modal" />);

    expect(getByTestId('modal-wrapper')).toHaveStyle({
      marginTop: 37,
      marginBottom: 44,
    });
  });
});
