import React from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { ACCESSORY_SIZE } from './constants';
import { styles } from './styles';
import { getIconColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $Omit } from '../../types';
import IconButton from '../IconButton/IconButton';

export type TextInputAccessoryProps = {
  style: StyleProp<ViewStyle>;
  multiline: boolean;
  disabled: boolean;
  error: boolean;
};

export type TextInputIconProps = TextInputAccessoryProps &
  $Omit<React.ComponentProps<typeof IconButton>, keyof TextInputAccessoryProps>;

/**
 * A component to render a leading / trailing icon in the TextInput
 * (return it from `startAccessory` or `endAccessory`). Accepts icon-specific props as well as
 * `TextInputAccessoryProps`, which TextInput passes into those render props.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextInput } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *   const searchAccessory = (props) => (
 *     <TextInput.Icon {...props} icon="magnify" />
 *   );
 *
 *   const clearAccessory = (props) => (
 *     <TextInput.Icon {...props} icon="close" onPress={() => setText('')} />
 *   );
 *
 *   return (
 *     <TextInput
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
const TextInputIcon = ({
  icon,
  iconColor,
  size,
  style,
  error,
  disabled,
  theme: themeOverride,
  onPress,
  ...rest
}: TextInputIconProps) => {
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

TextInputIcon.displayName = 'TextInput.Icon';

export default TextInputIcon;
