import * as React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import OTPInput from '../OTPInput/OTPInput';

describe('OTPInput', () => {
  it('renders correct number of inputs', () => {
    const { getAllByLabelText } = render(
      <OTPInput value="" onChangeText={() => {}} length={4} />
    );

    const inputs = getAllByLabelText(/OTP digit/i);
    expect(inputs).toHaveLength(4);
  });

  it('updates value on typing', () => {
    const onChangeText = jest.fn();

    const { getAllByLabelText } = render(
      <OTPInput value="" onChangeText={onChangeText} length={4} />
    );

    const inputs = getAllByLabelText(/OTP digit/i);

    fireEvent.changeText(inputs[0], '1');

    expect(onChangeText).toHaveBeenCalledWith('1');
  });

  it('moves to next input on typing', () => {
    const { getAllByLabelText } = render(
      <OTPInput value="" onChangeText={() => {}} length={4} autoFocus />
    );

    const inputs = getAllByLabelText(/OTP digit/i);

    fireEvent.changeText(inputs[0], '1');

    expect(inputs[1]).toBeTruthy();
  });

  it('calls onComplete when filled', () => {
    const onComplete = jest.fn();

    const Wrapper = () => {
      const [value, setValue] = React.useState('');

      return (
        <OTPInput
          value={value}
          onChangeText={setValue}
          onComplete={onComplete}
          length={4}
        />
      );
    };

    const { getAllByLabelText } = render(<Wrapper />);

    const inputs = getAllByLabelText(/OTP digit/i);

    fireEvent.changeText(inputs[0], '1');
    fireEvent.changeText(inputs[1], '2');
    fireEvent.changeText(inputs[2], '3');
    fireEvent.changeText(inputs[3], '4');

    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('handles backspace correctly', () => {
    const onChangeText = jest.fn();

    const { getAllByLabelText } = render(
      <OTPInput value="12" onChangeText={onChangeText} length={4} />
    );

    const inputs = getAllByLabelText(/OTP digit/i);

    fireEvent(inputs[1], 'keyPress', {
      nativeEvent: { key: 'Backspace' },
    });

    expect(inputs[0]).toBeTruthy();
  });

  it('handles paste input', () => {
    const onChangeText = jest.fn();

    const { getAllByLabelText } = render(
      <OTPInput value="" onChangeText={onChangeText} length={4} />
    );

    const inputs = getAllByLabelText(/OTP digit/i);

    fireEvent.changeText(inputs[0], '1234');

    expect(onChangeText).toHaveBeenCalledWith('1234');
  });
});
