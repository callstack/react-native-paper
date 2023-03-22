import * as React from 'react';
import { Platform, View, Image, StyleSheet } from 'react-native';

import { useLocaleDirection } from '../../core/Localization';
import MaterialCommunityIcon from '../MaterialCommunityIcon';

const AppbarBackIcon = ({ size, color }: { size: number; color: string }) => {
  const direction = useLocaleDirection();
  const iosIconSize = size - 3;

  return Platform.OS === 'ios' ? (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
        },
      ]}
    >
      <Image
        source={require('../../assets/back-chevron.png')}
        style={[
          styles.icon,
          { tintColor: color, width: iosIconSize, height: iosIconSize },
        ]}
        accessibilityIgnoresInvertColors
      />
    </View>
  ) : (
    <MaterialCommunityIcon
      name="arrow-left"
      color={color}
      size={size}
      direction={direction}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    resizeMode: 'contain',
  },
});

export default AppbarBackIcon;

// @component-docs ignore-next-line
export { AppbarBackIcon };
