import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import Surface from '../Surface';

type StyleCase = {
  property: keyof ViewStyle;
  value: ViewStyle[keyof ViewStyle];
};

const SPOT_SHADOW_OPACITY = 0.19;
const AMBIENT_SHADOW_OPACITY = 0.039;

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Surface', () => {
  it('should properly render passed props', async () => {
    await render(
      <Surface pointerEvents="box-none" testID="surface-container">
        {null}
      </Surface>
    );
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('surface-container').props.pointerEvents).toBe(
      'box-none'
    );
  });

  describe('on iOS', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'ios');
    });

    const styles = StyleSheet.create({
      absoluteStyles: {
        bottom: 10,
        end: 20,
        left: 30,
        position: 'absolute',
        right: 40,
        start: 50,
        top: 60,
      },
      innerLayerViewStyle: {
        padding: 13,
      },
      restStyle: {
        padding: 10,
        flexDirection: 'row',
        alignContent: 'center',
      },
    });

    it('should render Surface with appropriate bg color but without shadow, if mode is set to "flat"', async () => {
      await render(
        <Surface
          mode="flat"
          elevation={5}
          pointerEvents="box-none"
          testID={'surface-test'}
        >
          {null}
        </Surface>
      );

      // @ts-expect-error
      expect(screen.getByTestId('surface-test-outer-layer')).not.toHaveStyle({
        shadowOpacity: expect.any(Number),
      });
      // @ts-expect-error
      expect(screen.getByTestId('surface-test')).not.toHaveStyle({
        shadowOpacity: expect.any(Number),
      });
      expect(screen.getByTestId('surface-test')).toHaveStyle({
        backgroundColor: getTheme().colors.surfaceContainerHighest,
      });
    });

    it('should render a spot shadow over an ambient shadow, if mode is elevated', async () => {
      await render(
        <Surface elevation={5} testID={'surface-test'}>
          {null}
        </Surface>
      );

      expect(screen.getByTestId('surface-test-outer-layer')).toHaveStyle({
        shadowOpacity: SPOT_SHADOW_OPACITY,
      });
      expect(screen.getByTestId('surface-test')).toHaveStyle({
        shadowOpacity: AMBIENT_SHADOW_OPACITY,
      });
    });

    it.each([
      { property: 'opacity', value: 0.7 },
      { property: 'transform', value: [{ scale: 1.02 }] },
      { property: 'width', value: '42%' },
      { property: 'height', value: '32.5%' },
      { property: 'margin', value: 13 },
      { property: 'marginLeft', value: 13.1 },
      { property: 'marginRight', value: 13.2 },
      { property: 'marginTop', value: 13.3 },
      { property: 'marginBottom', value: 13.4 },
      { property: 'marginHorizontal', value: 13.5 },
      { property: 'marginVertical', value: 13.6 },
      { property: 'position', value: 'absolute' },
      { property: 'alignSelf', value: 'flex-start' },
      { property: 'top', value: 1.1 },
      { property: 'right', value: 1.2 },
      { property: 'bottom', value: 1.3 },
      { property: 'left', value: 1.4 },
      { property: 'start', value: 1.5 },
      { property: 'end', value: 1.6 },
      { property: 'flex', value: 6 },
    ] satisfies StyleCase[])(
      'applies $property to outer layer only',
      async ({ property, value }) => {
        const style = { [property]: value };

        await render(
          <Surface testID="surface-test" style={style}>
            {null}
          </Surface>
        );

        expect(screen.getByTestId('surface-test-outer-layer')).toHaveStyle(
          style
        );
        expect(screen.getByTestId('surface-test')).not.toHaveStyle(style);
      }
    );

    it.each([
      { property: 'padding', value: 12 },
      { property: 'paddingLeft', value: 12.1 },
      { property: 'paddingRight', value: 12.2 },
      { property: 'paddingTop', value: 12.3 },
      { property: 'paddingBottom', value: 12.4 },
      { property: 'paddingHorizontal', value: 12.5 },
      { property: 'paddingVertical', value: 12.6 },
      { property: 'borderWidth', value: 2 },
      { property: 'borderColor', value: 'black' },
    ] satisfies StyleCase[])(
      'applies $property to inner layer only',
      async ({ property, value }) => {
        const style = { [property]: value };

        await render(
          <Surface testID="surface-test" style={style}>
            {null}
          </Surface>
        );

        expect(screen.getByTestId('surface-test-outer-layer')).not.toHaveStyle(
          style
        );
        expect(screen.getByTestId('surface-test')).toHaveStyle(style);
      }
    );

    it.each([
      { property: 'borderRadius', value: 3 },
      { property: 'borderTopLeftRadius', value: 1 },
      { property: 'borderTopRightRadius', value: 2 },
      { property: 'borderBottomLeftRadius', value: 3 },
      { property: 'borderBottomRightRadius', value: 4 },
      { property: 'backgroundColor', value: 'rgb(4, 5, 6)' },
    ] satisfies StyleCase[])(
      'applies $property to every layer',
      async ({ property, value }) => {
        const style = { [property]: value };

        await render(
          <Surface testID="surface-test" style={style}>
            {null}
          </Surface>
        );

        expect(screen.getByTestId('surface-test-outer-layer')).toHaveStyle(
          style
        );
        expect(screen.getByTestId('surface-test')).toHaveStyle(style);
      }
    );

    describe('outer layer', () => {
      it('should not render rest style', async () => {
        await render(
          <Surface testID="surface-test" style={styles.restStyle}>
            {null}
          </Surface>
        );

        expect(screen.getByTestId('surface-test-outer-layer')).not.toHaveStyle(
          styles.restStyle
        );
      });

      it('should render absolute position properties on outer layer', async () => {
        await render(
          <Surface testID="surface-test" style={styles.absoluteStyles}>
            {null}
          </Surface>
        );

        expect(screen.getByTestId('surface-test-outer-layer')).toHaveStyle(
          styles.absoluteStyles
        );
      });

      it('should render absolute position properties on the outer layer', async () => {
        await render(
          <Surface testID="surface-test" style={styles.absoluteStyles}>
            {null}
          </Surface>
        );

        expect(screen.getByTestId('surface-test-outer-layer')).toHaveStyle(
          styles.absoluteStyles
        );
      });
    });

    describe('inner layer', () => {
      it('should render inner layer styles on the inner layer', async () => {
        await render(
          <Surface testID="surface-test" style={styles.innerLayerViewStyle}>
            {null}
          </Surface>
        );

        expect(screen.getByTestId('surface-test')).toHaveStyle(
          styles.innerLayerViewStyle
        );
      });
    });

    it('applies backgroundColor to every layer', async () => {
      const backgroundColor = 'rgb(1, 2, 3)';
      await render(
        <Surface
          testID="surface-test"
          theme={{ colors: { elevation: { level1: backgroundColor } } }}
        >
          {null}
        </Surface>
      );

      const style = { backgroundColor };
      expect(screen.getByTestId('surface-test-outer-layer')).toHaveStyle(style);
      expect(screen.getByTestId('surface-test')).toHaveStyle(style);
    });

    describe('children wrapper', () => {
      it('should render rest styles', async () => {
        const combinedStyles = [styles.innerLayerViewStyle, styles.restStyle];

        await render(
          <Surface testID="surface-test" style={combinedStyles}>
            {null}
          </Surface>
        );

        expect(screen.getByTestId('surface-test')).toHaveStyle(combinedStyles);
      });
    });
  });

  describe('on Android', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'android');
    });

    it('should render Surface with appropriate bg color but without shadow, if mode is set to "flat"', async () => {
      await render(
        <Surface
          mode="flat"
          elevation={5}
          pointerEvents="box-none"
          testID="surface-container"
        >
          {null}
        </Surface>
      );

      // @ts-expect-error
      expect(screen.getByTestId('surface-container')).not.toHaveStyle({
        elevation: expect.any(Number),
      });
      expect(screen.getByTestId('surface-container')).toHaveStyle({
        backgroundColor: getTheme().colors.surfaceContainerHighest,
      });
    });

    it('should render the dp value for the elevation level, if mode is elevated', async () => {
      await render(
        <Surface elevation={5} testID="surface-container">
          {null}
        </Surface>
      );

      expect(screen.getByTestId('surface-container')).toHaveStyle({
        elevation: 12,
      });
    });
  });

  describe('on Web', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'web');
    });

    it('should render both shadows in one box shadow, if mode is elevated', async () => {
      await render(
        <Surface elevation={5} testID="surface-container">
          {null}
        </Surface>
      );

      expect(screen.getByTestId('surface-container')).toHaveStyle({
        boxShadow:
          `0px 6.75px 19.22px rgba(0, 0, 0, ${SPOT_SHADOW_OPACITY}), ` +
          `0px 0px 6px rgba(0, 0, 0, ${AMBIENT_SHADOW_OPACITY})`,
      });
    });
  });
});
