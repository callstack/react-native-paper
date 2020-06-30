import color from 'color';
import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import TouchableRipple from '../TouchableRipple';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import type { $RemoveChildren, EllipsizeProp } from '../../types';

type Description =
  | React.ReactNode
  | ((props: {
      ellipsizeMode: EllipsizeProp | undefined;
      color: string;
      fontSize: number;
    }) => React.ReactNode);

type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Title text for the list item.
   */
  title: React.ReactNode;
  /**
   * Description text for the list item or callback which returns a React element to display the description.
   */
  description?: Description | null;
  /**
   * Callback which returns a React element to display on the left side.
   */
  left?: (props: {
    color: string;
    style: {
      marginLeft: number;
      marginRight: number;
      marginVertical?: number;
    };
  }) => React.ReactNode;
  /**
   * Callback which returns a React element to display on the right side.
   */
  right?: (props: {
    color: string;
    style?: {
      marginRight: number;
      marginVertical?: number;
    };
  }) => React.ReactNode;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
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
   * Ellipsize Mode for the Title
   */
  titleEllipsizeMode?: EllipsizeProp;
  /**
   * Ellipsize Mode for the Description
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
 */
class ListItem extends React.Component<Props> {
  static displayName = 'List.Item';

  static defaultProps: Partial<Props> = {
    titleNumberOfLines: 1,
    descriptionNumberOfLines: 2,
  };

  renderDescription(
    descriptionColor: string,
    description?: Description | null
  ) {
    const {
      descriptionEllipsizeMode,
      descriptionStyle,
      descriptionNumberOfLines,
    } = this.props;

    return typeof description === 'function' ? (
      description({
        ellipsizeMode: descriptionEllipsizeMode,
        color: descriptionColor,
        fontSize: styles.description.fontSize,
      })
    ) : (
      <Text
        numberOfLines={descriptionNumberOfLines}
        ellipsizeMode={descriptionEllipsizeMode}
        style={[
          styles.description,
          { color: descriptionColor },
          descriptionStyle,
        ]}
      >
        {description}
      </Text>
    );
  }

  render() {
    const {
      left,
      right,
      title,
      description,
      onPress,
      theme,
      style,
      titleStyle,
      titleNumberOfLines,
      titleEllipsizeMode,
      ...rest
    } = this.props;
    const titleColor = color(theme.colors.text).alpha(0.87).rgb().string();
    const descriptionColor = color(theme.colors.text)
      .alpha(0.54)
      .rgb()
      .string();

    return (
      <TouchableRipple
        {...rest}
        style={[styles.container, style]}
        onPress={onPress}
      >
        <View style={styles.row}>
          {left
            ? left({
                color: descriptionColor,
                style: description
                  ? styles.iconMarginLeft
                  : {
                      ...styles.iconMarginLeft,
                      ...styles.marginVerticalNone,
                    },
              })
            : null}
          <View style={[styles.item, styles.content]}>
            <Text
              ellipsizeMode={titleEllipsizeMode}
              numberOfLines={titleNumberOfLines}
              style={[styles.title, { color: titleColor }, titleStyle]}
            >
              {title}
            </Text>
            {description
              ? this.renderDescription(descriptionColor, description)
              : null}
          </View>
          {right
            ? right({
                color: descriptionColor,
                style: description
                  ? styles.iconMarginRight
                  : {
                      ...styles.iconMarginRight,
                      ...styles.marginVerticalNone,
                    },
              })
            : null}
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
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
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default withTheme(ListItem);
