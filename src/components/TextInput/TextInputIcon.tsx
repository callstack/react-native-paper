import * as React from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { ACCESSORY_SIZE } from './constants';
import { styles } from './styles';
import { getIconColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import getMinInteractiveSizeHitSlop from '../../utils/getMinInteractiveSizeHitSlop';
import hasTouchHandler from '../../utils/hasTouchHandler';
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
  Omit<
    IconButtonProps,
    keyof TextInputAccessoryProps | 'aria-label' | 'accessibilityLabel'
  > &
  (
    | {
        onPress?: undefined;
        onLongPress?: undefined;
        onPressIn?: undefined;
        onPressOut?: undefined;
        'aria-label'?: string;
        accessibilityLabel?: string;
      }
    | { 'aria-label': string; accessibilityLabel?: string }
    | { 'aria-label'?: string; accessibilityLabel: string }
  );

/**
 * A component to render a leading / trailing icon in the TextInput
 * (return it from `startAccessory` or `endAccessory`). Accepts icon-specific props as well as
 * `TextInputAccessoryProps`, which TextInput passes into those render props.
 *
 * Without `onPress`, `onLongPress`, `onPressIn` or `onPressOut`, the icon is
 * decorative: it is hidden from assistive technology, and a tap on it goes to
 * the field. An actionable icon requires an `aria-label` (or
 * `accessibilityLabel`) that names its action, such as "Clear text" or
 * "Show password".
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
 *     <TextInput.Icon {...props} icon="close" aria-label="Clear text" onPress={() => setText('')} />
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
  multiline: _multiline,
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

  // Decides both the accessibility contract and `disabled`. A decorative icon
  // is not a control, and forwarding `disabled` would turn it back into a
  // disabled button. Must match TouchableRipple's predicate, or an icon with
  // only `onLongPress` stays pressable on a disabled field.
  const { onLongPress, onPressIn, onPressOut } = rest;
  const actionable = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });
  const iconRef = React.useRef<View>(null);
  React.useImperativeHandle<View | null, View | null>(
    rest.ref,
    () => iconRef.current,
    []
  );
  const accessibleName = rest['aria-label'] ?? rest.accessibilityLabel;
  React.useEffect(() => {
    if (__DEV__ && actionable && !accessibleName?.trim()) {
      console.warn(
        'TextInput.Icon: an actionable icon requires an aria-label or accessibilityLabel.'
      );
    }
  }, [actionable, accessibleName]);

  void _multiline;

  return (
    <View
      style={styles.iconWrapper}
      aria-hidden={!actionable}
      pointerEvents={actionable ? 'auto' : 'none'}
    >
      <IconButton
        {...rest}
        ref={rest.ref ? iconRef : undefined}
        {...(!actionable && {
          role: 'none',
          accessibilityRole: 'none',
          accessible: false,
          focusable: false,
          tabIndex: -1,
          'aria-hidden': true,
        })}
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
          // one. A decorative icon keeps it, nothing else dims it.
          actionable && disabled ? styles.notDimmed : null,
        ]}
        disabled={actionable ? disabled : undefined}
        onPress={onPress}
      />
    </View>
  );
};

TextInputIcon.displayName = 'TextInput.Icon';

export default TextInputIcon;
