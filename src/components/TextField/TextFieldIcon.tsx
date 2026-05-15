import React from 'react';
import { AccessibilityProps, GestureResponderEvent, View } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import type { IconSource } from '../Icon';
import { ACCESSORY_SIZE } from './constants';
import { styles } from './styles';
import type { TextFieldAccessoryProps } from './TextField';
import { getIconColor } from './utils';
import IconButton from '../IconButton/IconButton';

export interface TextFieldIconProps extends TextFieldAccessoryProps {
  /**
   * Icon to display.
   */
  icon: IconSource;
  /**
   * Color of the icon.
   */
  color?: string;
  /**
   * Size of the icon.
   */
  size?: number;
  /**
   * Accessibility props for the icon button.
   */
  accessibility?: AccessibilityProps;
  theme?: ThemeProp;
  /**
   * Function to execute on press.
   */
  onPress?: (event: GestureResponderEvent) => void;
}

/**
 * A component to render a leading / trailing icon in the TextField
 * (return it from `startAccessory` or `endAccessory`). Accepts icon-specific props as well as
 * `TextFieldAccessoryProps`, which TextField passes into those render props.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextField } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *   const searchAccessory = (props) => (
 *     <TextField.Icon {...props} icon="magnify" />
 *   );
 *
 *   const clearAccessory = (props) => (
 *     <TextField.Icon {...props} icon="close" onPress={() => setText('')} />
 *   );
 *
 *   return (
 *     <TextField
 *       label="Search"
 *       value={text}
 *       onChangeText={setText}
 *       startAccessory={searchAccessory}
 *       endAccessory={clearAccessory}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const TextFieldIcon = ({
  icon,
  color,
  size,
  style,
  error,
  disabled,
  accessibility,
  theme: themeOverride,
  onPress,
}: TextFieldIconProps) => {
  const theme = useInternalTheme(themeOverride);

  const iconSize = size ?? ACCESSORY_SIZE;

  const iconColor = getIconColor({
    theme,
    color,
    hasError: error,
    isDisabled: disabled,
  });

  const onPressHandler = disabled ? undefined : onPress;

  return (
    <View style={[styles.iconWrapper, style]}>
      <IconButton
        icon={icon}
        iconColor={iconColor}
        size={iconSize}
        style={styles.icon}
        onPress={onPressHandler}
        {...accessibility}
      />
    </View>
  );
};

TextFieldIcon.displayName = 'TextField.Icon';

export default TextFieldIcon;
