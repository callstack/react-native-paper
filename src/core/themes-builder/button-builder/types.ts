import type { Animated } from 'react-native';

import type { Font } from '../../../types';

type DirectionOptions = {
  reverse: {
    compact: Record<string, number>;
    normal: Record<string, number>;
  };
  forward: {
    compact: Record<string, number>;
    normal: Record<string, number>;
  };
};

export type ButtonMode =
  | 'text'
  | 'outlined'
  | 'contained'
  | 'elevated'
  | 'contained-tonal';

export type ButtonTheme = {
  elevation: {
    initial: number;
    active: number;
    supportedMode: ButtonMode;
  };
  borderRadius: number;
  iconSize: number;
  font: Font;

  iconStyle: {
    icon: DirectionOptions;
    textMode: DirectionOptions;
  };
  textStyle: {
    getTextLabel: (
      isTextMode: boolean,
      hasIconOrLoading: boolean
    ) => Record<string, number>;
  };
  surfaceStyle: {
    getElevationStyle: (elevation: Animated.Value) => Record<string, number>;
    getElevationProp: (elevation: Animated.Value) => Record<string, number>;
  };
  buttonStyle: {
    backgroundColor: {
      enabled: { [key in ButtonMode]?: string };
      disabled: { [key in ButtonMode]?: string };
      default: string;
    };
    borderColor: {
      enabled: {
        [key in ButtonMode]?: string;
      };
      disabled: {
        [key in ButtonMode]?: string;
      };
      default: string;
    };
    borderWidth: {
      [key in ButtonMode]?: number;
    } & { default: number };
    textColor: {
      getTextColor: ({
        backgroundColor,
        isMode,
        disabled,
        dark,
      }: {
        backgroundColor: string;
        dark?: boolean;
        disabled?: boolean;
        isMode: (mode: ButtonMode) => boolean;
      }) => string;
    };
  };
};
