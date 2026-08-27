import * as React from 'react';
import { Animated, Platform, StyleSheet, Pressable, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import useLatestCallback from 'use-latest-callback';

import { getChipColors } from './helpers';
import type { ChipAvatarProps } from './helpers';
import { useInternalTheme } from '../../core/theming';
import { white } from '../../theme/colors';
import type { $Omit, EllipsizeProp, ThemeProp } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import type { IconSource } from '../Icon';
import Icon from '../Icon';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
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
  selectedColor?: ColorValue;
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
/**
 * Room the chip reserves on its right for the close button, which fills all of
 * it, so the body stops here and the two divide the chip.
 *
 * MD3 splits the same way and does not give a chip's trailing action 48dp; in
 * material-web it is 24x24 with no expansion. This column is wider than that and
 * gets no vertical expansion, so the strips above and below belong to the body
 * and a near miss activates the chip rather than deleting it.
 * @see https://github.com/material-components/material-web/blob/main/chips/internal/_trailing-icon.scss
 */
const CLOSE_AFFORDANCE_WIDTH = 34;

/**
 * Floor for the clamp below. The glyph is 18dp and sits 8dp from the right, so
 * under this it hangs over the chip body, and part of the visible icon would
 * activate the chip instead of removing it.
 */
const CLOSE_AFFORDANCE_MIN_WIDTH = 26;

const Chip = ({
  mode = 'flat',
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
  compact,
  elevated = false,
  maxFontSizeMultiplier,
  hitSlop,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
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
  const defaultBorderRadius = theme.shapes.corner.small;
  const iconSize = 18;

  const {
    backgroundColor: customBackgroundColor,
    borderRadius = defaultBorderRadius,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  } = (StyleSheet.flatten(style) || {}) as ViewStyle;

  const {
    borderColor,
    textColor,
    iconColor,
    contentOpacity,
    selectedBackgroundColor,
    backgroundColor,
  } = getChipColors({
    isOutlined,
    theme,
    selectedColor,
    customBackgroundColor,
    disabled,
  });

  const elevationStyle = elevation;
  const multiplier = compact ? 1.5 : 2;
  const labelSpacings = {
    marginRight: onClose ? 0 : 8 * multiplier,
    marginLeft:
      avatar || icon || (selected && showSelectedCheck)
        ? 4 * multiplier
        : 8 * multiplier,
  };
  const contentSpacings = {
    paddingRight: onClose ? CLOSE_AFFORDANCE_WIDTH : 0,
  };
  const labelTextStyle = {
    color: textColor,
    ...theme.fonts.labelLarge,
  };
  return (
    <Surface
      style={[
        styles.container,
        styles.md3Container,
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
      container
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
        disabled={disabled}
        aria-label={ariaLabel}
        role={role}
        aria-selected={selected}
        aria-disabled={disabled}
        testID={testID}
        theme={theme}
        hitSlop={hitSlop}
      >
        <View
          style={[
            styles.content,
            styles.md3Content,
            { opacity: contentOpacity },
            contentSpacings,
          ]}
        >
          {avatar && !icon ? (
            <View
              style={[
                styles.avatarWrapper,
                styles.md3AvatarWrapper,
                disabled && { opacity },
              ]}
            >
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
                styles.md3Icon,
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
            role="button"
            aria-label={closeIconAccessibilityLabel}
            style={styles.closeButton}
          >
            <View
              testID={`${testID}-close-icon`}
              style={[styles.icon, styles.closeIcon, styles.md3CloseIcon]}
            >
              {closeIcon ? (
                <Icon source={closeIcon} color={iconColor} size={iconSize} />
              ) : (
                <MaterialCommunityIcon
                  name="close"
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
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    flexDirection: Platform.select({ default: 'column', web: 'row' }),
  },
  md3Container: {
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    position: 'relative',
  },
  md3Content: {
    paddingLeft: 0,
  },
  icon: {
    padding: 4,
    alignSelf: 'center',
  },
  md3Icon: {
    paddingLeft: 8,
    paddingRight: 0,
  },
  closeIcon: {
    marginRight: 4,
  },
  md3CloseIcon: {
    marginRight: 8,
    padding: 0,
    // `styles.icon` sets `alignSelf: 'center'`, which beats `alignItems` on the
    // parent. Without this the glyph centres in the wider column and moves 4dp
    // left.
    alignSelf: 'flex-end',
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
    marginRight: 4,
  },
  md3AvatarWrapper: {
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
    width: CLOSE_AFFORDANCE_WIDTH,
    // A chip narrower than this column would hand the whole thing to the close
    // button. Never more than half, never less than the glyph needs; minWidth
    // wins over maxWidth.
    minWidth: CLOSE_AFFORDANCE_MIN_WIDTH,
    maxWidth: '50%',
    height: '100%',
  },
  closeButton: {
    width: '100%',
    height: '100%',
    // Vertical only. The glyph pins itself horizontally with `alignSelf`.
    justifyContent: 'center',
  },
  touchable: {
    width: '100%',
  },
});

export default Chip;
