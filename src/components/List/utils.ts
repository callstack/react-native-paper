import {
  FlexAlignType,
  ColorValue,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import color from 'color';
import type { EllipsizeProp, InternalTheme, ThemeProp } from 'src/types';

type Description =
  | React.ReactNode
  | ((props: {
      selectable: boolean;
      ellipsizeMode: EllipsizeProp | undefined;
      color: string;
      fontSize: number;
    }) => React.ReactNode);

export type ListChildProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  theme?: ThemeProp;
};

export type Style = {
  marginLeft?: number;
  marginRight?: number;
  marginVertical?: number;
  alignSelf?: FlexAlignType;
};

export const getLeftStyles = (
  alignToTop: boolean,
  description: Description
): Style => {
  const additionalStyles = {
    marginRight: 0,
    marginLeft: 16,
    alignSelf: (alignToTop ? 'flex-start' : 'center') as FlexAlignType,
  };

  if (!description) {
    return {
      ...styles.iconMarginLeft,
      ...styles.marginVerticalNone,
      ...additionalStyles,
    };
  }

  return {
    ...styles.iconMarginLeft,
    ...additionalStyles,
  };
};

export const getRightStyles = (
  alignToTop: boolean,
  description: Description
): Style => {
  const additionalStyles = {
    marginLeft: 16,
    alignSelf: (alignToTop ? 'flex-start' : 'center') as FlexAlignType,
  };

  if (!description) {
    return {
      ...styles.iconMarginRight,
      ...styles.marginVerticalNone,
      ...additionalStyles,
    };
  }

  return {
    ...styles.iconMarginRight,
    ...additionalStyles,
  };
};

const styles = StyleSheet.create({
  marginVerticalNone: { marginVertical: 0 },
  iconMarginLeft: { marginLeft: 0, marginRight: 16 },
  iconMarginRight: { marginRight: 0 },
});

export const getAccordionColors = ({
  theme,
  isExpanded,
  customRippleColor,
}: {
  theme: InternalTheme;
  isExpanded?: boolean;
  customRippleColor?: ColorValue;
}) => {
  const {
    colors: { onSurfaceVariant, primary, onSurface },
  } = theme;

  const titleTextColor = isExpanded ? primary : onSurface;
  const rippleColor =
    customRippleColor || color(titleTextColor).alpha(0.12).rgb().string();

  return {
    descriptionColor: onSurfaceVariant,
    titleTextColor,
    rippleColor,
  };
};
