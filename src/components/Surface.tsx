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
import overlay, { isAnimatedValue } from '../styles/overlay';
import shadow from '../styles/shadow';
import type { ThemeProp, MD3Elevation } from '../types';
import { forwardRef } from '../utils/forwardRef';
import { splitStyles } from '../utils/splitStyles';

type Elevation = 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;

export type Props = React.ComponentPropsWithRef<typeof View> & {
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
   * TestID used for testing purposes
   */
  testID?: string;
  ref?: React.RefObject<View>;
};

const MD2Surface = forwardRef<View, Props>(
  ({ style, theme: overrideTheme, ...rest }: Omit<Props, 'elevation'>, ref) => {
    const { elevation = 4 } = (StyleSheet.flatten(style) || {}) as ViewStyle;
    const { dark: isDarkTheme, mode, colors } = useInternalTheme(overrideTheme);

    return (
      <Animated.View
        ref={ref}
        {...rest}
        style={[
          {
            backgroundColor:
              isDarkTheme && mode === 'adaptive'
                ? overlay(elevation, colors?.surface)
                : colors?.surface,
          },
          elevation ? shadow(elevation) : null,
          style,
        ]}
      />
    );
  }
);

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

const shadowColor = '#000';
const iOSShadowOutputRanges = [
  {
    shadowOpacity: 0.15,
    height: [0, 1, 2, 4, 6, 8],
    shadowRadius: [0, 3, 6, 8, 10, 12],
  },
  {
    shadowOpacity: 0.3,
    height: [0, 1, 1, 1, 2, 4],
    shadowRadius: [0, 1, 2, 3, 3, 4],
  },
];
const inputRange = [0, 1, 2, 3, 4, 5];
function getStyleForShadowLayer(
  elevation: Elevation,
  layer: 0 | 1
): Animated.WithAnimatedValue<ShadowStyleIOS> {
  if (isAnimatedValue(elevation)) {
    return {
      shadowColor,
      shadowOpacity: elevation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, iOSShadowOutputRanges[layer].shadowOpacity],
        extrapolate: 'clamp',
      }),
      shadowOffset: {
        width: 0,
        height: elevation.interpolate({
          inputRange,
          outputRange: iOSShadowOutputRanges[layer].height,
        }),
      },
      shadowRadius: elevation.interpolate({
        inputRange,
        outputRange: iOSShadowOutputRanges[layer].shadowRadius,
      }),
    };
  }

  return {
    shadowColor,
    shadowOpacity: elevation ? iOSShadowOutputRanges[layer].shadowOpacity : 0,
    shadowOffset: {
      width: 0,
      height: iOSShadowOutputRanges[layer].height[elevation],
    },
    shadowRadius: iOSShadowOutputRanges[layer].shadowRadius[elevation],
  };
}

const SurfaceIOS = forwardRef<
  View,
  Omit<Props, 'elevation'> & {
    elevation: Elevation;
    backgroundColor?: string | Animated.AnimatedInterpolation<string | number>;
  }
>(
  (
    {
      elevation,
      style,
      backgroundColor,
      testID,
      children,
      mode = 'elevated',
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
        ...(isElevated && getStyleForShadowLayer(elevation, 0)),
        ...outerLayerStyles,
        ...borderRadiusStyles,
        backgroundColor: bgColor,
      };

      const innerLayerViewStyles = {
        ...(isElevated && getStyleForShadowLayer(elevation, 1)),
        ...filteredStyles,
        ...borderRadiusStyles,
        flex: flattenedStyles.height ? 1 : undefined,
        backgroundColor: bgColor,
      };

      return [outerLayerViewStyles, innerLayerViewStyles];
    }, [style, elevation, backgroundColor, mode]);

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

    if (!theme.isV3)
      return (
        <MD2Surface {...props} theme={theme} style={style} ref={ref}>
          {children}
        </MD2Surface>
      );

    const { colors } = theme;

    const inputRange = [0, 1, 2, 3, 4, 5];

    const backgroundColor = (() => {
      if (isAnimatedValue(elevation)) {
        return elevation.interpolate({
          inputRange,
          outputRange: inputRange.map((elevation) => {
            return colors.elevation?.[`level${elevation as MD3Elevation}`];
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
            elevation && isElevated ? shadow(elevation, theme.isV3) : null,
            style,
          ]}
        >
          {children}
        </Animated.View>
      );
    }

    if (Platform.OS === 'android') {
      const elevationLevel = [0, 3, 6, 9, 12, 15];

      const getElevationAndroid = () => {
        if (isAnimatedValue(elevation)) {
          return elevation.interpolate({
            inputRange,
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
