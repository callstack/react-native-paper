import * as React from 'react';
import {
  NativeModules,
  Platform,
  StyleProp,
  Switch as NativeSwitch,
  ViewStyle,
} from 'react-native';

import { getSwitchColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';

const version = NativeModules.PlatformConstants
  ? NativeModules.PlatformConstants.reactNativeVersion
  : undefined;

export type Props = React.ComponentPropsWithRef<typeof NativeSwitch> & {
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
  theme?: ThemeProp;
};

/**
 * Switch is a visual toggle between two mutually exclusive states — on and off.
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
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  // Internal state is needed to fix #4789 where Switch is inside a Portal
  const [internalValue, setInternalValue] = React.useState<boolean>(() =>
    typeof value === 'boolean' ? value : false
  );

  React.useEffect(() => {
    if (typeof value === 'boolean' && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value, internalValue]);

  const { checkedColor, onTintColor, thumbTintColor } = getSwitchColor({
    theme,
    disabled,
    value: internalValue,
    color,
  });

  const handleValueChange = React.useCallback(
    (newValue: boolean) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange]
  );

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
            false: onTintColor,
          },
        };

  return (
    <NativeSwitch
      value={internalValue}
      disabled={disabled}
      onValueChange={disabled ? undefined : handleValueChange}
      {...props}
      {...rest}
    />
  );
};

Switch.displayName = 'Switch';

export default Switch;
