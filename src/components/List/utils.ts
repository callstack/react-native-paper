import { StyleSheet } from 'react-native';

import color from 'color';
import type { EllipsizeProp, InternalTheme } from 'src/types';

type Description =
  | React.ReactNode
  | ((props: {
      selectable: boolean;
      ellipsizeMode: EllipsizeProp | undefined;
      color: string;
      fontSize: number;
    }) => React.ReactNode);

export const getLeftStyles = (
  alignToTop: boolean,
  description: Description,
  isV3: boolean
) => {
  const stylesV3 = {
    marginEnd: 0,
    marginStart: 16,
    alignSelf: alignToTop ? 'flex-start' : 'center',
  };

  if (!description) {
    return {
      ...styles.iconmarginStart,
      ...styles.marginVerticalNone,
      ...(isV3 && { ...stylesV3 }),
    };
  }

  if (!isV3) {
    return styles.iconmarginStart;
  }

  return {
    ...styles.iconmarginStart,
    ...stylesV3,
  };
};

export const getRightStyles = (
  alignToTop: boolean,
  description: Description,
  isV3: boolean
) => {
  const stylesV3 = {
    marginStart: 16,
    alignSelf: alignToTop ? 'flex-start' : 'center',
  };

  if (!description) {
    return {
      ...styles.iconmarginEnd,
      ...styles.marginVerticalNone,
      ...(isV3 && { ...stylesV3 }),
    };
  }

  if (!isV3) {
    return styles.iconmarginEnd;
  }

  return {
    ...styles.iconmarginEnd,
    ...stylesV3,
  };
};

const styles = StyleSheet.create({
  marginVerticalNone: { marginVertical: 0 },
  iconmarginStart: { marginStart: 0, marginEnd: 16 },
  iconmarginEnd: { marginEnd: 0 },
});

export const getAccordionColors = ({
  theme,
  isExpanded,
}: {
  theme: InternalTheme;
  isExpanded?: boolean;
}) => {
  const titleColor = theme.isV3
    ? theme.colors.onSurface
    : color(theme.colors.text).alpha(0.87).rgb().string();

  const descriptionColor = theme.isV3
    ? theme.colors.onSurfaceVariant
    : color(theme.colors.text).alpha(0.54).rgb().string();

  const titleTextColor = isExpanded ? theme.colors?.primary : titleColor;

  const rippleColor = color(titleTextColor).alpha(0.12).rgb().string();

  return {
    titleColor,
    descriptionColor,
    titleTextColor,
    rippleColor,
  };
};
