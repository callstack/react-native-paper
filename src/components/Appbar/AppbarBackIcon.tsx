import { Image, Platform, StyleSheet, View } from 'react-native';
import type { ColorValue } from 'react-native';

import { useLocale } from '../../core/locale';
import Icon from '../Icon';

const AppbarBackIcon = ({
  size,
  color,
}: {
  size: number;
  color: ColorValue;
}) => {
  const { direction } = useLocale();
  const isRTL = direction === 'rtl';
  const iosIconSize = size - 3;

  return Platform.OS === 'ios' ? (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          transform: [{ scaleX: isRTL ? -1 : 1 }],
        },
      ]}
    >
      <Image
        source={require('../../assets/back-chevron.png')}
        resizeMode="contain"
        style={{ width: iosIconSize, height: iosIconSize, tintColor: color }}
        accessibilityIgnoresInvertColors
      />
    </View>
  ) : (
    <Icon
      source={{ source: 'arrow-left', direction }}
      color={color}
      size={size}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppbarBackIcon;

// @component-docs ignore-next-line
export { AppbarBackIcon };
