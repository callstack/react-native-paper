import React from 'react';
import { AccessibilityProps, GestureResponderEvent, View } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import type { IconSource } from '../Icon';
import { ACCESSORY_SIZE } from './constants';
import { $iconStyle, $iconWrapperStyle } from './styles';
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
  onPress?: (e: GestureResponderEvent) => void;
}

/**
 * A pre-built accessory component that renders an icon button inside a TextField.
 * Accepts all `TextFieldAccessoryProps` (passed automatically by the parent) plus
 * icon-specific props.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextField } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *   const SearchIcon = (props) => (
 *     <TextField.Icon {...props} icon="magnify" />
 *   );
 *
 *   const ClearIcon = (props) => (
 *     <TextField.Icon {...props} icon="close" onPress={() => setText('')} />
 *   );
 *
 *   return (
 *     <TextField
 *       label="Search"
 *       value={text}
 *       onChangeText={setText}
 *       StartAccessory={SearchIcon}
 *       EndAccessory={ClearIcon}
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
  size = ACCESSORY_SIZE,
  style,
  status,
  editable,
  accessibility,
  theme: themeOverride,
  onPress,
}: TextFieldIconProps) => {
  const theme = useInternalTheme(themeOverride);

  const iconColor = getIconColor({
    theme,
    color,
    status,
  });

  const onPressHandler = editable ? onPress : undefined;

  return (
    <View style={[$iconWrapperStyle, style]}>
      <IconButton
        icon={icon}
        iconColor={iconColor}
        size={size}
        style={$iconStyle}
        onPress={onPressHandler}
        {...accessibility}
      />
    </View>
  );
};

TextFieldIcon.displayName = 'TextField.Icon';

export default TextFieldIcon;
