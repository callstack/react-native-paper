/* @flow */

import * as React from 'react';
import createReactContext, { type Context } from 'create-react-context';

type Props = {|
  /**
   * Function to execute on selection change.
   */
  onValueChange: (value: string) => mixed,
  /**
   * Value of the currently selected radio button.
   */
  value: string,
  /**
   * React elements containing radio buttons.
   */
  children: React.Node,
|};

type RadioButtonContextType = {
  value: string,
  onValueChange: (item: string) => mixed,
};

export const RadioButtonContext: Context<?RadioButtonContextType> = createReactContext(
  null
);

/**
 * Radio button group allows to control a group of radio buttons.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { RadioButton, Text } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     value: 'first',
 *   };
 *
 *   render() {
 *     return(
 *       <RadioButton.Group
 *         onValueChange={value => this.setState({ value })}
 *         value={this.state.value}
 *       >
 *         <View>
 *           <Text>First</Text>
 *           <RadioButton value="first" />
 *         </View>
 *         <View>
 *           <Text>Second</Text>
 *           <RadioButton value="second" />
 *         </View>
 *       </RadioButton.Group>
 *     )
 *   }
 * }
 *```
 */
class RadioButtonGroup extends React.Component<Props> {
  static displayName = 'RadioButton.Group';

  render() {
    const { value, onValueChange, children } = this.props;

    return (
      <RadioButtonContext.Provider value={{ value, onValueChange }}>
        {children}
      </RadioButtonContext.Provider>
    );
  }
}

export default RadioButtonGroup;
