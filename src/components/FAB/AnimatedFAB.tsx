import * as React from 'react';
import type {
  AccessibilityState,
  ColorValue,
  NativeSyntheticEvent,
  PressableAndroidRippleConfig,
  TextLayoutEventData,
} from 'react-native';
import {
  Animated,
  Easing,
  GestureResponderEvent,
  I18nManager,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Text,
} from 'react-native';

import color from 'color';

import { getCombinedStyles, getFABColors, getLabelSizeWeb } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $Omit, $RemoveChildren, ThemeProp } from '../../types';
import type { IconSource } from '../Icon';
import Icon from '../Icon';
import Surface from '../Surface';
import TouchableRipple, {
  Props as TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import AnimatedText from '../Typography/AnimatedText';

export type AnimatedFABIconMode = 'static' | 'dynamic';
export type AnimatedFABAnimateFrom = 'left' | 'right';

export type Props = $Omit<$RemoveChildren<typeof Surface>, 'mode'> & {
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
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
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
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
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
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * The number of milliseconds a user must touch the element before executing `onLongPress`.
   */
  delayLongPress?: number;
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
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Color mappings variant for combinations of container and icon colors.
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
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
   * TestID used for testing purposes
   */
  testID?: string;
};

const SIZE = 56;
const SCALE = 0.9;

/**
 * An animated, extending horizontally floating action button represents the primary action in an application.
 *
 * ## Usage
 * ```js
 * import React from 'react';
 * import {
 *   StyleProp,
 *   ViewStyle,
 *   Animated,
 *   StyleSheet,
 *   Platform,
 *   ScrollView,
 *   Text,
 *   SafeAreaView,
 *   I18nManager,
 * } from 'react-native';
 * import { AnimatedFAB } from 'react-native-paper';
 *
 * const MyComponent = ({
 *   animatedValue,
 *   visible,
 *   extended,
 *   label,
 *   animateFrom,
 *   style,
 *   iconMode,
 * }) => {
 *   const [isExtended, setIsExtended] = React.useState(true);
 *
 *   const isIOS = Platform.OS === 'ios';
 *
 *   const onScroll = ({ nativeEvent }) => {
 *     const currentScrollPosition =
 *       Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
 *
 *     setIsExtended(currentScrollPosition <= 0);
 *   };
 *
 *   const fabStyle = { [animateFrom]: 16 };
 *
 *   return (
 *     <SafeAreaView style={styles.container}>
 *       <ScrollView onScroll={onScroll}>
 *         {[...new Array(100).keys()].map((_, i) => (
 *           <Text>{i}</Text>
 *         ))}
 *       </ScrollView>
 *       <AnimatedFAB
 *         icon={'plus'}
 *         label={'Label'}
 *         extended={isExtended}
 *         onPress={() => console.log('Pressed')}
 *         visible={visible}
 *         animateFrom={'right'}
 *         iconMode={'static'}
 *         style={[styles.fabStyle, style, fabStyle]}
 *       />
 *     </SafeAreaView>
 *   );
 * };
 *
 * export default MyComponent;
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     flexGrow: 1,
 *   },
 *   fabStyle: {
 *     bottom: 16,
 *     right: 16,
 *     position: 'absolute',
 *   },
 * });
 * ```
 */
const AnimatedFAB = ({
  icon,
  label,
  background,
  accessibilityLabel = label,
  accessibilityState,
  color: customColor,
  rippleColor: customRippleColor,
  disabled,
  onPress,
  onLongPress,
  delayLongPress,
  theme: themeOverrides,
  style,
  visible = true,
  uppercase: uppercaseProp,
  testID = 'animated-fab',
  animateFrom = 'right',
  extended = false,
  iconMode = 'dynamic',
  variant = 'primary',
  labelMaxFontSizeMultiplier,
  hitSlop,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const uppercase: boolean = uppercaseProp ?? !theme.isV3;
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  const isAnimatedFromRight = animateFrom === 'right';
  const isIconStatic = iconMode === 'static';
  const { isRTL } = I18nManager;
  const labelRef = React.useRef<Text & HTMLElement>(null);
  const { current: visibility } = React.useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0)
  );
  const { current: animFAB } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );
  const { isV3, animation } = theme;
  const { scale } = animation;

  const labelSize = isWeb ? getLabelSizeWeb(labelRef) : null;
  const [textWidth, setTextWidth] = React.useState<number>(
    labelSize?.width ?? 0
  );
  const [textHeight, setTextHeight] = React.useState<number>(
    labelSize?.height ?? 0
  );

  const borderRadius = SIZE / (isV3 ? 3.5 : 2);

  React.useEffect(() => {
    if (!isWeb) {
      return;
    }

    const updateTextSize = () => {
      if (labelRef.current) {
        const labelSize = getLabelSizeWeb(labelRef);

        if (labelSize) {
          setTextHeight(labelSize.height ?? 0);
          setTextWidth(labelSize.width ?? 0);
        }
      }
    };

    updateTextSize();
    window.addEventListener('resize', updateTextSize);

    return () => {
      if (!isWeb) {
        return;
      }

      window.removeEventListener('resize', updateTextSize);
    };
  }, [isWeb]);

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

  const { backgroundColor: customBackgroundColor, ...restStyle } =
    (StyleSheet.flatten(style) || {}) as ViewStyle;

  const { backgroundColor, foregroundColor } = getFABColors({
    theme,
    variant,
    disabled,
    customColor,
    customBackgroundColor,
  });

  const rippleColor =
    customRippleColor || color(foregroundColor).alpha(0.12).rgb().string();

  const extendedWidth = textWidth + SIZE + borderRadius;

  const distance = isAnimatedFromRight
    ? -textWidth - borderRadius
    : textWidth + borderRadius;

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
    const currentWidth = Math.ceil(nativeEvent.lines[0]?.width ?? 0);
    const currentHeight = Math.ceil(nativeEvent.lines[0]?.height ?? 0);

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

  const font = isV3 ? theme.fonts.labelLarge : theme.fonts.medium;

  const textStyle = {
    color: foregroundColor,
    ...font,
  };

  const md2Elevation = disabled || !isIOS ? 0 : 6;
  const md3Elevation = disabled || !isIOS ? 0 : 3;

  const shadowStyle = isV3 ? styles.v3Shadow : styles.shadow;
  const baseStyle = [
    StyleSheet.absoluteFill,
    disabled ? styles.disabled : shadowStyle,
  ];

  const newAccessibilityState = { ...accessibilityState, disabled };

  return (
    <Surface
      {...rest}
      testID={`${testID}-container`}
      style={[
        {
          opacity: visibility,
          transform: [
            {
              scale: visibility,
            },
          ],
          borderRadius,
        },
        !isV3 && {
          elevation: md2Elevation,
        },
        styles.container,
        restStyle,
      ]}
      {...(isV3 && { elevation: md3Elevation })}
      theme={theme}
      container
    >
      <Animated.View
        style={[
          !isV3 && {
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
          { borderRadius },
        ]}
      >
        <View style={[StyleSheet.absoluteFill, styles.shadowWrapper]}>
          <Animated.View
            pointerEvents="none"
            style={[
              baseStyle,
              {
                width: extendedWidth,
                opacity: animFAB.interpolate({
                  inputRange: propForDirection([distance, 0.9 * distance, 0]),
                  outputRange: propForDirection([1, 0.15, 0]),
                }),
                borderRadius,
              },
            ]}
            testID={`${testID}-extended-shadow`}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              baseStyle,
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
                    borderRadius,
                  ]),
                }),
              },
              combinedStyles.absoluteFill,
            ]}
            testID={`${testID}-shadow`}
          />
        </View>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.innerWrapper, { borderRadius }]}
        >
          <Animated.View
            style={[
              styles.standard,
              {
                width: extendedWidth,
                backgroundColor,
                borderRadius,
              },
              combinedStyles.innerWrapper,
            ]}
          >
            <TouchableRipple
              borderless
              background={background}
              onPress={onPress}
              onLongPress={onLongPress}
              delayLongPress={delayLongPress}
              rippleColor={rippleColor}
              disabled={disabled}
              accessibilityLabel={accessibilityLabel}
              accessibilityRole="button"
              accessibilityState={newAccessibilityState}
              testID={testID}
              style={{ borderRadius }}
              theme={theme}
              hitSlop={hitSlop}
            >
              <View
                style={[
                  styles.standard,
                  {
                    width: extendedWidth,
                    borderRadius,
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
        <Icon source={icon} size={24} color={foregroundColor} theme={theme} />
      </Animated.View>

      <View pointerEvents="none">
        <AnimatedText
          ref={isWeb ? labelRef : null}
          variant="labelLarge"
          numberOfLines={1}
          onTextLayout={isIOS ? onTextLayout : undefined}
          ellipsizeMode={'tail'}
          style={[
            {
              [isAnimatedFromRight || isRTL ? 'right' : 'left']: isIconStatic
                ? textWidth - SIZE + borderRadius / (isV3 ? 1 : 2)
                : borderRadius,
            },
            {
              minWidth: textWidth,
              top: -SIZE / 2 - textHeight / 2,
              opacity: animFAB.interpolate({
                inputRange: propForDirection([distance, 0.7 * distance, 0]),
                outputRange: propForDirection([1, 0, 0]),
              }) as unknown as number,
              // TODO: check
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
            textStyle,
          ]}
          theme={theme}
          testID={`${testID}-text`}
          maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
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
          <AnimatedText
            variant="labelLarge"
            numberOfLines={1}
            onTextLayout={onTextLayout}
            ellipsizeMode={'tail'}
            style={[
              styles.label,
              uppercase && styles.uppercaseLabel,
              textStyle,
            ]}
            theme={theme}
          >
            {label}
          </AnimatedText>
        </ScrollView>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  standard: {
    height: SIZE,
  },
  disabled: {
    elevation: 0,
  },
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  innerWrapper: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  shadowWrapper: {
    elevation: 0,
  },
  shadow: {
    elevation: 6,
  },
  v3Shadow: {
    elevation: 3,
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

export default AnimatedFAB;
