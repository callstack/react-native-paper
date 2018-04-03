/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import TouchableRipple from './TouchableRipple';
import Paragraph from './Typography/Paragraph';
import RadioButton from './RadioButton';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

type Props = {
  /**
   * Value of the radio button
   */
  value: string,
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
   * Label that will displayed inside component
   */
  label: string,
  /**
   * Style that will be applied to label
   */
  labelStyle?: Object,
  /**
   * Color that will be applied to RadioButton
   */
  color?: string,
  theme: Theme,
};

/**
 * RadioGroupItem allow to display Radio button with a label
 *
 * **Usage:**
 * ```js
 * export default class RadioGroupItemExample extends React.Component {
 *   state = {
 *     value: 'first',
 *   };
 *
 *   render() {
 *     const { value } = this.state;
 *
 *     return (
 *       <View>
 *         <RadioGroupItem
 *           onPress={() => this.setState({ value: 'first' })}
 *           label="Radio first"
 *           checked={ value === 'first' }
 *         />
 *         <RadioGroupItem
 *           onPress={() => this.setState({ value: 'second' })}
 *           label="Radio second"
 *           checked={ value === 'second' }
 *         />
 *       </View>
 *     );
 *   }
 * }
 * ```
 */

class RadioGroupItem extends React.Component<Props> {
  render() {
    const { label, onPress, disabled, labelStyle, ...rest } = this.props;

    return (
      <TouchableRipple onPress={disabled ? undefined : onPress}>
        <View style={styles.row}>
          <Paragraph style={labelStyle}>{label}</Paragraph>
          <View pointerEvents="none">
            <RadioButton disabled={disabled} {...rest} />
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

export default withTheme(RadioGroupItem);
