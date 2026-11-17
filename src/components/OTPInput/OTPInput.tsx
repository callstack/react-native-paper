import * as React from 'react';
import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  ViewStyle,
  StyleProp,
} from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';
import TextInput from '../TextInput/TextInput';
type Props = {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  theme?: ThemeProp;
  testID?: string;
};

const OTPInput = forwardRef<View, Props>(
  (
    {
      length = 6,
      value,
      onChangeText,
      onComplete,
      disabled = false,
      error = false,
      autoFocus = false,
      style,
      theme: themeOverrides,
      testID,
    },
    ref
  ) => {
    const theme = useInternalTheme(themeOverrides);

    type PaperTextInputRef = React.ElementRef<typeof TextInput>;
    const inputsRef = React.useRef<Array<PaperTextInputRef | null>>([]);

    const values = React.useMemo(() => {
      const arr = value.split('').slice(0, length);
      while (arr.length < length) arr.push('');
      return arr;
    }, [value, length]);

    const prevValuesRef = React.useRef<string[]>(values);

    React.useEffect(() => {
      prevValuesRef.current = values;
    }, [values]);

    const focusInput = (index: number) => {
      inputsRef.current[index]?.focus();
    };

    const updateValue = (arr: string[]) => {
      const otp = arr.join('');
      onChangeText(otp);

      if (otp.length === length && !arr.includes('')) {
        onComplete?.(otp);
      }
    };

    const handleChange = (text: string, index: number) => {
      const prev = prevValuesRef.current;
      let newValues = [...values];

      if (text === '') {
        if (prev[index] !== '') {
          newValues[index] = '';
          updateValue(newValues);
          return;
        }

        if (index > 0) {
          newValues[index - 1] = '';
          updateValue(newValues);
          focusInput(index - 1);
          return;
        }

        return;
      }

      if (text.length > 1) {
        const pasted = text.replace(/\s/g, '').slice(0, length).split('');
        const filled = Array(length).fill('');

        pasted.forEach((char, i) => {
          filled[i] = char;
        });

        updateValue(filled);

        const lastIndex = Math.min(pasted.length - 1, length - 1);
        focusInput(lastIndex);
        return;
      }

      newValues[index] = text;
      updateValue(newValues);

      if (index < length - 1) {
        focusInput(index + 1);
      }
    };

    const handleKeyPress = (
      e: NativeSyntheticEvent<TextInputKeyPressEventData>,
      index: number
    ) => {
      if (e.nativeEvent.key === 'Backspace') {
        if (values[index] === '' && index > 0) {
          focusInput(index - 1);
        }
      }
    };

    return (
      <View ref={ref} testID={testID} style={[styles.container, style]}>
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={(input: PaperTextInputRef | null) => {
              inputsRef.current[index] = input;
            }}
            mode="outlined"
            dense
            keyboardType="number-pad"
            maxLength={1}
            value={values[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            autoFocus={autoFocus && index === 0}
            disabled={disabled}
            error={error}
            textContentType={index === 0 ? 'oneTimeCode' : 'none'}
            autoComplete={index === 0 ? 'sms-otp' : 'off'}
            importantForAutofill={index === 0 ? 'yes' : 'no'}
            accessibilityLabel={`OTP digit ${index + 1}`}
            accessibilityRole="text"
            style={styles.input}
            contentStyle={[styles.content, { color: theme.colors.onSurface }]}
            textAlign="center"
          />
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: 48,
    paddingHorizontal: 18,
  },
  content: {
    fontSize: 18,
    paddingHorizontal: 0,
  },
});

export default OTPInput;
