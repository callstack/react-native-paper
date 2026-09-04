import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';

import Animated, {
  cubicBezier,
  isSharedValue,
  type AnimatedStyle,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useInternalTheme } from '../core/theming';
import { androidElevationLevels, shadow } from '../theme/tokens/sys/elevation';
import type { Elevation, ThemeProp } from '../theme/types';

type AnimatedStyleProp<Key extends keyof ViewStyle> = Extract<
  AnimatedStyle<Required<Pick<ViewStyle, Key>>>,
  Record<Key, unknown>
>[Key];

type BorderRadius = AnimatedStyleProp<'borderRadius'>;

type SurfaceVisualProps = {
  /**
   * Background color of the Surface. Overrides the color derived from
   * `elevation`.
   */
  backgroundColor?: ColorValue;
  /**
   * Radius of every corner of the Surface.
   */
  borderRadius?: BorderRadius;
  /**
   * Radius of the bottom-end corner of the Surface.
   */
  borderBottomEndRadius?: BorderRadius;
  /**
   * Radius of the bottom-left corner of the Surface.
   */
  borderBottomLeftRadius?: BorderRadius;
  /**
   * Radius of the bottom-right corner of the Surface.
   */
  borderBottomRightRadius?: BorderRadius;
  /**
   * Radius of the bottom-start corner of the Surface.
   */
  borderBottomStartRadius?: BorderRadius;
  /**
   * Radius of the end-end corner of the Surface.
   */
  borderEndEndRadius?: BorderRadius;
  /**
   * Radius of the end-start corner of the Surface.
   */
  borderEndStartRadius?: BorderRadius;
  /**
   * Radius of the start-end corner of the Surface.
   */
  borderStartEndRadius?: BorderRadius;
  /**
   * Radius of the start-start corner of the Surface.
   */
  borderStartStartRadius?: BorderRadius;
  /**
   * Radius of the top-end corner of the Surface.
   */
  borderTopEndRadius?: BorderRadius;
  /**
   * Radius of the top-left corner of the Surface.
   */
  borderTopLeftRadius?: BorderRadius;
  /**
   * Radius of the top-right corner of the Surface.
   */
  borderTopRightRadius?: BorderRadius;
  /**
   * Radius of the top-start corner of the Surface.
   */
  borderTopStartRadius?: BorderRadius;
  /**
   * Corner curve of the Surface on iOS.
   */
  borderCurve?: ViewStyle['borderCurve'];
};

export type SurfaceStyle = AnimatedStyle<
  Omit<ViewStyle, keyof SurfaceVisualProps | 'elevation'>
>;

export type Props = Omit<ViewProps, 'pointerEvents' | 'style'> &
  SurfaceVisualProps & {
    /**
     * Duration of the background, elevation, and shadow transitions in
     * milliseconds.
     */
    transitionDuration?: number;
    /**
     * Style of the Surface.
     *
     * This doesn't support all View style properties:
     * - Background color and border radius should be specified via props instead.
     * - `overflow: 'hidden'` is not supported with `elevation` as it can clip the shadow.
     *    To achieve the same effect, wrap the content in a child View with the overflow style.
     */
    style?: StyleProp<SurfaceStyle>;
    /**
     * @supported Available in v5.x with theme version 3
     * Changes shadows and background on iOS and Android.
     * Used to create UI hierarchy between components.
     *
     * Note: If `mode` is set to `flat`, Surface doesn't have a shadow.
     *
     * Note: In version 2 the `elevation` prop was accepted via `style` prop i.e. `style={{ elevation: 4 }}`.
     * It's no longer supported with theme version 3 and you should use `elevation` property instead.
     */
    elevation?: Elevation;
    /**
     * @supported Available in v5.x with theme version 3
     * Mode of the Surface.
     * - `elevated` - Surface with a shadow and background color corresponding to set `elevation` value.
     * - `flat` - Surface without a shadow, with the background color corresponding to set `elevation` value.
     */
    mode?: 'flat' | 'elevated';
    /**
     * @optional
     */
    theme?: ThemeProp;
    /**
     * Content of the `Surface`.
     */
    children: React.ReactNode;
    /**
     * TestID used for testing purposes
     */
    testID?: string;
    ref?: React.Ref<View>;
  };

/**
 * Surface is a basic container that can give depth to an element with elevation shadow.
 *
 * On Android, Surface uses the native `elevation` style,
 * and falls back to shadows that approximate the elevation on other platforms.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Surface, Text } from 'react-native-paper';
 * import { StyleSheet } from 'react-native';
 *
 * const MyComponent = () => (
 *   <Surface style={styles.surface} elevation={4} borderRadius={8}>
 *      <Text>Surface</Text>
 *   </Surface>
 * );
 *
 * export default MyComponent;
 *
 * const styles = StyleSheet.create({
 *   surface: {
 *     height: 80,
 *     width: 80,
 *     padding: 8,
 *     alignItems: 'center',
 *     justifyContent: 'center',
 *   },
 * });
 * ```
 */
