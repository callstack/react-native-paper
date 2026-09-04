import type { ViewStyle } from 'react-native';

import type { InternalTheme } from '../../theme/types';

type BorderRadiusStyles = Pick<
  ViewStyle,
  Extract<keyof ViewStyle, `border${string}Radius`>
>;

export const getCardCoverStyle = ({
  theme,
  index: _index,
  total: _total,
  borderRadiusStyles,
}: {
  theme: InternalTheme;
  borderRadiusStyles: BorderRadiusStyles;
  index?: number;
  total?: number;
}) => {
  if (Object.keys(borderRadiusStyles).length > 0) {
    return {
      borderRadius: theme.shapes.corner.medium,
      ...borderRadiusStyles,
    };
  }

  return {
    borderRadius: theme.shapes.corner.medium,
  };
};
