// M3 elevation tokens and shadow builder per spec:
// https://m3.material.io/styles/elevation/tokens

import {
  Animated,
  Platform,
  type ColorValue,
  type ViewStyle,
  type Animated as AnimatedNS,
} from 'react-native';

import color from 'color';

import { isAnimatedValue } from '../../../utils/animations';
import type { Elevation, ThemeElevation } from '../../types';

type AnimatedNativeShadowStyle = {
  shadowColor: ColorValue;
  shadowOffset: {
    width: AnimatedNS.Value;
    height: AnimatedNS.AnimatedInterpolation<number>;
  };
  shadowOpacity: AnimatedNS.AnimatedInterpolation<number>;
  shadowRadius: AnimatedNS.AnimatedInterpolation<number>;
};

type AnimatedBoxShadowStyle = {
  boxShadow: AnimatedNS.AnimatedInterpolation<string | number>;
};

type AnimatedShadowStyle = AnimatedNativeShadowStyle | AnimatedBoxShadowStyle;

export const defaultElevation: ThemeElevation = {
  level0: 0,
  level1: 1,
  level2: 2,
  level3: 3,
  level4: 4,
  level5: 5,
};

export const elevationInputRange: Elevation[] = Object.values(defaultElevation);

export const androidElevationLevels = [0, 1, 3, 6, 8, 12];

/**
 * Android draws two shadows for an elevated view:
 * - Spot shadow cast by a light source above the top edge of the window
 * - Ambient shadow centered on the view
 *
 * The shadow is dynamic based on how far the view is from the light source.
 * But we can't express this dynamic value in a static shadow.
 *
 * So we use an approximation assuming:
 * - Light is at the platform's default height and radius
 * - Screen is the size of a phone, 400dp wide and 800dp tall
 * - View is halfway down the window, and centered horizontally
 */

// https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/res/res/values/dimens.xml#752
const LIGHT_Z = 500;
const LIGHT_RADIUS = 800;
const SPOT_SHADOW_ALPHA = 0.19;
const AMBIENT_SHADOW_ALPHA = 0.039;

// https://skia.googlesource.com/skia/+/refs/heads/main/src/core/SkDrawShadowInfo.h#51
const AMBIENT_HEIGHT_FACTOR = 1 / 128;
const AMBIENT_GEOM_FACTOR = 64;

// Approximate blur based on how Skia draws the shadow
// https://skia.googlesource.com/skia/+/refs/heads/main/src/opts/SkRasterPipeline_opts.h#5326
const SOFT_EDGE_BLUR_FACTOR = 0.94;
const SOFT_EDGE_OFFSET_FACTOR = 0.17;

// Since we can't express the dynamic shadow statically
// We use these device dimensions to calculate as an approximation
const WINDOW_WIDTH = 400;
const WINDOW_HEIGHT = 800;

// https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/view/ThreadedRenderer.java#602
const LIGHT_HEIGHT = LIGHT_Z * ((WINDOW_WIDTH / 450 + 2) / 3);

// Sub-pixel precision is enough for a shadow, and keeps the values readable.
const round = (value: number) => Math.round(value * 100) / 100;

// How far the view has moved towards the light
// This controls the height and softness of the shadow
const getLightRatio = (dp: number) => dp / (LIGHT_HEIGHT - dp);

// How wide the shadow fades out over
// A larger light casts a softer shadow
const getSoftEdge = (dp: number) => getLightRatio(dp) * LIGHT_RADIUS;

const spotBlurRadius = androidElevationLevels.map((dp) =>
  round(getSoftEdge(dp) * SOFT_EDGE_BLUR_FACTOR)
);

// Android's ambient shadow starts dark at the view’s edge and fades outward.
// A regular blur is already half faded at that edge because half of it is hidden behind the view.
// Using the same fade distance gives both shadows a similar size, but our shadow starts lighter.
// https://skia.googlesource.com/skia/+/refs/heads/main/src/utils/SkShadowTessellator.cpp#923
const ambientBlurRadius = androidElevationLevels.map((dp) =>
  round(dp * AMBIENT_HEIGHT_FACTOR * AMBIENT_GEOM_FACTOR)
);

