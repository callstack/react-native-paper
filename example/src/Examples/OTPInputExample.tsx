import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text, Button } from 'react-native-paper';

import OTPInput from '../../../src/components/OTPInput/OTPInput';

const OTPInputExample = () => {
  const [otp, setOtp] = React.useState('');
  const [otp4, setOtp4] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleComplete = (value: string) => {
    if (value !== '123456') {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        6 Digit OTP
      </Text>

      <OTPInput
        length={6}
        value={otp}
        onChangeText={(val) => {
          setOtp(val);
          if (error) setError(false);
        }}
        onComplete={handleComplete}
        error={error}
        autoFocus
      />

      <Text style={styles.helper}>Try entering 123456</Text>

      <Text variant="titleMedium" style={styles.title}>
        4 Digit OTP
      </Text>

      <OTPInput
        length={4}
        value={otp4}
        onChangeText={setOtp4}
        style={styles.input}
      />

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => {
            setOtp('');
            setOtp4('');
            setError(false);
          }}
        >
          Reset
        </Button>
      </View>
    </View>
  );
};
OTPInputExample.title = 'OTP Input';
export default OTPInputExample;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    marginTop: 16,
  },
  helper: {
    opacity: 0.6,
  },
  actions: {
    marginTop: 24,
  },
  input: {
    justifyContent: 'space-evenly',
  },
});
