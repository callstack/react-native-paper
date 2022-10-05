import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { withInternalTheme } from '../../core/theming';
import type { $RemoveChildren, InternalTheme } from '../../types';
import { getSelectionControlIOSColor } from '../Checkbox/utils';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { RadioButtonContext, RadioButtonContextType } from './RadioButtonGroup';
import { handlePress, isChecked } from './utils';

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
  onPress?: () => void;
  /**
   * Custom color for radio.
   */
  color?: string;
  /**
   * @optional
   */
  theme: InternalTheme;
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
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/radio-enabled.ios.png" />
 *     <figcaption>Enabled</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-disabled.ios.png" />
 *     <figcaption>Disabled</figcaption>
 *   </figure>
 * </div>
 */
const RadioButtonIOS = ({
  disabled,
  onPress,
  theme,
  status,
  value,
  testID,
  ...rest
}: Props) => {
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

        return (
          <TouchableRipple
            {...rest}
            borderless
            rippleColor={rippleColor}
            onPress={
              disabled
                ? undefined
                : () => {
                    handlePress({
                      onPress,
                      value,
                      onValueChange: context?.onValueChange,
                    });
                  }
            }
            accessibilityRole="radio"
            accessibilityState={{ disabled, checked }}
            accessibilityLiveRegion="polite"
            style={styles.container}
            testID={testID}
          >
            <View style={{ opacity: checked ? 1 : 0 }}>
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

export default withInternalTheme(RadioButtonIOS);

// @component-docs ignore-next-line
const RadioButtonIOSWithTheme = withInternalTheme(RadioButtonIOS);
// @component-docs ignore-next-line
export { RadioButtonIOSWithTheme as RadioButtonIOS };
