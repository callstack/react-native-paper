import * as React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import type { TimePickerProps } from './types';
import { useInternalTheme } from '../../core/theming';

const pad = (n: number) => String(n).padStart(2, '0');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  } as ViewStyle,
  field: {
    alignItems: 'center',
    marginHorizontal: 4,
  } as ViewStyle,
  stepperButton: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  stepperText: {
    fontSize: 18,
  } as ViewStyle,
  valueText: {
    fontSize: 36,
    fontWeight: '500',
    minWidth: 72,
    textAlign: 'center',
  } as ViewStyle,
  label: {
    fontSize: 12,
    marginTop: 4,
  } as ViewStyle,
  colon: {
    fontSize: 36,
    fontWeight: '500',
  } as ViewStyle,
  toggle: {
    marginLeft: 12,
    flexDirection: 'row',
  } as ViewStyle,
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  } as ViewStyle,
});

/**
 * Material 3 time picker (input/stepper style).
 *
 * Lets the user pick an hour and minute with up/down steppers, and toggle
 * AM/PM in 12-hour mode. The value is controlled as a Date; only the hour and
 * minute components are read and written.
 *
 * @param props
 */
function TimePicker({
  value,
  onChange,
  hours24 = false,
  minuteStep = 1,
  style,
  theme: themeOverrides,
  testID = 'time-picker',
}: TimePickerProps) {
  const theme = useInternalTheme(themeOverrides);
  const primary = theme.isV3 ? theme.colors.primary : theme.colors.accent;
  const onSurface = theme.isV3 ? theme.colors.onSurface : '#000';
  const surface = theme.isV3 ? theme.colors.surface : '#fff';
  const outline = theme.isV3 ? theme.colors.outline : '#999';

  const hour24 = value.getHours();
  const minute = value.getMinutes();
  const isPM = hour24 >= 12;

  const displayHour = hours24 ? hour24 : hour24 % 12 === 0 ? 12 : hour24 % 12;

  const emit = (nextHour: number, nextMinute: number) => {
    const next = new Date(value);
    // Let Date carry over/underflow across hour and minute boundaries.
    next.setHours(nextHour, nextMinute, 0, 0);
    onChange(next);
  };

  const stepHour = (delta: number) => emit(hour24 + delta, minute);
  const stepMinute = (delta: number) => emit(hour24, minute + delta);

  const togglePeriod = () => {
    emit(hour24 + (isPM ? -12 : 12), minute);
  };

  const PeriodToggle = () => (
    <View style={styles.toggle} testID={`${testID}-period`}>
      <Pressable
        testID={`${testID}-am`}
        onPress={() => {
          if (isPM) togglePeriod();
        }}
        accessibilityRole="button"
        accessibilityLabel="AM"
        accessibilityState={{ selected: !isPM }}
        style={[
          styles.toggleButton,
          {
            borderColor: outline,
            backgroundColor: !isPM ? primary : 'transparent',
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          } as ViewStyle,
        ]}
      >
        <Text style={{ color: !isPM ? surface : onSurface, fontSize: 14 }}>
          AM
        </Text>
      </Pressable>
      <Pressable
        testID={`${testID}-pm`}
        onPress={() => {
          if (!isPM) togglePeriod();
        }}
        accessibilityRole="button"
        accessibilityLabel="PM"
        accessibilityState={{ selected: isPM }}
        style={[
          styles.toggleButton,
          {
            borderColor: outline,
            backgroundColor: isPM ? primary : 'transparent',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            marginLeft: -1,
          } as ViewStyle,
        ]}
      >
        <Text style={{ color: isPM ? surface : onSurface, fontSize: 14 }}>
          PM
        </Text>
      </Pressable>
    </View>
  );

  const Stepper = ({
    testIDStem,
    onUp,
    onDown,
  }: {
    testIDStem: string;
    onUp: () => void;
    onDown: () => void;
  }) => (
    <View style={styles.field} testID={`${testIDStem}-field`}>
      <Pressable
        testID={`${testIDStem}-up`}
        onPress={onUp}
        accessibilityRole="button"
        accessibilityLabel="increment"
        style={styles.stepperButton}
      >
        <Text style={[styles.stepperText, { color: onSurface }]}>▲</Text>
      </Pressable>
      <Text
        testID={`${testIDStem}-value`}
        style={[styles.valueText, { color: onSurface }]}
      >
        {testIDStem === `${testID}-hour` ? pad(displayHour) : pad(minute)}
      </Text>
      <Pressable
        testID={`${testIDStem}-down`}
        onPress={onDown}
        accessibilityRole="button"
        accessibilityLabel="decrement"
        style={styles.stepperButton}
      >
        <Text style={[styles.stepperText, { color: onSurface }]}>▼</Text>
      </Pressable>
      <Text style={[styles.label, { color: outline }]}>
        {testIDStem === `${testID}-hour` ? 'Hour' : 'Minute'}
      </Text>
    </View>
  );

  return (
    <View
      testID={testID}
      style={[styles.container, { backgroundColor: surface }, style]}
    >
      <Stepper
        testIDStem={`${testID}-hour`}
        onUp={() => stepHour(1)}
        onDown={() => stepHour(-1)}
      />
      <Text style={[styles.colon, { color: onSurface }]}>:</Text>
      <Stepper
        testIDStem={`${testID}-minute`}
        onUp={() => stepMinute(minuteStep)}
        onDown={() => stepMinute(-minuteStep)}
      />
      {!hours24 ? <PeriodToggle /> : null}
    </View>
  );
}

export default TimePicker;
