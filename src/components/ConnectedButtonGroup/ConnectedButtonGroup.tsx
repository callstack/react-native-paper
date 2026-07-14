import { StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import ConnectedButton from './ConnectedButton';
import {
  connectedButtonSizeTokens,
  type ConnectedButtonGroupSize,
} from './tokens';
import { getConnectedButtonPosition } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import type { IconSource } from '../Icon';

type ConditionalValue<T extends string = string> =
  | {
      /**
       * Array of the currently selected button values.
       */
      value: T[];
      /**
       * Allow more than one button to be selected at a time.
       */
      multiSelect: true;
      /**
       * Function to execute on selection change.
       */
      onValueChange: (value: T[]) => void;
    }
  | {
      /**
       * Value of the currently selected button.
       */
      value: T;
      /**
       * Allow more than one button to be selected at a time.
       */
      multiSelect?: false;
      /**
       * Function to execute on selection change.
       */
      onValueChange: (value: T) => void;
    };

/**
 * Configuration for a single button rendered inside the group.
 */
export type ConnectedButtonConfig<T extends string = string> = {
  /**
   * Value of the button (required).
   */
  value: T;
  /**
   * Icon to display for the button.
   */
  icon?: IconSource;
  /**
   * Label text of the button.
   */
  label?: string;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Accessibility label for the button. Read by the screen reader when the
   * user taps the button.
   */
  'aria-label'?: string;
  /**
   * Custom color for the selected label and icon.
   */
  checkedColor?: string;
  /**
   * Custom color for the unselected label and icon.
   */
  uncheckedColor?: string;
  /**
   * Custom ripple color for the button.
   */
  rippleColor?: string;
  /**
   * Show an optional check icon to indicate the selected state.
   */
  showSelectedCheck?: boolean;
  /**
   * Callback that is called when the button is pressed, in addition to the
   * group's `onValueChange`.
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  /**
   * Pass additional styles for the button container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the button label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

export type Props<T extends string = string> = {
  /**
   * Buttons to display as options in the group. Each button should contain the
   * following properties:
   * - `value`: value of the button (required)
   * - `icon`: icon to display for the button
   * - `label`: label text of the button
   * - `disabled`: whether the button is disabled
   * - `aria-label`: accessibility label for the button
   * - `checkedColor`: custom color for the selected label and icon
   * - `uncheckedColor`: custom color for the unselected label and icon
   * - `rippleColor`: custom ripple color for the button
   * - `showSelectedCheck`: show an optional check icon to indicate the selected state
   * - `onPress`: callback that is called when the button is pressed
   * - `style`: pass additional styles for the button
   * - `labelStyle`: style for the button label
   * - `testID`: testID to be used on tests
   */
  buttons: ConnectedButtonConfig<T>[];
  /**
   * Size of the buttons, following the Material Design 3 button-group scale.
   */
  size?: ConnectedButtonGroupSize;
  style?: StyleProp<ViewStyle>;
  /**
   * testID to be used on tests.
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
} & ConditionalValue<T>;

/**
 * Connected button groups let people select from a set of related options,
 * switch views or sort elements. They are the Material Design 3 successor to
 * `SegmentedButtons`: selected buttons morph to a fully-rounded shape and the
 * group supports single- and multi-select.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { SafeAreaView, StyleSheet } from 'react-native';
 * import { ConnectedButtonGroup } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('walk');
 *
 *   return (
 *     <SafeAreaView style={styles.container}>
 *       <ConnectedButtonGroup
 *         value={value}
 *         onValueChange={setValue}
 *         buttons={[
 *           { value: 'walk', label: 'Walking' },
 *           { value: 'train', label: 'Transit' },
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
 * ```
 */
const ConnectedButtonGroup = <T extends string = string>({
  value,
  onValueChange,
  buttons,
  multiSelect,
  size = 'small',
  style,
  testID,
  theme: themeOverrides,
}: Props<T>) => {
  const theme = useInternalTheme(themeOverrides);
  const { betweenSpace } = connectedButtonSizeTokens[size];

  return (
    <View
      style={[styles.row, { columnGap: betweenSpace }, style]}
      testID={testID}
    >
      {buttons.map((item, index) => {
        const position = getConnectedButtonPosition(index, buttons.length);
        const checked =
          multiSelect && Array.isArray(value)
            ? value.includes(item.value)
            : value === item.value;

        const handlePress = (event: GestureResponderEvent) => {
          item.onPress?.(event);

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
          <ConnectedButton
            key={item.value}
            position={position}
            size={size}
            checked={checked}
            icon={item.icon}
            label={item.label}
            disabled={item.disabled}
            showSelectedCheck={item.showSelectedCheck}
            checkedColor={item.checkedColor}
            uncheckedColor={item.uncheckedColor}
            rippleColor={item.rippleColor}
            aria-label={item['aria-label']}
            onPress={handlePress}
            labelMaxFontSizeMultiplier={item.labelMaxFontSizeMultiplier}
            style={item.style}
            labelStyle={item.labelStyle}
            testID={item.testID}
            theme={theme}
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

export default ConnectedButtonGroup;