const Surface = ({
  elevation = 1,
  children,
  theme: overridenTheme,
  style,
  backgroundColor: customBackgroundColor,
  borderRadius,
  borderBottomEndRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderBottomStartRadius,
  borderEndEndRadius,
  borderEndStartRadius,
  borderStartEndRadius,
  borderStartStartRadius,
  borderTopEndRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderTopStartRadius,
  borderCurve = 'continuous',
  testID,
  mode = 'elevated',
  transitionDuration: customTransitionDuration,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(overridenTheme);

  const { colors } = theme;

  const backgroundColor =
    customBackgroundColor ?? colors.elevation?.[`level${elevation}`];

  const backgroundStyle = { backgroundColor };

  const shapeProps = {
    borderRadius,
    borderBottomEndRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderBottomStartRadius,
    borderEndEndRadius,
    borderEndStartRadius,
    borderStartEndRadius,
    borderStartStartRadius,
    borderTopEndRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderTopStartRadius,
    borderCurve,
  };

  // Reanimated styles can't be shared between different views
  // So we need to create two separate styles for the surface and shadow layers
  const visualStyle = useSurfaceVisualStyle(shapeProps);
  const shadowVisualStyle = useSurfaceVisualStyle(shapeProps);

  const isElevated = mode === 'elevated';

  const transitionDuration =
    customTransitionDuration ??
    theme.motion.duration.short3 * theme.animation.scale;
  const transitionDurationStyle: AnimatedStyle<ViewStyle> = {
    transitionDuration,
  };
  const transitionTimingFunction = cubicBezier(...theme.motion.easing.standard);
  const transitionProperty =
    // FIXME: Reanimated can't animate PlatformColor and DynamicColorIOS
    typeof backgroundColor === 'string' ? ['backgroundColor' as const] : [];

  if (Platform.OS === 'web') {
    const [elevationShadow] = shadow(elevation, theme.colors.shadow);

    const transitionStyle: AnimatedStyle<ViewStyle> = {
      transitionTimingFunction,
      transitionProperty: [...transitionProperty, 'boxShadow'],
    };

    return (
      <Animated.View
        {...rest}
        ref={ref}
        testID={testID}
        style={[
          transitionStyle,
          styles.container,
          style,
          transitionDurationStyle,
          backgroundStyle,
          visualStyle,
          isElevated ? elevationShadow : null,
        ]}
      >
        {children}
      </Animated.View>
    );
  }

  if (Platform.OS === 'android') {
    const elevationAndroid = androidElevationLevels[elevation];

    const transitionStyle: AnimatedStyle<ViewStyle> = {
      transitionTimingFunction,
      transitionProperty: [...transitionProperty, 'elevation'],
    };

    return (
      <Animated.View
        {...rest}
        testID={testID}
        ref={ref}
        style={[
          transitionStyle,
          style,
          transitionDurationStyle,
          backgroundStyle,
          visualStyle,
          isElevated && { elevation: elevationAndroid },
        ]}
      >
        {children}
      </Animated.View>
    );
  }

  const [spotShadow, ambientShadow] = shadow(elevation, theme.colors.shadow);

  const transitionStyle: AnimatedStyle<ViewStyle> = {
    transitionTimingFunction,
    transitionProperty: [
      ...transitionProperty,
      'shadowOpacity',
      'shadowOffset',
      'shadowRadius',
    ],
  };

  return (
    <Animated.View
      {...rest}
      ref={ref}
      style={[
        transitionStyle,
        style,
        transitionDurationStyle,
        backgroundStyle,
        visualStyle,
        isElevated && spotShadow,
      ]}
      testID={testID}
    >
      {isElevated ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.shadow,
            transitionStyle,
            transitionDurationStyle,
            backgroundStyle,
            shadowVisualStyle,
            ambientShadow,
          ]}
        />
      ) : null}
      {children}
    </Animated.View>
  );
};

const useSurfaceVisualStyle = ({
  borderRadius,
  borderBottomEndRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderBottomStartRadius,
  borderEndEndRadius,
  borderEndStartRadius,
  borderStartEndRadius,
  borderStartStartRadius,
  borderTopEndRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderTopStartRadius,
  borderCurve,
}: Omit<SurfaceVisualProps, 'backgroundColor'>) =>
  useAnimatedStyle<ViewStyle>(() =>
    Object.fromEntries(
      Object.entries({
        borderRadius,
        borderBottomEndRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        borderBottomStartRadius,
        borderEndEndRadius,
        borderEndStartRadius,
        borderStartEndRadius,
        borderStartStartRadius,
        borderTopEndRadius,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderTopStartRadius,
        borderCurve,
      }).map(([property, value]) => [
        property,
        isSharedValue(value) ? value.value : value,
      ])
    )
  );

const styles = StyleSheet.create({
  container: {
    pointerEvents: 'auto',
  },
  shadow: {
    pointerEvents: 'none',
  },
});

export default Surface;
