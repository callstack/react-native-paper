import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { RadioButtonContext } from './RadioButtonGroup';
import type { RadioButtonContextType } from './RadioButtonGroup';
import { RadioButtonTokens } from './tokens';
import { getSelectionControlColor, handlePress, isChecked } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, ThemeProp } from '../../types';
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
   * Whether the radio button is in an error state. When true, the ring
   * (unchecked) and dot (selected) use `theme.colors.error`. `disabled`
   * and explicit `color`/`uncheckedColor` overrides take precedence.
   */
  error?: boolean;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

const { ringSize, dotSize, outlineWidth: OUTLINE_WIDTH } = RadioButtonTokens;

/**
 * Radio buttons allow the selection a single option from a set.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { RadioButton } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [checked, setChecked] = React.useState('first');
 *
 *   return (
 *     <View>
 *       <RadioButton
 *         value="first"
 *         status={ checked === 'first' ? 'checked' : 'unchecked' }
 *         onPress={() => setChecked('first')}
 *       />
 *       <RadioButton
 *         value="second"
 *         status={ checked === 'second' ? 'checked' : 'unchecked' }
 *         onPress={() => setChecked('second')}
 *       />
 *     </View>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 *
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/docs/components/TouchableRipple
 */
const RadioButton = ({
  disabled,
  onPress,
  theme: themeOverrides,
  value,
  status,
  testID,
  error,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  // Single selection animation path: the dot scales in (with a slight
  // overshoot) when the radio becomes checked. The ring outline stays a
  // constant width.
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
    }
  }, [status, radioAnim, scale]);

  return (
    <RadioButtonContext.Consumer>
      {(context?: RadioButtonContextType) => {
        const checked =
          isChecked({
            contextValue: context?.value,
            status,
            value,
          }) === 'checked';

        const { selectionControlColor } = getSelectionControlColor({
          theme,
          disabled,
          checked,
          error,
          customColor: rest.color,
          customUncheckedColor: rest.uncheckedColor,
        });

        return (
          <TouchableRipple
            {...rest}
            borderless
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
            <View
              style={[
                styles.radio,
                {
                  borderColor: selectionControlColor,
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
            </View>
          </TouchableRipple>
        );
      }}
    </RadioButtonContext.Consumer>
  );
};

RadioButton.displayName = 'RadioButton';

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    height: ringSize,
    width: ringSize,
    borderRadius: ringSize / 2,
    borderWidth: OUTLINE_WIDTH,
    margin: 8,
  },
  dot: {
    height: dotSize,
    width: dotSize,
    borderRadius: dotSize / 2,
  },
});

export default RadioButton;
