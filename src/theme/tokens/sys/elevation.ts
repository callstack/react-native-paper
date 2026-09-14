// M3 elevation tokens and shadow builder per spec:
// https://m3.material.io/styles/elevation/tokens

import { Platform, type ColorValue, type ViewStyle } from 'react-native';

import color from 'color';

import type { ThemeElevation } from '../../types';

export const defaultElevation: ThemeElevation = {
  level0: 0,
  level1: 1,
  level2: 2,
  level3: 3,
  level4: 4,
  level5: 5,
};

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

const shadowLayers = [
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

type NativeShadowStyle = {
  shadowColor: ColorValue;
  shadowOpacity: number;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowRadius: number;
};

type ShadowStyle =
  | NativeShadowStyle
  | { boxShadow: NonNullable<ViewStyle['boxShadow']> };

export function shadow(
  elevation: number,
  shadowColor: ColorValue
): [ShadowStyle, NativeShadowStyle | undefined] {
  if (Platform.OS === 'web') {
    if (typeof shadowColor !== 'string') {
      throw new Error(
        `Expected a string shadow color on Web, but received a ${typeof shadowColor}.`
      );
    }

    return [
      {
        boxShadow: shadowLayers
          .map(
            (layer) =>
              `0px ${layer.height[elevation]}px ${layer.blurRadius[elevation]}px ${color(
                shadowColor
              )
                .alpha(layer.shadowOpacity)
                .rgb()
                .string()}`
          )
          .join(', '),
      },
      undefined,
    ];
  }

  const [spotShadow, ambientShadow] = shadowLayers.map((layer) => ({
    shadowColor,
    shadowOpacity: elevation ? layer.shadowOpacity : 0,
    shadowOffset: {
      width: 0,
      height: layer.height[elevation],
    },
    shadowRadius: layer.shadowRadius[elevation],
  }));

  return [spotShadow, ambientShadow];
}
