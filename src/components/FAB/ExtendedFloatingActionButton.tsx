import * as React from 'react';
import {
  AccessibilityState,
  GestureResponderEvent,
  Platform,
  PressableAndroidRippleConfig,
  StyleProp,
  Text as NativeText,
  TextLayoutEvent,
  View,
  ViewStyle,
} from 'react-native';

import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import FabShell from './FabShell';
import {
  FloatingActionButtonSize,
  FloatingActionButtonVariant,
} from './tokens';
import { getDimensions, getLabelSizeWeb } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';
import type { IconSource } from '../Icon';

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
  variant?: FloatingActionButtonVariant;
  /**
   * Spec size. Defaults to `default`.
   */
  size?: FloatingActionButtonSize;
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
  accessibilityLabel?: string;
  /**
   * Accessibility state forwarded to the underlying button.
   */
  accessibilityState?: AccessibilityState;
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
 * import { ExtendedFloatingActionButton } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [expanded, setExpanded] = React.useState(true);
 *
 *   return (
 *     <ExtendedFloatingActionButton
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
const ExtendedFloatingActionButton = forwardRef<View, Props>(
  (
    {
      icon,
      label,
      variant = 'tonalPrimary',
      size = 'default',
      expanded,
      visible = true,
      onPress,
      accessibilityLabel = label,
      accessibilityState,
      labelMaxFontSizeMultiplier,
      background,
      style,
      testID = 'extended-floating-action-button',
      theme: themeOverrides,
    },
    ref
  ) => {
    const theme = useInternalTheme(themeOverrides);
    const reduceMotion = useReduceMotion();
    const isWeb = Platform.OS === 'web';

    const dimensions = React.useMemo(
      () => getDimensions({ theme, size }),
      [theme, size]
    );

    const labelRef = React.useRef<NativeText & HTMLElement>(null);
    const initialLabelSize = isWeb ? getLabelSizeWeb(labelRef) : null;
    const [labelWidth, setLabelWidth] = React.useState<number>(
      initialLabelSize?.width ?? 0
    );

    const collapsedWidth = dimensions.width;
    const expandedWidth =
      dimensions.leading +
      dimensions.iconSize +
      dimensions.iconLabelGap +
      labelWidth +
      dimensions.trailing;

    const widthValue = useSharedValue(
      expanded ? expandedWidth : collapsedWidth
    );
    const labelOpacity = useSharedValue(expanded ? 1 : 0);

    React.useEffect(() => {
      if (!isWeb) {
        return;
      }
      const updateLabelSize = () => {
        if (labelRef.current) {
          const measured = getLabelSizeWeb(labelRef);
          if (measured) {
            setLabelWidth(measured.width);
          }
        }
      };
      updateLabelSize();
      window.addEventListener('resize', updateLabelSize);
      return () => {
        window.removeEventListener('resize', updateLabelSize);
      };
    }, [isWeb, label]);

    React.useEffect(() => {
      const targetWidth = expanded ? expandedWidth : collapsedWidth;
      const targetOpacity = expanded ? 1 : 0;
      if (reduceMotion) {
        widthValue.value = targetWidth;
        labelOpacity.value = targetOpacity;
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
      widthValue.value = withSpring(targetWidth, widthSpring);
      labelOpacity.value = withSpring(targetOpacity, opacitySpring);
    }, [
      expanded,
      expandedWidth,
      collapsedWidth,
      theme,
      reduceMotion,
      widthValue,
      labelOpacity,
    ]);

    const labelAnimatedStyle = useAnimatedStyle(() => ({
      opacity: labelOpacity.value,
    }));

    const onTextLayout = ({ nativeEvent }: TextLayoutEvent) => {
      const measured = Math.ceil(nativeEvent.lines[0]?.width ?? 0);
      if (measured !== labelWidth) {
        setLabelWidth(measured);
      }
    };

    return (
      <FabShell
        ref={ref}
        icon={icon}
        label={label}
        variant={variant}
        size={size}
        visible={visible}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={accessibilityState}
        background={background}
        widthShared={widthValue}
        labelMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
        labelAnimatedStyle={labelAnimatedStyle}
        labelRef={isWeb ? labelRef : undefined}
        onLabelTextLayout={Platform.OS === 'ios' ? onTextLayout : undefined}
        offscreenLabelMeasure={
          Platform.OS === 'android' ? onTextLayout : undefined
        }
        style={style}
        testID={testID}
        theme={themeOverrides}
      />
    );
  }
);

export default ExtendedFloatingActionButton;

// @component-docs ignore-next-line
export { ExtendedFloatingActionButton };
