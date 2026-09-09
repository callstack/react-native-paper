import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { getIconButtonColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import getMinInteractiveSizeHitSlop from '../../utils/getMinInteractiveSizeHitSlop';
import ActivityIndicator from '../ActivityIndicator';
import CrossFadeIcon from '../CrossFadeIcon';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

const PADDING = 8;

type IconButtonMode = 'outlined' | 'contained' | 'contained-tonal';

export type Props = Omit<
  React.PropsWithoutRef<TouchableRippleProps>,
  'children' | 'style'
> & {
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
  /**
   * Radius of every corner of the button. Defaults to a circle (half of the
   * button's size). Read as a plain prop rather than out of `style`, since
   * `style` may be an animated value on the UI thread that a synchronous
   * `StyleSheet.flatten` cannot see.
   */
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderTopStartRadius?: number;
  borderTopEndRadius?: number;
  borderBottomStartRadius?: number;
  borderBottomEndRadius?: number;
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
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
  testID,
  loading = false,
  contentStyle,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderTopStartRadius,
  borderTopEndRadius,
  borderBottomStartRadius,
  borderBottomEndRadius,
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
  const borderWidth = mode === 'outlined' && !selected ? 1 : 0;

  const shapeStyles = {
    borderRadius: borderRadius ?? buttonSize / 2,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderTopStartRadius,
    borderTopEndRadius,
    borderBottomStartRadius,
    borderBottomEndRadius,
  };

  const borderStyles = {
    borderWidth,
    borderColor,
    ...shapeStyles,
  };

  // Computed straight from `size`, a plain prop known at render time, rather
  // than measured. `buttonSize` never changes after mount without `size` also
  // changing, so there is nothing to react to. A disabled button gets no
  // slop of its own, only what a caller's own `hitSlop` in `rest` supplies.
  const hitSlop = disabled
    ? undefined
    : getMinInteractiveSizeHitSlop({ width: buttonSize, height: buttonSize });

  return (
    <Animated.View
      ref={ref}
      testID={testID ? `${testID}-container` : undefined}
      style={[
        styles.container,
        {
          backgroundColor: backgroundOpacity < 1 ? undefined : backgroundColor,
          width: buttonSize,
          height: buttonSize,
        },
        borderStyles,
        style,
      ]}
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
        hitSlop={hitSlop}
        {...rest}
      >
        <View style={{ opacity: iconOpacity }}>
          {loading ? (
            <ActivityIndicator size={size} color={iconColor} />
          ) : (
            <IconComponent
              color={iconColor}
              source={icon}
              size={size}
              testID={testID ? `${testID}-icon` : undefined}
            />
          )}
        </View>
      </TouchableRipple>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // No `overflow: 'hidden'`. An ancestor that clips also clips the touch
    // target, which is why the hitSlop this component used to pass never
    // applied. The overlay and the touchable clip themselves instead.
    margin: 6,
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
