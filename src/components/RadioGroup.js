/* @flow */

import * as React from 'react';
import { View } from 'react-native';

type Props = {
  /**
   * Array of RadioButton elements
   */
  children?: React.Node,
  /**
   * Function to execute on selection change
   */
  selectionChanged?: Function,
  /**
   * Index of selected element
   */
  selectedIndex: number,
  /**
   * Style that will be set to View that wrapps Radio Buttons
   */
  style?: any,
};

/**
 * RadioGroup allows the selection of a single RadioButton
 * **Usage**
 * ```js
 * export default class MyComponent extends Component {
 *   state = {
 *     selectedIndex: 0,
 *   };
 *
 *   render() {
 *     const { selectedIndex } = this.state;
 *
 *     return(
 *       <RadioGroup
 *         selectedIndex={this.state.selectedIndex}
 *         selectionChanged={index => {
 *           this.setState({ selectedIndex: index });
 *         }}
 *       >
 *         <RadioButton />
 *         <RadioButton />
 *         <RadioButton />
 *         <RadioButton />
 *         <RadioButton />
 *       </RadioGroup>
 *     )
 *   }
 * }
 *```
 */

class RadioGroup extends React.Component<Props> {
  render() {
    const { children, selectionChanged, selectedIndex, style } = this.props;

    return (
      <View style={style}>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            checked: selectedIndex === index,
            onPress: () => {
              selectionChanged(index);
            },
          })
        )}
      </View>
    );
  }
}

export default RadioGroup;
