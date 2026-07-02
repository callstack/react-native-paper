import * as React from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import Reanimated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';

import Shell from './Shell';
import { Size, Variant } from './tokens';
import { getDimensions } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { ThemeProp } from '../../types';
import type { IconSource } from '../Icon';
import AnimatedText from '../Typography/AnimatedText';

export type Props = {
  /**
   * Icon to display inside the FAB.
   */
  icon: IconSource;
  /**
   * Label rendered next to the icon when expanded.
   */
  label: string;
  /**
   * Role-color preset. Defaults to `tonalPrimary`.
   */
  variant?: Variant;
  /**
   * Override the container (background) color. When set without `contentColor`,
   * the icon and label colors are derived automatically via `contentColorFor`.
   */
  containerColor?: ColorValue;
  /**
   * Override the content (icon + label) color.
   */
  contentColor?: ColorValue;
  /**
   * Spec size. Defaults to `default`.
   */
  size?: Size;
  /**
   * Whether the FAB is expanded (icon + label) or collapsed (icon only). The
   * width and label opacity animate per the MD3 Expressive spec on change.
   */
  expanded: boolean;
  /**
   * Whether the FAB is currently visible. Toggling animates the spec'd enter
   * and exit (scale + alpha) on the FAB itself.
   */
  visible?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Accessibility label. Falls back to `label` if unset.
   */
  'aria-label'?: string;
  /**
   * Indicates whether the element is checked. Accepts `true`, `false`,
   * or `'mixed'` for an indeterminate state.
   */
  'aria-checked'?: boolean | 'mixed';
  /**
   * Indicates whether the element is selected.
   */
  'aria-selected'?: boolean;
  /**
   * Indicates whether the element is currently busy (e.g. loading).
   */
  'aria-busy'?: boolean;
  /**
   * Indicates whether the element's controlled content is expanded.
   */
  'aria-expanded'?: boolean;
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  /**
   * Type of background drawable to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Style for positioning the FAB. The visual treatment (size, shape, color)
   * is driven by `variant` and `size`.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * TestID used for testing purposes.
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * @optional
   */
  ref?: React.RefObject<View>;
};

/**
 * An extended floating action button represents the primary action on a screen
 * and shows a label next to the icon. Animates between expanded (icon + label)
 * and collapsed (icon only) states.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { StyleSheet } from 'react-native';
 * import { FAB } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [expanded, setExpanded] = React.useState(true);
 *
 *   return (
 *     <FAB.Extended
 *       icon="plus"
 *       label="New message"
 *       expanded={expanded}
 *       onPress={() => setExpanded((v) => !v)}
 *       style={styles.fab}
 *     />
 *   );
 * };
 *
 * const styles = StyleSheet.create({
 *   fab: {
 *     position: 'absolute',
 *     margin: 16,
 *     left: 0,
 *     bottom: 0,
 *   },
 * });
 *
 * export default MyComponent;
 * ```
 */
const Extended = ({
  icon,
  label,
  variant = 'tonalPrimary',
  containerColor,
  contentColor,
  size = 'default',
  expanded,
  visible = true,
  onPress,
  'aria-label': ariaLabel = label,
  'aria-checked': ariaChecked,
  'aria-selected': ariaSelected,
  'aria-busy': ariaBusy,
  'aria-expanded': ariaExpanded,
  labelMaxFontSizeMultiplier,
  background,
  style,
  testID = 'extended-floating-action-button',
  theme: themeOverrides,
  ref,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();

  const dimensions = getDimensions({ theme, size });

  const offscreenLabelRef = useAnimatedRef<Reanimated.View>();

  const widthValue = useSharedValue(dimensions.width);
  const labelOpacity = useSharedValue(expanded ? 1 : 0);

  React.useEffect(() => {
    const {
      width: collapsedWidth,
      leading,
      iconSize,
      iconLabelGap,
      trailing,
    } = dimensions;
    const targetOpacity = expanded ? 1 : 0;

    if (reduceMotion) {
      scheduleOnUI(() => {
        'worklet';
        const m = measure(offscreenLabelRef);
        const lw = m?.width ?? 0;
        widthValue.value = expanded
          ? leading + iconSize + iconLabelGap + lw + trailing
          : collapsedWidth;
        labelOpacity.value = targetOpacity;
      });
      return;
    }

    const widthSpring = toRawSpring(
      expanded
        ? theme.motion.spring.fast.spatial
        : theme.motion.spring.default.spatial
    );
    const opacitySpring = toRawSpring(
      expanded
        ? theme.motion.spring.default.effects
        : theme.motion.spring.fast.effects
    );

    scheduleOnUI(() => {
      'worklet';
      const m = measure(offscreenLabelRef);
      const lw = m?.width ?? 0;
      const expandedWidth = leading + iconSize + iconLabelGap + lw + trailing;
      widthValue.value = withSpring(
        expanded ? expandedWidth : collapsedWidth,
        widthSpring
      );
      labelOpacity.value = withSpring(targetOpacity, opacitySpring);
    });
  }, [
    expanded,
    label,
    dimensions,
    theme,
    reduceMotion,
    widthValue,
    labelOpacity,
    offscreenLabelRef,
  ]);

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  return (
    <>
      <Shell
        ref={ref}
        icon={icon}
        label={label}
        variant={variant}
        containerColor={containerColor}
        contentColor={contentColor}
        size={size}
        visible={visible}
        onPress={onPress}
        aria-label={ariaLabel}
        aria-checked={ariaChecked}
        aria-selected={ariaSelected}
        aria-busy={ariaBusy}
        aria-expanded={ariaExpanded}
        background={background}
        widthShared={widthValue}
        labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
        labelAnimatedStyle={labelAnimatedStyle}
        style={style}
        testID={testID}
        theme={themeOverrides}
      />
      <Reanimated.View
        ref={offscreenLabelRef}
        style={styles.offscreenMeasure}
        importantForAccessibility="no-hide-descendants"
        aria-hidden
      >
        <AnimatedText
          variant={dimensions.labelTypescale}
          numberOfLines={1}
          maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
        >
          {label}
        </AnimatedText>
      </Reanimated.View>
    </>
  );
};

const styles = StyleSheet.create({
  offscreenMeasure: {
    position: 'absolute',
    alignSelf: 'flex-start',
    opacity: 0,
    pointerEvents: 'none',
  },
});

export default Extended;

// @component-docs ignore-next-line
export { Extended };