// On iOS, we need to use half the blur radius to draw the approximately same blur in `shadowRadius`
// https://github.com/react/react-native/blob/main/packages/react-native/React/Fabric/Utils/RCTBoxShadow.mm#L64-L67
const IOS_SHADOW_RADIUS_FACTOR = 0.5;

const getShadowRadius = (blurRadius: number[]) =>
  blurRadius.map((radius) => round(radius * IOS_SHADOW_RADIUS_FACTOR));

export const shadowLayers = [
  {
    height: androidElevationLevels.map((dp) =>
      round(
        getLightRatio(dp) * (WINDOW_HEIGHT / 2) -
          getSoftEdge(dp) * SOFT_EDGE_OFFSET_FACTOR
      )
    ),
    blurRadius: spotBlurRadius,
    shadowOpacity: SPOT_SHADOW_ALPHA,
    shadowRadius: getShadowRadius(spotBlurRadius),
  },
  {
    height: androidElevationLevels.map(() => 0),
    blurRadius: ambientBlurRadius,
    shadowOpacity: AMBIENT_SHADOW_ALPHA,
    shadowRadius: getShadowRadius(ambientBlurRadius),
  },
];

const getShadowColor = (shadowColor: ColorValue, shadowOpacity: number) => {
  if (typeof shadowColor !== 'string') {
    throw new Error(
      `Expected a string shadow color on Web, but received a ${typeof shadowColor}.`
    );
  }

  return color(shadowColor).alpha(shadowOpacity).rgb().string();
};

const getBoxShadowValue = (elevation: number, layerColors: readonly string[]) =>
  shadowLayers
    .map(
      (layer, index) =>
        `0px ${layer.height[elevation]}px ${layer.blurRadius[elevation]}px ${layerColors[index]}`
    )
    .join(', ');

export function shadow(elevation: number, shadowColor: ColorValue): ViewStyle;
// eslint-disable-next-line no-redeclare
export function shadow(
  elevation: Animated.Value,
  shadowColor: ColorValue
): AnimatedShadowStyle;
// eslint-disable-next-line no-redeclare
export function shadow(
  elevation: number | Animated.Value,
  shadowColor: ColorValue
): ViewStyle | AnimatedShadowStyle;
// eslint-disable-next-line no-redeclare
export function shadow(
  elevation: number | Animated.Value = 0,
  shadowColor: ColorValue
): ViewStyle | AnimatedShadowStyle {
  if (Platform.OS === 'web') {
    const layerColors = shadowLayers.map((layer) =>
      getShadowColor(shadowColor, layer.shadowOpacity)
    );

    if (isAnimatedValue(elevation)) {
      return {
        boxShadow: elevation.interpolate({
          inputRange: elevationInputRange,
          outputRange: elevationInputRange.map((value) =>
            getBoxShadowValue(value, layerColors)
          ),
        }),
      };
    }

    return {
      boxShadow: getBoxShadowValue(elevation, layerColors),
    };
  }

  // For a single view, we can only draw one shadow
  // So we pick the spot shadow, as it shows the depth
  const [spotShadow] = shadowLayers;

  if (isAnimatedValue(elevation)) {
    return {
      shadowColor,
      shadowOffset: {
        width: new Animated.Value(0),
        height: elevation.interpolate({
          inputRange: elevationInputRange,
          outputRange: spotShadow.height,
        }),
      },
      shadowOpacity: elevation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, spotShadow.shadowOpacity],
        extrapolate: 'clamp',
      }),
      shadowRadius: elevation.interpolate({
        inputRange: elevationInputRange,
        outputRange: spotShadow.shadowRadius,
      }),
    };
  }

  return {
    shadowColor,
    shadowOpacity: elevation ? spotShadow.shadowOpacity : 0,
    shadowOffset: {
      width: 0,
      height: spotShadow.height[elevation],
    },
    shadowRadius: spotShadow.shadowRadius[elevation],
  };
}
