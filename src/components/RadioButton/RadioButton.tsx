import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { RadioButtonContext } from './RadioButtonGroup';
import { RadioButtonTokens } from './tokens';
import { getSelectionControlColor, handlePress, isChecked } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
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
  const context = React.useContext(RadioButtonContext);

  const checked =
    isChecked({
      contextValue: context?.value,
      status,
      value,
    }) === 'checked';

  const reduceMotion = useReduceMotion();
  const reanimatedReduceMotion = reduceMotion
    ? ReduceMotion.Always
    : ReduceMotion.Never;

  // Single selection animation path: the dot scales in (with a slight
  // overshoot) when the radio becomes checked. The ring outline stays a
  // constant width. Keyed on `checked` (not `status`) so radios driven by a
  // `RadioButton.Group` animate too.
  const dotScale = useSharedValue(1);
  const isFirstRendering = React.useRef<boolean>(true);

  const dotTimingConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration.short3,
      easing: Easing.bezier(...theme.motion.easing.standard),
      reduceMotion: reanimatedReduceMotion,
    }),
    [
      theme.motion.duration.short3,
      theme.motion.easing.standard,
      reanimatedReduceMotion,
    ]
  );

  React.useEffect(() => {
    // Do not run animation on very first rendering
    if (isFirstRendering.current) {
      isFirstRendering.current = false;
      return;
    }

    if (checked) {
      // Jump to the overshoot value, then settle back to 1.
      dotScale.value = 1.2;
      dotScale.value = withTiming(1, dotTimingConfig);
    }
  }, [checked, dotScale, dotTimingConfig]);

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  const { selectionControlColor, selectionControlOpacity } =
    getSelectionControlColor({
      theme,
      disabled,
      checked,
      error,
      customColor: rest.color,
      customUncheckedColor: rest.uncheckedColor,
    });

  // When `accessible={false}` is passed (typically by `RadioButton.Item`,
  // which owns the a11y tree for the wrapped row), suppress our own role and
  // state so the same logical control doesn't expose two `checked` states to
  // assistive tech.
  const accessibilityProps =
    rest.accessible === false
      ? {}
      : {
          accessibilityRole: 'radio' as const,
          accessibilityState: { disabled: !!disabled, checked },
        };

  return (
    <TouchableRipple
      {...rest}
      borderless
      onPress={(event) => {
        handlePress({
          onPress,
          onValueChange: context?.onValueChange,
          value,
          event,
        });
      }}
      disabled={disabled}
      {...accessibilityProps}
      style={styles.container}
      testID={testID}
      theme={theme}
    >
      <View
        style={[
          styles.radio,
          {
            borderColor: selectionControlColor,
            opacity: selectionControlOpacity,
          },
        ]}
      >
        {checked ? (
          <View style={[StyleSheet.absoluteFill, styles.radioContainer]}>
            <Animated.View
              style={[
                styles.dot,
                { backgroundColor: selectionControlColor },
                dotAnimatedStyle,
              ]}
            />
          </View>
        ) : null}
      </View>
    </TouchableRipple>
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
