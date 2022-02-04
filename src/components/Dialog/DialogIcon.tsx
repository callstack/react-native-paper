import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../core/theming';
import Icon, { IconSource } from '../Icon';

type Props = {
  /**
   *  Custom color for action icon.
   */
  color?: string;
  /**
   * Name of the icon to show.
   */
  icon: IconSource;
  /**
   * Optional icon size.
   */
  size?: number;
};
const DialogIcon = ({ size = 24, color, icon }: Props) => {
  const { md } = useTheme();
  return (
    <View style={styles.wrapper}>
      <Icon
        source={icon}
        color={color || (md('md.sys.color.secondary') as string)}
        size={size}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
});

export default DialogIcon;

// @component-docs ignore-next-line
export { DialogIcon };
