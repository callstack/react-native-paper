import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import IconButton from '../../IconButton';
import type { $Omit } from '../../../../src/types';

type Props = $Omit<
  React.ComponentProps<typeof IconButton>,
  'icon' | 'theme'
> & {
  name: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  theme?: ReactNativePaper.Theme;
};

export const ICON_SIZE = 24;
const ICON_OFFSET = 12;

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

export const IconAdornment: React.FunctionComponent<
  {
    testID: string;
    icon: React.ReactNode;
    topPosition: number;
    side: 'left' | 'right';
  } & Omit<StyleContextType, 'style'>
> = ({ icon, topPosition, side, isTextInputFocused, forceFocus }) => {
  const style = {
    top: topPosition,
    [side]: ICON_OFFSET,
  };
  const contextState = { style, isTextInputFocused, forceFocus };

  return (
    <StyleContext.Provider value={contextState}>{icon}</StyleContext.Provider>
  );
};

const TextInputIcon = ({ name, onPress, ...rest }: Props) => {
  const { style, isTextInputFocused, forceFocus } = React.useContext(
    StyleContext
  );

  const onPressWithFocusControl = React.useCallback(() => {
    if (!isTextInputFocused) {
      forceFocus();
    }
    onPress?.();
  }, [forceFocus, isTextInputFocused, onPress]);

  return (
    <View style={[styles.container, style]}>
      <IconButton
        icon={name}
        style={styles.iconButton}
        size={ICON_SIZE}
        onPress={onPressWithFocusControl}
        {...rest}
      />
    </View>
  );
};
TextInputIcon.displayName = 'TextInput.Icon';

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
