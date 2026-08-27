import * as React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { getIconButtonColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, ThemeProp } from '../../types';
import { splitStyles } from '../../utils/splitStyles';
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
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const flattenedStyle = (StyleSheet.flatten(style) || {}) as ViewStyle;

  const { borderWidth = mode === 'outlined' && !selected ? 1 : 0 } =
    flattenedStyle;

  const [, borderRadiusStyles] = splitStyles(
    flattenedStyle,
    (style) => style.startsWith('border') && style.endsWith('Radius')
  );

  const shapeStyles = {
    borderRadius: buttonSize / 2,
    ...borderRadiusStyles,
  };

  const borderStyles = {
    borderWidth,
    borderColor,
    ...shapeStyles,
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
            shapeStyles,
          ]}
        />
      )}
      <TouchableRipple
        borderless
        centered
        onPress={onPress}
        aria-label={ariaLabel}
        style={[
          styles.touchable,
          shapeStyles,
          // The Surface used to clip the ripple, so the touchable does it now.
          // Native only: its own overflow does not clip its hitSlop, but on web
          // it would clip the touch target, where the container already clips.
          Platform.OS !== 'web' && styles.clipToShape,
          contentStyle,
        ]}
        role="button"
        aria-disabled={disabled}
        disabled={disabled}
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
    // No `overflow: 'hidden'`. An ancestor that clips also clips the touch
    // target, which is why the hitSlop this component used to pass never
    // applied. The overlay and the touchable clip themselves instead.
    margin: 6,
    elevation: 0,
  },
  touchable: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clipToShape: {
    overflow: 'hidden',
  },
});

export default IconButton;
