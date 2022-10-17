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

import { withInternalTheme } from '../../core/theming';
import { white } from '../../styles/themes/v2/colors';
import type { EllipsizeProp, InternalTheme } from '../../types';
import type { IconSource } from '../Icon';
import Icon from '../Icon';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';
import { getChipColors } from './helpers';

export type Props = React.ComponentProps<typeof Surface> & {
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
   * @supported Available in v5.x with theme version 3
   * Whether to display overlay on selected chip
   */
  showSelectedOverlay?: boolean;
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
  theme: InternalTheme;
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
 *     <img class="small" src="screenshots/chip-1.png" />
 *     <figcaption>Flat chip</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="small" src="screenshots/chip-2.png" />
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
  showSelectedOverlay = false,
  ellipsizeMode,
  compact,
  elevated = false,
  ...rest
}: Props) => {
  const { isV3 } = theme;

  const { current: elevation } = React.useRef<Animated.Value>(
    new Animated.Value(isV3 && elevated ? 1 : 0)
  );

  const isOutlined = mode === 'outlined';

  const handlePressIn = () => {
    const { scale } = theme.animation;
    Animated.timing(elevation, {
      toValue: isV3 ? (elevated ? 2 : 0) : 4,
      duration: 200 * scale,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    const { scale } = theme.animation;
    Animated.timing(elevation, {
      toValue: isV3 && elevated ? 1 : 0,
      duration: 150 * scale,
      useNativeDriver: true,
    }).start();
  };

  const opacity = isV3 ? 0.38 : 0.26;
  const defaultBorderRadius = isV3 ? 8 : 16;
  const iconSize = isV3 ? 18 : 16;

  const {
    backgroundColor: customBackgroundColor,
    borderRadius = defaultBorderRadius,
  } = (StyleSheet.flatten(style) || {}) as ViewStyle;

  const {
    borderColor,
    textColor,
    iconColor,
    underlayColor,
    selectedBackgroundColor,
    backgroundColor,
  } = getChipColors({
    isOutlined,
    theme,
    selectedColor,
    showSelectedOverlay,
    customBackgroundColor,
    disabled,
  });

  const accessibilityState: AccessibilityState = {
    selected,
    disabled,
  };

  const elevationStyle = isV3 || Platform.OS === 'android' ? elevation : 0;
  const multiplier = isV3 ? (compact ? 1.5 : 2) : 1;
  const labelSpacings = {
    marginRight: onClose ? 0 : 8 * multiplier,
    marginLeft: avatar || icon || selected ? 4 * multiplier : 8 * multiplier,
  };
  const contentSpacings = {
    paddingRight: isV3 ? (onClose ? 34 : 0) : onClose ? 32 : 4,
  };
  const labelTextStyle = {
    color: textColor,
    ...(isV3 ? theme.fonts.labelLarge : theme.fonts.regular),
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
        style={[{ borderRadius }, styles.touchable]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        underlayColor={underlayColor}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
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
              isV3 ? styles.md3LabelText : styles.labelText,
              labelTextStyle,
              labelSpacings,
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
  labelText: {
    minHeight: 24,
    lineHeight: 24,
    textAlignVertical: 'center',
    marginVertical: 4,
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

export default withInternalTheme(Chip);
