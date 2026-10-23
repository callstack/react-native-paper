import { StyleSheet, View } from 'react-native';
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

import ConnectedButton from './ConnectedButton';
import {
  connectedButtonSizeTokens,
  type ConnectedButtonGroupSize,
} from './tokens';
import type { ConnectedButtonConfig } from './types';
import { getConnectedButtonPosition } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';

type ConditionalValue<T extends string = string> =
  | {
      /**
       * Value of the currently selected button, or an array of the selected
       * values when `multiSelect` is enabled.
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
       * Value of the currently selected button, or an array of the selected
       * values when `multiSelect` is enabled.
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
   * - `showSelectedCheck`: show an optional check icon to indicate the selected state
   * - `background`: type of background drawable to display the feedback (Android)
   * - `hitSlop`: additional distance outside of the button in which a press can be detected
   * - `onPress`: callback that is called when the button is pressed
   * - `labelMaxFontSizeMultiplier`: the largest possible scale a label font can reach
   * - `style`: pass additional styles for the button
   * - `labelStyle`: style for the button label
   * - `testID`: testID to be used on tests
   */
  buttons: ConnectedButtonConfig<T>[];
  /**
   * Size of the buttons, following the Material Design 3 button-group scale:
   * `'extra-small'`, `'small'`, `'medium'`, `'large'` or `'extra-large'`.
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
      role={multiSelect ? 'group' : 'radiogroup'}
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
            key={`${item.value}-${index}`}
            position={position}
            size={size}
            checked={checked}
            multiSelect={Boolean(multiSelect)}
            icon={item.icon}
            label={item.label}
            disabled={item.disabled}
            showSelectedCheck={item.showSelectedCheck}
            checkedColor={item.checkedColor}
            uncheckedColor={item.uncheckedColor}
            background={item.background}
            hitSlop={item.hitSlop}
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
