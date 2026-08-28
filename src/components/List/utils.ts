import type { StyleProp, ViewStyle } from 'react-native';

import { ListTokens } from './tokens';
import type { EllipsizeProp, InternalTheme, ThemeProp } from '../../types';

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

const getAccessoryStyles = (
  alignToTop: boolean,
  description: Description
): Style => {
  const style: Style = {
    marginLeft: ListTokens.leadingSpace,
    marginRight: 0,
    alignSelf: alignToTop ? 'flex-start' : 'center',
  };

  return description ? style : { ...style, marginVertical: 0 };
};

export const getLeftStyles = (alignToTop: boolean, description: Description) =>
  getAccessoryStyles(alignToTop, description);

export const getRightStyles = (alignToTop: boolean, description: Description) =>
  getAccessoryStyles(alignToTop, description);

export const getAccordionColors = ({ theme }: { theme: InternalTheme }) => ({
  titleTextColor: theme.colors[ListTokens.headlineColor],
  descriptionColor: theme.colors[ListTokens.supportingTextColor],
});
