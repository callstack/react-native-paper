import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { RadioButtonContext, RadioButtonContextType } from './RadioButtonGroup';
import { handlePress, isChecked } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, ThemeProp } from '../../types';
import { getAndroidSelectionControlColor } from '../Checkbox/utils';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Value of the radio button
   */
  value: string;
  /**
   * Status of radio button.
   */
  status?: 'checked' | 'unchecked';
  /**
   * Whether radio is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (param?: any) => void;
  /**
   * Custom color for unchecked radio.
   */
  uncheckedColor?: string;
  /**
   * Custom color for radio.
   */
  color?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

const BORDER_WIDTH = 2;

/**
 * Radio buttons allow the selection a single option from a set.
 * This component follows platform guidelines for Android, but can be used
 * on any platform.
 */
const RadioButtonAndroid = ({
  disabled,
  onPress,
  theme: themeOverrides,
  value,
  status,
  testID,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { current: borderAnim } = React.useRef<Animated.Value>(
    new Animated.Value(BORDER_WIDTH)
  );

  const { current: radioAnim } = React.useRef<Animated.Value>(
    new Animated.Value(1)
  );

  const isFirstRendering = React.useRef<boolean>(true);

  const { scale } = theme.animation;

  React.useEffect(() => {
    // Do not run animation on very first rendering
    if (isFirstRendering.current) {
      isFirstRendering.current = false;
      return;
    }

    if (status === 'checked') {
      radioAnim.setValue(1.2);

      Animated.timing(radioAnim, {
        toValue: 1,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start();
    } else {
      borderAnim.setValue(10);

      Animated.timing(borderAnim, {
        toValue: BORDER_WIDTH,
        duration: 150 * scale,
        useNativeDriver: false,
      }).start();
    }
  }, [status, borderAnim, radioAnim, scale]);

  return (
    <RadioButtonContext.Consumer>
      {(context?: RadioButtonContextType) => {
        const checked =
          isChecked({
            contextValue: context?.value,
            status,
            value,
          }) === 'checked';

        const { rippleColor, selectionControlColor } =
          getAndroidSelectionControlColor({
            theme,
            disabled,
            checked,
            customColor: rest.color,
            customUncheckedColor: rest.uncheckedColor,
          });

        return (
          <TouchableRipple
            {...rest}
            borderless
            rippleColor={rippleColor}
            onPress={
              disabled
                ? undefined
                : (event) => {
                    handlePress({
                      onPress,
                      onValueChange: context?.onValueChange,
                      value,
                      event,
                    });
                  }
            }
            accessibilityRole="radio"
            accessibilityState={{ disabled, checked }}
            accessibilityLiveRegion="polite"
            style={styles.container}
            testID={testID}
            theme={theme}
          >
            <Animated.View
              style={[
                styles.radio,
                {
                  borderColor: selectionControlColor,
                  borderWidth: borderAnim,
                },
              ]}
            >
              {checked ? (
                <View style={[StyleSheet.absoluteFill, styles.radioContainer]}>
                  <Animated.View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: selectionControlColor,
                        transform: [{ scale: radioAnim }],
                      },
                    ]}
                  />
                </View>
              ) : null}
            </Animated.View>
          </TouchableRipple>
        );
      }}
    </RadioButtonContext.Consumer>
  );
};

RadioButtonAndroid.displayName = 'RadioButton.Android';

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    margin: 8,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});

export default RadioButtonAndroid;

// @component-docs ignore-next-line
export { RadioButtonAndroid };
