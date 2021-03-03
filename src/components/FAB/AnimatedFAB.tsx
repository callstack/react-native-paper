import color from 'color';
import * as React from 'react';
import {
  Animated,
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  Easing,
} from 'react-native';
import Surface from '../Surface';
import Icon from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { withTheme } from '../../core/theming';
import type { $RemoveChildren } from '../../types';
import type { IconSource } from './../Icon';
//@ts-ignore
import type { AccessibilityState, TextLayoutEvent } from 'react-native';
import { white, black } from '../../styles/colors';
import AnimatedText from '../Typography/AnimatedText';

type Props = $RemoveChildren<typeof Surface> & {
  /**
   * Icon to display for the `FAB`.
   */
  icon: IconSource;
  /**
   * Label for extended `FAB`.
   */
  label: string;
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
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: () => void;
  /**
   * Whether icon should be translated to the end of extended `FAB` or be static and stay in the same place. The default value is `dynamic`.
   */
  iconMode?: 'static' | 'dynamic';
  /**
   * Indicates from which direction animation should be performed. The default value is `right`.
   */
  animateFrom?: 'right' | 'left';
  /**
   * Whether `FAB` should start animation to extend.
   */
  extended: boolean;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
  testID?: string;
};

const SIZE = 56;

const AnimatedFAB = ({
  icon,
  label,
  accessibilityLabel = label,
  accessibilityState,
  color: customColor,
  disabled,
  onPress,
  onLongPress,
  theme,
  style,
  visible = true,
  uppercase = true,
  testID,
  animateFrom = 'right',
  extended = false,
  iconMode = 'dynamic',
  ...rest
}: Props) => {
  const { current: visibility } = React.useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0)
  );
  const { current: scaleFAB } = React.useRef(new Animated.Value(1));
  const { current: translateFAB } = React.useRef(new Animated.Value(0));
  const { current: translateIcon } = React.useRef(new Animated.Value(0));
  const { current: opacityLabel } = React.useRef(new Animated.Value(0));

  const { scale } = theme.animation;

  const [textWidth, setTextWidth] = React.useState<number>(0);
  const [textHeight, setTextHeight] = React.useState<number>(0);

  const animateFromRight = animateFrom === 'right';
  const isIconStatic = iconMode === 'static';

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

  const disabledColor = color(theme.dark ? white : black)
    .alpha(0.12)
    .rgb()
    .string();

  const { backgroundColor = disabled ? disabledColor : theme.colors.accent } =
    StyleSheet.flatten(style) || {};

  let foregroundColor;

  if (typeof customColor !== 'undefined') {
    foregroundColor = customColor;
  } else if (disabled) {
    foregroundColor = color(theme.dark ? white : black)
      .alpha(0.32)
      .rgb()
      .string();
  } else {
    foregroundColor = !color(backgroundColor).isLight()
      ? white
      : 'rgba(0, 0, 0, .54)';
  }

  const rippleColor = color(foregroundColor).alpha(0.32).rgb().string();

  const totalWidth = animateFromRight
    ? -textWidth - SIZE / 2
    : textWidth + SIZE / 2;

  React.useEffect(() => {
    const animations = [
      {
        property: scaleFAB,
        toValue: !extended ? 1 : 0.9,
      },
      {
        property: translateFAB,
        toValue: !extended ? 0 : totalWidth,
      },
      {
        property: translateIcon,
        toValue: !extended ? 0 : totalWidth,
        exclude: isIconStatic,
      },
      {
        property: opacityLabel,
        toValue: !extended ? 0 : 1,
        duration: extended ? 250 : 100,
        delay: extended ? 100 : 0,
      },
    ];

    Animated.parallel(
      animations
        .filter(({ exclude }) => !exclude)
        .map(({ property, toValue, duration = 250, delay = 0 }) => {
          return Animated.timing(property, {
            toValue,
            duration: duration * scale,
            delay: delay * scale,
            useNativeDriver: true,
            easing: Easing.linear,
          });
        })
    ).start();
  }, [
    extended,
    scaleFAB,
    opacityLabel,
    totalWidth,
    translateIcon,
    translateFAB,
    scale,
    isIconStatic,
  ]);

  const onTextLayout = ({ nativeEvent }: TextLayoutEvent) => {
    const currentWidth = Math.ceil(nativeEvent.lines[0].width);
    const currentHeight = Math.ceil(nativeEvent.lines[0].height);

    if (currentWidth !== textWidth || currentHeight !== textHeight) {
      setTextWidth(currentWidth);
      setTextHeight(currentHeight);
    }
  };

  return (
    <Surface
      {...rest}
      style={
        [
          {
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
    >
      <Animated.View
        style={[
          {
            transform: [
              {
                scaleY: scaleFAB,
              },
            ],
          },
        ]}
      >
        <TouchableRipple
          onPress={onPress}
          onLongPress={onLongPress}
          rippleColor={rippleColor}
          disabled={disabled}
          accessibilityLabel={accessibilityLabel}
          accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityState={{ ...accessibilityState, disabled }}
          style={[styles.touchable, styles.standard]}
          testID={testID}
          hitSlop={{
            left: textWidth + 1.5 * SIZE,
          }}
        >
          <View>
            <Animated.View
              style={[
                styles.innerWrapper,
                !animateFromRight && styles.leftInnerWrapper,
              ]}
            >
              <Animated.View
                style={[
                  styles.standard,
                  {
                    transform: [
                      {
                        translateX: translateFAB,
                      },
                    ],
                    width: textWidth + 1.5 * SIZE,
                    right: totalWidth,
                    backgroundColor,
                  },
                ]}
              />
            </Animated.View>
          </View>
        </TouchableRipple>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.iconWrapper,
          !animateFromRight && styles.moveIconFromLeft,
          {
            transform: [{ translateX: translateIcon }],
          },
        ]}
      >
        <Icon source={icon} size={24} color={white} />
      </Animated.View>

      <AnimatedText
        numberOfLines={1}
        //@ts-ignore
        onTextLayout={onTextLayout}
        ellipsizeMode={'tail'}
        pointerEvents="none"
        style={[
          animateFromRight
            ? { right: isIconStatic ? SIZE : SIZE / 2 }
            : { left: isIconStatic ? SIZE : SIZE / 2 },
          {
            width: textWidth,
            top: SIZE / 2 - textHeight / 2,
            opacity: opacityLabel,
          },
          styles.label,
          uppercase && styles.uppercaseLabel,
          {
            color: foregroundColor,
            ...theme.fonts.medium,
          },
        ]}
      >
        {label}
      </AnimatedText>
    </Surface>
  );
};

const styles = StyleSheet.create({
  standard: {
    height: SIZE,
    borderRadius: SIZE / 2,
  },
  disabled: {
    elevation: 0,
  },
  container: {
    position: 'absolute',
    borderRadius: SIZE / 2,
    elevation: 6,
    right: 16,
    bottom: 32,
  },
  innerWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: SIZE / 2,
    right: 0,
  },
  touchable: {
    borderRadius: SIZE / 2,
  },
  leftInnerWrapper: {
    left: 0,
    right: undefined,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    height: SIZE,
    width: SIZE,
    right: 0,
  },
  moveIconFromLeft: {
    left: 0,
    right: undefined,
  },
  label: {
    position: 'absolute',
    zIndex: 2,
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
});

export default withTheme(AnimatedFAB);
