import * as React from 'react';
import { Platform, I18nManager, View, Image, StyleSheet } from 'react-native';
import MaterialCommunityIcon from '../MaterialCommunityIcon';

const AppbarBackIcon = ({ size, color }: { size: number; color: string }) =>
  Platform.OS === 'ios' ? (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        },
      ]}
    >
      <Image
        source={require('../../assets/back-chevron.png')}
        style={[styles.icon, { tintColor: color }]}
      />
    </View>
  ) : (
    <MaterialCommunityIcon
      name="arrow-left"
      color={color}
      size={size}
      direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
    />
  );

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 21,
    width: 21,
    resizeMode: 'contain',
  },
});

export default AppbarBackIcon;
