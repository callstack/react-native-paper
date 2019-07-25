import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import _RadioButton from '../../RadioButton/RadioButton';
import WithRadioContext from '../../RadioButton/WithRadioContext';

describe('WithRadioContext', () => {
  describe('status', () => {
    describe('When it is not wrapped by RadioButton.Group', () => {
      it('returns the given status', () => {
        const RadioButton = WithRadioContext(_RadioButton.Android);

        const { getByType } = render(<RadioButton status="first" />);

        expect(getByType(_RadioButton.Android).props).toHaveProperty(
          'status',
          'first'
        );
      });
    });

    describe('When it is wrapped by RadioButton.Group', () => {
      it('passes status as checked if context value equals to child value', () => {
        const RadioButton = WithRadioContext(_RadioButton.Android);

        const { getByType } = render(
          <_RadioButton.Group value="first">
            <RadioButton value="first" />
          </_RadioButton.Group>
        );

        expect(getByType(_RadioButton.Android).props).toHaveProperty(
          'status',
          'checked'
        );
      });

      it('passes status as unchecked if context value does not equals to child value', () => {
        const RadioButton = WithRadioContext(_RadioButton.Android);

        const { getByType } = render(
          <_RadioButton.Group value="second">
            <RadioButton value="first" />
          </_RadioButton.Group>
        );

        expect(getByType(_RadioButton.Android).props).toHaveProperty(
          'status',
          'unchecked'
        );
      });
    });
  });

  describe('onPress', () => {
    describe('When it is not wrapped by RadioButton.Group', () => {
      it('calls onPress given prop when pressed', () => {
        const RadioButton = WithRadioContext(_RadioButton.Android);
        const mockOnPress = jest.fn();
        const { getByType } = render(<RadioButton onPress={mockOnPress} />);

        fireEvent.press(getByType(_RadioButton.Android));

        expect(mockOnPress).toHaveBeenCalled();
      });
    });

    describe('When it is wrapped by RadioButton.Group', () => {
      it('calls context onValueChange with child value when pressed', () => {
        const RadioButton = WithRadioContext(_RadioButton.Android);
        const mockOnValueChange = jest.fn();
        const { getByType } = render(
          <_RadioButton.Group onValueChange={mockOnValueChange}>
            <RadioButton value="first" />
          </_RadioButton.Group>
        );

        fireEvent.press(getByType(_RadioButton.Android));

        expect(mockOnValueChange).toHaveBeenCalledWith('first');
      });
    });
  });
});
