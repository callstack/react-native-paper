import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import type { Theme } from '../../types';
import { withTheme } from '../../core/theming';
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
    };

export type Props = {
  /**
   * Function to execute on selection change
   */
  onValueChange: (item: string | string[]) => void;
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
   * - `density`: density is applied to the height, to allow usage in denser UIs
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
    density?: 0 | -1 | -2 | -3;
    style?: StyleProp<ViewStyle>;
    testID?: string;
  }[];
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
} & ConditionalValue;

type SegmentedButtonContextType = {
  value: string | string[];
  onValueChange: (item: string | string[]) => void;
  multiSelect?: boolean;
};

export const SegmentedButtonGroupContext =
  React.createContext<SegmentedButtonContextType>({
    value: '',
    onValueChange: () => {},
  });

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
 * import { SegmentedButton } from 'react-native-paper';
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
  style,
  theme,
}: Props) => {
  if (buttons.length < 2 || buttons.length > 5) {
    console.warn(
      'Segmented buttons are best used for selecting between 2 and 5 choices. If you have more than five choices, consider using another component, such as chips.'
    );
  }

  return (
    <SegmentedButtonGroupContext.Provider
      value={{
        value,
        onValueChange,
        multiSelect,
      }}
    >
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
              key={i}
              segment={segment}
              style={[item.style, disabledChildStyle]}
              {...item}
            />
          );
        })}
      </View>
    </SegmentedButtonGroupContext.Provider>
  );
};

SegmentedButtons.displayName = 'SegmentedButtons';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

export default withTheme(SegmentedButtons);

// @component-docs ignore-next-line
export { SegmentedButtons as SegmentedButtons };
