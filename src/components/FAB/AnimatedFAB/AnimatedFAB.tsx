import * as React from 'react';
import color from 'color';
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
  I18nManager,
} from 'react-native';
import Surface from '../../Surface';
import Icon from '../../Icon';
import TouchableRipple from '../../TouchableRipple/TouchableRipple';
import type { $RemoveChildren } from '../../../types';
import type { IconSource } from '../../Icon';
import { withTheme } from '../../../core/theming';
import type {
  AccessibilityState,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';
import { white, black } from '../../../styles/colors';
import AnimatedText from '../../Typography/AnimatedText';
import { getCombinedStyles } from './utils';

export type AnimatedFABIconMode = 'static' | 'dynamic';
export type AnimatedFABAnimateFrom = 'left' | 'right';

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
  iconMode?: AnimatedFABIconMode;
  /**
   * Indicates from which direction animation should be performed. The default value is `right`.
   */
  animateFrom?: AnimatedFABAnimateFrom;
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
const BORDER_RADIUS = SIZE / 2;
const SCALE = 0.9;

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
  const isIOS = Platform.OS === 'ios';
  const isAnimatedFromRight = animateFrom === 'right';
  const isIconStatic = iconMode === 'static';
  const { isRTL } = I18nManager;
  const { current: visibility } = React.useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0)
  );
  const { current: animFAB } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );
  const { scale } = theme.animation;

  const [textWidth, setTextWidth] = React.useState<number>(0);
  const [textHeight, setTextHeight] = React.useState<number>(0);

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
    StyleSheet.flatten<ViewStyle>(style) || {};

  let foregroundColor: string;

  if (typeof customColor !== 'undefined') {
    foregroundColor = customColor;
  } else if (disabled) {
    foregroundColor = color(theme.dark ? white : black)
      .alpha(0.32)
      .rgb()
      .string();
  } else {
    foregroundColor = !color(backgroundColor as string).isLight()
      ? white
      : 'rgba(0, 0, 0, .54)';
  }

  const rippleColor = color(foregroundColor).alpha(0.32).rgb().string();

  const extendedWidth = textWidth + 1.5 * SIZE;

  const distance = isAnimatedFromRight
    ? -textWidth - BORDER_RADIUS
    : textWidth + BORDER_RADIUS;

  React.useEffect(() => {
    Animated.timing(animFAB, {
      toValue: !extended ? 0 : distance,
      duration: 150 * scale,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, [animFAB, scale, distance, extended]);

  const onTextLayout = ({
    nativeEvent,
  }: NativeSyntheticEvent<TextLayoutEventData>) => {
    const currentWidth = Math.ceil(nativeEvent.lines[0].width);
    const currentHeight = Math.ceil(nativeEvent.lines[0].height);

    if (currentWidth !== textWidth || currentHeight !== textHeight) {
      setTextHeight(currentHeight);

      if (isIOS) {
        return setTextWidth(currentWidth - 12);
      }

      setTextWidth(currentWidth);
    }
  };

  const propForDirection = <T,>(right: T[]): T[] => {
    if (isAnimatedFromRight) {
      return right;
    }

    return right.reverse();
  };

  const combinedStyles = getCombinedStyles({
    isAnimatedFromRight,
    isIconStatic,
    distance,
    animFAB,
  });

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
            elevation: isIOS ? 6 : 0,
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
                scaleY: animFAB.interpolate({
                  inputRange: propForDirection([distance, 0]),
                  outputRange: propForDirection([SCALE, 1]),
                }),
              },
            ],
          },
          styles.standard,
        ]}
      >
        <View style={[StyleSheet.absoluteFill, styles.shadowWrapper]}>
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.shadow,
              {
                width: extendedWidth,
                opacity: animFAB.interpolate({
                  inputRange: propForDirection([distance, 0.9 * distance, 0]),
                  outputRange: propForDirection([1, 0.15, 0]),
                }),
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.shadow,
              {
                opacity: animFAB.interpolate({
                  inputRange: propForDirection([distance, 0.9 * distance, 0]),
                  outputRange: propForDirection([0, 0.85, 1]),
                }),
                width: SIZE,
                borderRadius: animFAB.interpolate({
                  inputRange: propForDirection([distance, 0]),
                  outputRange: propForDirection([
                    SIZE / (extendedWidth / SIZE),
                    BORDER_RADIUS,
                  ]),
                }),
              },
              combinedStyles.absoluteFill,
            ]}
          />
        </View>
        <Animated.View pointerEvents="box-none" style={[styles.innerWrapper]}>
          <Animated.View
            style={[
              styles.standard,
              {
                width: extendedWidth,
                backgroundColor,
              },
              combinedStyles.innerWrapper,
            ]}
          >
            <TouchableRipple
              borderless
              onPress={onPress}
              onLongPress={onLongPress}
              rippleColor={rippleColor}
              disabled={disabled}
              accessibilityLabel={accessibilityLabel}
              // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
              accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
              accessibilityComponentType="button"
              accessibilityRole="button"
              accessibilityState={{ ...accessibilityState, disabled }}
              testID={testID}
              style={styles.touchable}
            >
              <View
                style={[
                  styles.standard,
                  {
                    width: extendedWidth,
                  },
                ]}
              />
            </TouchableRipple>
          </Animated.View>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[styles.iconWrapper, combinedStyles.iconWrapper]}
        pointerEvents="none"
      >
        <Icon source={icon} size={24} color={foregroundColor} />
      </Animated.View>

      <View pointerEvents="none">
        <AnimatedText
          numberOfLines={1}
          onTextLayout={isIOS ? onTextLayout : undefined}
          ellipsizeMode={'tail'}
          style={[
            {
              [isAnimatedFromRight || isRTL ? 'right' : 'left']: isIconStatic
                ? isIOS
                  ? SIZE - 10
                  : SIZE - 12
                : BORDER_RADIUS,
            },
            {
              minWidth: textWidth,
              top: -BORDER_RADIUS - textHeight / 2,
              opacity: animFAB.interpolate({
                inputRange: propForDirection([distance, 0.7 * distance, 0]),
                outputRange: propForDirection([1, 0, 0]),
              }),
              transform: [
                {
                  translateX: animFAB.interpolate({
                    inputRange: propForDirection([distance, 0]),
                    outputRange: propForDirection([0, SIZE]),
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

      {!isIOS && (
        // Method `onTextLayout` on Android returns sizes of text visible on the screen,
        // however during render the text in `FAB` isn't fully visible. In order to get
        // proper text measurements there is a need to additionaly render that text, but
        // wrapped in absolutely positioned `ScrollView` which height is 0.
        <ScrollView style={styles.textPlaceholderContainer}>
          <Text onTextLayout={onTextLayout}>{label}</Text>
        </ScrollView>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  standard: {
    height: SIZE,
    borderRadius: BORDER_RADIUS,
  },
  disabled: {
    elevation: 0,
  },
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS,
  },
  innerWrapper: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS,
  },
  shadowWrapper: {
    elevation: 0,
  },
  shadow: {
    elevation: 6,
    borderRadius: BORDER_RADIUS,
  },
  touchable: {
    borderRadius: BORDER_RADIUS,
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
