import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { ChipTokens } from './tokens';
import { getChipColors } from './utils';
import type { ChipAvatarProps } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { EllipsizeProp, ThemeProp } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import type { IconSource } from '../Icon';
import Icon from '../Icon';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

// The trailing icon's ripple is a square that stretches flush to the chip's
// top/bottom edges, so it's sized to match the chip's height rather than a
// fixed value of its own.
const TRAILING_ICON_AREA_SIZE = ChipTokens.containerHeight;

// The icon glyph is centered inside that (larger) ripple square, so its own
// edge sits this far in from the ripple square's edge.
const TRAILING_ICON_INSET = (TRAILING_ICON_AREA_SIZE - ChipTokens.iconSize) / 2;

// Suppresses the browser's native focus outline so only our own focus
// indicator ring is visible. Not in StyleSheet because `outline` is outside ViewStyle.
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

export type Props = Omit<ViewProps, 'style'> & {
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
   * Leading icon to display for the `Chip`. Takes precedence over `avatar` when both are specified.
   */
  icon?: IconSource;
  /**
   * Leading avatar to display for the `Chip`. Ignored when `icon` is also specified.
   */
  avatar?: React.ReactNode;
  /**
   * Trailing icon to display for the `Chip`, independent of the close button (e.g. a dropdown or info icon).
   * Takes precedence over `onClose`'s close icon when both are specified.
   */
  trailingIcon?: IconSource;
  /**
   * Function to execute when the trailing icon is pressed. Only called when `trailingIcon` is specified.
   */
  onTrailingIconPress?: (e: GestureResponderEvent) => void;
  /**
   * Accessibility label for the trailing icon. This is read by the screen reader when the user taps the trailing icon.
   */
  trailingIconAccessibilityLabel?: string;
  /**
   * Icon to display as the close button for the `Chip`, rendered in the trailing icon slot. The icon appears only
   * when `onClose` is specified and `trailingIcon` is not.
   */
  closeIcon?: IconSource;
  /**
   * Whether chip is selected.
   */
  selected?: boolean;
  /**
   * Custom color to use for the label, leading icon, trailing icon, and outlined border,
   * overriding the default selected/unselected theme colors.
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
   * Ignored when `trailingIcon` is also specified — use `trailingIconAccessibilityLabel` instead.
   */
  closeIconAccessibilityLabel?: string;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the touchable element is pressed and invoked even before onPress.
   */
  onPressIn?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the touch is released even before onPress.
   */
  onPressOut?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on close button press, indicating the chip should be removed. The close button appears
   * only when this prop is specified and `trailingIcon` is not.
   */
  onClose?: () => void;
  /**
   * The number of milliseconds a user must touch the element before executing `onLongPress`.
   */
  delayLongPress?: number;
  /**
   * Whether the chip should have elevation.
   */
  elevated?: boolean;
  /**
   * Style of chip's text.
   */
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
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
  /**
   * Reference to the chip container.
   */
  ref?: React.Ref<View>;
};

