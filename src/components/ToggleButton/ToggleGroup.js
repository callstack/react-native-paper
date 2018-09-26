/* @flow */

import * as React from 'react';
import createReactContext, { type Context } from 'create-react-context';

type Props = {
  /**
   * Function to execute on selection change.
   */
  onValueChange: (value: string) => mixed,
  /**
   * Value of the currently selected toggle button.
   */
  value: string,
  /**
   * React elements containing toggle buttons.
   */
  children: React.Node,
};

type ToggleButtonContextType = {
  value: string,
  onValueChange: (item: string) => mixed,
};

export const ToggleGroupContext: Context<?ToggleButtonContextType> = createReactContext(
  null
);

/**
 * Toggle group allows to control a group of toggle buttons.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { ToggleButton } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     value: 'left',
 *   };
 *
 *   render() {
 *     return(
 *       <ToggleButton.Group
 *         onValueChange={value => this.setState({ value })}
 *         value={this.state.value}
 *       >
 *           <ToggleButton outlined icon="format-align-left" value="left" />
 *           <ToggleButton outlined icon="format-align-right" value="right" />
 *       </ToggleButton.Group>
 *     )
 *   }
 * }
 *```
 */
class ToggleGroup extends React.Component<Props> {
  static displayName = 'ToggleButton.Group';

  render() {
    const { value, onValueChange, children } = this.props;

    return (
      <ToggleGroupContext.Provider
        value={{
          value,
          onValueChange,
        }}
      >
        {children}
      </ToggleGroupContext.Provider>
    );
  }
}

export default ToggleGroup;
