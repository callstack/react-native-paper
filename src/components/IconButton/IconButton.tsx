import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { getIconButtonColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, ThemeProp } from '../../types';
import ActivityIndicator from '../ActivityIndicator';
import CrossFadeIcon from '../CrossFadeIcon';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

const PADDING = 8;

type IconButtonMode = 'outlined' | 'contained' | 'contained-tonal';

export type Props = Omit<$RemoveChildren<typeof TouchableRipple>, 'style'> & {
  /**
   * Icon to display.
   */
  icon: IconSource;
  /**
   * @supported Available in v5.x with theme version 3
   * Mode of the icon button. By default there is no specified mode - only pressable icon will be rendered.
   */
  mode?: IconButtonMode;
  /**
   * @renamed Renamed from 'color' to 'iconColor' in v5.x
   * Color of the icon.
   */
  iconColor?: ColorValue;
  /**
   * Background color of the icon container.
   */
  containerColor?: ColorValue;
  /**
   * Whether icon button is selected. A selected button receives alternative combination of icon and container colors.
   */
  selected?: boolean;
  /**
   * Size of the icon.
   */
  size?: number;
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Whether an icon change is animated.
   */
  animated?: boolean;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  'aria-label'?: string;
  /**
   * Style of button's inner content.
   * Use this prop to apply custom height and width or to set a custom padding`.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  ref?: React.Ref<View>;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
};

/**
 * An icon button is a button which displays only an icon without a label.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { IconButton, Palette } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <IconButton
 *     icon="camera"
 *     iconColor={Palette.error50}
 *     size={20}
 *     onPress={() => console.log('Pressed')}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/docs/components/TouchableRipple
 */
const IconButton = ({
  icon,
  iconColor: customIconColor,
  containerColor: customContainerColor,
  size = 24,
  'aria-label': ariaLabel,
  disabled,
  onPress,
  selected = false,
  animated = false,
  mode,
  style,
  theme: themeOverrides,
  testID = 'icon-button',
  loading = false,
  contentStyle,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const IconComponent = animated ? CrossFadeIcon : Icon;

  const {
    iconColor,
    iconOpacity,
    backgroundColor,
    borderColor,
    backgroundOpacity,
  } = getIconButtonColor({
    theme,
    disabled,
    selected,
    mode,
    customIconColor,
    customContainerColor,
  });

  const buttonSize = size + 2 * PADDING;

  const {
    borderWidth = mode === 'outlined' && !selected ? 1 : 0,
    borderRadius = buttonSize / 2,
  } = (StyleSheet.flatten(style) || {}) as ViewStyle;

  const borderStyles = {
    borderWidth,
    borderRadius,
    borderColor,
  };

  return (
    <Surface
      ref={ref}
      testID={`${testID}-container`}
      style={[
        {
          backgroundColor: backgroundOpacity < 1 ? undefined : backgroundColor,
          width: buttonSize,
          height: buttonSize,
        },
        styles.container,
        borderStyles,
        style,
      ]}
      container
      elevation={0}
    >
      {backgroundOpacity < 1 && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor, opacity: backgroundOpacity },
          ]}
        />
      )}
      <TouchableRipple
        borderless
        centered
        onPress={onPress}
        aria-label={ariaLabel}
        style={[styles.touchable, contentStyle]}
        role="button"
        aria-disabled={disabled}
        disabled={disabled}
        hitSlop={
          TouchableRipple.supported
            ? { top: 10, left: 10, bottom: 10, right: 10 }
            : { top: 6, left: 6, bottom: 6, right: 6 }
        }
        testID={testID}
        {...rest}
      >
        <View style={{ opacity: iconOpacity }}>
          {loading ? (
            <ActivityIndicator size={size} color={iconColor} />
          ) : (
            <IconComponent color={iconColor} source={icon} size={size} />
          )}
        </View>
      </TouchableRipple>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    margin: 6,
    elevation: 0,
  },
  touchable: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconButton;
