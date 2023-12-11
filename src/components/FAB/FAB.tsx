import * as React from 'react';
import {
  AccessibilityState,
  Animated,
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { getExtendedFabStyle, getFABColors, getFabStyle } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $Omit, $RemoveChildren, ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';
import ActivityIndicator from '../ActivityIndicator';
import CrossFadeIcon from '../CrossFadeIcon';
import Icon, { IconSource } from '../Icon';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

type FABSize = 'small' | 'medium' | 'large';

type FABMode = 'flat' | 'elevated';

type IconOrLabel =
  | {
      icon: IconSource;
      label?: string;
    }
  | {
      icon?: IconSource;
      label: string;
    };

export type Props = $Omit<$RemoveChildren<typeof Surface>, 'mode'> & {
  // For `icon` and `label` props their types are duplicated due to the generation of documentation.
  // Appropriate type for them is `IconOrLabel` contains the both union and intersection types.
  /**
   * Icon to display for the `FAB`. It's optional only if `label` is defined.
   */
  icon?: IconSource;
  /**
   * Optional label for extended `FAB`. It's optional only if `icon` is defined.
   */
  label?: string;
  /**
   * Make the label text uppercased.
   */
  uppercase?: boolean;
  /**
   * Accessibility label for the FAB. This is read by the screen reader when the user taps the FAB.
   * Uses `label` by default if specified.
   */
  accessibilityLabel?: string;
  /**
   * Accessibility state for the FAB. This is read by the screen reader when the user taps the FAB.
   */
  accessibilityState?: AccessibilityState;
  /**
   * Whether an icon change is animated.
   */
  animated?: boolean;
  /**
   *  @deprecated Deprecated in v.5x - use prop size="small".
   *
   *  Whether FAB is mini-sized, used to create visual continuity with other elements. This has no effect if `label` is specified.
   */
  small?: boolean;
  /**
   * Custom color for the icon and label of the `FAB`.
   */
  color?: string;
  /**
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
  /**
   * Whether `FAB` is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Whether `FAB` is currently visible.
   */
  visible?: boolean;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * The number of milliseconds a user must touch the element before executing `onLongPress`.
   */
  delayLongPress?: number;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Size of the `FAB`.
   * - `small` - FAB with small height (40).
   * - `medium` - FAB with default medium height (56).
   * - `large` - FAB with large height (96).
   */
  size?: FABSize;
  /**
   * Custom size for the `FAB`. This prop takes precedence over size prop
   */
  customSize?: number;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Mode of the `FAB`. You can change the mode to adjust the the shadow:
   * - `flat` - button without a shadow.
   * - `elevated` - button with a shadow.
   */
  mode?: FABMode;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Color mappings variant for combinations of container and icon colors.
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  ref?: React.RefObject<View>;
} & IconOrLabel;

/**
 * A floating action button represents the primary action on a screen. It appears in front of all screen content.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { StyleSheet } from 'react-native';
 * import { FAB } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <FAB
 *     icon="plus"
 *     style={styles.fab}
 *     onPress={() => console.log('Pressed')}
 *   />
 * );
 *
 * const styles = StyleSheet.create({
 *   fab: {
 *     position: 'absolute',
 *     margin: 16,
 *     right: 0,
 *     bottom: 0,
 *   },
 * })
 *
 * export default MyComponent;
 * ```
 */
const FAB = forwardRef<View, Props>(
  (
    {
      icon,
      label,
      accessibilityLabel = label,
      accessibilityState,
      animated = true,
      color: customColor,
      rippleColor: customRippleColor,
      disabled,
      onPress,
      onLongPress,
      delayLongPress,
      theme: themeOverrides,
      style,
      visible = true,
      uppercase: uppercaseProp,
      loading,
      testID = 'fab',
      size = 'medium',
      customSize,
      mode = 'elevated',
      variant = 'primary',
      labelMaxFontSizeMultiplier,
      ...rest
    }: Props,
    ref
  ) => {
    const theme = useInternalTheme(themeOverrides);
    const uppercase = uppercaseProp ?? !theme.isV3;
    const { current: visibility } = React.useRef<Animated.Value>(
      new Animated.Value(visible ? 1 : 0)
    );
    const { isV3, animation } = theme;
    const { scale } = animation;

    React.useEffect(() => {
      if (visible) {
        Animated.timing(visibility, {
          toValue: 1,
          duration: 200 * scale,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(visibility, {
          toValue: 0,
          duration: 150 * scale,
          useNativeDriver: true,
        }).start();
      }
    }, [visible, scale, visibility]);

    const IconComponent = animated ? CrossFadeIcon : Icon;

    const fabStyle = getFabStyle({ customSize, size, theme });

    const {
      borderRadius = fabStyle.borderRadius,
      backgroundColor: customBackgroundColor,
    } = (StyleSheet.flatten(style) || {}) as ViewStyle;

    const { backgroundColor, foregroundColor, rippleColor } = getFABColors({
      theme,
      variant,
      disabled,
      customColor,
      customBackgroundColor,
      customRippleColor,
    });

    const isLargeSize = size === 'large';
    const isFlatMode = mode === 'flat';
    const iconSize = isLargeSize ? 36 : 24;
    const loadingIndicatorSize = isLargeSize ? 24 : 18;
    const font = isV3 ? theme.fonts.labelLarge : theme.fonts.medium;

    const extendedStyle = getExtendedFabStyle({ customSize, theme });
    const textStyle = {
      color: foregroundColor,
      ...font,
    };

    const md3Elevation = isFlatMode || disabled ? 0 : 3;

    const newAccessibilityState = { ...accessibilityState, disabled };

    return (
      <Surface
        ref={ref}
        {...rest}
        style={[
          {
            borderRadius,
            backgroundColor,
            opacity: visibility,
            transform: [
              {
                scale: visibility,
              },
            ],
          },
          !isV3 && styles.elevated,
          !isV3 && disabled && styles.disabled,
          style,
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
        testID={`${testID}-container`}
        {...(isV3 && { elevation: md3Elevation })}
      >
        <TouchableRipple
          borderless
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={delayLongPress}
          rippleColor={rippleColor}
          disabled={disabled}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          accessibilityState={newAccessibilityState}
          testID={testID}
          style={{ borderRadius }}
          {...rest}
        >
          <View
            style={[styles.content, label ? extendedStyle : fabStyle]}
            testID={`${testID}-content`}
            pointerEvents="none"
          >
            {icon && loading !== true ? (
              <IconComponent
                source={icon}
                size={customSize ? customSize / 2 : iconSize}
                color={foregroundColor}
              />
            ) : null}
            {loading ? (
              <ActivityIndicator
                size={customSize ? customSize / 2 : loadingIndicatorSize}
                color={foregroundColor}
              />
            ) : null}
            {label ? (
              <Text
                variant="labelLarge"
                selectable={false}
                testID={`${testID}-text`}
                style={[
                  styles.label,
                  uppercase && styles.uppercaseLabel,
                  textStyle,
                ]}
                maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
              >
                {label}
              </Text>
            ) : null}
          </View>
        </TouchableRipple>
      </Surface>
    );
  }
);

const styles = StyleSheet.create({
  elevated: {
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginHorizontal: 8,
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
  disabled: {
    elevation: 0,
  },
});

export default FAB;

// @component-docs ignore-next-line
export { FAB };
