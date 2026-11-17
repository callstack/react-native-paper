import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { ACCESSORY_SIZE } from './constants';
import { styles } from './styles';
import { getIconColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import getMinInteractiveSizeHitSlop from '../../utils/getMinInteractiveSizeHitSlop';
import hasTouchHandler from '../../utils/hasTouchHandler';
import Icon from '../Icon';
import IconButton from '../IconButton/IconButton';
import type { Props as IconButtonProps } from '../IconButton/IconButton';

// TextInput shrinks the button to ACCESSORY_SIZE through `style`, which
// IconButton can't see when computing its own slop.
const ACCESSORY_HIT_SLOP = getMinInteractiveSizeHitSlop({
  width: ACCESSORY_SIZE,
  height: ACCESSORY_SIZE,
});

export type TextInputAccessoryProps = {
  style: StyleProp<ViewStyle>;
  multiline: boolean;
  disabled: boolean;
  error: boolean;
};

export type TextInputIconProps = TextInputAccessoryProps &
  Omit<IconButtonProps, keyof TextInputAccessoryProps>;

/**
 * A component to render a leading / trailing icon in the TextInput
 * (return it from `startAccessory` or `endAccessory`). Accepts icon-specific props as well as
 * `TextInputAccessoryProps`, which TextInput passes into those render props.
 *
 * Without `onPress`, `onLongPress`, `onPressIn` or `onPressOut`, the icon is
 * decorative: a plain element, not an `IconButton`, so it has no button role
 * and isn't a focus stop. It is hidden from assistive tech unless you pass
 * `aria-label`, and a tap on it goes to the field. An icon with a handler is a
 * control and needs `aria-label` (or `accessibilityLabel`).
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
  hitSlop,
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

  // Decorative icons render no button at all. Must match TouchableRipple's
  // predicate, or an icon with only `onLongPress` would count as decorative
  // and stay pressable on a disabled field.
  const { onLongPress, onPressIn, onPressOut } = rest;
  const isInteractive = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const accessibleName = rest['aria-label'] ?? rest.accessibilityLabel;

  if (!isInteractive) {
    return (
      <View
        ref={rest.ref}
        testID={rest.testID}
        style={[styles.icon, style]}
        {...(accessibleName
          ? { accessible: true, role: 'img', 'aria-label': accessibleName }
          : { 'aria-hidden': true })}
      >
        <Icon source={icon} color={color} size={iconSize} theme={theme} />
      </View>
    );
  }

  return (
    <View style={styles.iconWrapper}>
      <IconButton
        {...rest}
        hitSlop={hitSlop !== undefined ? hitSlop : ACCESSORY_HIT_SLOP}
        icon={icon}
        iconColor={color}
        size={iconSize}
        theme={themeOverride}
        style={[
          styles.icon,
          style,
          // TextInput already dims the whole accessory when the field is
          // disabled. Forwarding `disabled` makes IconButton dim the icon too,
          // and the two multiply, so let IconButton own it and cancel the outer
          // one.
          disabled ? styles.notDimmed : null,
        ]}
        disabled={disabled}
        onPress={onPress}
      />
    </View>
  );
};

TextInputIcon.displayName = 'TextInput.Icon';

export default TextInputIcon;
