/* @flow */

import * as React from 'react';
import { View } from 'react-native';
import { Broadcast } from 'react-broadcast';

type Props = {
  /**
   * Array of RadioButton elements
   */
  children?: React.Node,
  /**
   * Function to execute on selection change
   */
  onValueChange: Function,
  /**
   * Value of currently selected Radio
   */
  value: string,
  /**
   * Style that will be set to View that wrapps Radio Buttons
   */
  style?: any,
};

/**
 * RadioGroup allows the selection of a single RadioButton
 * **Usage**
 * ```js
 *
 * const Radio = withRadioGroup(RadioButton);
 *
 * export default class MyComponent extends Component {
 *   state = {
 *     value: 'first',
 *   };
 *
 *   render() {
 *     return(
 *       <RadioGroup
 *         onValueChange={value => this.setState({ value })}
 *         value={this.state.value}
 *       >
 *         <View>
 *           <Radio value="first" />
 *         </View>
 *         <View>
 *           <Radio value="second" />
 *         </View>
 *       </RadioGroup>
 *     )
 *   }
 * }
 *```
 */

export const channel = 'react-native-paper$radio-group';

class RadioGroup extends React.Component<Props> {
  render() {
    const { value, onValueChange, children } = this.props;

    return (
      <Broadcast channel={channel} value={{ value, onValueChange }}>
        <View>{children}</View>
      </Broadcast>
    );
  }
}

export default RadioGroup;
