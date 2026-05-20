import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { ACCESSORY_SIZE } from './constants';
import { styles } from './styles';
import { getIconColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $Omit } from '../../types';
import IconButton from '../IconButton/IconButton';

export type TextFieldAccessoryProps = {
  style: StyleProp<ViewStyle>;
  multiline: boolean;
  disabled: boolean;
  error: boolean;
};

export type TextFieldIconProps = TextFieldAccessoryProps &
  $Omit<React.ComponentProps<typeof IconButton>, keyof TextFieldAccessoryProps>;

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
 *
 * @extends IconButton props https://callstack.github.io/react-native-paper/docs/components/IconButton
 */
const TextFieldIcon = ({
  icon,
  iconColor,
  size,
  style,
  error,
  disabled,
  theme: themeOverride,
  onPress,
  ...rest
}: TextFieldIconProps) => {
  const theme = useInternalTheme(themeOverride);

  const iconSize = size ?? ACCESSORY_SIZE;

  const color = getIconColor({
    theme,
    iconColor,
    hasError: error,
    isDisabled: disabled,
  });

  const onPressHandler = disabled ? undefined : onPress;

  return (
    <View style={styles.iconWrapper}>
      <IconButton
        {...rest}
        icon={icon}
        iconColor={color}
        size={iconSize}
        style={[styles.icon, style]}
        onPress={onPressHandler}
      />
    </View>
  );
};

TextFieldIcon.displayName = 'TextField.Icon';

export default TextFieldIcon;
