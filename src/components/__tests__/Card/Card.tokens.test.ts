import { describe, expect, it } from '@jest/globals';

import { LightTheme } from '../../../theme/schemes';
import {
  cardStates,
  cardVariants,
  resolveCardVisuals,
} from '../../Card/tokens';
import type { CardState, CardVariant } from '../../Card/tokens';

const stateFlags: Record<
  CardState,
  Partial<
    Record<'disabled' | 'dragged' | 'pressed' | 'focused' | 'hovered', boolean>
  >
> = {
  enabled: {},
  hovered: { hovered: true },
  focused: { focused: true },
  pressed: { pressed: true },
  dragged: { dragged: true },
  disabled: { disabled: true },
};

type ExpectedVisualTokens = {
  containerRole:
    | 'surfaceContainerLow'
    | 'surfaceContainerHighest'
    | 'surface'
    | 'onSurface';
  containerOpacity: number;
  outlineRole: 'outlineVariant' | 'onSurface' | 'outline';
  outlineOpacity: number;
  outlineWidth: 0 | 1;
  elevation: 0 | 1 | 2 | 3 | 4 | 5;
  stateLayerOpacity: number;
};

const expectedVisual = (
  tokens: Pick<
    ExpectedVisualTokens,
    'containerRole' | 'elevation' | 'stateLayerOpacity'
  > &
    Partial<ExpectedVisualTokens>
): ExpectedVisualTokens => ({
  containerOpacity: 1,
  outlineRole: 'outlineVariant',
  outlineOpacity: 0,
  outlineWidth: 0,
  ...tokens,
});

const expectedOutlinedVisual = (
  tokens: Pick<ExpectedVisualTokens, 'elevation' | 'stateLayerOpacity'> &
    Partial<ExpectedVisualTokens>
): ExpectedVisualTokens =>
  expectedVisual({
    containerRole: 'surface',
    outlineOpacity: 1,
    outlineWidth: 1,
    ...tokens,
  });

const expectedVisuals: Record<
  (typeof cardVariants)[number],
  ExpectedVisualTokens[]
> = {
  elevated: [
    expectedVisual({
      containerRole: 'surfaceContainerLow',
      elevation: 1,
      stateLayerOpacity: 0,
    }),
    expectedVisual({
      containerRole: 'surfaceContainerLow',
      elevation: 2,
      stateLayerOpacity: 0.08,
    }),
    expectedVisual({
      containerRole: 'surfaceContainerLow',
      elevation: 1,
      stateLayerOpacity: 0.1,
    }),
    expectedVisual({
      containerRole: 'surfaceContainerLow',
      elevation: 1,
      stateLayerOpacity: 0.1,
    }),
    expectedVisual({
      containerRole: 'surfaceContainerLow',
      elevation: 4,
      stateLayerOpacity: 0.16,
    }),
    expectedVisual({
      containerRole: 'surface',
      containerOpacity: 0.38,
      elevation: 1,
      stateLayerOpacity: 0,
    }),
  ],
  filled: [
    expectedVisual({
      containerRole: 'surfaceContainerHighest',
      elevation: 0,
      stateLayerOpacity: 0,
    }),
    expectedVisual({
      containerRole: 'surfaceContainerHighest',
      elevation: 1,
      stateLayerOpacity: 0.08,
    }),
    expectedVisual({
      containerRole: 'surfaceContainerHighest',
      elevation: 0,
      stateLayerOpacity: 0.1,
    }),
    expectedVisual({
      containerRole: 'surfaceContainerHighest',
      elevation: 0,
      stateLayerOpacity: 0.1,
    }),
    expectedVisual({
      containerRole: 'surfaceContainerHighest',
      elevation: 3,
      stateLayerOpacity: 0.16,
    }),
    expectedVisual({
      containerRole: 'onSurface',
      containerOpacity: 0.38,
      elevation: 0,
      stateLayerOpacity: 0,
    }),
  ],
  outlined: [
    expectedOutlinedVisual({ elevation: 0, stateLayerOpacity: 0 }),
    expectedOutlinedVisual({ elevation: 1, stateLayerOpacity: 0.08 }),
    expectedOutlinedVisual({
      elevation: 0,
      outlineRole: 'onSurface',
      stateLayerOpacity: 0.1,
    }),
    expectedOutlinedVisual({ elevation: 0, stateLayerOpacity: 0.1 }),
    expectedOutlinedVisual({ elevation: 3, stateLayerOpacity: 0.16 }),
    expectedOutlinedVisual({
      elevation: 0,
      outlineRole: 'outline',
      outlineOpacity: 0.12,
      stateLayerOpacity: 0,
    }),
  ],
};

describe('resolveCardVisuals', () => {
  it.each(cardVariants)(
    'resolves every Material state for the %s variant',
    (variant) => {
      const theme = LightTheme;

      expect(
        cardStates.map((state) => {
          return resolveCardVisuals({
            theme,
            variant,
            ...stateFlags[state],
          });
        })
      ).toEqual(
        expectedVisuals[variant].map(
          (
            {
              containerRole,
              containerOpacity,
              outlineRole,
              outlineOpacity,
              outlineWidth,
              elevation,
              stateLayerOpacity,
            },
            index
          ) => ({
            state: cardStates[index],
            containerColor: theme.colors[containerRole],
            containerOpacity,
            outlineColor: theme.colors[outlineRole],
            outlineOpacity,
            outlineWidth,
            elevation,
            shape: theme.shapes.corner.medium,
            stateLayerColor: theme.colors.onSurface,
            stateLayerOpacity,
          })
        )
      );
    }
  );

  it('uses disabled, dragged, pressed, focused, hovered, then enabled precedence', () => {
    const theme = LightTheme;
    const common = { theme, variant: 'filled' as const };

    expect([
      resolveCardVisuals({
        ...common,
        disabled: true,
        dragged: true,
        pressed: true,
        focused: true,
        hovered: true,
      }).state,
      resolveCardVisuals({
        ...common,
        dragged: true,
        pressed: true,
        focused: true,
        hovered: true,
      }).state,
      resolveCardVisuals({
        ...common,
        pressed: true,
        focused: true,
        hovered: true,
      }).state,
      resolveCardVisuals({
        ...common,
        focused: true,
        hovered: true,
      }).state,
      resolveCardVisuals({ ...common, hovered: true }).state,
      resolveCardVisuals(common).state,
    ]).toEqual(cardStates.toReversed());
  });

  const disabledContainerCases: [
    CardVariant,
    'surface' | 'onSurface',
    number,
  ][] = [
    ['filled', 'onSurface', 0.38],
    ['elevated', 'surface', 0.38],
    ['outlined', 'surface', 1],
  ];

  it.each(disabledContainerCases)(
    'resolves the MD3 disabled container color role for the %s variant',
    (variant, containerRole, containerOpacity) => {
      const theme = LightTheme;

      const { containerColor, containerOpacity: resolvedOpacity } =
        resolveCardVisuals({ theme, variant, disabled: true });

      expect(containerColor).toBe(theme.colors[containerRole]);
      expect(resolvedOpacity).toBe(containerOpacity);
    }
  );

  it('uses a custom resting elevation only for the enabled elevated state', () => {
    const theme = LightTheme;

    expect(
      resolveCardVisuals({ theme, variant: 'elevated', elevation: 5 }).elevation
    ).toBe(5);
    expect(
      resolveCardVisuals({
        theme,
        variant: 'elevated',
        elevation: 5,
        hovered: true,
      }).elevation
    ).toBe(2);
  });
});
