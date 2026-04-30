import React from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';

import type { TextFieldAccessoryProps } from './TextField';
import type { IconSource } from '../Icon';
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
   * Accessibility label for the icon button.
   */
  accessibilityLabel?: string;
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
  size = 24,
  style,
  editable,
  accessibilityLabel,
  onPress,
}: TextFieldIconProps) => {
  return (
    <View style={[styles.container, style]}>
      <IconButton
        icon={icon}
        onPress={onPress}
        iconColor={color}
        disabled={!editable}
        size={size}
        style={styles.iconButton}
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
};

TextFieldIcon.displayName = 'TextField.Icon';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    margin: 0,
  },
});

export default TextFieldIcon;
