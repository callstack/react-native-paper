import * as React from 'react';
import {
  AccessibilityState,
  Animated,
  ColorValue,
  GestureResponderEvent,
  Platform,
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  TextStyle,
  Pressable,
  View,
  ViewStyle,
} from 'react-native';

import useLatestCallback from 'use-latest-callback';

import { ChipAvatarProps, getChipColors } from './helpers';
import { useInternalTheme } from '../../core/theming';
import { white } from '../../styles/themes/v2/colors';
import type { $Omit, EllipsizeProp, ThemeProp } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import type { IconSource } from '../Icon';
import Icon from '../Icon';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Surface from '../Surface';
import TouchableRipple, {
  Props as TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = $Omit<React.ComponentProps<typeof Surface>, 'mode'> & {
  /**
   * Mode of the chip.
   * - `flat` - flat chip without outline.
   * - `outlined` - chip with an outline.
   */
  mode?: 'flat' | 'outlined';
  /**
   * Text content of the `Chip`.
   */
  children: React.ReactNode;
  /**
   * Icon to display for the `Chip`. Both icon and avatar cannot be specified.
   */
  icon?: IconSource;
  /**
   * Avatar to display for the `Chip`. Both icon and avatar cannot be specified.
   */
  avatar?: React.ReactNode;
  /**
   * Icon to display as the close button for the `Chip`. The icon appears only when the onClose prop is specified.
   */
  closeIcon?: IconSource;
  /**
   * Whether chip is selected.
   */
  selected?: boolean;
  /**
   * Whether to style the chip color as selected.
   * Note: With theme version 3 `selectedColor` doesn't apply to the `icon`.
   *       If you want specify custom color for the `icon`, render your own `Icon` component.
   */
  selectedColor?: string;
  /**
   * @supported Available in v5.x with theme version 3
   * Whether to display overlay on selected chip
   */
  showSelectedOverlay?: boolean;
  /**
   * Whether to display default check icon on selected chip.
   * Note: Check will not be shown if `icon` is specified. If specified, `icon` will be shown regardless of `selected`.
   */
  showSelectedCheck?: boolean;
  /**
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
  /**
   * Whether the chip is disabled. A disabled chip is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Accessibility label for the chip. This is read by the screen reader when the user taps the chip.
   */
  accessibilityLabel?: string;
  /**
   * Accessibility label for the close icon. This is read by the screen reader when the user taps the close icon.
   */
  closeIconAccessibilityLabel?: string;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: () => void;
  /**
   * Function to execute as soon as the touchable element is pressed and invoked even before onPress.
   */
  onPressIn?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the touch is released even before onPress.
   */
  onPressOut?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on close button press. The close button appears only when this prop is specified.
   */
  onClose?: () => void;
  /**
   * The number of milliseconds a user must touch the element before executing `onLongPress`.
   */
  delayLongPress?: number;
  /**
   * @supported Available in v5.x with theme version 3
   * Sets smaller horizontal paddings `12dp` around label, when there is only label.
   */
  compact?: boolean;
  /**
   * @supported Available in v5.x with theme version 3
   * Whether chip should have the elevation.
   */
  elevated?: boolean;
  /**
   * Style of chip's text
   */
  textStyle?: StyleProp<TextStyle>;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * Sets additional distance outside of element in which a press can be detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Pass down testID from chip props to touchable for Detox tests.
   */
  testID?: string;
  /**
   * Ellipsize Mode for the children text
   */
  ellipsizeMode?: EllipsizeProp;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
};

/**
 * Chips are compact elements that can represent inputs, attributes, or actions.
 * They can have an icon or avatar on the left, and a close button icon on the right.
 * They are typically used to:
 * <ul>
 *  <li>Present multiple options </li>
 *  <li>Represent attributes active or chosen </li>
 *  <li>Present filter options </li>
 *  <li>Trigger actions related to primary content </li>
 * </ul>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Chip } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Chip icon="information" onPress={() => console.log('Pressed')}>Example Chip</Chip>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Chip = ({
  mode = 'flat',
  children,
  icon,
  avatar,
  selected = false,
  disabled = false,
  background,
  accessibilityLabel,
  accessibilityRole = 'button',
  closeIconAccessibilityLabel = 'Close',
  onPress,
  onLongPress,
  onPressOut,
  onPressIn,
  delayLongPress,
  onClose,
  closeIcon,
  textStyle,
  style,
  theme: themeOverrides,
  testID = 'chip',
  selectedColor,
  rippleColor: customRippleColor,
  showSelectedOverlay = false,
  showSelectedCheck = true,
  ellipsizeMode,
  compact,
  elevated = false,
  maxFontSizeMultiplier,
  hitSlop,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { roundness } = theme;
  const isWeb = Platform.OS === 'web';

  const { current: elevation } = React.useRef<Animated.Value>(
    new Animated.Value(elevated ? 1 : 0)
  );

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const isOutlined = mode === 'outlined';

  const handlePressIn = useLatestCallback((e: GestureResponderEvent) => {
    const { scale } = theme.animation;
    onPressIn?.(e);
    Animated.timing(elevation, {
      toValue: elevated ? 2 : 0,
      duration: 200 * scale,
      useNativeDriver:
        isWeb || Platform.constants.reactNativeVersion.minor <= 72,
    }).start();
  });

  const handlePressOut = useLatestCallback((e: GestureResponderEvent) => {
    const { scale } = theme.animation;
    onPressOut?.(e);
    Animated.timing(elevation, {
      toValue: elevated ? 1 : 0,
      duration: 150 * scale,
      useNativeDriver:
        isWeb || Platform.constants.reactNativeVersion.minor <= 72,
    }).start();
  });

  const opacity = 0.38;
  const defaultBorderRadius = roundness * 2;
  const iconSize = 18;

  const {
    backgroundColor: customBackgroundColor,
    borderRadius = defaultBorderRadius,
  } = (StyleSheet.flatten(style) || {}) as ViewStyle;

  const {
    borderColor,
    textColor,
    iconColor,
    rippleColor,
    selectedBackgroundColor,
    backgroundColor,
  } = getChipColors({
    isOutlined,
    theme,
    selectedColor,
    showSelectedOverlay,
    customBackgroundColor,
    disabled,
    customRippleColor,
  });

  const accessibilityState: AccessibilityState = {
    selected,
    disabled,
  };

  const elevationStyle = Platform.OS === 'android' ? elevation : 0;
  const multiplier = compact ? 1.5 : 2;
  const labelSpacings = {
    marginRight: onClose ? 0 : 8 * multiplier,
    marginLeft:
      avatar || icon || (selected && showSelectedCheck)
        ? 4 * multiplier
        : 8 * multiplier,
  };
  const contentSpacings = {
    paddingRight: onClose ? 34 : 0,
  };
  const labelTextStyle = {
    color: textColor,
    ...theme.fonts.labelLarge,
  };
  return (
    <Surface
      style={[
        styles.container,
        {
          backgroundColor: selected ? selectedBackgroundColor : backgroundColor,
          borderColor,
          borderRadius,
        },
        style,
      ]}
      elevation={elevationStyle}
      {...rest}
      testID={`${testID}-container`}
      theme={theme}
    >
      <TouchableRipple
        borderless
        background={background}
        style={[{ borderRadius }, styles.touchable]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={hasPassedTouchHandler ? handlePressIn : undefined}
        onPressOut={hasPassedTouchHandler ? handlePressOut : undefined}
        delayLongPress={delayLongPress}
        rippleColor={rippleColor}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        testID={testID}
        theme={theme}
        hitSlop={hitSlop}
      >
        <View style={[styles.content, contentSpacings]}>
          {avatar && !icon ? (
            <View style={[styles.avatarWrapper, disabled && { opacity }]}>
              {React.isValidElement<ChipAvatarProps>(avatar)
                ? React.cloneElement(avatar, {
                    style: [styles.avatar, avatar.props.style],
                  })
                : avatar}
            </View>
          ) : null}
          {icon || (selected && showSelectedCheck) ? (
            <View
              style={[
                styles.icon,
                avatar
                  ? [
                      styles.avatar,
                      styles.avatarSelected,
                      selected && styles.md3SelectedIcon,
                    ]
                  : null,
              ]}
            >
              {icon ? (
                <Icon
                  source={icon}
                  color={
                    avatar
                      ? white
                      : !disabled
                      ? theme.colors.primary
                      : iconColor
                  }
                  size={18}
                  theme={theme}
                />
              ) : (
                <MaterialCommunityIcon
                  name="check"
                  color={avatar ? white : iconColor}
                  size={18}
                  direction="ltr"
                />
              )}
            </View>
          ) : null}
          <Text
            variant="labelLarge"
            selectable={false}
            numberOfLines={1}
            style={[
              styles.md3LabelText,
              labelTextStyle,
              labelSpacings,
              textStyle,
            ]}
            ellipsizeMode={ellipsizeMode}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
          >
            {children}
          </Text>
        </View>
      </TouchableRipple>
      {onClose ? (
        <View style={styles.closeButtonStyle}>
          <Pressable
            onPress={onClose}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={closeIconAccessibilityLabel}
          >
            <View style={[styles.icon, styles.closeIcon]}>
              {closeIcon ? (
                <Icon source={closeIcon} color={iconColor} size={iconSize} />
              ) : (
                <MaterialCommunityIcon
                  name={'close'}
                  size={iconSize}
                  color={iconColor}
                  direction="ltr"
                />
              )}
            </View>
          </Pressable>
        </View>
      ) : null}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'solid',
    flexDirection: Platform.select({ default: 'column', web: 'row' }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 0,
    position: 'relative',
  },
  icon: {
    padding: 4,
    paddingLeft: 8,
    paddingRight: 0,
    alignSelf: 'center',
  },
  closeIcon: {
    marginRight: 8,
    padding: 0,
  },
  md3LabelText: {
    textAlignVertical: 'center',
    marginVertical: 6,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  avatarWrapper: {
    marginLeft: 4,
    marginRight: 0,
  },
  md3SelectedIcon: {
    paddingLeft: 4,
  },
  // eslint-disable-next-line react-native/no-color-literals
  avatarSelected: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, .29)',
  },
  closeButtonStyle: {
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    width: '100%',
  },
});

export default Chip;
