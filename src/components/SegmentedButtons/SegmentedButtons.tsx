import { StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import SegmentedButtonItem from './SegmentedButtonItem';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import type { IconSource } from '../Icon';

type ConditionalValue<T extends string = string> =
  | {
      /**
       * Array of the currently selected segmented button values.
       */
      value: T[];
      /**
       * Support multiple selected options.
       */
      multiSelect: true;
      /**
       * Function to execute on selection change
       */
      onValueChange: (value: T[]) => void;
    }
  | {
      /**
       * Value of the currently selected segmented button.
       */
      value: T;
      /**
       * Support multiple selected options.
       */
      multiSelect?: false;
      /**
       * Function to execute on selection change
       */
      onValueChange: (value: T) => void;
    };

export type Props<T extends string = string> = {
  /**
   * Buttons to display as options in toggle button.
   * Button should contain the following properties:
   * - `value`: unique value of button (required)
   * - `icon`: icon to display for the item
   * - `disabled`: whether the button is disabled
   * - `aria-label`: accessibility label for the button. This is read by the screen reader when the user taps the button.
   * - `checkedColor`: custom color for checked Text and Icon
   * - `uncheckedColor`: custom color for unchecked Text and Icon
   * - `onPress`: callback that is called when button is pressed
   * - `label`: label text of the button
   * - `showSelectedCheck`: show optional check icon to indicate selected state
   * - `style`: pass additional styles for the button
   * - `testID`: testID to be used on tests
   */
  buttons: {
    value: T;
    icon?: IconSource;
    disabled?: boolean;
    'aria-label'?: string;
    checkedColor?: string;
    uncheckedColor?: string;
    onPress?: (event: GestureResponderEvent) => void;
    label?: string;
    showSelectedCheck?: boolean;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    testID?: string;
  }[];
  /**
   * Density is applied to the height, to allow usage in denser UIs
   */
  density?: 'regular' | 'small' | 'medium' | 'high';
  style?: StyleProp<ViewStyle>;
  theme?: ThemeProp;
} & ConditionalValue<T>;

/**
 * Segmented buttons can be used to select options, switch views or sort elements.</br>
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
const SegmentedButtons = <T extends string = string>({
  value,
  onValueChange,
  buttons,
  multiSelect,
  density,
  style,
  theme: themeOverrides,
}: Props<T>) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();

  const singleSelectedIndex = multiSelect
    ? -1
    : buttons.findIndex((item) => value === item.value);

  return (
    <View
      role={multiSelect ? 'group' : 'radiogroup'}
      style={[styles.row, { direction }, style]}
    >
      {buttons.map(
        ({ value: itemValue, onPress: onItemPress, ...itemProps }, index) => {
          const segment =
            index === 0
              ? 'first'
              : index === buttons.length - 1
                ? 'last'
                : 'middle';

          const checked = multiSelect
            ? value.includes(itemValue)
            : index === singleSelectedIndex;

          const handlePress = (event: GestureResponderEvent) => {
            onItemPress?.(event);

            if (multiSelect) {
              onValueChange(
                checked
                  ? value.filter((selectedValue) => itemValue !== selectedValue)
                  : [...value, itemValue]
              );
            } else {
              onValueChange(itemValue);
            }
          };

          return (
            <SegmentedButtonItem
              {...itemProps}
              key={itemValue}
              checked={checked}
              previousDisabled={buttons[index - 1]?.disabled}
              role={multiSelect ? 'checkbox' : 'radio'}
              segment={segment}
              density={density}
              onPress={handlePress}
              theme={theme}
            />
          );
        }
      )}
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
