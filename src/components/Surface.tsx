import * as React from 'react';
import {
  Animated,
  Platform,
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
   * Note: In version 2 the `elevation` prop was accepted via `style` prop i.e. `style={{ elevation: 4 }}`.
   * It's no longer supported with theme version 3 and you should use `elevation` property instead.
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;
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

/**
 * Surface is a basic container that can give depth to an element with elevation shadow.
 * On dark theme with `adaptive` mode, surface is constructed by also placing a semi-transparent white overlay over a component surface.
 * See [Dark InternalTheme](https://callstack.github.io/react-native-paper/theming.html#dark-theme) for more information.
 * Overlay and shadow can be applied by specifying the `elevation` property both on Android and iOS.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/surface-android.png" />
 *     <figcaption>Surface on Android</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/surface-ios.png" />
 *     <figcaption>Surface on iOS</figcaption>
 *   </figure>
 * </div>
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

    if (Platform.OS === 'web') {
      return (
        <Animated.View
          {...props}
          ref={ref}
          testID={testID}
          style={[
            { backgroundColor },
            elevation ? shadow(elevation, theme.isV3) : null,
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
            {
              elevation: getElevationAndroid(),
            },
          ]}
        >
          {children}
        </Animated.View>
      );
    }

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

    const shadowColor = '#000';

    const {
      position,
      alignSelf,
      top,
      left,
      right,
      bottom,
      start,
      end,
      flex,
      ...restStyle
    } = (StyleSheet.flatten(style) || {}) as ViewStyle;

    const absoluteStyles = {
      position,
      alignSelf,
      top,
      right,
      bottom,
      left,
      start,
      end,
    };

    const sharedStyle = [{ backgroundColor, flex }, restStyle];

    const innerLayerViewStyles = [{ flex }];

    const outerLayerViewStyles = [absoluteStyles, innerLayerViewStyles];

    if (isAnimatedValue(elevation)) {
      const inputRange = [0, 1, 2, 3, 4, 5];

      const getStyleForAnimatedShadowLayer = (layer: 0 | 1) => {
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
      };

      return (
        <Animated.View
          style={[getStyleForAnimatedShadowLayer(0), outerLayerViewStyles]}
          testID={`${testID}-outer-layer`}
        >
          <Animated.View
            style={[getStyleForAnimatedShadowLayer(1), innerLayerViewStyles]}
            testID={`${testID}-inner-layer`}
          >
            <Animated.View {...props} testID={testID} style={sharedStyle}>
              {children}
            </Animated.View>
          </Animated.View>
        </Animated.View>
      );
    }

    const getStyleForShadowLayer = (layer: 0 | 1) => {
      return {
        shadowColor,
        shadowOpacity: elevation
          ? iOSShadowOutputRanges[layer].shadowOpacity
          : 0,
        shadowOffset: {
          width: 0,
          height: iOSShadowOutputRanges[layer].height[elevation],
        },
        shadowRadius: iOSShadowOutputRanges[layer].shadowRadius[elevation],
      };
    };

    return (
      <Animated.View
        ref={ref}
        style={[getStyleForShadowLayer(0), outerLayerViewStyles]}
        testID={`${testID}-outer-layer`}
      >
        <Animated.View
          style={[getStyleForShadowLayer(1), innerLayerViewStyles]}
          testID={`${testID}-inner-layer`}
        >
          <Animated.View {...props} testID={testID} style={sharedStyle}>
            {children}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  }
);

export default Surface;
