import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  NativeSyntheticEvent,
  StyleProp,
  TextLayoutEventData,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { ListItemContext } from './ListItemContext';
import { ListTokens } from './tokens';
import { ListRowContext, getLeftStyles, getRightStyles } from './utils';
import type { Style } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, EllipsizeProp, ThemeProp } from '../../types';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

type Title =
  | React.ReactNode
  | ((props: {
      selectable: boolean;
      ellipsizeMode: EllipsizeProp | undefined;
      color: ColorValue;
      fontSize: number;
    }) => React.ReactNode);

type Description =
  | React.ReactNode
  | ((props: {
      selectable: boolean;
      ellipsizeMode: EllipsizeProp | undefined;
      color: ColorValue;
      fontSize: number;
    }) => React.ReactNode);

export type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Title text for the list item.
   */
  title: Title;
  /**
   * Description text for the list item or callback which returns a React element to display the description.
   */
  description?: Description;
  /**
   * Element to display in the leading slot. Takes precedence over `left`.
   */
  leading?: React.ReactNode;
  /**
   * Element to display in the trailing slot. Takes precedence over `right`.
   */
  trailing?: React.ReactNode;
  /**
   * Callback which returns a React element to display on the left side.
   */
  left?: (props: { color: ColorValue; style: Style }) => React.ReactNode;
  /**
   * Callback which returns a React element to display on the right side.
   */
  right?: (props: { color: ColorValue; style?: Style }) => React.ReactNode;
  /**
   * Whether to highlight the list item as selected.
   */
  selected?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Style that is passed to the root TouchableRipple container.
   */
  style?: StyleProp<ViewStyle>;
  ref?: React.Ref<View>;
  /**
   * Style that is passed to the outermost container that wraps the entire content, including left and right items and both title and description.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Style that is passed to the content container, which wraps the title and description.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Style that is passed to Title element.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * Style that is passed to Description element.
   */
  descriptionStyle?: StyleProp<TextStyle>;
  /**
   * Truncate Title text such that the total number of lines does not
   * exceed this number.
   */
  titleNumberOfLines?: number;
  /**
   * Truncate Description text such that the total number of lines does not
   * exceed this number.
   */
  descriptionNumberOfLines?: number;
  /**
   * Ellipsize Mode for the Title.  One of `'head'`, `'middle'`, `'tail'`, `'clip'`.
   *
   * See [`ellipsizeMode`](https://reactnative.dev/docs/text#ellipsizemode)
   */
  titleEllipsizeMode?: EllipsizeProp;
  /**
   * Ellipsize Mode for the Description.  One of `'head'`, `'middle'`, `'tail'`, `'clip'`.
   *
   * See [`ellipsizeMode`](https://reactnative.dev/docs/text#ellipsizemode)
   */
  descriptionEllipsizeMode?: EllipsizeProp;
  /**
   * Specifies the largest possible scale a title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
  /**
   * Specifies the largest possible scale a description font can reach.
   */
  descriptionMaxFontSizeMultiplier?: number;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
};

/**
 * A component to show tiles inside a List.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <List.Item
 *     title="First Item"
 *     description="Item description"
 *     left={props => <List.Icon {...props} icon="folder" />}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/docs/components/TouchableRipple
 */
