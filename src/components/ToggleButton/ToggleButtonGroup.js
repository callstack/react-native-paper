/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import createReactContext, { type Context } from 'create-react-context';
import ToggleButton from './ToggleButton';

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

export const ToggleButtonGroupContext: Context<?ToggleButtonContextType> = createReactContext(
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
 *           <ToggleButton icon="format-align-left" value="left" />
 *           <ToggleButton icon="format-align-right" value="right" />
 *       </ToggleButton.Group>
 *     )
 *   }
 * }
 *```
 */
class ToggleButtonGroup extends React.Component<Props> {
  static displayName = 'ToggleButton.Group';

  render() {
    const { value, onValueChange, children } = this.props;
    const count = React.Children.count(children);

    return (
      <ToggleButtonGroupContext.Provider
        value={{
          value,
          onValueChange,
        }}
      >
        {React.Children.map(children, (child, i) => {
          if (child && child.type === ToggleButton) {
            return React.cloneElement(child, {
              style: [
                styles.button,
                i === 0
                  ? styles.first
                  : i === count - 1
                    ? styles.last
                    : styles.middle,
                child.props.style,
              ],
            });
          }

          return child;
        })}
      </ToggleButtonGroupContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderWidth: StyleSheet.hairlineWidth,
  },

  first: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  middle: {
    borderRadius: 0,
    borderLeftWidth: 0,
  },

  last: {
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
});

export default ToggleButtonGroup;
