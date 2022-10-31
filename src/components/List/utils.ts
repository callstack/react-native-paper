import { StyleSheet } from 'react-native';

import type { EllipsizeProp } from 'src/types';

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