const ListItem = ({
  left,
  right,
  leading,
  trailing,
  title,
  description,
  selected,
  onPress,
  theme: themeOverrides,
  style,
  containerStyle,
  contentStyle,
  titleStyle,
  titleNumberOfLines = 1,
  descriptionNumberOfLines = 2,
  titleEllipsizeMode,
  descriptionEllipsizeMode,
  descriptionStyle,
  descriptionMaxFontSizeMultiplier,
  titleMaxFontSizeMultiplier,
  testID,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const [isDescriptionMultiline, setIsDescriptionMultiline] =
    React.useState(false);

  const onDescriptionTextLayout = (
    event: NativeSyntheticEvent<TextLayoutEventData>
  ) => {
    const { nativeEvent } = event;
    setIsDescriptionMultiline(nativeEvent.lines.length >= 2);
  };

  const backgroundColor = selected
    ? theme.colors[ListTokens.selectedContainerColor]
    : undefined;
  const titleColor = selected
    ? theme.colors[ListTokens.selectedContentColor]
    : theme.colors[ListTokens.headlineColor];

  const renderDescription = (
    descriptionColor: ColorValue,
    description?: Description | null
  ) => {
    return typeof description === 'function' ? (
      description({
        selectable: false,
        ellipsizeMode: descriptionEllipsizeMode,
        color: descriptionColor,
        fontSize: theme.fonts.bodyMedium.fontSize,
      })
    ) : (
      <Text
        variant="bodyMedium"
        theme={theme}
        selectable={false}
        numberOfLines={descriptionNumberOfLines}
        ellipsizeMode={descriptionEllipsizeMode}
        style={[{ color: descriptionColor }, descriptionStyle]}
        onTextLayout={onDescriptionTextLayout}
        maxFontSizeMultiplier={descriptionMaxFontSizeMultiplier}
      >
        {description}
      </Text>
    );
  };

  const renderTitle = () => {
    return typeof title === 'function' ? (
      title({
        selectable: false,
        ellipsizeMode: titleEllipsizeMode,
        color: titleColor,
        fontSize: theme.fonts.bodyLarge.fontSize,
      })
    ) : (
      <Text
        variant="bodyLarge"
        theme={theme}
        selectable={false}
        ellipsizeMode={titleEllipsizeMode}
        numberOfLines={titleNumberOfLines}
        style={[{ color: titleColor }, titleStyle]}
        maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
      >
        {title}
      </Text>
    );
  };

  const descriptionColor = selected
    ? theme.colors[ListTokens.selectedContentColor]
    : theme.colors[ListTokens.supportingTextColor];

  const rowContext = React.useMemo(
    () => ({
      verticalPadding: isDescriptionMultiline
        ? ListTokens.threeLineVerticalPadding
        : ListTokens.verticalPadding,
    }),
    [isDescriptionMultiline]
  );

  const accessoryContext = React.useMemo(
    () => ({ color: descriptionColor }),
    [descriptionColor]
  );

  const renderLeading = () => {
    const accessoryStyle = getLeftStyles(isDescriptionMultiline, description);

    if (leading) {
      return <View style={accessoryStyle}>{leading}</View>;
    }

    return left
      ? left({
          color: selected
            ? theme.colors[ListTokens.selectedContentColor]
            : theme.colors[ListTokens.leadingIconColor],
          style: accessoryStyle,
        })
      : null;
  };

  const renderTrailing = () => {
    const accessoryStyle = getRightStyles(isDescriptionMultiline, description);

    if (trailing) {
      return <View style={accessoryStyle}>{trailing}</View>;
    }

    return right
      ? right({
          color: selected
            ? theme.colors[ListTokens.selectedContentColor]
            : theme.colors[ListTokens.trailingIconColor],
          style: accessoryStyle,
        })
      : null;
  };

  return (
    <ListRowContext.Provider value={rowContext}>
      <TouchableRipple
        {...rest}
        ref={ref}
        style={[
          styles.container,
          description ? styles.containerTwoLine : styles.containerOneLine,
          isDescriptionMultiline && styles.containerThreeLine,
          { backgroundColor },
          style,
        ]}
        onPress={onPress}
        aria-selected={selected}
        theme={theme}
        testID={testID}
      >
        <ListItemContext.Provider value={accessoryContext}>
          <View style={[styles.row, containerStyle]}>
            {renderLeading()}
            <View
              style={[styles.item, styles.content, contentStyle]}
              testID={`${testID}-content`}
            >
              {renderTitle()}

              {description
                ? renderDescription(descriptionColor, description)
                : null}
            </View>
            {renderTrailing()}
          </View>
        </ListItemContext.Provider>
      </TouchableRipple>
    </ListRowContext.Provider>
  );
};

ListItem.displayName = 'List.Item';

const styles = StyleSheet.create({
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
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  item: {
    paddingLeft: ListTokens.leadingSpace,
  },
  content: {
    flexShrink: 1,
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default ListItem;
