import color from 'color';
import * as React from 'react';
import {
  Animated,
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  AccessibilityState,
} from 'react-native';
import ActivityIndicator from '../ActivityIndicator';
import Surface from '../Surface';
import CrossFadeIcon from '../CrossFadeIcon';
import Icon, { IconSource } from '../Icon';
import Text from '../Typography/Text';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { black, white } from '../../styles/colors';
import { withTheme } from '../../core/theming';
import getContrastingColor from '../../utils/getContrastingColor';
import type { $RemoveChildren } from '../../types';

getContrastingColor;

export type Props = $RemoveChildren<typeof Surface> & {
  /**
   * Icon to display for the `FAB`.
   */
  icon: IconSource;
  /**
   * Optional label for extended `FAB`.
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
   *  Whether FAB is mini-sized, used to create visual continuity with other elements. This has no effect if `label` is specified.
   */
  small?: boolean;
  /**
   * Custom color for the icon and label of the `FAB`.
   */
  color?: string;
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
  onPress?: () => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
  testID?: string;
};

/**
 * A floating action button represents the primary action in an application.
 *
 * <div class="screenshots">
 *   <img src="screenshots/fab-1.png" />
 *   <img src="screenshots/fab-2.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { StyleSheet } from 'react-native';
 * import { FAB } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <FAB
 *     style={styles.fab}
 *     small
 *     icon="plus"
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
const FAB = ({
  small,
  icon,
  label,
  accessibilityLabel = label,
  accessibilityState,
  animated = true,
  color: customColor,
  disabled,
  onPress,
  onLongPress,
  theme,
  style,
  visible = true,
  uppercase = true,
  loading,
  testID,
  ...rest
}: Props) => {
  const { current: visibility } = React.useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0)
  );
  const { scale } = theme.animation;

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

  const disabledColor = color(theme.dark ? white : black)
    .alpha(0.12)
    .rgb()
    .string();

  const { backgroundColor = disabled ? disabledColor : theme.colors.accent } =
    (StyleSheet.flatten(style) || {}) as ViewStyle;

  let foregroundColor;

  if (typeof customColor !== 'undefined') {
    foregroundColor = customColor;
  } else if (disabled) {
    foregroundColor = color(theme.dark ? white : black)
      .alpha(0.32)
      .rgb()
      .string();
  } else {
    foregroundColor = getContrastingColor(
      backgroundColor,
      white,
      'rgba(0, 0, 0, .54)'
    );
  }

  const rippleColor = color(foregroundColor).alpha(0.32).rgb().string();

  return (
    <Surface
      {...rest}
      style={
        [
          {
            backgroundColor,
            opacity: visibility,
            transform: [
              {
                scale: visibility,
              },
            ],
          },
          styles.container,
          disabled && styles.disabled,
          style,
        ] as StyleProp<ViewStyle>
      }
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableRipple
        borderless
        onPress={onPress}
        onLongPress={onLongPress}
        rippleColor={rippleColor}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
        accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
        accessibilityComponentType="button"
        accessibilityRole="button"
        accessibilityState={{ ...accessibilityState, disabled }}
        style={styles.touchable}
        testID={testID}
      >
        <View
          style={[
            styles.content,
            label ? styles.extended : small ? styles.small : styles.standard,
          ]}
          pointerEvents="none"
        >
          {icon && loading !== true ? (
            <IconComponent source={icon} size={24} color={foregroundColor} />
          ) : null}
          {loading ? (
            <ActivityIndicator size={18} color={foregroundColor} />
          ) : null}
          {label ? (
            <Text
              selectable={false}
              style={[
                styles.label,
                uppercase && styles.uppercaseLabel,
                { color: foregroundColor, ...theme.fonts.medium },
              ]}
            >
              {label}
            </Text>
          ) : null}
        </View>
      </TouchableRipple>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    elevation: 6,
  },
  touchable: {
    borderRadius: 28,
  },
  standard: {
    height: 56,
    width: 56,
  },
  small: {
    height: 40,
    width: 40,
  },
  extended: {
    height: 48,
    paddingHorizontal: 16,
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

export default withTheme(FAB);

// @component-docs ignore-next-line
const FABWithTheme = withTheme(FAB);
// @component-docs ignore-next-line
export { FABWithTheme as FAB };
