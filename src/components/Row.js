/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import TouchableRipple from './TouchableRipple';
import Paragraph from './Typography/Paragraph';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

type Props = {
  /**
   * Function to execute onPress
   */
  onPress?: Function,
  /**
   * Whether row is checked
   */
  checked: boolean,
  /**
   * Whether row is disabled
   */
  disabled?: boolean,
  /**
   * Text that will be displayed inside row
   */
  label: string,
  /**
   * Styles that will be applied to Label
   */
  labelStyle?: string,
  /**
   * color that will be applied to Checkbox or Radio button
   */
  color?: string,
  /**
   * Function that returns JSX for Checkbox or Radio Button
   */
  renderComponent: Function,
  theme: Theme,
};

/**
 * Row allow to display Checkbox or Radio button with a label
 *
 * **Usage:**
 * ```js
 * export default class RowExample extends React.Component {
 *   state = {
 *     index: 0,
 *   };
 *
 *   render() {
 *     const { index } = this.state;
 *
 *     return (
 *       <View>
 *         <Row
 *           onPress={() => this.setState({ index: 0 })}
 *           label="First radio"
 *           checked={index === 0}
 *           renderComponent={props => <RadioButton {...props} />}
 *         />
 *         <Row
 *           disabled
 *           onPress={() => this.setState({ index: 1 })}
 *           label="Second radio"
 *           checked={index === 1}
 *           renderComponent={props => <RadioButton {...props} />}
 *         />
 *       </View>
 *     );
 *   }
 * }
 * ```
 */

class Row extends React.Component<Props> {
  render() {
    const {
      label,
      onPress,
      labelStyle,
      disabled,
      checked,
      color,
      renderComponent,
    } = this.props;

    return (
      <TouchableRipple onPress={disabled ? undefined : onPress}>
        <View style={styles.row}>
          <Paragraph style={labelStyle}>{label}</Paragraph>
          <View pointerEvents="none">
            {renderComponent({ checked, disabled, color })}
          </View>
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
});

export default withTheme(Row);
