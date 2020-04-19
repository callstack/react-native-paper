import * as React from 'react';

type Props = {
  /**
   * React elements containing checkboxes.
   */
  children: React.ReactNode;
};

/**
 * Checkbox group allows to control a group of checkboxes.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Checkbox, Text } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *
 *   render() {
 *     return(
 *       <Checkbox.Group>
 *         <View>
 *           <Text>First</Text>
 *           <Checkbox status="checked" />
 *         </View>
 *         <View>
 *           <Text>Second</Text>
 *           <Checkbox status="unchecked" />
 *         </View>
 *       </Checkbox.Group>
 *     )
 *   }
 * }
 *```
 */

class CheckboxGroup extends React.Component<Props> {
  render() {
    const { children } = this.props;

    return <> {children} </>;
  }
}

export default CheckboxGroup;
