import * as React from 'react';

type Props = {
  /**
   * Function to execute on selection change.
   */
  onAccordionPress?: (expandedId: string | number) => void;
  /**
   * Id of the currently expanded list accordion
   */
  expandedId?: string | number;
  /**
   * React elements containing list accordions
   */
  children: React.ReactNode;
};

export type ListAccordionGroupContextType = {
  expandedId: string | number | undefined;
  onAccordionPress: (expandedId: string | number) => void;
} | null;

export const ListAccordionGroupContext =
  React.createContext<ListAccordionGroupContextType>(null);

/**
 * List.AccordionGroup allows to control a group of List Accordions. `id` prop for List.Accordion is required in order for group to work.
 * List.AccordionGroup can be a controlled or uncontrolled component. The example shows the uncontrolled version.
 * At most one Accordion can be expanded at a given time.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/list-accordion-group.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View, Text } from 'react-native';
 * import { List } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <List.AccordionGroup>
 *     <List.Accordion title="Accordion 1" id="1">
 *       <List.Item title="Item 1" />
 *     </List.Accordion>
 *     <List.Accordion title="Accordion 2" id="2">
 *       <List.Item title="Item 2" />
 *     </List.Accordion>
 *     <View>
 *       <Text>
 *         List.Accordion can be wrapped because implementation uses React.Context.
 *       </Text>
 *       <List.Accordion title="Accordion 3" id="3">
 *         <List.Item title="Item 3" />
 *       </List.Accordion>
 *     </View>
 *   </List.AccordionGroup>
 * );
 *
 * export default MyComponent;
 *```
 */
const ListAccordionGroup = ({
  expandedId: expandedIdProp,
  onAccordionPress,
  children,
}: Props) => {
  const [expandedId, setExpandedId] = React.useState<
    string | number | undefined
  >(undefined);

  const onAccordionPressDefault = (newExpandedId: string | number) => {
    setExpandedId((currentExpandedId) =>
      currentExpandedId === newExpandedId ? undefined : newExpandedId
    );
  };

  return (
    <ListAccordionGroupContext.Provider
      value={{
        expandedId: expandedIdProp || expandedId, // component can be controlled or uncontrolled
        onAccordionPress: onAccordionPress || onAccordionPressDefault,
      }}
    >
      {children}
    </ListAccordionGroupContext.Provider>
  );
};

ListAccordionGroup.displayName = 'List.AccordionGroup';

export default ListAccordionGroup;
