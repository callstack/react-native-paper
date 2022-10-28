import * as React from 'react';
import {
  FlexAlignType,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextLayoutEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import color from 'color';

import { withInternalTheme } from '../../core/theming';
import type {
  $RemoveChildren,
  EllipsizeProp,
  InternalTheme,
} from '../../types';
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

interface Style {
  marginLeft?: number;
  marginRight?: number;
  marginVertical?: number;
  alignSelf?: FlexAlignType;
}

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
  onPress?: () => void;
  /**
   * @optional
   */
  theme: InternalTheme;
  /**
   * Style that is passed to the wrapping TouchableRipple element.
   */
  style?: StyleProp<ViewStyle>;
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
};

/**
 * A component to show tiles inside a List.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/list-item-1.png" />
 *   <img class="medium" src="screenshots/list-item-2.png" />
 *   <img class="medium" src="screenshots/list-item-3.png" />
 * </div>
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
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/touchable-ripple.html
 */
const ListItem = ({
  left,
  right,
  title,
  description,
  onPress,
  theme,
  style,
  titleStyle,
  titleNumberOfLines = 1,
  descriptionNumberOfLines = 2,
  titleEllipsizeMode,
  descriptionEllipsizeMode,
  descriptionStyle,
  ...rest
}: Props) => {
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
      style={[theme.isV3 ? styles.containerV3 : styles.container, style]}
      onPress={onPress}
    >
      <View style={theme.isV3 ? styles.rowV3 : styles.row}>
        {left
          ? left({
              color: descriptionColor,
              style: getLeftStyles(alignToTop, description, theme.isV3),
            })
          : null}
        <View
          style={[theme.isV3 ? styles.itemV3 : styles.item, styles.content]}
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

const getLeftStyles = (
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

const getRightStyles = (
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

ListItem.displayName = 'List.Item';

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  containerV3: {
    paddingVertical: 8,
    paddingRight: 24,
  },
  row: {
    flexDirection: 'row',
  },
  rowV3: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  marginVerticalNone: { marginVertical: 0 },
  iconMarginLeft: { marginLeft: 0, marginRight: 16 },
  iconMarginRight: { marginRight: 0 },
  item: {
    marginVertical: 6,
    paddingLeft: 8,
  },
  itemV3: {
    paddingLeft: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default withInternalTheme(ListItem);
