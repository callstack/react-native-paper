import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { GestureResponderEvent, ViewStyle } from 'react-native';

import Animated, { cubicBezier, type CSSStyle } from 'react-native-reanimated';

import { RadioButtonContext } from './RadioButtonGroup';
import { RadioButtonTokens } from './tokens';
import { getSelectionControlColor, handlePress, isChecked } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { ThemeProp } from '../../theme/types';
import type { PressableStateCallbackType } from '../TouchableRipple/Pressable';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

export type Props = Omit<
  React.PropsWithoutRef<TouchableRippleProps>,
  'children'
> & {
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
  onPress?: (e: GestureResponderEvent) => void;
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

const {
  ringSize,
  dotSize,
  outlineWidth: OUTLINE_WIDTH,
  stateLayerSize,
  touchTargetSize,
} = RadioButtonTokens;

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

  const { selectionControlColor, selectionControlOpacity } =
    getSelectionControlColor({
      theme,
      disabled,
      checked,
      error,
      customColor: rest.color,
      customUncheckedColor: rest.uncheckedColor,
    });

  const dotStyle: CSSStyle<ViewStyle> = {
    backgroundColor: selectionControlColor,
    transform: [{ scale: checked ? 1 : 0 }],
    transitionProperty: 'transform',
    transitionDuration: reduceMotion ? 0 : theme.motion.duration.short3,
    transitionTimingFunction: cubicBezier(...theme.motion.easing.standard),
  };

  // When `accessible={false}` is passed (typically by `RadioButton.Item`,
  // which owns the a11y tree for the wrapped row), suppress our own role and
  // state so the same logical control doesn't expose two `checked` states to
  // assistive tech.
  const accessibilityProps =
    rest.accessible === false
      ? {}
      : {
          role: 'radio' as const,
          'aria-disabled': !!disabled,
          'aria-checked': checked,
        };

  const { style: restStyle, ...restProps } = rest;
  const combinedStyle =
    typeof restStyle === 'function'
      ? (state: PressableStateCallbackType) => [
          styles.container,
          restStyle(state),
        ]
      : [styles.container, restStyle];

  return (
    <TouchableRipple
      {...restProps}
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
      style={combinedStyle}
      testID={testID}
      theme={theme}
    >
      <View pointerEvents="none" style={styles.stateLayer}>
        <View
          style={[
            styles.radio,
            {
              borderColor: selectionControlColor,
              opacity: selectionControlOpacity,
            },
          ]}
        >
          <Animated.View style={[styles.dot, dotStyle]} />
        </View>
      </View>
    </TouchableRipple>
  );
};

RadioButton.displayName = 'RadioButton';

const styles = StyleSheet.create({
  container: {
    width: touchTargetSize,
    height: touchTargetSize,
    borderRadius: touchTargetSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateLayer: {
    width: stateLayerSize,
    height: stateLayerSize,
    borderRadius: stateLayerSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    height: ringSize,
    width: ringSize,
    borderRadius: ringSize / 2,
    borderWidth: OUTLINE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: dotSize,
    width: dotSize,
    borderRadius: dotSize / 2,
  },
});

export default RadioButton;
