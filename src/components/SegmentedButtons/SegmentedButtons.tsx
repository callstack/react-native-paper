import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../core/theming';
import SegmentedButtonItem from './SegmentedButtonItem';
import { getDisabledSegmentedButtonStyle } from './utils';
import type { IconSource } from '../Icon';

type ConditionalValue =
  | {
      /**
       * Array of the currently selected segmented button values.
       */
      value: string[];
      /**
       * Support multiple selected options.
       */
      multiSelect: true;
      /**
       * Function to execute on selection change
       */
      onValueChange: (value: string[]) => void;
    }
  | {
      /**
       * Value of the currently selected segmented button.
       */
      value: string;
      /**
       * Support multiple selected options.
       */
      multiSelect?: false;
      /**
       * Function to execute on selection change
       */
      onValueChange: (value: string) => void;
    };

export type Props = {
  /**
   * Buttons to display as options in toggle button.
   * Button should contain the following properties:
   * - `value`: value of button (required)
   * - `icon`: icon to display for the item
   * - `disabled`: whether the button is disabled
   * - `accessibilityLabel`: acccessibility label for the button. This is read by the screen reader when the user taps the button.
   * - `onPress`: callback that is called when button is pressed
   * - `label`: label text of the button
   * - `showSelectedCheck`: show optional check icon to indicate selected state
   * - `style`: pass additional styles for the button
   * - `testID`: testID to be used on tests
   */
  buttons: {
    value: string;
    icon?: IconSource;
    disabled?: boolean;
    accessibilityLabel?: string;
    onPress?: (event: GestureResponderEvent) => void;
    label?: string;
    showSelectedCheck?: boolean;
    style?: StyleProp<ViewStyle>;
    testID?: string;
  }[];
  /**
   * Density is applied to the height, to allow usage in denser UIs
   */
  density?: 'regular' | 'small' | 'medium' | 'high';
  style?: StyleProp<ViewStyle>;
} & ConditionalValue;

/**
 * @supported Available in v5.x
 * Segmented buttons can be used to select options, switch views or sort elements.</br>
 * 
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/segmented-button.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { SegmentedButtons } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('');
 *
 *   return (
 *     <SegmentedButtons
        value={value}
        onValueChange={(value) => {
          typeof value === 'string' && setValue(value);
        }}
        buttons={[
          {
            value: 'walk',
            label: 'Walking',
          },
          {
            value: 'train',
            label: 'Transit',
          },
        ]}
        style={styles.group}
      />
 *   );
 * };
 *
 * export default MyComponent;
 *```
 */
const SegmentedButtons = ({
  value,
  onValueChange,
  buttons,
  multiSelect,
  density,
  style,
}: Props) => {
  const theme = useTheme();
  return (
    <View style={[styles.row, style]}>
      {buttons.map((item, i) => {
        const disabledChildStyle = getDisabledSegmentedButtonStyle({
          theme,
          buttons,
          index: i,
        });
        const segment =
          i === 0 ? 'first' : i === buttons.length - 1 ? 'last' : undefined;

        return (
          <SegmentedButtonItem
            // @ts-expect-error We can't statically determine the type of the function
            onValueChange={onValueChange}
            key={i}
            currentValue={value}
            multiSelect={multiSelect}
            segment={segment}
            density={density}
            {...item}
            style={[item.style, disabledChildStyle]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

export default SegmentedButtons;

// @component-docs ignore-next-line
export { SegmentedButtons as SegmentedButtons };
