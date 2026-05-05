import * as React from 'react';
import {
  Animated,
  Platform,
  ShadowStyleIOS,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useInternalTheme } from '../core/theming';
import {
  androidElevationLevels,
  elevationInputRange,
  shadow,
  shadowLayers,
} from '../theme/tokens/sys/elevation';
import type { Elevation, Theme, ThemeProp } from '../types';
import { isAnimatedValue } from '../utils/animations';
import { forwardRef } from '../utils/forwardRef';
import { splitStyles } from '../utils/splitStyles';

type SurfaceElevation = Elevation | Animated.Value;

export type Props = Omit<React.ComponentPropsWithRef<typeof View>, 'style'> & {
  /**
   * Content of the `Surface`.
   */
  children: React.ReactNode;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
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
  elevation?: SurfaceElevation;
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
   * TestID used for testing purposes
   */
  testID?: string;
  ref?: React.RefObject<View>;
  /**
   * @internal
   */
  container?: boolean;
};

const outerLayerStyleProperties: (keyof ViewStyle)[] = [
  'position',
  'alignSelf',
  'top',
  'right',
  'bottom',
  'left',
  'start',
  'end',
  'flex',
  'flexShrink',
  'flexGrow',
  'width',
  'height',
  'transform',
  'opacity',
];

function getStyleForShadowLayer(
  elevation: SurfaceElevation,
  layer: 0 | 1,
  shadowColor: string
): Animated.WithAnimatedValue<ShadowStyleIOS> {
  if (isAnimatedValue(elevation)) {
    return {
      shadowColor,
      shadowOpacity: elevation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, shadowLayers[layer].shadowOpacity],
        extrapolate: 'clamp',
      }),
      shadowOffset: {
        width: 0,
        height: elevation.interpolate({
          inputRange: [...elevationInputRange],
          outputRange: [...shadowLayers[layer].height],
        }),
      },
      shadowRadius: elevation.interpolate({
        inputRange: [...elevationInputRange],
        outputRange: [...shadowLayers[layer].shadowRadius],
      }),
    };
  }

  return {
    shadowColor,
    shadowOpacity: elevation ? shadowLayers[layer].shadowOpacity : 0,
    shadowOffset: {
      width: 0,
      height: shadowLayers[layer].height[elevation],
    },
    shadowRadius: shadowLayers[layer].shadowRadius[elevation],
  };
}

const SurfaceIOS = forwardRef<
  View,
  Omit<Props, 'elevation'> & {
    elevation: SurfaceElevation;
    backgroundColor?: string | Animated.AnimatedInterpolation<string | number>;
    shadowColor: string;
  }
>(
  (
    {
      elevation,
      style,
      backgroundColor,
      shadowColor,
      testID,
      children,
      mode = 'elevated',
      container,
      ...props
    },
    ref
  ) => {
    const [outerLayerViewStyles, innerLayerViewStyles] = React.useMemo(() => {
      const flattenedStyles = (StyleSheet.flatten(style) || {}) as ViewStyle;

      const [filteredStyles, outerLayerStyles, borderRadiusStyles] =
        splitStyles(
          flattenedStyles,
          (style) =>
            outerLayerStyleProperties.includes(style) ||
            style.startsWith('margin'),
          (style) => style.startsWith('border') && style.endsWith('Radius')
        );

      if (
        process.env.NODE_ENV !== 'production' &&
        filteredStyles.overflow === 'hidden' &&
        elevation !== 0
      ) {
        console.warn(
          'When setting overflow to hidden on Surface the shadow will not be displayed correctly. Wrap the content of your component in a separate View with the overflow style.'
        );
      }

      const bgColor = flattenedStyles.backgroundColor || backgroundColor;

      const isElevated = mode === 'elevated';

      const outerLayerViewStyles = {
        ...(isElevated && getStyleForShadowLayer(elevation, 0, shadowColor)),
        ...outerLayerStyles,
        ...borderRadiusStyles,
        backgroundColor: bgColor,
      };

      const innerLayerViewStyles = {
        ...(isElevated && getStyleForShadowLayer(elevation, 1, shadowColor)),
        ...filteredStyles,
        ...borderRadiusStyles,
        flex:
          flattenedStyles.height || (!container && flattenedStyles.flex)
            ? 1
            : undefined,
        backgroundColor: bgColor,
      };

      return [outerLayerViewStyles, innerLayerViewStyles];
    }, [style, elevation, backgroundColor, shadowColor, mode, container]);

    return (
      <Animated.View
        ref={ref}
        style={outerLayerViewStyles}
        testID={`${testID}-outer-layer`}
      >
        <Animated.View {...props} style={innerLayerViewStyles} testID={testID}>
          {children}
        </Animated.View>
      </Animated.View>
    );
  }
);

