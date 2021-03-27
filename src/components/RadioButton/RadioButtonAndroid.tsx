import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import color from 'color';
import { RadioButtonContext, RadioButtonContextType } from './RadioButtonGroup';
import { handlePress, isChecked } from './utils';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { withTheme } from '../../core/theming';
import type { $RemoveChildren } from '../../types';

type Props = $RemoveChildren<typeof TouchableRipple> & {
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
   * Custom border color for radio border.
   */
  radioBorderColor?: string;
  /**
   * Custom color for radio.
   */
  color?: string;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
  /**
   * Custom border width for radio.
   */
  borderWidth?: number;
  /**
   * Custom dot size for radio.
   */
  dotSize?: number;
  /**
   * Custom size for radio.
   */
  radioSize?: number;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

const BORDER_WIDTH = 1;
const DOT_SIZE = 16;
const RADIO_SIZE = 22;
/**
 * Radio buttons allow the selection a single option from a set.
 * This component follows platform guidelines for Android, but can be used
 * on any platform.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/radio-enabled.android.png" />
 *     <figcaption>Enabled</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-disabled.android.png" />
 *     <figcaption>Disabled</figcaption>
 *   </figure>
 * </div>
 */
const RadioButtonAndroid = ({
  disabled,
  onPress,
  theme,
  value,
  status,
  testID,
  ...rest
}: Props) => {
  const { current: borderAnim } = React.useRef<Animated.Value>(
    new Animated.Value(rest.borderWidth ? rest.borderWidth : BORDER_WIDTH)
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
        toValue: rest.borderWidth ? rest.borderWidth : BORDER_WIDTH,
        duration: 150 * scale,
        useNativeDriver: false,
      }).start();
    }
  }, [status, borderAnim, radioAnim, scale]);

  const checkedColor = rest.color || theme.colors.accent;
  const uncheckedColor =
    rest.uncheckedColor ||
    color(theme.colors.text)
      .alpha(theme.dark ? 0.7 : 0.54)
      .rgb()
      .string();

  let rippleColor: string, radioColor: string, radioBorderColor: string;

  return (
    <RadioButtonContext.Consumer>
      {(context?: RadioButtonContextType) => {
        const checked =
          isChecked({
            contextValue: context?.value,
            status,
            value,
          }) === 'checked';

        if (disabled) {
          rippleColor = color(theme.colors.text).alpha(0.16).rgb().string();
          radioColor = theme.colors.disabled;
        } else {
          rippleColor = color(checkedColor).fade(0.32).rgb().string();
          radioColor = checked ? checkedColor : uncheckedColor;
        }

        radioBorderColor = rest.radioBorderColor || radioColor;

        return (
          <TouchableRipple
            {...rest}
            borderless
            rippleColor={rippleColor}
            onPress={
              disabled
                ? undefined
                : () => {
                    handlePress({
                      onPress,
                      onValueChange: context?.onValueChange,
                      value,
                    });
                  }
            }
            // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
            accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
            accessibilityComponentType={
              checked ? 'radiobutton_checked' : 'radiobutton_unchecked'
            }
            accessibilityRole="radio"
            accessibilityState={{ disabled, checked }}
            accessibilityLiveRegion="polite"
            style={styles.container}
            testID={testID}
          >
            <Animated.View
              style={[
                styles.radio,
                {
                  borderColor: radioBorderColor,
                  borderWidth: borderAnim,
                  height: rest.radioSize || RADIO_SIZE,
                  width: rest.radioSize || RADIO_SIZE,
                  borderRadius: rest.radioSize ? rest.radioSize / 2 : RADIO_SIZE / 2,
                },
              ]}
            >
              {checked ? (
                <View style={[StyleSheet.absoluteFill, styles.radioContainer]}>
                  <Animated.View
                    style={[
                      {
                        height: rest.dotSize || DOT_SIZE,
                        width: rest.dotSize || DOT_SIZE,
                        borderRadius: rest.dotSize
                          ? rest.dotSize / 2
                          : DOT_SIZE / 2,
                        backgroundColor: radioColor,
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
    borderRadius: 10,
    margin: 8,
  },
});

export default withTheme(RadioButtonAndroid);

// @component-docs ignore-next-line
const RadioButtonAndroidWithTheme = withTheme(RadioButtonAndroid);
// @component-docs ignore-next-line
export { RadioButtonAndroidWithTheme as RadioButtonAndroid };
