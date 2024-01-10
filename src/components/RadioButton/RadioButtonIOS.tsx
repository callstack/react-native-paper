import * as React from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';

import { RadioButtonContext, RadioButtonContextType } from './RadioButtonGroup';
import { handlePress, isChecked } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, ThemeProp } from '../../types';
import { getSelectionControlIOSColor } from '../Checkbox/utils';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Value of the radio button
   */
  value: string;
  /**
   * Status of radio button.
   */
  status?: 'checked' | 'unchecked';
  /**
   * Whether radio is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Custom color for radio.
   */
  color?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

/**
 * Radio buttons allow the selection a single option from a set.
 * This component follows platform guidelines for iOS, but can be used
 * on any platform.
 *
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/docs/components/TouchableRipple
 */
const RadioButtonIOS = ({
  disabled,
  onPress,
  theme: themeOverrides,
  status,
  value,
  testID,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  return (
    <RadioButtonContext.Consumer>
      {(context?: RadioButtonContextType) => {
        const checked =
          isChecked({
            contextValue: context?.value,
            status,
            value,
          }) === 'checked';

        const { checkedColor, rippleColor } = getSelectionControlIOSColor({
          theme,
          disabled,
          customColor: rest.color,
        });
        const opacity = checked ? 1 : 0;

        return (
          <TouchableRipple
            {...rest}
            borderless
            rippleColor={rippleColor}
            onPress={
              disabled
                ? undefined
                : (event) => {
                    handlePress({
                      onPress,
                      value,
                      onValueChange: context?.onValueChange,
                      event,
                    });
                  }
            }
            accessibilityRole="radio"
            accessibilityState={{ disabled, checked }}
            accessibilityLiveRegion="polite"
            style={styles.container}
            testID={testID}
            theme={theme}
          >
            <View style={{ opacity }}>
              <MaterialCommunityIcon
                allowFontScaling={false}
                name="check"
                size={24}
                color={checkedColor}
                direction="ltr"
              />
            </View>
          </TouchableRipple>
        );
      }}
    </RadioButtonContext.Consumer>
  );
};

RadioButtonIOS.displayName = 'RadioButton.IOS';

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 6,
  },
});

export default RadioButtonIOS;

// @component-docs ignore-next-line
export { RadioButtonIOS };
