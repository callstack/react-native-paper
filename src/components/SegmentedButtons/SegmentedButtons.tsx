import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../core/theming';
import type { IconSource } from '../Icon';
import SegmentedButtonItem from './SegmentedButtonItem';
import { getDisabledSegmentedButtonStyle } from './utils';

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
 * import { SafeAreaView, StyleSheet } from 'react-native';
 * import { SegmentedButtons } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('');
 *
 *   return (
 *     <SafeAreaView style={styles.container}>
 *       <SegmentedButtons
 *         value={value}
 *         onValueChange={setValue}
 *         buttons={[
 *           {
 *             value: 'walk',
 *             label: 'Walking',
 *           },
 *           {
 *             value: 'train',
 *             label: 'Transit',
 *           },
 *           { value: 'drive', label: 'Driving' },
 *         ]}
 *       />
 *     </SafeAreaView>
 *   );
 * };
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     flex: 1,
 *     alignItems: 'center',
 *   },
 * });
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

        const checked =
          multiSelect && Array.isArray(value)
            ? value.includes(item.value)
            : value === item.value;

        const onPress = (e: GestureResponderEvent) => {
          item.onPress?.(e);

          const nextValue =
            multiSelect && Array.isArray(value)
              ? checked
                ? value.filter((val) => item.value !== val)
                : [...value, item.value]
              : item.value;

          // @ts-expect-error: TS doesn't preserve types after destructuring, so the type isn't inferred correctly
          onValueChange(nextValue);
        };

        return (
          <SegmentedButtonItem
            {...item}
            key={i}
            checked={checked}
            segment={segment}
            density={density}
            onPress={onPress}
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
