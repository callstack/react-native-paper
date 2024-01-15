import * as React from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  I18nManager,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TextLayoutEventData,
  View,
  ViewProps,
  ViewStyle,
  PressableAndroidRippleConfig,
} from 'react-native';

import { ListAccordionGroupContext } from './ListAccordionGroup';
import type { Style } from './utils';
import { getAccordionColors, getLeftStyles } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = {
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
  left?: (props: { color: string; style: Style }) => React.ReactNode;
  /**
   * Callback which returns a React element to display on the right side.
   */
  right?: (props: { isExpanded: boolean }) => React.ReactNode;
  /**
   * Whether the accordion is expanded
   * If this prop is provided, the accordion will behave as a "controlled component".
   * You'll need to update this prop when you want to toggle the component or on `onPress`.
   */
  expanded?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * The number of milliseconds a user must touch the element before executing `onLongPress`.
   */
  delayLongPress?: number;
  /**
   * Content of the section.
   */
  children: React.ReactNode;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
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
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
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
   * Specifies the largest possible scale a title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
  /**
   * Specifies the largest possible scale a description font can reach.
   */
  descriptionMaxFontSizeMultiplier?: number;
  /**
   * Id is used for distinguishing specific accordion when using List.AccordionGroup. Property is required when using List.AccordionGroup and has no impact on behavior when using standalone List.Accordion.
   */
  id?: string | number;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  /**
   * Accessibility label for the TouchableRipple. This is read by the screen reader when the user taps the touchable.
   */
  accessibilityLabel?: string;
  /**
   * `pointerEvents` passed to the `View` container
   */
  pointerEvents?: ViewProps['pointerEvents'];
};

/**
 * A component used to display an expandable list item.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [expanded, setExpanded] = React.useState(true);
 *
 *   const handlePress = () => setExpanded(!expanded);
 *
 *   return (
 *     <List.Section title="Accordions">
 *       <List.Accordion
 *         title="Uncontrolled Accordion"
 *         left={props => <List.Icon {...props} icon="folder" />}>
 *         <List.Item title="First item" />
 *         <List.Item title="Second item" />
 *       </List.Accordion>
 *
 *       <List.Accordion
 *         title="Controlled Accordion"
 *         left={props => <List.Icon {...props} icon="folder" />}
 *         expanded={expanded}
 *         onPress={handlePress}>
 *         <List.Item title="First item" />
 *         <List.Item title="Second item" />
 *       </List.Accordion>
 *     </List.Section>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const ListAccordion = ({
  left,
  right,
  title,
  description,
  children,
  theme: themeOverrides,
  titleStyle,
  descriptionStyle,
  titleNumberOfLines = 1,
  descriptionNumberOfLines = 2,
  rippleColor: customRippleColor,
  style,
  id,
  testID,
  background,
  onPress,
  onLongPress,
  delayLongPress,
  expanded: expandedProp,
  accessibilityLabel,
  pointerEvents = 'none',
  titleMaxFontSizeMultiplier,
  descriptionMaxFontSizeMultiplier,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const [expanded, setExpanded] = React.useState<boolean>(
    expandedProp || false
  );
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

  const handlePressAction = (e: GestureResponderEvent) => {
    onPress?.(e);

    if (expandedProp === undefined) {
      // Only update state of the `expanded` prop was not passed
      // If it was passed, the component will act as a controlled component
      setExpanded((expanded) => !expanded);
    }
  };

  const expandedInternal = expandedProp !== undefined ? expandedProp : expanded;

  const groupContext = React.useContext(ListAccordionGroupContext);
  if (groupContext !== null && (id === undefined || id === null || id === '')) {
    throw new Error(
      'List.Accordion is used inside a List.AccordionGroup without specifying an id prop.'
    );
  }
  const isExpanded = groupContext
    ? groupContext.expandedId === id
    : expandedInternal;

  const { titleColor, descriptionColor, titleTextColor, rippleColor } =
    getAccordionColors({
      theme,
      isExpanded,
      customRippleColor,
    });

  const handlePress =
    groupContext && id !== undefined
      ? () => groupContext.onAccordionPress(id)
      : handlePressAction;
  return (
    <View>
      <View style={{ backgroundColor: theme?.colors?.background }}>
        <TouchableRipple
          style={[theme.isV3 ? styles.containerV3 : styles.container, style]}
          onPress={handlePress}
          onLongPress={onLongPress}
          delayLongPress={delayLongPress}
          rippleColor={rippleColor}
          accessibilityRole="button"
          accessibilityState={{ expanded: isExpanded }}
          accessibilityLabel={accessibilityLabel}
          testID={testID}
          theme={theme}
          background={background}
          borderless
        >
          <View
            style={theme.isV3 ? styles.rowV3 : styles.row}
            pointerEvents={pointerEvents}
          >
            {left
              ? left({
                  color: isExpanded ? theme.colors?.primary : descriptionColor,
                  style: getLeftStyles(alignToTop, description, theme.isV3),
                })
              : null}
            <View
              style={[theme.isV3 ? styles.itemV3 : styles.item, styles.content]}
            >
              <Text
                selectable={false}
                numberOfLines={titleNumberOfLines}
                style={[
                  styles.title,
                  {
                    color: titleTextColor,
                  },
                  titleStyle,
                ]}
                maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
              >
                {title}
              </Text>
              {description ? (
                <Text
                  selectable={false}
                  numberOfLines={descriptionNumberOfLines}
                  style={[
                    styles.description,
                    {
                      color: descriptionColor,
                    },
                    descriptionStyle,
                  ]}
                  onTextLayout={onDescriptionTextLayout}
                  maxFontSizeMultiplier={descriptionMaxFontSizeMultiplier}
                >
                  {description}
                </Text>
              ) : null}
            </View>
            <View
              style={[styles.item, description ? styles.multiline : undefined]}
            >
              {right ? (
                right({
                  isExpanded: isExpanded,
                })
              ) : (
                <MaterialCommunityIcon
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  color={theme.isV3 ? descriptionColor : titleColor}
                  size={24}
                  direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
                />
              )}
            </View>
          </View>
        </TouchableRipple>
      </View>

      {isExpanded
        ? React.Children.map(children, (child) => {
            if (
              left &&
              React.isValidElement(child) &&
              !child.props.left &&
              !child.props.right
            ) {
              return React.cloneElement(child as React.ReactElement<any>, {
                style: [
                  theme.isV3 ? styles.childV3 : styles.child,
                  child.props.style,
                ],
                theme,
              });
            }

            return child;
          })
        : null}
    </View>
  );
};

ListAccordion.displayName = 'List.Accordion';

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
    alignItems: 'center',
  },
  rowV3: {
    flexDirection: 'row',
    marginVertical: 6,
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
    marginVertical: 6,
    paddingLeft: 8,
  },
  itemV3: {
    paddingLeft: 16,
  },
  child: {
    paddingLeft: 64,
  },
  childV3: {
    paddingLeft: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default ListAccordion;
