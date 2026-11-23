import { StyleSheet } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import Chip from '../../components/Chip/Chip';
import Surface from '../../components/Surface';
import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import PaperProvider from '../PaperProvider';

// Reanimated's jest setup keeps CSS transition props off `style`, on the host
// view's `jestInlineStyle` prop.
const getTransitionDuration = (
  element: ReturnType<typeof screen.getByTestId> | null
) =>
  // eslint-disable-next-line no-restricted-syntax -- CSS transitions are only readable from this Reanimated test prop.
  StyleSheet.flatten(element?.props.jestInlineStyle)?.transitionDuration;

// A full theme passed to a component, such as a built-in scheme, overrides
// what PaperProvider puts in the theme, so reduce motion has to reach the
// component another way. A theme written for an early 6.x build may also still
// set `animation.scale`, which Paper no longer reads.
const LegacyLightTheme = { ...LightTheme, animation: { scale: 1 } };

describe.each([
  { label: 'a built-in scheme', theme: LightTheme },
  { label: 'a theme that still sets animation.scale', theme: LegacyLightTheme },
])('given $label', ({ theme }) => {
  const cases = [
    { reduceMotion: 'on', duration: 0 },
    { reduceMotion: 'off', duration: LightTheme.motion.duration.short3 },
  ] as const;

  it.each(cases)(
    'transitions the elevation of a Surface in $duration ms when reduceMotion is "$reduceMotion"',
    async ({ reduceMotion, duration }) => {
      await render(
        <PaperProvider reduceMotion={reduceMotion}>
          <Surface elevation={1} theme={theme} testID="surface">
            {null}
          </Surface>
        </PaperProvider>
      );

      expect(getTransitionDuration(screen.getByTestId('surface'))).toBe(
        duration
      );
    }
  );

  it.each(cases)(
    'transitions the elevation of a Chip in $duration ms when reduceMotion is "$reduceMotion"',
    async ({ reduceMotion, duration }) => {
      await render(
        <PaperProvider reduceMotion={reduceMotion}>
          <Chip onPress={() => {}} theme={theme}>
            Chip
          </Chip>
        </PaperProvider>
      );

      // The Chip's Surface is the container of its pressable body.
      expect(getTransitionDuration(screen.getByRole('button').parent)).toBe(
        duration
      );
    }
  );
});
