import * as React from 'react';
import { Platform, PlatformColor, Text } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import color from 'color';

import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import type { PressableProps } from '../TouchableRipple/Pressable';
// The bare specifier resolves to .native under the jest preset, so the web file
// needs the extension or it never runs.
import TouchableRipple from '../TouchableRipple/TouchableRipple.tsx';

// Jest has no pointer, so the mock renders Pressable as hovered. That is the
// state React Native Web passes to the style function under a mouse.
jest.mock('../TouchableRipple/Pressable', () => {
  const React = require('react');
  const { View } = require('react-native');
  const hovered = { hovered: true, pressed: false, focused: false };

  return {
    Pressable: React.forwardRef(
      (
        { style, children, ...rest }: PressableProps,
        ref: React.Ref<unknown>
      ) => (
        <View
          {...rest}
          ref={ref}
          style={typeof style === 'function' ? style(hovered) : style}
        >
          {typeof children === 'function' ? children(hovered) : children}
        </View>
      )
    ),
  };
});

const hoverColor = color(String(LightTheme.colors.stateLayerPressed))
  .fade(0.5)
  .rgb()
  .string();
const hoverLayer = `linear-gradient(${hoverColor}, ${hoverColor})`;
const rowColor = LightTheme.colors.secondaryContainer;

describe('TouchableRipple hover (web)', () => {
  const original = Platform.OS;
  beforeEach(() => {
    Platform.OS = 'web';
  });
  afterEach(() => {
    Platform.OS = original;
  });

  it('paints the hover layer when style sets no background', async () => {
    await render(
      <TouchableRipple onPress={() => {}} testID="ripple">
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('ripple')).toHaveStyle({
      backgroundImage: hoverLayer,
    });
  });

  it('paints the hover layer on top of a background set through style', async () => {
    await render(
      <TouchableRipple
        onPress={() => {}}
        style={{ backgroundColor: rowColor }}
        testID="ripple"
      >
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('ripple')).toHaveStyle({
      backgroundColor: rowColor,
      backgroundImage: hoverLayer,
    });
  });

  it('paints the hover layer on top of a background from a style function', async () => {
    await render(
      <TouchableRipple
        onPress={() => {}}
        style={() => ({ backgroundColor: rowColor })}
        testID="ripple"
      >
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('ripple')).toHaveStyle({
      backgroundColor: rowColor,
      backgroundImage: hoverLayer,
    });
  });

  it('does not paint a hover layer for a ripple color that is not a string', async () => {
    await render(
      <TouchableRipple
        onPress={() => {}}
        rippleColor={PlatformColor('systemBlue')}
        testID="ripple"
      >
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('ripple')).toHaveStyle({
      backgroundImage: undefined,
    });
  });

  it('does not paint the hover layer on a disabled touchable', async () => {
    await render(
      <TouchableRipple onPress={() => {}} disabled testID="ripple">
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('ripple')).not.toHaveStyle({
      backgroundImage: hoverLayer,
    });
  });
});
