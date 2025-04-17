import * as React from 'react';
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextLayoutEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import color from 'color';

import { Style, getLeftStyles, getRightStyles } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, EllipsizeProp, ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

type Title =
  | React.ReactNode
  | ((props: {
      selectable: boolean;
      ellipsizeMode: EllipsizeProp | undefined;
      color: string;
      fontSize: number;
    }) => React.ReactNode);

type Description =
  | React.ReactNode
  | ((props: {
      selectable: boolean;
      ellipsizeMode: EllipsizeProp | undefined;
      color: string;
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
   * Callback which returns a React element to display on the left side.
   */
  left?: (props: { color: string; style: Style }) => React.ReactNode;
  /**
   * Callback which returns a React element to display on the right side.
   */
  right?: (props: { color: string; style?: Style }) => React.ReactNode;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Style that is passed to the wrapping TouchableRipple element.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style that is passed to the container wrapping title and descripton.
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
const ListItem = (
  {
    left,
    right,
    title,
    description,
    onPress,
    theme: themeOverrides,
    style,
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
    ...rest
  }: Props,
  ref: React.ForwardedRef<View>
) => {
  const theme = useInternalTheme(themeOverrides);
  const [alignToTop, setAlignToTop] = React.useState(false);

  const onDescriptionTextLayout = (
    event: NativeSyntheticEvent<TextLayoutEventData>
  ) => {
    if (!theme.isV3) {
      return;
    }
    const { nativeEvent } = event;
    setAlignToTop(nativeEvent.lines.length >= 2);
  };

  const renderDescription = (
    descriptionColor: string,
    description?: Description | null
  ) => {
    return typeof description === 'function' ? (
      description({
        selectable: false,
        ellipsizeMode: descriptionEllipsizeMode,
        color: descriptionColor,
        fontSize: styles.description.fontSize,
      })
    ) : (
      <Text
        selectable={false}
        numberOfLines={descriptionNumberOfLines}
        ellipsizeMode={descriptionEllipsizeMode}
        style={[
          styles.description,
          { color: descriptionColor },
          descriptionStyle,
        ]}
        onTextLayout={onDescriptionTextLayout}
        maxFontSizeMultiplier={descriptionMaxFontSizeMultiplier}
      >
        {description}
      </Text>
    );
  };

  const renderTitle = () => {
    const titleColor = theme.isV3
      ? theme.colors.onSurface
      : color(theme.colors.text).alpha(0.87).rgb().string();

    return typeof title === 'function' ? (
      title({
        selectable: false,
        ellipsizeMode: titleEllipsizeMode,
        color: titleColor,
        fontSize: styles.title.fontSize,
      })
    ) : (
      <Text
        selectable={false}
        ellipsizeMode={titleEllipsizeMode}
        numberOfLines={titleNumberOfLines}
        style={[styles.title, { color: titleColor }, titleStyle]}
        maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
      >
        {title}
      </Text>
    );
  };

  const descriptionColor = theme.isV3
    ? theme.colors.onSurfaceVariant
    : color(theme.colors.text).alpha(0.54).rgb().string();

  return (
    <TouchableRipple
      {...rest}
      ref={ref}
      style={[theme.isV3 ? styles.containerV3 : styles.container, style]}
      onPress={onPress}
      theme={theme}
      testID={testID}
    >
      <View style={theme.isV3 ? styles.rowV3 : styles.row}>
        {left
          ? left({
              color: descriptionColor,
              style: getLeftStyles(alignToTop, description, theme.isV3),
            })
          : null}
        <View
          style={[
            theme.isV3 ? styles.itemV3 : styles.item,
            styles.content,
            contentStyle,
          ]}
          testID={`${testID}-content`}
        >
          {renderTitle()}

          {description
            ? renderDescription(descriptionColor, description)
            : null}
        </View>
        {right
          ? right({
              color: descriptionColor,
              style: getRightStyles(alignToTop, description, theme.isV3),
            })
          : null}
      </View>
    </TouchableRipple>
  );
};

ListItem.displayName = 'List.Item';
const Component = forwardRef(ListItem);

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  containerV3: {
    paddingVertical: 8,
    paddingRight: 24,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  rowV3: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 6,
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  item: {
    marginVertical: 6,
    paddingLeft: 8,
  },
  itemV3: {
    paddingLeft: 16,
  },
  content: {
    flexShrink: 1,
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default Component;
