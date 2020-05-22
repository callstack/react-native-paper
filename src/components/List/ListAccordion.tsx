import color from 'color';
import * as React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  TextStyle,
  I18nManager,
} from 'react-native';
import TouchableRipple from '../TouchableRipple';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import { Theme } from '../../types';

import {
  ListAccordionGroupContext,
  ListAccordionGroupContextType,
} from './ListAccordionGroup';

type Props = {
  /**
   * Title text for the list accordion.
   */
  title: React.ReactNode;
  /**
   * Description text for the list accordion.
   */
  description?: React.ReactNode;
  /**
   * Callback which returns a React element to display on the left side.
   */
  left?: (props: { color: string }) => React.ReactNode;
  /**
   * Whether the accordion is expanded
   * If this prop is provided, the accordion will behave as a "controlled component".
   * You'll need to update this prop when you want to toggle the component or on `onPress`.
   */
  expanded?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Content of the section.
   */
  children: React.ReactNode;
  /**
   * @optional
   */
  theme: Theme;
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
   * Id is used for distinguishing specific accordion when using List.AccordionGroup. Property is required when using List.AccordionGroup and has no impact on behavior when using standalone List.Accordion.
   */
  id?: string | number;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
};

type State = {
  expanded: boolean;
};

/**
 * A component used to display an expandable list item.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/list-accordion-1.png" />
 *   <img class="medium" src="screenshots/list-accordion-2.png" />
 *   <img class="medium" src="screenshots/list-accordion-3.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List, Checkbox } from 'react-native-paper';
 *
 * class MyComponent extends React.Component {
 *   state = {
 *     expanded: true
 *   }
 *
 *   _handlePress = () =>
 *     this.setState({
 *       expanded: !this.state.expanded
 *     });
 *
 *   render() {
 *     return (
 *       <List.Section title="Accordions">
 *         <List.Accordion
 *           title="Uncontrolled Accordion"
 *           left={props => <List.Icon {...props} icon="folder" />}
 *         >
 *           <List.Item title="First item" />
 *           <List.Item title="Second item" />
 *         </List.Accordion>
 *
 *         <List.Accordion
 *           title="Controlled Accordion"
 *           left={props => <List.Icon {...props} icon="folder" />}
 *           expanded={this.state.expanded}
 *           onPress={this._handlePress}
 *         >
 *           <List.Item title="First item" />
 *           <List.Item title="Second item" />
 *         </List.Accordion>
 *       </List.Section>
 *     );
 *   }
 * }
 *
 * export default MyComponent;
 * ```
 */
class ListAccordion extends React.Component<Props, State> {
  static displayName = 'List.Accordion';

  static defaultProps: Partial<Props> = {
    titleNumberOfLines: 1,
    descriptionNumberOfLines: 2,
  };

  state = {
    expanded: this.props.expanded || false,
  };

  private handlePress = () => {
    this.props.onPress && this.props.onPress();

    if (this.props.expanded === undefined) {
      // Only update state of the `expanded` prop was not passed
      // If it was passed, the component will act as a controlled component
      this.setState(state => ({
        expanded: !state.expanded,
      }));
    }
  };

  render() {
    const {
      left,
      title,
      description,
      children,
      theme,
      titleStyle,
      descriptionStyle,
      titleNumberOfLines,
      descriptionNumberOfLines,
      style,
      id,
      testID,
    } = this.props;
    const titleColor = color(theme.colors.text)
      .alpha(0.87)
      .rgb()
      .string();
    const descriptionColor = color(theme.colors.text)
      .alpha(0.54)
      .rgb()
      .string();

    const expandedInternal =
      this.props.expanded !== undefined
        ? this.props.expanded
        : this.state.expanded;

    return (
      <ListAccordionGroupContext.Consumer>
        {(groupContext: ListAccordionGroupContextType) => {
          if (groupContext !== null && !id) {
            throw new Error(
              'List.Accordion is used inside a List.AccordionGroup without specifying an id prop.'
            );
          }
          const expanded = groupContext
            ? groupContext.expandedId === id
            : expandedInternal;
          const handlePress =
            groupContext && id !== undefined
              ? () => groupContext.onAccordionPress(id)
              : this.handlePress;
          return (
            <View>
              <TouchableRipple
                style={[styles.container, style]}
                onPress={handlePress}
                accessibilityTraits="button"
                accessibilityComponentType="button"
                accessibilityRole="button"
                testID={testID}
              >
                <View style={styles.row} pointerEvents="none">
                  {left
                    ? left({
                        color: expanded
                          ? theme.colors.primary
                          : descriptionColor,
                      })
                    : null}
                  <View style={[styles.item, styles.content]}>
                    <Text
                      numberOfLines={titleNumberOfLines}
                      style={[
                        styles.title,
                        {
                          color: expanded ? theme.colors.primary : titleColor,
                        },
                        titleStyle,
                      ]}
                    >
                      {title}
                    </Text>
                    {description && (
                      <Text
                        numberOfLines={descriptionNumberOfLines}
                        style={[
                          styles.description,
                          {
                            color: descriptionColor,
                          },
                          descriptionStyle,
                        ]}
                      >
                        {description}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.item,
                      description ? styles.multiline : undefined,
                    ]}
                  >
                    <MaterialCommunityIcon
                      name={expanded ? 'chevron-up' : 'chevron-down'}
                      color={titleColor}
                      size={24}
                      direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
                    />
                  </View>
                </View>
              </TouchableRipple>
              {expanded
                ? React.Children.map(children, child => {
                    if (
                      left &&
                      React.isValidElement(child) &&
                      !child.props.left &&
                      !child.props.right
                    ) {
                      return React.cloneElement(child, {
                        style: [styles.child, child.props.style],
                      });
                    }

                    return child;
                  })
                : null}
            </View>
          );
        }}
      </ListAccordionGroupContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multiline: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  item: {
    margin: 8,
  },
  child: {
    paddingLeft: 64,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default withTheme(ListAccordion);
