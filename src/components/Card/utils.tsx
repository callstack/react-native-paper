import type { StyleProp, ViewStyle } from 'react-native';

import type { InternalTheme } from '../../types';

type CardMode = 'elevated' | 'outlined' | 'contained';

type BorderRadiusStyles = Pick<
  ViewStyle,
  Extract<keyof ViewStyle, `border${string}Radius`>
>;

export type CardActionChildProps = {
  compact?: boolean;
  mode?: string;
  style?: StyleProp<ViewStyle>;
};

export const getCardCoverStyle = ({
  theme,
  borderRadiusStyles,
}: {
  theme: InternalTheme;
  borderRadiusStyles: BorderRadiusStyles;
  index?: number;
  total?: number;
}) => {
  const { roundness } = theme;

  if (Object.keys(borderRadiusStyles).length > 0) {
    return {
      borderRadius: 3 * roundness,
      ...borderRadiusStyles,
    };
  }

  return {
    borderRadius: 3 * roundness,
  };
};

const getBorderColor = ({ theme }: { theme: InternalTheme }) => {
  const {
    colors: { outline },
  } = theme;

  return outline;
};

const getBackgroundColor = ({
  theme,
  isMode,
}: {
  theme: InternalTheme;
  isMode: (mode: CardMode) => boolean;
}) => {
  const {
    colors: { surfaceVariant, surface },
  } = theme;

  if (isMode('contained')) {
    return surfaceVariant;
  }
  if (isMode('outlined')) {
    return surface;
  }
  return undefined;
};

export const getCardColors = ({
  theme,
  mode,
}: {
  theme: InternalTheme;
  mode: CardMode;
}) => {
  const isMode = (modeToCompare: CardMode) => {
    return mode === modeToCompare;
  };

  return {
    backgroundColor: getBackgroundColor({
      theme,
      isMode,
    }),
    borderColor: getBorderColor({ theme }),
  };
};
