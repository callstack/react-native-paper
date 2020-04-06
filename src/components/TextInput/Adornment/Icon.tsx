import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import IconButton from '../../IconButton';

type Props = {
  name: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const ICON_SIZE = 24;
const ICON_OFFSET = 12;

/** *
 *  TODO: add support for all IconButton props
 * */
// type Props = $RemoveChildren<typeof TouchableRipple> & {
//     color?: string;
//     disabled?: boolean;
//     animated?: boolean;
//     accessibilityLabel?: string;
//     onPress?: (e: GestureResponderEvent) => void;
//     style?: StyleProp<ViewStyle>;
//     theme?: Theme;
//   };

export function renderIcon({
  icon,
  iconTopPosition,
  side,
}: {
  icon: React.ReactNode;
  iconTopPosition: number;
  side: 'left' | 'right';
}): React.ReactNode {
  /** Same cloning practice */
  // @ts-ignore
  return React.cloneElement(icon, {
    style: {
      top: iconTopPosition,
      [side]: ICON_OFFSET,
    },
  });
}

const TextInputIcon = ({ name, onPress, style }: Props) => {
  return (
    <View style={[styles.container, style]}>
      <IconButton
        icon={name}
        style={styles.iconButton}
        size={ICON_SIZE}
        onPress={onPress}
      />
    </View>
  );
};
TextInputIcon.displayName = 'TextInput.Icon';

/** So, some constants are used */
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
