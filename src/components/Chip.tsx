import * as React from 'react';
import {
  AccessibilityState,
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import color from 'color';
import type { IconSource } from './Icon';
import Icon from './Icon';
import MaterialCommunityIcon from './MaterialCommunityIcon';
import Surface from './Surface';
import Text from './Typography/Text';
import TouchableRipple from './TouchableRipple/TouchableRipple';
import { withTheme } from '../core/theming';
import { black, white } from '../styles/themes/v2/colors';
import type { EllipsizeProp, Theme } from '../types';

type Props = React.ComponentProps<typeof Surface> & {
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
   */
  selectedColor?: string;
  /**
   * Whether the chip is disabled. A disabled chip is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
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
  onPress?: () => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: () => void;
  /**
   * Function to execute on close button press. The close button appears only when this prop is specified.
   */
  onClose?: () => void;
  /**
   * Style of chip's text
   */
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;

  /**
   * @optional
   */
  theme: Theme;
  /**
   * Pass down testID from chip props to touchable for Detox tests.
   */
  testID?: string;
  /**
   * Ellipsize Mode for the children text
   */
  ellipsizeMode?: EllipsizeProp;
};

/**
 * Chips can be used to display entities in small blocks.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/chip-1.png" />
 *     <figcaption>Flat chip</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/chip-2.png" />
 *     <figcaption>Outlined chip</figcaption>
 *   </figure>
 * </div>
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
  accessibilityLabel,
  closeIconAccessibilityLabel = 'Close',
  onPress,
  onLongPress,
  onClose,
  closeIcon,
  textStyle,
  style,
  theme,
  testID,
  selectedColor,
  ellipsizeMode,
  ...rest
}: Props) => {
  const { current: elevation } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );

  const isOutlined = mode === 'outlined';

  const handlePressIn = () => {
    const { scale } = theme.animation;
    Animated.timing(elevation, {
      toValue: 4,
      duration: 200 * scale,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    const { scale } = theme.animation;
    Animated.timing(elevation, {
      toValue: 0,
      duration: 150 * scale,
      useNativeDriver: false,
    }).start();
  };

  const { dark, colors, isV3 } = theme;

  let defaultBackgroundColor;

  if (isV3) {
    defaultBackgroundColor = isOutlined
      ? theme.colors.surface
      : theme.colors.secondaryContainer;
  } else {
    defaultBackgroundColor = isOutlined
      ? colors?.surface
      : dark
      ? '#383838'
      : '#ebebeb';
  }

  const opacity = isV3 ? 0.38 : 0.26;
  const defaultBorderRadius = isV3 ? 8 : 16;
  const iconSize = isV3 ? 18 : 16;

  const {
    backgroundColor: customBackgroundColor = defaultBackgroundColor,
    borderRadius = defaultBorderRadius,
  } = (StyleSheet.flatten(style) || {}) as ViewStyle;

  let borderColor;
  let textColor;
  let iconColor;
  let backgroundColor;
  let underlayColor;

  backgroundColor =
    typeof customBackgroundColor === 'string'
      ? customBackgroundColor
      : defaultBackgroundColor;

  const selectedBackgroundColor = (
    dark
      ? color(backgroundColor).lighten(mode === 'outlined' ? 0.2 : 0.4)
      : color(backgroundColor).darken(mode === 'outlined' ? 0.08 : 0.2)
  )
    .rgb()
    .string();

  if (isV3) {
    if (disabled) {
      const customDisabledColor = color(theme.colors.onSurfaceVariant)
        .alpha(0.12)
        .rgb()
        .string();
      borderColor = customDisabledColor;
      textColor = iconColor = theme.colors.onSurfaceDisabled;
      backgroundColor = isOutlined ? 'transparent' : customDisabledColor;
    } else {
      borderColor = theme.colors.outline;
      textColor = iconColor = isOutlined
        ? theme.colors.onSurfaceVariant
        : theme.colors.onSecondaryContainer;
      underlayColor = color(textColor).alpha(0.12).rgb().string();
    }
  } else {
    borderColor = isOutlined
      ? color(
          selectedColor !== undefined
            ? selectedColor
            : color(dark ? white : black)
        )
          .alpha(0.29)
          .rgb()
          .string()
      : backgroundColor;
    if (disabled) {
      textColor = theme.colors.disabled;
      iconColor = theme.colors.disabled;
    } else {
      const customTextColor =
        selectedColor !== undefined ? selectedColor : theme.colors.text;
      textColor = color(customTextColor).alpha(0.87).rgb().string();
      iconColor = color(customTextColor).alpha(0.54).rgb().string();
      underlayColor = selectedColor
        ? color(selectedColor).fade(0.5).rgb().string()
        : selectedBackgroundColor;
    }
  }

  const accessibilityTraits = ['button'];
  const accessibilityState: AccessibilityState = {
    selected,
    disabled,
  };

  if (selected) {
    accessibilityTraits.push('selected');
  }

  if (disabled) {
    accessibilityTraits.push('disabled');
  }

  const elevationStyle = Platform.OS === 'android' ? elevation : 0;
  const multiplier = isV3 ? 2 : 1;
  const labelSpacings = {
    marginRight: onClose ? 0 : 8 * multiplier,
    marginLeft: avatar || icon || selected ? 4 * multiplier : 8 * multiplier,
  };
  const contentSpacings = {
    paddingRight: isV3 ? (onClose ? 34 : 0) : onClose ? 32 : 8,
  };

  return (
    <Surface
      style={
        [
          styles.container,
          isV3 &&
            (isOutlined ? styles.md3OutlineContainer : styles.md3FlatContainer),
          !theme.isV3 && {
            elevation: elevationStyle,
          },
          {
            backgroundColor: selected
              ? selectedBackgroundColor
              : backgroundColor,
            borderColor,
            borderRadius,
          },
          style,
        ] as StyleProp<ViewStyle>
      }
      {...(theme.isV3 && { elevation: elevationStyle })}
      {...rest}
    >
      <TouchableRipple
        borderless
        delayPressIn={0}
        style={[{ borderRadius }, styles.touchable]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        underlayColor={underlayColor}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
        accessibilityTraits={accessibilityTraits}
        accessibilityComponentType="button"
        accessibilityRole="button"
        accessibilityState={accessibilityState}
        testID={testID}
      >
        <View
          style={[styles.content, isV3 && styles.md3Content, contentSpacings]}
        >
          {avatar && !icon ? (
            <View
              style={[
                styles.avatarWrapper,
                isV3 && styles.md3AvatarWrapper,
                disabled && { opacity },
              ]}
            >
              {React.isValidElement(avatar)
                ? React.cloneElement(avatar, {
                    style: [styles.avatar, avatar.props.style],
                  })
                : avatar}
            </View>
          ) : null}
          {icon || selected ? (
            <View
              style={[
                styles.icon,
                isV3 && styles.md3Icon,
                avatar
                  ? [
                      styles.avatar,
                      styles.avatarSelected,
                      isV3 && selected && styles.md3SelectedIcon,
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
                      : !disabled && theme.isV3
                      ? theme.colors.primary
                      : iconColor
                  }
                  size={18}
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
              styles.text,
              labelSpacings,
              {
                color: textColor,
                ...(isV3 && {
                  ...theme.fonts.regular,
                }),
              },
              textStyle,
            ]}
            ellipsizeMode={ellipsizeMode}
          >
            {children}
          </Text>
        </View>
      </TouchableRipple>
      {onClose ? (
        <View style={styles.closeButtonStyle}>
          <TouchableWithoutFeedback
            onPress={onClose}
            // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
            accessibilityTraits="button"
            accessibilityComponentType="button"
            accessibilityRole="button"
            accessibilityLabel={closeIconAccessibilityLabel}
          >
            <View
              style={[
                styles.icon,
                styles.closeIcon,
                isV3 && styles.md3CloseIcon,
              ]}
            >
              {closeIcon ? (
                <Icon source={closeIcon} color={iconColor} size={iconSize} />
              ) : (
                <MaterialCommunityIcon
                  name={isV3 ? 'close' : 'close-circle'}
                  size={iconSize}
                  color={iconColor}
                  direction="ltr"
                />
              )}
            </View>
          </TouchableWithoutFeedback>
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
  md3OutlineContainer: {
    borderWidth: 1,
  },
  md3FlatContainer: {
    borderWidth: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    position: 'relative',
    flexGrow: 1,
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
  },
  text: {
    minHeight: 24,
    lineHeight: 24,
    textAlignVertical: 'center',
    marginVertical: 4,
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
  },
  md3SelectedIcon: {
    paddingLeft: 4,
  },
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
    flexGrow: 1,
  },
});

export default withTheme(Chip);
