import React from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { getIconColor } from './utils';
import { useInternalTheme } from '../../../core/theming';
import type { $Omit, ThemeProp } from '../../../types';
import type { IconSource } from '../../Icon';
import IconButton from '../../IconButton/IconButton';
import { ICON_SIZE } from '../constants';
import { getConstants } from '../helpers';

export type Props = $Omit<
  React.ComponentProps<typeof IconButton>,
  'icon' | 'theme' | 'color' | 'iconColor'
> & {
  /**
   * @renamed Renamed from 'name' to 'icon` in v5.x
   * Icon to show.
   */
  icon: IconSource;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Whether the TextInput will focus after onPress.
   */
  forceTextInputFocus?: boolean;
  /**
   * Color of the icon or a function receiving a boolean indicating whether the TextInput is focused and returning the color.
   */
  color?: ((isTextInputFocused: boolean) => string | undefined) | string;
  /**
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

type StyleContextType = {
  style: StyleProp<ViewStyle>;
  isTextInputFocused: boolean;
  forceFocus: () => void;
  testID: string;
  disabled?: boolean;
};

const StyleContext = React.createContext<StyleContextType>({
  style: {},
  isTextInputFocused: false,
  forceFocus: () => {},
  testID: '',
});

const IconAdornment: React.FunctionComponent<
  {
    testID: string;
    icon: React.ReactNode;
    topPosition: number;
    side: 'left' | 'right';
    theme?: ThemeProp;
    disabled?: boolean;
  } & Omit<StyleContextType, 'style'>
> = ({
  icon,
  topPosition,
  side,
  isTextInputFocused,
  forceFocus,
  testID,
  theme: themeOverrides,
  disabled,
}) => {
  const { isV3 } = useInternalTheme(themeOverrides);
  const { ICON_OFFSET } = getConstants(isV3);

  const style = {
    top: topPosition,
    [side]: ICON_OFFSET,
  };
  const contextState = {
    style,
    isTextInputFocused,
    forceFocus,
    testID,
    disabled,
  };

  return (
    <StyleContext.Provider value={contextState}>{icon}</StyleContext.Provider>
  );
};

/**
 * A component to render a leading / trailing icon in the TextInput
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextInput } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *   return (
 *     <TextInput
 *       label="Password"
 *       secureTextEntry
 *       right={<TextInput.Icon icon="eye" />}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */

const TextInputIcon = ({
  icon,
  onPress,
  forceTextInputFocus,
  color: customColor,
  theme: themeOverrides,
  rippleColor,
  ...rest
}: Props) => {
  const { style, isTextInputFocused, forceFocus, testID, disabled } =
    React.useContext(StyleContext);

  const onPressWithFocusControl = React.useCallback(
    (e: GestureResponderEvent) => {
      if (forceTextInputFocus && !isTextInputFocused) {
        forceFocus();
      }

      onPress?.(e);
    },
    [forceTextInputFocus, forceFocus, isTextInputFocused, onPress]
  );

  const theme = useInternalTheme(themeOverrides);

  const iconColor = getIconColor({
    theme,
    disabled,
    isTextInputFocused,
    customColor,
  });

  return (
    <View style={[styles.container, style]}>
      <IconButton
        icon={icon}
        style={styles.iconButton}
        size={ICON_SIZE}
        onPress={onPressWithFocusControl}
        iconColor={iconColor}
        testID={testID}
        theme={themeOverrides}
        rippleColor={rippleColor}
        {...rest}
      />
    </View>
  );
};
TextInputIcon.displayName = 'TextInput.Icon';

TextInputIcon.defaultProps = {
  forceTextInputFocus: true,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    margin: 0,
  },
});

export default TextInputIcon;

// @component-docs ignore-next-line
export { IconAdornment };
