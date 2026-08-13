import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  Button,
  Checkbox,
  Divider,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import type { TextInputAccessoryProps } from 'react-native-paper';

import type { SampleConfig } from './types';
import ScreenWrapper from '../ScreenWrapper';

export const SignUpSampleConfig: SampleConfig = {
  title: 'Sign up',
  icon: 'account-plus-outline',
  components: [
    'Button',
    'Checkbox',
    'Divider',
    'Snackbar',
    'Text',
    'TextInput',
  ],
};

const SignUpSample = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [secure, setSecure] = React.useState(true);
  const [accepted, setAccepted] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const emailIcon = (props: TextInputAccessoryProps) => (
    <TextInput.Icon {...props} icon="email-outline" />
  );

  const passwordIcon = (props: TextInputAccessoryProps) => (
    <TextInput.Icon
      {...props}
      icon={secure ? 'eye-outline' : 'eye-off-outline'}
      aria-label={secure ? 'Show password' : 'Hide password'}
      onPress={() => setSecure(!secure)}
    />
  );

  return (
    <>
      <ScreenWrapper contentContainerStyle={styles.content}>
        <Text variant="headlineSmall">Create your account</Text>
        <Text variant="bodyMedium">
          Sign up to sync your projects across every device.
        </Text>

        <TextInput
          variant="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          startAccessory={emailIcon}
        />
        <TextInput
          variant="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secure}
          supportingText="At least 8 characters"
          endAccessory={passwordIcon}
        />

        <Checkbox.Item
          label="I accept the terms of service"
          status={accepted ? 'checked' : 'unchecked'}
          onPress={() => setAccepted(!accepted)}
        />

        <Divider />

        <Button
          mode="contained"
          disabled={!accepted}
          onPress={() => setSubmitted(true)}
        >
          Sign up
        </Button>
        <Button onPress={() => {}}>I already have an account</Button>
      </ScreenWrapper>

      <Snackbar visible={submitted} onDismiss={() => setSubmitted(false)}>
        Account created
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
});

export default SignUpSample;
