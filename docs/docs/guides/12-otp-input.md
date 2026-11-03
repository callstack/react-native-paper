# OTPInput

A component for entering one-time passwords (OTP) with multiple input fields.

## Usage

```js
import * as React from 'react';
import { OTPInput } from 'react-native-paper';

const MyComponent = () => {
  const [otp, setOtp] = React.useState('');

  return (
    <OTPInput
      length={6}
      value={otp}
      onChangeText={setOtp}
      onComplete={(value) => console.log(value)}
    />
  );
};

export default MyComponent;
```
