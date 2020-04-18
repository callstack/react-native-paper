import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import IconButton from '../../IconButton';
import { $Omit, Theme } from '../../../../src/types';

type Props = $Omit<
  React.ComponentProps<typeof IconButton>,
  'icon' | 'theme'
> & {
  name: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  theme?: Theme;
};

export const ICON_SIZE = 24;
const ICON_OFFSET = 12;

const StyleContext = React.createContext<{ style?: StyleProp<ViewStyle> }>({
  style: {},
});

export const IconAdornment: React.FunctionComponent<{
  testID: string;
  icon: React.ReactNode;
  iconTopPosition: number;
  side: 'left' | 'right';
}> = ({ icon, iconTopPosition, side }) => {
  const style = {
    top: iconTopPosition,
    [side]: ICON_OFFSET,
  };

  return (
    <StyleContext.Provider value={{ style }}>{icon}</StyleContext.Provider>
  );
};

const TextInputIcon = ({ name, onPress, ...rest }: Props) => {
  const { style } = React.useContext(StyleContext);
  return (
    <View style={[styles.container, style]}>
      <IconButton
        icon={name}
        style={styles.iconButton}
        size={ICON_SIZE}
        onPress={onPress}
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
