import * as React from 'react';
import {
  grey400,
  grey800,
  grey50,
  white,
  black,
} from '../styles/themes/v2/colors';
import { MD3Colors } from '../styles/themes/v3/tokens';
import {
  NativeModules,
  Platform,
  StyleProp,
  Switch as NativeSwitch,
  ViewStyle,
} from 'react-native';
import setColor from 'color';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

const version = NativeModules.PlatformConstants
  ? NativeModules.PlatformConstants.reactNativeVersion
  : undefined;

type Props = React.ComponentPropsWithRef<typeof NativeSwitch> & {
  /**
   * Disable toggling the switch.
   */
  disabled?: boolean;
  /**
   * Value of the switch, true means 'on', false means 'off'.
   */
  value?: boolean;
  /**
   * Custom color for switch.
   */
  color?: string;
  /**
   * Callback called with the new value when it changes.
   */
  onValueChange?: Function;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

/**
 * Switch is a visual toggle between two mutually exclusive states — on and off.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/switch-enabled.android.png" />
 *     <figcaption>Android (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/switch-disabled.android.png" />
 *     <figcaption>Android (disabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/switch-enabled.ios.png" />
 *     <figcaption>iOS (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/switch-disabled.ios.png" />
 *     <figcaption>iOS (disabled)</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Switch } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [isSwitchOn, setIsSwitchOn] = React.useState(false);
 *
 *   const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
 *
 *   return <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />;
 * };
 *
 * export default MyComponent;
 * ```
 */
const Switch = ({
  value,
  disabled,
  onValueChange,
  color,
  theme,
  ...rest
}: Props) => {
  const isIOS = Platform.OS === 'ios';

  const checkedColor =
    color || (theme.isV3 ? theme.colors.primary : theme?.colors?.accent);

  const androidDisabledOnTintColor = theme.dark
    ? setColor(white)
        .alpha(theme.isV3 ? 0.06 : 0.1)
        .rgb()
        .string()
    : setColor(black).alpha(0.12).rgb().string();

  const androidDisabledThumbTintColor = theme.dark ? grey800 : grey400;

  const md2AndroidCheckedThumbTintColor = theme.dark ? grey400 : grey50;
  const md3AndroidCheckedThumbTintColor = theme.dark
    ? MD3Colors.neutral80
    : MD3Colors.neutral99;

  const androidCheckedThumbTintColor = theme.isV3
    ? md3AndroidCheckedThumbTintColor
    : md2AndroidCheckedThumbTintColor;

  const md3AndroidOnTintColor = theme.dark
    ? MD3Colors.neutral40
    : MD3Colors.neutral70;

  const onTintColor = isIOS
    ? checkedColor
    : disabled
    ? androidDisabledOnTintColor
    : theme.isV3 && !value
    ? md3AndroidOnTintColor
    : setColor(checkedColor).alpha(0.5).rgb().string();

  const thumbTintColor = isIOS
    ? undefined
    : disabled
    ? androidDisabledThumbTintColor
    : value
    ? checkedColor
    : androidCheckedThumbTintColor;

  const props =
    version && version.major === 0 && version.minor <= 56
      ? {
          onTintColor,
          thumbTintColor,
        }
      : Platform.OS === 'web'
      ? {
          activeTrackColor: onTintColor,
          thumbColor: thumbTintColor,
          activeThumbColor: checkedColor,
        }
      : {
          thumbColor: thumbTintColor,
          trackColor: {
            true: onTintColor,
            false: theme.isV3 && !isIOS ? onTintColor : '',
          },
        };

  return (
    <NativeSwitch
      value={value}
      disabled={disabled}
      onValueChange={disabled ? undefined : onValueChange}
      {...props}
      {...rest}
    />
  );
};

export default withTheme(Switch);
