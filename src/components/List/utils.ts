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
  description: Description,
  isV3: boolean
) => {
  const stylesV3 = {
    marginRight: 0,
    marginLeft: 16,
    alignSelf: alignToTop ? 'flex-start' : 'center',
  };

  if (!description) {
    return {
      ...styles.iconMarginLeft,
      ...styles.marginVerticalNone,
      ...(isV3 && { ...stylesV3 }),
    };
  }

  if (!isV3) {
    return styles.iconMarginLeft;
  }

  return {
    ...styles.iconMarginLeft,
    ...stylesV3,
  };
};

export const getRightStyles = (
  alignToTop: boolean,
  description: Description,
  isV3: boolean
) => {
  const stylesV3 = {
    marginLeft: 16,
    alignSelf: alignToTop ? 'flex-start' : 'center',
  };

  if (!description) {
    return {
      ...styles.iconMarginRight,
      ...styles.marginVerticalNone,
      ...(isV3 && { ...stylesV3 }),
    };
  }

  if (!isV3) {
    return styles.iconMarginRight;
  }

  return {
    ...styles.iconMarginRight,
    ...stylesV3,
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
  const titleColor = theme.isV3
    ? theme.colors.onSurface
    : color(theme.colors.text).alpha(0.87).rgb().string();

  const descriptionColor = theme.isV3
    ? theme.colors.onSurfaceVariant
    : color(theme.colors.text).alpha(0.54).rgb().string();

  const titleTextColor = isExpanded ? theme.colors?.primary : titleColor;

  const rippleColor =
    customRippleColor || color(titleTextColor).alpha(0.12).rgb().string();

  return {
    titleColor,
    descriptionColor,
    titleTextColor,
    rippleColor,
  };
};