/**
 * Surface is a basic container that can give depth to an element with elevation shadow.
 * On dark theme with `adaptive` mode, surface is constructed by also placing a semi-transparent white overlay over a component surface.
 * See [Dark Theme](https://callstack.github.io/react-native-paper/docs/guides/theming#dark-theme) for more information.
 * Overlay and shadow can be applied by specifying the `elevation` property both on Android and iOS.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Surface, Text } from 'react-native-paper';
 * import { StyleSheet } from 'react-native';
 *
 * const MyComponent = () => (
 *   <Surface style={styles.surface} elevation={4}>
 *      <Text>Surface</Text>
 *   </Surface>
 * );
 *
 * export default MyComponent;
 *
 * const styles = StyleSheet.create({
 *   surface: {
 *     padding: 8,
 *     height: 80,
 *     width: 80,
 *     alignItems: 'center',
 *     justifyContent: 'center',
 *   },
 * });
 * ```
 */
const Surface = forwardRef<View, Props>(
  (
    {
      elevation = 1,
      children,
      theme: overridenTheme,
      style,
      testID = 'surface',
      mode = 'elevated',
      ...props
    }: Props,
    ref
  ) => {
    const theme = useInternalTheme(overridenTheme);

    const { colors } = theme as Theme;

    const backgroundColor = (() => {
      if (isAnimatedValue(elevation)) {
        return elevation.interpolate({
          inputRange: [...elevationInputRange],
          outputRange: [...elevationInputRange].map((elevation) => {
            return colors.elevation?.[`level${elevation as Elevation}`];
          }),
        });
      }

      return colors.elevation?.[`level${elevation}`];
    })();

    const isElevated = mode === 'elevated';

    if (Platform.OS === 'web') {
      const { pointerEvents = 'auto' } = props;
      return (
        <Animated.View
          {...props}
          pointerEvents={pointerEvents}
          ref={ref}
          testID={testID}
          style={[
            { backgroundColor },
            elevation && isElevated
              ? shadow(elevation, theme.colors.shadow)
              : null,
            style,
          ]}
        >
          {children}
        </Animated.View>
      );
    }

    if (Platform.OS === 'android') {
      const elevationLevel = [...androidElevationLevels];

      const getElevationAndroid = () => {
        if (isAnimatedValue(elevation)) {
          return elevation.interpolate({
            inputRange: [...elevationInputRange],
            outputRange: elevationLevel,
          });
        }

        return elevationLevel[elevation];
      };

      const { margin, padding, transform, borderRadius } = (StyleSheet.flatten(
        style
      ) || {}) as ViewStyle;

      const outerLayerStyles = { margin, padding, transform, borderRadius };
      const sharedStyle = [{ backgroundColor }, style];

      return (
        <Animated.View
          {...props}
          testID={testID}
          ref={ref}
          style={[
            {
              backgroundColor,
              transform,
            },
            outerLayerStyles,
            sharedStyle,
            isElevated && {
              elevation: getElevationAndroid(),
            },
          ]}
        >
          {children}
        </Animated.View>
      );
    }

    return (
      <SurfaceIOS
        {...props}
        ref={ref}
        elevation={elevation}
        backgroundColor={backgroundColor}
        shadowColor={theme.colors.shadow}
        style={style}
        testID={testID}
        mode={mode}
      >
        {children}
      </SurfaceIOS>
    );
  }
);

export default Surface;