/**
 * Chips are compact elements that can represent inputs, attributes, or actions.
 * They can have a leading icon or avatar, and a trailing icon (a close button or a custom action) on the right.
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
  trailingIcon,
  onTrailingIconPress,
  trailingIconAccessibilityLabel = 'Trailing icon',
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

  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const focusedSV = useSharedValue(0);
  const focusRingStyle = useAnimatedStyle(
    () => ({ opacity: focusedSV.value }),
    []
  );

  const trailingIconFocusedSV = useSharedValue(0);
  const trailingIconFocusRingStyle = useAnimatedStyle(
    () => ({ opacity: trailingIconFocusedSV.value }),
    []
  );

  const defaultBorderRadius = theme.shapes.corner.small;
  const {
    backgroundColor: customBackgroundColor,
    borderRadius = defaultBorderRadius,
  } = StyleSheet.flatten(style) || {};
  const focusRingBorderRadius =
    typeof borderRadius === 'number'
      ? borderRadius + ChipTokens.focusIndicatorOffset
      : borderRadius;

  const {
    borderColor,
    textColor,
    iconColor,
    trailingIconColor,
    contentOpacity,
    selectedBackgroundColor,
    backgroundColor,
    rippleColor,
    avatarOverlayColor,
  } = getChipColors({
    isOutlined,
    selected,
    elevated,
    focused,
    theme,
    selectedColor,
    customBackgroundColor,
    disabled,
  });

  const hasAvatar = !!avatar && !icon;
  const showSelectedIcon = selected && showSelectedCheck && !icon;
  const showLeadingIcon = !!icon || showSelectedIcon;
  const hasLeading = hasAvatar || showLeadingIcon;
  const hasTrailingIcon = !!trailingIcon;
  const hasClose = !hasTrailingIcon && !!onClose;
  const showTrailingIcon = hasTrailingIcon || hasClose;

  const leftPadding = hasAvatar
    ? ChipTokens.avatarLeadingPadding
    : hasLeading
      ? ChipTokens.iconLeadingPadding
      : ChipTokens.leadingPadding;
  const rightPadding = showTrailingIcon
    ? ChipTokens.trailingIconPadding + ChipTokens.iconSize + TRAILING_ICON_INSET
    : ChipTokens.trailingPadding;
  const touchTargetInset =
    (ChipTokens.minimumTouchTarget - ChipTokens.containerHeight) / 2;
  const touchTargetHitSlop = {
    top: touchTargetInset,
    bottom: touchTargetInset,
  };
  const trailingIconTouchTargetInset =
    (ChipTokens.minimumTouchTarget - TRAILING_ICON_AREA_SIZE) / 2;
  const trailingIconHitSlop = {
    top: trailingIconTouchTargetInset,
    bottom: trailingIconTouchTargetInset,
    left: trailingIconTouchTargetInset,
    right: trailingIconTouchTargetInset,
  };
  const trailingIconAndroidRipple =
    Platform.OS === 'android'
      ? {
          color: rippleColor,
          borderless: true,
          radius: TRAILING_ICON_AREA_SIZE / 2,
        }
      : undefined;

  return (
    <Surface
      backgroundColor={selected ? selectedBackgroundColor : backgroundColor}
      borderRadius={borderRadius}
      style={[styles.container, { borderColor }, style]}
      elevation={
        disabled
          ? 0
          : elevated
            ? hovered
              ? ChipTokens.elevatedHoverElevation
              : ChipTokens.elevatedElevation
            : ChipTokens.flatElevation
      }
      {...rest}
      testID={`${testID}-container`}
      theme={theme}
    >
      <TouchableRipple
        borderless
        background={background}
        rippleColor={rippleColor}
        style={[
          styles.touchable,
          { borderRadius },
          Platform.OS === 'web' ? webNoOutline : undefined,
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onFocus={(e) => {
          if (!isKeyboardFocusEvent(e)) return;
          focusedSV.value = 1;
          setFocused(true);
        }}
        onBlur={() => {
          focusedSV.value = 0;
          setFocused(false);
        }}
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
        <View
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
                    size={ChipTokens.iconSize}
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
                size={ChipTokens.iconSize}
                theme={theme}
              />
            </View>
          ) : null}
          <Text
            variant={ChipTokens.labelTypescale}
            selectable={false}
            numberOfLines={1}
            style={[styles.labelText, { color: textColor }, textStyle]}
            ellipsizeMode={ellipsizeMode}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
          >
            {children}
          </Text>
        </View>
      </TouchableRipple>
      {showTrailingIcon ? (
        <TouchableRipple
          borderless
          centered
          onPress={hasTrailingIcon ? onTrailingIconPress : onClose}
          disabled={disabled}
          role="button"
          aria-label={
            hasTrailingIcon
              ? trailingIconAccessibilityLabel
              : closeIconAccessibilityLabel
          }
          aria-disabled={disabled}
          testID={
            hasTrailingIcon ? `${testID}-trailing-icon` : `${testID}-close`
          }
          hitSlop={trailingIconHitSlop}
          background={trailingIconAndroidRipple}
          rippleColor={rippleColor}
          onFocus={(e) => {
            if (!isKeyboardFocusEvent(e)) return;
            trailingIconFocusedSV.value = 1;
          }}
          onBlur={() => {
            trailingIconFocusedSV.value = 0;
          }}
          style={[
            styles.closeButton,
            Platform.OS === 'web' ? webNoOutline : undefined,
            disabled ? { opacity: contentOpacity } : null,
          ]}
          theme={theme}
        >
          <Icon
            source={hasTrailingIcon ? trailingIcon : (closeIcon ?? 'close')}
            color={trailingIconColor}
            size={ChipTokens.iconSize}
            theme={theme}
          />
        </TouchableRipple>
      ) : null}
      {showTrailingIcon ? (
        <Animated.View
          style={[
            styles.trailingIconFocusRing,
            { borderColor: theme.colors[ChipTokens.focusIndicatorColor] },
            trailingIconFocusRingStyle,
          ]}
        />
      ) : null}
      <Animated.View
        style={[
          styles.focusRing,
          {
            borderRadius: focusRingBorderRadius,
            borderColor: theme.colors[ChipTokens.focusIndicatorColor],
          },
          focusRingStyle,
        ]}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: ChipTokens.containerHeight,
    borderWidth: ChipTokens.outlineWidth,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  touchable: {
    minHeight: ChipTokens.containerHeight,
    flexShrink: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  focusRing: {
    position: 'absolute',
    top: -ChipTokens.focusIndicatorOffset,
    left: -ChipTokens.focusIndicatorOffset,
    right: -ChipTokens.focusIndicatorOffset,
    bottom: -ChipTokens.focusIndicatorOffset,
    borderWidth: ChipTokens.focusIndicatorThickness,
    pointerEvents: 'none',
  },
  content: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarWrapper: {
    width: ChipTokens.avatarSize,
    height: ChipTokens.avatarSize,
    borderRadius: ChipTokens.avatarSize / 2,
    marginRight: ChipTokens.leadingLabelGap,
    overflow: 'hidden',
  },
  avatar: {
    width: ChipTokens.avatarSize,
    height: ChipTokens.avatarSize,
    borderRadius: ChipTokens.avatarSize / 2,
  },
  avatarSelectedOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadingIcon: {
    width: ChipTokens.iconSize,
    height: ChipTokens.iconSize,
    marginRight: ChipTokens.leadingLabelGap,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: TRAILING_ICON_AREA_SIZE,
    borderRadius: TRAILING_ICON_AREA_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailingIconFocusRing: {
    position: 'absolute',
    top: -ChipTokens.focusIndicatorOffset,
    bottom: -ChipTokens.focusIndicatorOffset,
    right: -ChipTokens.focusIndicatorOffset,
    width: TRAILING_ICON_AREA_SIZE + ChipTokens.focusIndicatorOffset * 2,
    borderRadius: TRAILING_ICON_AREA_SIZE / 2 + ChipTokens.focusIndicatorOffset,
    borderWidth: ChipTokens.focusIndicatorThickness,
    pointerEvents: 'none',
  },
  disabled: {
    opacity: ChipTokens.disabledContentOpacity,
  },
});

export default Chip;
