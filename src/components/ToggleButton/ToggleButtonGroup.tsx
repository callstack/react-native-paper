import * as React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

type Props = {
  /**
   * Function to execute on selection change.
   */
  onValueChange: (value: string) => void;
  /**
   * Value of the currently selected toggle button.
   */
  value: string;
  /**
   * React elements containing toggle buttons.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

type ToggleButtonContextType = {
  value: string;
  onValueChange: (item: string) => void;
};

export const ToggleButtonGroupContext = React.createContext<
  ToggleButtonContextType
>(null as any);

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
    const { value, onValueChange, children, style } = this.props;

    return (
      <ToggleButtonGroupContext.Provider
        value={{
          value,
          onValueChange,
        }}
      >
        <View style={style}>{children}</View>
      </ToggleButtonGroupContext.Provider>
    );
  }
}

export default ToggleButtonGroup;
