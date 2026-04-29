import { StyleSheet, StyleProp, ViewStyle } from 'react-native';

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
  alignSelf?: 'flex-start' | 'center';
};

const stylesV3Left = {
  marginRight: 0,
  marginLeft: 16,
};

const stylesV3Right = {
  marginLeft: 16,
};

export const getLeftStyles = (
  alignToTop: boolean,
  description: Description
) => {
  const stylesV3: Style = {
    ...stylesV3Left,
    alignSelf: alignToTop ? 'flex-start' : 'center',
  };

  if (!description) {
    return {
      ...styles.iconMarginLeft,
      ...styles.marginVerticalNone,
      ...stylesV3,
    };
  }

  return {
    ...styles.iconMarginLeft,
    ...stylesV3,
  };
};

export const getRightStyles = (
  alignToTop: boolean,
  description: Description
) => {
  const stylesV3: Style = {
    ...stylesV3Right,
    alignSelf: alignToTop ? 'flex-start' : 'center',
  };

  if (!description) {
    return {
      ...styles.iconMarginRight,
      ...styles.marginVerticalNone,
      ...stylesV3,
    };
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
}: {
  theme: InternalTheme;
  isExpanded?: boolean;
}) => {
  const titleColor = theme.colors.onSurface;

  const descriptionColor = theme.colors.onSurfaceVariant;

  const titleTextColor = isExpanded ? theme.colors?.primary : titleColor;

  return {
    descriptionColor,
    titleTextColor,
  };
};
