import type { Animated } from 'react-native';
import color from 'color';
import { black, white } from '../../styles/themes/v2/colors';
import type { Theme } from '../../types';
import overlay from '../../styles/overlay';

type CardMode = 'elevated' | 'outlined' | 'filled';
type Elevation = 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;

export const getCardCoverStyle = ({
  theme,
  index,
  total,
}: {
  theme: Theme;
  index?: number;
  total?: number;
}) => {
  const { isV3, roundness } = theme;

  if (index === 0) {
    if (total === 1) {
      return {
        borderRadius: roundness,
      };
    }

    if (isV3) {
      return {
        borderRadius: roundness,
      };
    }

    return {
      borderTopLeftRadius: roundness,
      borderTopRightRadius: roundness,
    };
  }

  if (typeof total === 'number' && index === total - 1) {
    return {
      borderBottomLeftRadius: roundness,
    };
  }

  return undefined;
};

const getBorderColor = ({ theme }: { theme: Theme }) => {
  if (theme.isV3) {
    return theme.colors.outline;
  }

  if (theme.dark) {
    return color(white).alpha(0.12).rgb().string();
  }
  return color(black).alpha(0.12).rgb().string();
};

const getBackgroundColor = ({
  theme,
  isMode,
  isAdaptiveMode,
  elevation,
}: {
  theme: Theme;
  isMode: (mode: CardMode) => boolean;
  isAdaptiveMode?: boolean;
  elevation: Elevation;
}) => {
  if (theme.isV3 && isMode('filled')) {
    return theme.colors.surfaceVariant;
  }

  if (theme.dark && isAdaptiveMode) {
    return overlay(elevation, theme.colors.surface);
  }
  return theme.colors.surface;
};

export const getCardColors = ({
  theme,
  mode,
  isAdaptiveMode,
  elevation,
}: {
  theme: Theme;
  mode: CardMode;
  isAdaptiveMode?: boolean;
  elevation: Elevation;
}) => {
  const isMode = (modeToCompare: CardMode) => {
    return mode === modeToCompare;
  };

  return {
    backgroundColor: getBackgroundColor({
      theme,
      isMode,
      isAdaptiveMode,
      elevation,
    }),
    borderColor: getBorderColor({ theme }),
  };
};
