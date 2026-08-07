import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  NativeSyntheticEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextLayoutEventData,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type {
  EntryAnimationsValues,
  ExitAnimationsValues,
} from 'react-native-reanimated';

import { ListAccordionGroupContext } from './ListAccordionGroup';
import { ListTokens } from './tokens';
import type { ListChildProps, Style } from './utils';
import { ListRowContext, getAccordionColors, getLeftStyles } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { ThemeProp } from '../../types';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
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
  left?: (props: { color: ColorValue; style: Style }) => React.ReactNode;
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
   * Whether to highlight the accordion as selected.
   */
  selected?: boolean;
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
   * Style that is passed to the root TouchableRipple container.
   */
  style?: StyleProp<ViewStyle>;
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
  'aria-label'?: string;
  /**
   * `pointerEvents` passed to the `View` container
   */
  pointerEvents?: ViewProps['pointerEvents'];
  /**
   * Amount of space between the touchable area and the edge of the component.
   * This can be used to enlarge the touchable area beyond the visible component.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
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
  style,
  containerStyle,
  contentStyle,
  id,
  testID,
  background,
  onPress,
  onLongPress,
  delayLongPress,
  expanded: expandedProp,
  selected,
  'aria-label': ariaLabel,
  pointerEvents = 'none',
  titleMaxFontSizeMultiplier,
  descriptionMaxFontSizeMultiplier,
  hitSlop,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const [expanded, setExpanded] = React.useState<boolean>(
    expandedProp || false
  );
  const [isDescriptionMultiline, setIsDescriptionMultiline] =
    React.useState(false);

  const onDescriptionTextLayout = (
    event: NativeSyntheticEvent<TextLayoutEventData>
  ) => {
    const { nativeEvent } = event;
    setIsDescriptionMultiline(nativeEvent.lines.length >= 2);
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

  const reduceMotion = useReduceMotion();
  const reanimatedReduceMotion = reduceMotion
    ? ReduceMotion.Always
    : ReduceMotion.Never;

  const timingConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration.medium2,
      easing: Easing.bezier(...theme.motion.easing.emphasized),
      reduceMotion: reanimatedReduceMotion,
    }),
    [
      theme.motion.duration.medium2,
      theme.motion.easing.emphasized,
      reanimatedReduceMotion,
    ]
  );

  const chevronProgress = useSharedValue(isExpanded ? 1 : 0);

  React.useEffect(() => {
    chevronProgress.value = withTiming(isExpanded ? 1 : 0, timingConfig);
  }, [isExpanded, chevronProgress, timingConfig]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronProgress.value * 180}deg` }],
  }));

  const expandAnimation = React.useCallback(
    (values: EntryAnimationsValues) => {
      'worklet';
      return {
        initialValues: { height: 0, opacity: 0 },
        animations: {
          height: withTiming(values.targetHeight, timingConfig),
          opacity: withTiming(1, timingConfig),
        },
      };
    },
    [timingConfig]
  );

  const collapseAnimation = React.useCallback(
    (values: ExitAnimationsValues) => {
      'worklet';
      return {
        initialValues: { height: values.currentHeight, opacity: 1 },
        animations: {
          height: withTiming(0, timingConfig),
          opacity: withTiming(0, timingConfig),
        },
      };
    },
    [timingConfig]
  );

  const {
    descriptionColor,
    titleTextColor,
    leadingIconColor,
    trailingIconColor,
  } = getAccordionColors({ theme, selected });

  const handlePress =
    groupContext && id !== undefined
      ? () => groupContext.onAccordionPress(id)
      : handlePressAction;

  const rowContext = React.useMemo(
    () => ({
      verticalPadding: isDescriptionMultiline
        ? ListTokens.threeLineVerticalPadding
        : ListTokens.verticalPadding,
    }),
    [isDescriptionMultiline]
  );

  return (
    <View>
      <View
        style={{
          backgroundColor: selected
            ? theme.colors[ListTokens.selectedContainerColor]
            : theme.colors[ListTokens.containerColor],
        }}
      >
        <ListRowContext.Provider value={rowContext}>
          <TouchableRipple
            style={[
              styles.container,
              description ? styles.containerTwoLine : styles.containerOneLine,
              isDescriptionMultiline && styles.containerThreeLine,
              style,
            ]}
            onPress={handlePress}
            onLongPress={onLongPress}
            delayLongPress={delayLongPress}
            role="button"
            aria-expanded={isExpanded}
            aria-selected={selected}
            aria-label={ariaLabel}
            testID={testID}
            theme={theme}
            background={background}
            borderless
            hitSlop={hitSlop}
          >
            <View
              style={[styles.row, containerStyle]}
              pointerEvents={pointerEvents}
            >
              {left
                ? left({
                    color: leadingIconColor,
                    style: getLeftStyles(isDescriptionMultiline, description),
                  })
                : null}
              <View style={[styles.contentItem, styles.content, contentStyle]}>
                <Text
                  variant="bodyLarge"
                  theme={theme}
                  selectable={false}
                  numberOfLines={titleNumberOfLines}
                  style={[
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
                    variant="bodyMedium"
                    theme={theme}
                    selectable={false}
                    numberOfLines={descriptionNumberOfLines}
                    style={[
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
              <View style={styles.trailingItem}>
                {right ? (
                  right({
                    isExpanded: isExpanded,
                  })
                ) : (
                  <Animated.View style={chevronStyle}>
                    <MaterialCommunityIcon
                      name="chevron-down"
                      color={trailingIconColor}
                      size={24}
                      direction={direction}
                    />
                  </Animated.View>
                )}
              </View>
            </View>
          </TouchableRipple>
        </ListRowContext.Provider>
      </View>

      {isExpanded ? (
        <Animated.View
          entering={expandAnimation}
          exiting={collapseAnimation}
          style={styles.expandedContent}
        >
          {React.Children.map(children, (child) => {
            if (
              left &&
              React.isValidElement<ListChildProps>(child) &&
              !child.props.left &&
              !child.props.right
            ) {
              return React.cloneElement(child, {
                style: [styles.child, child.props.style],
                theme,
              });
            }

            return child;
          })}
        </Animated.View>
      ) : null}
    </View>
  );
};

ListAccordion.displayName = 'List.Accordion';

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
    flexDirection: 'row',
  },
  contentItem: {
    paddingLeft: ListTokens.leadingSpace,
  },
  trailingItem: {
    alignSelf: 'center',
    paddingLeft: ListTokens.leadingSpace,
  },
  child: {
    paddingLeft: 40,
  },
  expandedContent: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default ListAccordion;
