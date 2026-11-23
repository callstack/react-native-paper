import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  MouseEvent,
  NativeSyntheticEvent,
  TargetedEvent,
  ViewStyle,
} from 'react-native';

import Animated, { cubicBezier, type CSSStyle } from 'react-native-reanimated';

import { RadioButtonContext } from './RadioButtonGroup';
import { RadioButtonTokens } from './tokens';
import {
  getSelectionControlColor,
  getSelectionStateLayer,
  handlePress,
  isChecked,
  getInteraction,
} from './utils';
import { SettingsContext } from '../../core/settings';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { ThemeProp } from '../../theme/types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import { useSpaceKeyPress } from '../../utils/useSpaceKeyPress';
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
   * Function to execute on press. Without it, and outside a
   * `RadioButton.Group`, the radio is read only: it can't be pressed, and a
   * press goes to its parent.
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
  color,
  uncheckedColor,
  onFocus,
  onBlur,
  onHoverIn,
  onHoverOut,
  onPressIn,
  onPressOut,
  rippleColor,
  background,
  underlayColor,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const context = React.useContext(RadioButtonContext);
  const { rippleEffectEnabled } = React.useContext(SettingsContext);

  const checked =
    isChecked({
      contextValue: context?.value,
      status,
      value,
    }) === 'checked';

  const reduceMotion = useReduceMotion();

  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const { selectionControlColor, selectionControlOpacity } =
    getSelectionControlColor({
      theme,
      disabled,
      checked,
      error,
      customColor: color,
      customUncheckedColor: uncheckedColor,
    });

  const dotStyle: CSSStyle<ViewStyle> = {
    backgroundColor: selectionControlColor,
    transform: [{ scale: checked ? 1 : 0 }],
    transitionProperty: 'transform',
    transitionDuration: reduceMotion ? 0 : theme.motion.duration.short3,
    transitionTimingFunction: cubicBezier(...theme.motion.easing.standard),
  };

  const platformOwnsPress =
    rippleColor != null ||
    (Platform.OS === 'android' && background != null) ||
    (Platform.OS === 'ios' && underlayColor != null);

  // Without `onPress` and a `RadioButton.Group` there is nothing to select.
  const isPressable = Boolean(onPress || context?.onValueChange);
  // A handler-less radio would claim the touch and do nothing with it, so the
  // press handlers stay off unless there is something to call.
  const hasHandler =
    isPressable ||
    hasTouchHandler({ onLongPress: rest.onLongPress, onPressIn, onPressOut });
  const isInteractive = !disabled && hasHandler;

  const ownsPress =
    isInteractive && !platformOwnsPress && Boolean(rippleEffectEnabled);

  const platformPressProps = {
    background,
    underlayColor,
    rippleColor: platformOwnsPress ? rippleColor : 'transparent',
  };

  // A read-only or disabled radio can't be pressed, so it shows no state.
  const interaction = isInteractive
    ? getInteraction({
        pressed: pressed && ownsPress,
        focused,
        hovered,
      })
    : null;

  const stateLayerProps = {
    theme,
    checked,
    disabled,
    error,
    customColor: color,
    customUncheckedColor: uncheckedColor,
  };

  const stateLayer = getSelectionStateLayer({
    ...stateLayerProps,
    interaction,
  });

  const stateLayerColor = getSelectionStateLayer({
    ...stateLayerProps,
    interaction: interaction ?? 'hovered',
  }).color;

  const stateLayerStyle: CSSStyle<ViewStyle> = {
    backgroundColor: stateLayerColor,
    opacity: stateLayer.opacity,
    transitionProperty: 'opacity',
    transitionDuration: reduceMotion ? 0 : theme.motion.duration.short2,
    transitionTimingFunction: cubicBezier(...theme.motion.easing.standard),
  };

  const handleFocus = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      if (!disabled && isKeyboardFocusEvent(e)) {
        setFocused(true);
      }
      onFocus?.(e);
    },
    [disabled, onFocus]
  );

  const handleHoverIn = React.useCallback(
    (e: MouseEvent) => {
      setHovered(true);
      onHoverIn?.(e);
    },
    [onHoverIn]
  );

  const handleHoverOut = React.useCallback(
    (e: MouseEvent) => {
      setHovered(false);
      onHoverOut?.(e);
    },
    [onHoverOut]
  );

  const handlePressIn = React.useCallback(
    (e: GestureResponderEvent) => {
      if (ownsPress) {
        setPressed(true);
      }
      onPressIn?.(e);
    },
    [onPressIn, ownsPress]
  );

  const handlePressOut = React.useCallback(
    (e: GestureResponderEvent) => {
      setPressed(false);
      onPressOut?.(e);
    },
    [onPressOut]
  );

  const handleRadioPress = isPressable
    ? (event: GestureResponderEvent) => {
        handlePress({
          onPress,
          onValueChange: context?.onValueChange,
          value,
          event,
        });
      }
    : undefined;

  // React Native Web presses on Space only for `role="button"`, so the radio
  // handles Space itself.
  const { keyHandlers: spaceKeyHandlers, onBlur: handleSpaceKeyBlur } =
    useSpaceKeyPress({
      onPress: disabled ? undefined : handleRadioPress,
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
    });

  const handleBlur = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      setFocused(false);
      handleSpaceKeyBlur(e);
      onBlur?.(e);
    },
    [handleSpaceKeyBlur, onBlur]
  );

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
          // Announces a `status` change that comes from outside the radio,
          // such as a `RadioButton.Group` value set elsewhere.
          'aria-live': 'polite' as const,
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
      onFocus={handleFocus}
      onBlur={handleBlur}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      onPressIn={hasHandler ? handlePressIn : undefined}
      onPressOut={hasHandler ? handlePressOut : undefined}
      {...platformPressProps}
      // A radio with nothing to call (no `onPress` and no `RadioButton.Group`)
      // is read only and gets no handler, so it never takes a press meant for
      // its parent. A live radio is turned off with `disabled`, which keeps the
      // same element instead of remounting it. A read-only one still swaps
      // elements when `disabled` toggles.
      onPress={handleRadioPress}
      {...spaceKeyHandlers}
      disabled={disabled}
      {...accessibilityProps}
      style={combinedStyle}
      testID={testID}
      theme={theme}
    >
      <View pointerEvents="none" style={styles.stateLayer}>
        <Animated.View
          pointerEvents="none"
          testID={testID ? `${testID}-state-layer` : undefined}
          style={[styles.stateLayerFill, stateLayerStyle]}
        />
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
  stateLayerFill: {
    position: 'absolute',
    width: stateLayerSize,
    height: stateLayerSize,
    borderRadius: stateLayerSize / 2,
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
