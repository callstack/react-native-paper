import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import IconButton from '../../IconButton/IconButton';
import type { $Omit, Theme } from '../../../types';
import type { IconSource } from '../../Icon';
import { useTheme } from '../../../core/theming';
import { getConstants } from '../helpers';
import { ICON_SIZE } from '../constants';

export type Props = $Omit<
  React.ComponentProps<typeof IconButton>,
  'icon' | 'theme' | 'color'
> & {
  /**
   * Icon to show.
   */
  name: IconSource;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Whether the TextInput will focus after onPress.
   */
  forceTextInputFocus?: boolean;
  /**
   * Color of the icon or a function receiving a boolean indicating whether the TextInput is focused and returning the color.
   */
  color?: ((isTextInputFocused: boolean) => string | undefined) | string;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: Theme;
};

type StyleContextType = {
  style: StyleProp<ViewStyle>;
  isTextInputFocused: boolean;
  forceFocus: () => void;
};

const StyleContext = React.createContext<StyleContextType>({
  style: {},
  isTextInputFocused: false,
  forceFocus: () => {},
});

const IconAdornment: React.FunctionComponent<
  {
    testID: string;
    icon: React.ReactNode;
    topPosition: number;
    side: 'left' | 'right';
  } & Omit<StyleContextType, 'style'>
> = ({ icon, topPosition, side, isTextInputFocused, forceFocus }) => {
  const { isV3 } = useTheme();
  const { ICON_OFFSET } = getConstants(isV3);

  const style = {
    top: topPosition,
    [side]: ICON_OFFSET,
  };
  const contextState = { style, isTextInputFocused, forceFocus };

  return (
    <StyleContext.Provider value={contextState}>{icon}</StyleContext.Provider>
  );
};

/**
 * A component to render a leading / trailing icon in the TextInput
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/textinput-flat.icon.png" />
 *   </figure>
 * </div>
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
 *       right={<TextInput.Icon name="eye" />}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */

const TextInputIcon = ({
  name,
  onPress,
  forceTextInputFocus,
  color,
  ...rest
}: Props) => {
  const { style, isTextInputFocused, forceFocus } =
    React.useContext(StyleContext);

  const onPressWithFocusControl = React.useCallback(() => {
    if (forceTextInputFocus && !isTextInputFocused) {
      forceFocus();
    }
    onPress?.();
  }, [forceTextInputFocus, forceFocus, isTextInputFocused, onPress]);

  const theme = useTheme();

  let iconColor = color;

  if (theme.isV3) {
    if (rest.disabled) {
      iconColor = theme.colors.onSurface;
    }
    iconColor = theme.colors.onSurfaceVariant;
  } else {
    iconColor = theme.colors.text;
  }

  return (
    <View style={[styles.container, style]}>
      <IconButton
        icon={name}
        style={styles.iconButton}
        size={ICON_SIZE}
        onPress={onPressWithFocusControl}
        iconColor={
          typeof color === 'function' ? color(isTextInputFocused) : iconColor
        }
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
