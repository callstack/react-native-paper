import color from 'color';
import * as React from 'react';
import {
  Animated,
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  Easing,
  ScrollView,
  Text,
  Platform,
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
      },
    ];

    Animated.parallel(
      animations
        .filter(({ exclude }) => !exclude)
        .map(({ property, toValue }) => {
          return Animated.timing(property, {
            toValue,
            duration: 150 * scale,
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

  const getSidesPosition = () => {
    if (animateFromRight) {
      return {
        left: -totalWidth,
        right: undefined,
      };
    } else {
      return {
        left: undefined,
        right: totalWidth,
      };
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
          styles.standard,
        ]}
      >
        <TouchableRipple
          borderless
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
        >
          <Animated.View pointerEvents="box-none" style={[styles.innerWrapper]}>
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
                  backgroundColor,
                },
                getSidesPosition(),
              ]}
            />
          </Animated.View>
        </TouchableRipple>
      </Animated.View>

      <Animated.View
        style={[
          styles.iconWrapper,
          {
            transform: [{ translateX: translateIcon }],
          },
          getSidesPosition(),
        ]}
        pointerEvents="none"
      >
        <Icon source={icon} size={24} color={white} />
      </Animated.View>

      <View pointerEvents="none">
        <AnimatedText
          numberOfLines={1}
          //@ts-ignore
          onTextLayout={Platform.OS === 'ios' ? onTextLayout : undefined}
          ellipsizeMode={'tail'}
          style={[
            animateFromRight
              ? // eslint-disable-next-line react-native/no-inline-styles
                { right: isIconStatic ? SIZE : SIZE / 2 }
              : { left: isIconStatic ? SIZE : SIZE / 2 },
            {
              width: textWidth,
              top: -SIZE / 2 - textHeight / 2,
              opacity: opacityLabel.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [0, 0, 1],
              }),
              transform: [
                {
                  translateX: translateFAB.interpolate({
                    inputRange: animateFromRight
                      ? [totalWidth, 0]
                      : [0, totalWidth],
                    outputRange: animateFromRight ? [0, SIZE] : [-SIZE, 0],
                  }),
                },
              ],
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
      </View>

      {Platform.OS !== 'ios' && (
        <ScrollView style={styles.textPlaceholderContainer}>
          {/* @ts-ignore */}
          <Text onTextLayout={onTextLayout}>{label}</Text>
        </ScrollView>
      )}
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
    backgroundColor: 'transparent',
    borderRadius: SIZE / 2,
    elevation: 6,
  },
  innerWrapper: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: SIZE / 2,
  },
  touchable: {
    borderRadius: SIZE / 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    height: SIZE,
    width: SIZE,
  },
  label: {
    position: 'absolute',
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
  textPlaceholderContainer: {
    height: 0,
    position: 'absolute',
  },
});

export default withTheme(AnimatedFAB);
