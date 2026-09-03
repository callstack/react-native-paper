import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  LayoutChangeEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import useLatestCallback from 'use-latest-callback';

import Button from './Button/Button';
import type { Props as ButtonProps } from './Button/Button';
import Icon from './Icon';
import type { IconSource } from './Icon';
import Surface from './Surface';
import type { SurfaceStyle } from './Surface';
import Text from './Typography/Text';
import { useInternalTheme } from '../core/theming';
import type { Elevation, ThemeProp } from '../types';

const DEFAULT_MAX_WIDTH = 960;

type AnimationFinishedCallback = (result: { finished: boolean }) => void;

export type Props = Omit<ViewProps, 'style'> & {
  /**
   * Whether banner is currently visible.
   */
  visible: boolean;
  /**
   * Content that will be displayed inside banner.
   */
  children: React.ReactNode;
  /**
   * Icon to display for the `Banner`. Can be an image.
   */
  icon?: IconSource;
  /**
   * Action items to shown in the banner.
   * An action item should contain the following properties:
   *
   * - `label`: label of the action button (required)
   * - `onPress`: callback that is called when button is pressed (required)
   *
   * To customize button you can pass other props that button component takes.
   */
  actions?: Array<
    {
      label: string;
    } & Omit<ButtonProps, 'children'>
  >;
  /**
   * Style of banner's inner content.
   * Use this prop to apply custom width for wide layouts.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * @supported Available in v5.x with theme version 3
   * Changes Banner shadow and background on iOS and Android.
   */
  elevation?: Elevation;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
  style?: StyleProp<SurfaceStyle>;
  ref?: React.RefObject<View>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * @optional
   * Optional callback that will be called after the opening animation finished running normally
   */
  onShowAnimationFinished?: AnimationFinishedCallback;
  /**
   * @optional
   * Optional callback that will be called after the closing animation finished running normally
   */
  onHideAnimationFinished?: AnimationFinishedCallback;
};

/**
 * Banner displays a prominent message and related actions.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Image } from 'react-native';
 * import { Banner } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(true);
 *
 *   return (
 *     <Banner
 *       visible={visible}
 *       actions={[
 *         {
 *           label: 'Fix it',
 *           onPress: () => setVisible(false),
 *         },
 *         {
 *           label: 'Learn more',
 *           onPress: () => setVisible(false),
 *         },
 *       ]}
 *       icon={({size}) => (
 *         <Image
 *           source={{
 *             uri: 'https://avatars3.githubusercontent.com/u/17571969?s=400&v=4',
 *           }}
 *           style={{
 *             width: size,
 *             height: size,
 *           }}
 *         />
 *       )}>
 *       There was a problem processing a transaction on your credit card.
 *     </Banner>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Banner = ({
  visible,
  icon,
  children,
  actions = [],
  contentStyle,
  elevation = 1,
  style,
  theme: themeOverrides,
  onShowAnimationFinished = () => {},
  onHideAnimationFinished = () => {},
  maxFontSizeMultiplier,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors } = theme;

  const position = useSharedValue(visible ? 1 : 0);

  const [layout, setLayout] = React.useState<{
    height: number;
    measured: boolean;
  }>({
    height: 0,
    measured: false,
  });

  const showCallback = useLatestCallback(onShowAnimationFinished);
  const hideCallback = useLatestCallback(onHideAnimationFinished);

  const { scale } = theme.animation;
  const animationDuration = (visible ? 250 : 200) * scale;

  React.useEffect(() => {
    const callback = visible ? showCallback : hideCallback;

    position.value = withTiming(
      visible ? 1 : 0,
      {
        duration: animationDuration,
        easing: Easing.inOut(Easing.ease),
        reduceMotion: ReduceMotion.Never,
      },
      (finished) => scheduleOnRN(callback, { finished: finished ?? false })
    );
  }, [animationDuration, hideCallback, position, showCallback, visible]);

  const surfaceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(position.value, [0, 0.1, 1], [0, 1, 1]),
  }));

  const spacerStyle = useAnimatedStyle(() => ({
    height: position.value * layout.height,
  }));

  const contentAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (position.value - 1) * layout.height }],
  }));

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { height } = nativeEvent.layout;
    setLayout({ height, measured: true });
  };

  // The banner animation has 2 parts:
  // 1. Blank spacer element which animates its height to move the content
  // 2. Actual banner which animates its translateY
  // In initial render, we position everything normally and measure the height of the banner
  // Once we have the height, we apply the height to the spacer and switch the banner to position: absolute
  // We need this because we need to move the content below as if banner's height was being animated
  // However we can't animated banner's height directly as it'll also resize the content inside
  return (
    <Surface
      {...rest}
      style={[surfaceStyle, style]}
      theme={theme}
      elevation={elevation}
    >
      <View style={[styles.wrapper, contentStyle]}>
        <Animated.View style={spacerStyle} />
        <Animated.View
          onLayout={handleLayout}
          style={[
            layout.measured || !visible
              ? // If we have measured banner's height or it's invisible,
                // Position it absolutely, the layout will be taken care of the spacer
                [styles.absolute, contentAnimationStyle]
              : // Otherwise position it normally
                null,
            !layout.measured && !visible
              ? // If we haven't measured banner's height yet and it's invisible,
                // hide it with opacity: 0 so user doesn't see it
                styles.transparent
              : null,
          ]}
        >
          <View style={styles.content}>
            {icon ? (
              <View style={styles.icon}>
                <Icon source={icon} size={40} />
              </View>
            ) : null}
            <Text
              variant="bodyMedium"
              style={[
                styles.message,
                {
                  color: colors.onSurface,
                },
              ]}
              aria-live={visible ? 'polite' : 'off'}
              role="alert"
              maxFontSizeMultiplier={maxFontSizeMultiplier}
            >
              {children}
            </Text>
          </View>
          <View style={styles.actions}>
            {actions.map(({ label, ...others }, i) => (
              <Button
                key={i}
                compact
                mode="text"
                style={styles.button}
                textColor={colors.primary}
                theme={theme}
                {...others}
              >
                {label}
              </Button>
            ))}
          </View>
        </Animated.View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    alignSelf: 'center',
    width: '100%',
    maxWidth: DEFAULT_MAX_WIDTH,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 8,
    marginTop: 16,
    marginBottom: 0,
  },
  icon: {
    margin: 8,
  },
  message: {
    flex: 1,
    margin: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 4,
  },
  button: {
    margin: 4,
  },
  transparent: {
    opacity: 0,
  },
});

export default Banner;
