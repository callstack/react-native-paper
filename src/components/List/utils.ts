import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import type {
  ColorValue,
  StyleProp,
  TextLayoutEvent,
  TextProps,
  ViewStyle,
} from 'react-native';

import { ListTokens } from './tokens';
import type { ColorRole, InternalTheme, ThemeProp } from '../../theme/types';

type Description =
  | React.ReactNode
  | ((props: {
      selectable: boolean;
      ellipsizeMode: TextProps['ellipsizeMode'];
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

export const getAccessoryStyles = (
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

/**
 * Rows change their vertical padding with the number of lines, so a leading
 * element taller than the default slot needs to know how much of the MD3
 * height the row already covers.
 */
export const ListRowContext = React.createContext<{ verticalPadding: number }>({
  verticalPadding: ListTokens.verticalPadding,
});

/**
 * Text and icon colors for a `List.Item` or `List.Accordion` row. Disabled
 * wins over selected, as in the MD3 tokens.
 */
export const getListColors = ({
  theme,
  selected,
  disabled,
}: {
  theme: InternalTheme;
  selected?: boolean;
  disabled?: boolean;
}): {
  titleColor: ColorValue;
  descriptionColor: ColorValue;
  leadingIconColor: ColorValue;
  trailingIconColor: ColorValue;
  expandIconColor: ColorValue;
} => {
  const pick = (role: ColorRole) => {
    if (disabled) {
      return theme.colors[ListTokens.disabledContentColor];
    }

    return theme.colors[selected ? ListTokens.selectedContentColor : role];
  };

  return {
    titleColor: pick(ListTokens.headlineColor),
    descriptionColor: pick(ListTokens.supportingTextColor),
    leadingIconColor: pick(ListTokens.leadingIconColor),
    trailingIconColor: pick(ListTokens.trailingIconColor),
    expandIconColor: pick(ListTokens.expandTrailingIconColor),
  };
};

/**
 * Background of a selected row. A selected, disabled row gets an `onSurface`
 * layer at 38% opacity instead, which `ListSelectedDisabledLayer` draws.
 */
export const getSelectedContainerColor = ({
  theme,
  selected,
  disabled,
}: {
  theme: InternalTheme;
  selected?: boolean;
  disabled?: boolean;
}): ColorValue | undefined =>
  selected && !disabled
    ? theme.colors[ListTokens.selectedContainerColor]
    : undefined;

/**
 * The selected state for screen readers. On native, `aria-selected` is
 * announced as "selected". On web, `aria-selected` is not valid on
 * `role="button"` and goes unannounced, so a button row uses `aria-pressed`,
 * as `IconButton` does. React Native's types have no `aria-pressed`.
 */
export const getSelectedStateProps = ({
  selected,
  role,
}: {
  selected?: boolean;
  role?: string;
}): { 'aria-selected'?: boolean } | { 'aria-pressed': boolean } => {
  if (selected === undefined) {
    return {};
  }

  return Platform.OS === 'web' && role === 'button'
    ? { 'aria-pressed': selected }
    : { 'aria-selected': selected };
};

/**
 * Tracks whether the description wraps to more lines, which changes the
 * row's vertical padding and where its leading and trailing elements sit.
 */
export const useListRow = () => {
  const [isDescriptionMultiline, setIsDescriptionMultiline] =
    React.useState(false);

  const onDescriptionTextLayout = (event: TextLayoutEvent) => {
    setIsDescriptionMultiline(event.nativeEvent.lines.length >= 2);
  };

  const rowContext = React.useMemo(
    () => ({
      verticalPadding: isDescriptionMultiline
        ? ListTokens.threeLineVerticalPadding
        : ListTokens.verticalPadding,
    }),
    [isDescriptionMultiline]
  );

  return { isDescriptionMultiline, onDescriptionTextLayout, rowContext };
};

export const getRowContainerStyles = (
  hasDescription: boolean,
  isDescriptionMultiline: boolean
) => [
  rowStyles.container,
  hasDescription ? rowStyles.containerTwoLine : rowStyles.containerOneLine,
  isDescriptionMultiline && rowStyles.containerThreeLine,
];

/**
 * Fades the content of a disabled row: text, icons and custom elements.
 */
export const getRowContentStyle = (disabled?: boolean) =>
  disabled ? rowStyles.disabledContent : null;

const rowStyles = StyleSheet.create({
  container: {
    paddingVertical: ListTokens.verticalPadding,
    paddingRight: ListTokens.trailingSpace,
    justifyContent: 'center',
  },
  containerOneLine: {
    minHeight: ListTokens.oneLineContainerHeight,
  },
  containerTwoLine: {
    minHeight: ListTokens.twoLineContainerHeight,
  },
  containerThreeLine: {
    paddingVertical: ListTokens.threeLineVerticalPadding,
  },
  disabledContent: {
    opacity: ListTokens.disabledContentOpacity,
  },
});
