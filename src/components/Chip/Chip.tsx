import * as React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { getChipColors } from './helpers';
import type { ChipAvatarProps } from './helpers';
import {
  CHIP_AVATAR_LEADING_PADDING,
  CHIP_AVATAR_SIZE,
  CHIP_CLOSE_TRAILING_PADDING,
  CHIP_CONTAINER_HEIGHT,
  CHIP_DISABLED_CONTENT_OPACITY,
  CHIP_ELEVATED_ELEVATION,
  CHIP_FLAT_ELEVATION,
  CHIP_ICON_LEADING_PADDING,
  CHIP_LABEL_TYPESCALE,
  CHIP_LEADING_ICON_SIZE,
  CHIP_LEADING_LABEL_GAP,
  CHIP_LEADING_PADDING,
  CHIP_MINIMUM_TOUCH_TARGET,
  CHIP_OUTLINE_WIDTH,
  CHIP_SELECTED_ICON_SIZE,
  CHIP_TRAILING_ICON_SIZE,
  CHIP_TRAILING_ICON_TOUCH_TARGET,
  CHIP_TRAILING_PADDING,
} from './tokens';
import { useInternalTheme } from '../../core/theming';
import type { EllipsizeProp, ThemeProp } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import type { IconSource } from '../Icon';
import Icon from '../Icon';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = Omit<React.ComponentProps<typeof Surface>, 'mode'> & {
  /**
   * Mode of the chip.
   * - `flat` - chip with a filled container.
   * - `outlined` - chip with an outline when unselected.
   */
  mode?: 'flat' | 'outlined';
  /**
   * Text content of the `Chip`.
   */
  children: React.ReactNode;
  /**
   * Leading icon to display for the `Chip`. Both icon and avatar cannot be specified.
   */
  icon?: IconSource;
  /**
   * Leading avatar to display for the `Chip`. Both icon and avatar cannot be specified.
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
   * Applies to label, leading icon, trailing icon, and custom outlined border.
   */
  selectedColor?: ColorValue;
  /**
   * Whether to display default check icon on selected chip.
   * Note: Check will not be shown if `icon` is specified. If specified, `icon` will be shown regardless of `selected`.
   */
  showSelectedCheck?: boolean;
  /**
   * Whether the chip is disabled. A disabled chip is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Type of background drawable to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Accessibility label for the chip. This is read by the screen reader when the user taps the chip.
   */
  'aria-label'?: string;
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
   * Whether chip should have the elevation.
   */
  elevated?: boolean;
  /**
   * Style of chip's text.
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
   * Ellipsize Mode for the label text.
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
  mode = 'outlined',
  children,
  icon,
  avatar,
  selected = false,
  disabled = false,
  background,
  'aria-label': ariaLabel,
  role = 'button',
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
  showSelectedCheck = true,
  ellipsizeMode,
  elevated = false,
  maxFontSizeMultiplier,
  hitSlop,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const isOutlined = mode === 'outlined';

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });
  const isTouchableDisabled = disabled || !hasPassedTouchHandler;

  const defaultBorderRadius = theme.shapes.corner.small;
  const {
    backgroundColor: customBackgroundColor,
    borderRadius = defaultBorderRadius,
  } = (StyleSheet.flatten(style) || {}) as ViewStyle;

  const {
    borderColor,
    textColor,
    iconColor,
    closeIconColor,
    contentOpacity,
    selectedBackgroundColor,
    backgroundColor,
    rippleColor,
    avatarOverlayColor,
  } = getChipColors({
    isOutlined,
    selected,
    elevated,
    theme,
    selectedColor,
    customBackgroundColor,
    disabled,
  });

  const hasAvatar = !!avatar && !icon;
  const showSelectedIcon = selected && showSelectedCheck && !icon;
  const showLeadingIcon = !!icon || showSelectedIcon;
  const hasLeading = hasAvatar || showLeadingIcon;
  const hasClose = !!onClose;

  const leftPadding = hasAvatar
    ? CHIP_AVATAR_LEADING_PADDING
    : hasLeading
      ? CHIP_ICON_LEADING_PADDING
      : CHIP_LEADING_PADDING;
  const rightPadding = hasClose
    ? CHIP_CLOSE_TRAILING_PADDING
    : CHIP_TRAILING_PADDING;
  const touchTargetInset =
    (CHIP_MINIMUM_TOUCH_TARGET - CHIP_CONTAINER_HEIGHT) / 2;
  const touchTargetHitSlop = {
    top: touchTargetInset,
    bottom: touchTargetInset,
  };
  const closeAndroidRipple =
    Platform.OS === 'android'
      ? {
          color: rippleColor,
          borderless: true,
          radius: CHIP_TRAILING_ICON_TOUCH_TARGET / 2,
        }
      : undefined;

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
      elevation={
        disabled ? 0 : elevated ? CHIP_ELEVATED_ELEVATION : CHIP_FLAT_ELEVATION
      }
      {...rest}
      testID={`${testID}-container`}
      theme={theme}
      container
    >
      <TouchableRipple
        borderless
        background={background}
        rippleColor={rippleColor}
        style={[styles.touchable, styles.rippleLayer, { borderRadius }]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        delayLongPress={delayLongPress}
        disabled={isTouchableDisabled}
        aria-label={ariaLabel}
        role={role}
        aria-selected={selected}
        aria-disabled={isTouchableDisabled}
        testID={testID}
        theme={theme}
        hitSlop={hitSlop ?? touchTargetHitSlop}
      >
        <View style={styles.rippleContent} />
      </TouchableRipple>
      <View
        pointerEvents="none"
        style={[
          styles.content,
          {
            opacity: contentOpacity,
            paddingLeft: leftPadding,
            paddingRight: rightPadding,
          },
        ]}
      >
        {hasAvatar ? (
          <View style={[styles.avatarWrapper, disabled && styles.disabled]}>
            {React.isValidElement<ChipAvatarProps>(avatar)
              ? React.cloneElement(avatar, {
                  style: [styles.avatar, avatar.props.style],
                })
              : avatar}
            {showSelectedIcon ? (
              <View
                style={[
                  styles.avatarSelectedOverlay,
                  { backgroundColor: avatarOverlayColor },
                ]}
              >
                <Icon
                  source="check"
                  color={theme.colors.surface}
                  size={CHIP_SELECTED_ICON_SIZE}
                  theme={theme}
                />
              </View>
            ) : null}
          </View>
        ) : null}
        {showLeadingIcon && !hasAvatar ? (
          <View style={styles.leadingIcon}>
            <Icon
              source={icon ?? 'check'}
              color={iconColor}
              size={CHIP_LEADING_ICON_SIZE}
              theme={theme}
            />
          </View>
        ) : null}
        <Text
          variant={CHIP_LABEL_TYPESCALE}
          selectable={false}
          numberOfLines={1}
          style={[styles.labelText, { color: textColor }, textStyle]}
          ellipsizeMode={ellipsizeMode}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
        >
          {children}
        </Text>
      </View>
      {hasClose ? (
        <TouchableRipple
          borderless
          centered
          onPress={onClose}
          disabled={disabled}
          role="button"
          aria-label={closeIconAccessibilityLabel}
          aria-disabled={disabled}
          testID={`${testID}-close`}
          hitSlop={touchTargetHitSlop}
          background={closeAndroidRipple}
          rippleColor={rippleColor}
          style={[
            styles.closeButton,
            disabled ? { opacity: contentOpacity } : null,
          ]}
          theme={theme}
        >
          <Icon
            source={closeIcon ?? 'close'}
            color={closeIconColor}
            size={CHIP_TRAILING_ICON_SIZE}
            theme={theme}
          />
        </TouchableRipple>
      ) : null}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CHIP_CONTAINER_HEIGHT,
    borderWidth: CHIP_OUTLINE_WIDTH,
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  touchable: {
    height: '100%',
    flexGrow: 1,
    flexShrink: 1,
  },
  rippleLayer: {
    ...StyleSheet.absoluteFill,
  },
  rippleContent: {
    flex: 1,
  },
  content: {
    height: '100%',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarWrapper: {
    width: CHIP_AVATAR_SIZE,
    height: CHIP_AVATAR_SIZE,
    borderRadius: CHIP_AVATAR_SIZE / 2,
    marginRight: CHIP_LEADING_LABEL_GAP,
    overflow: 'hidden',
  },
  avatar: {
    width: CHIP_AVATAR_SIZE,
    height: CHIP_AVATAR_SIZE,
    borderRadius: CHIP_AVATAR_SIZE / 2,
  },
  avatarSelectedOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadingIcon: {
    width: CHIP_LEADING_ICON_SIZE,
    height: CHIP_LEADING_ICON_SIZE,
    marginRight: CHIP_LEADING_LABEL_GAP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  closeButton: {
    width: CHIP_TRAILING_ICON_TOUCH_TARGET,
    height: '100%',
    borderRadius: CHIP_TRAILING_ICON_TOUCH_TARGET / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: CHIP_DISABLED_CONTENT_OPACITY,
  },
});

export default Chip;
