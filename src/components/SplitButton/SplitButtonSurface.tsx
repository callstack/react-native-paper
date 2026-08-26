import * as React from 'react';
import { Platform } from 'react-native';
import type { ViewProps, ViewStyle } from 'react-native';

import Animated from 'react-native-reanimated';

import { useInternalTheme } from '../../core/theming';
import {
  androidElevationLevels,
  shadow,
} from '../../theme/tokens/sys/elevation';
import type { ThemeProp } from '../../types';

type Props = ViewProps & {
  children: React.ReactNode;
  elevation: number;
  // `SplitButton` mixes plain style objects with Reanimated
  // `useAnimatedStyle()` results in the same array, which TS can't unify
  // structurally, so this internal-only prop is intentionally untyped.
  style?: any;
  theme?: ThemeProp;
};

/**
 * A bare `Surface` stand-in used only by `SplitButton`'s trailing segment,
 * so its Reanimated-driven shape style reaches a single native view
 * directly instead of going through `Surface`'s own JS-side style
 * splitting (which doesn't propagate Reanimated updates reliably).
 */
const SplitButtonSurface = ({
  elevation,
  style,
  theme: themeOverrides,
  children,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const elevationStyle: ViewStyle =
    Platform.OS === 'android'
      ? { elevation: androidElevationLevels[elevation] }
      : shadow(elevation, theme.colors.shadow);

  return (
    <Animated.View {...rest} style={[elevationStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default SplitButtonSurface;
