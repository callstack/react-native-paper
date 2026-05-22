import * as React from 'react';
import {
  Animated,
  ColorValue,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { CheckboxTokens } from './tokens';
import { getSelectionVisualState } from './utils';
import { useInternalTheme } from '../../core/theming';
import { tokens } from '../../theme/tokens';
import type { ThemeProp } from '../../types';
import useAnimatedValue from '../../utils/useAnimatedValue';
import { useFocusVisible } from '../../utils/useFocusVisible';

export type Props = {
  /**
   * Status of checkbox.
   */
  status: 'checked' | 'unchecked' | 'indeterminate';
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Custom color for unchecked checkbox.
   */
  uncheckedColor?: ColorValue;
  /**
   * Custom color for checkbox.
   */
  color?: ColorValue;
  /**
   * Whether the checkbox is in an error state. When true, the outline
   * (unchecked) and container (selected) use `theme.colors.error`.
   * `disabled` and explicit `color`/`uncheckedColor` overrides take
   * precedence.
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

const { focusIndicator } = tokens.md.sys.state;

/**
 * Checkboxes allow the selection of multiple options from a set.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Checkbox } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [checked, setChecked] = React.useState(false);
 *
 *   return (
 *     <Checkbox
 *       status={checked ? 'checked' : 'unchecked'}
 *       onPress={() => {
 *         setChecked(!checked);
 *       }}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Checkbox = ({
  status,
  theme: themeOverrides,
  disabled,
  onPress,
  testID,
  error,
  color,
  uncheckedColor,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { focusVisible, onFocus, onBlur } = useFocusVisible();
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const selected = status === 'checked' || status === 'indeterminate';

  const {
    animation: { scale },
  } = theme;

  // 0 = unselected (outline only), 1 = selected (filled + drawn icon).
  const fillAnim = useAnimatedValue(selected ? 1 : 0);
  const checkAnim = useAnimatedValue(selected ? 1 : 0);
  const firstRender = React.useRef(true);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    Animated.timing(fillAnim, {
      toValue: selected ? 1 : 0,
      duration: CheckboxTokens.fillDuration * scale,
      useNativeDriver: true,
    }).start();
    Animated.timing(checkAnim, {
      toValue: selected ? 1 : 0,
      duration: CheckboxTokens.checkDuration * scale,
      useNativeDriver: false,
    }).start();
  }, [selected, fillAnim, checkAnim, scale]);

  const visual = getSelectionVisualState({
    theme,
    selected,
    disabled,
    hovered,
    pressed,
    error,
    customColor: color,
    customUncheckedColor: uncheckedColor,
  });

  // Outline fades out as fill fades in (and vice versa).
  const outlineOpacity = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  // Remember which glyph to render so the reveal-mask can still collapse
  // when transitioning back to 'unchecked' (selected becomes false, but
  // we keep showing the previous glyph until checkAnim hits 0).
  const lastGlyph = React.useRef<'check' | 'indeterminate'>('check');
  if (status === 'checked') lastGlyph.current = 'check';
  else if (status === 'indeterminate') lastGlyph.current = 'indeterminate';
  const showIndeterminate = lastGlyph.current === 'indeterminate';

  return (
    <Pressable
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{
        disabled,
        checked: status === 'indeterminate' ? 'mixed' : status === 'checked',
      }}
      accessibilityLiveRegion="polite"
      testID={testID}
      style={styles.tapTarget}
    >
      <View
        pointerEvents="none"
        style={[
          styles.stateLayer,
          {
            backgroundColor: visual.stateLayerColor,
            opacity: visual.stateLayerOpacity,
          },
        ]}
      />
      {focusVisible && !disabled ? (
        <View
          pointerEvents="none"
          style={[
            styles.focusRing,
            {
              borderColor: theme.colors[CheckboxTokens.focusIndicatorColor],
              borderWidth: focusIndicator.thickness,
            },
          ]}
        />
      ) : null}
      <View
        pointerEvents="none"
        style={[styles.container, { opacity: visual.containerOpacity }]}
      >
        <Animated.View
          style={[
            styles.outline,
            { borderColor: visual.outlineColor, opacity: outlineOpacity },
          ]}
        />
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: visual.containerColor, opacity: fillAnim },
          ]}
        />
        <RevealMask progress={checkAnim}>
          {showIndeterminate ? (
            <View
              style={[styles.dash, { backgroundColor: visual.iconColor }]}
            />
          ) : (
            <View
              style={[styles.checkmarkGlyph, { borderColor: visual.iconColor }]}
            />
          )}
        </RevealMask>
      </View>
    </Pressable>
  );
};

/**
 * Reveal-mask wrapper: animates its width from 0 -> containerSize so the
 * child glyph "draws in" left-to-right, approximating Compose Material3's
 * stroke-fraction animation without an SVG dependency.
 */
const RevealMask = ({
  progress,
  children,
}: {
  progress: Animated.Value;
  children: React.ReactNode;
}) => {
  const maskWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CheckboxTokens.containerSize],
  });
  return (
    <Animated.View
      style={[styles.checkmarkMask, { width: maskWidth, opacity: progress }]}
    >
      <View style={styles.checkmarkContent}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tapTarget: {
    width: CheckboxTokens.stateLayerSize,
    height: CheckboxTokens.stateLayerSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CheckboxTokens.stateLayerSize,
    height: CheckboxTokens.stateLayerSize,
    borderRadius: CheckboxTokens.stateLayerSize / 2,
  },
  focusRing: {
    position: 'absolute',
    top: -focusIndicator.outerOffset,
    left: -focusIndicator.outerOffset,
    width: CheckboxTokens.stateLayerSize + focusIndicator.outerOffset * 2,
    height: CheckboxTokens.stateLayerSize + focusIndicator.outerOffset * 2,
    borderRadius:
      (CheckboxTokens.stateLayerSize + focusIndicator.outerOffset * 2) / 2,
  },
  container: {
    width: CheckboxTokens.containerSize,
    height: CheckboxTokens.containerSize,
    borderRadius: CheckboxTokens.containerRadius,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: CheckboxTokens.containerRadius,
  },
  outline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: CheckboxTokens.outlineWidth,
    borderRadius: CheckboxTokens.containerRadius,
  },
  dash: {
    width: CheckboxTokens.indeterminateWidth,
    height: CheckboxTokens.indeterminateHeight,
    borderRadius: CheckboxTokens.indeterminateRadius,
  },
  checkmarkMask: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: CheckboxTokens.containerSize,
    overflow: 'hidden',
  },
  checkmarkContent: {
    width: CheckboxTokens.containerSize,
    height: CheckboxTokens.containerSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkGlyph: {
    width: CheckboxTokens.checkmarkWidth,
    height: CheckboxTokens.checkmarkHeight,
    borderLeftWidth: CheckboxTokens.checkmarkStrokeWidth,
    borderBottomWidth: CheckboxTokens.checkmarkStrokeWidth,
    transform: [{ rotate: '-45deg' }, { translateY: -1 }, { translateX: 1 }],
  },
});

export default Checkbox;

// @component-docs ignore-next-line
const CheckboxWithTheme = Checkbox;
// @component-docs ignore-next-line
export { CheckboxWithTheme as Checkbox };
