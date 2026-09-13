import * as React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import type { ColorValue } from 'react-native';

import { useLocale } from '../../core/locale';
import { SettingsContext } from '../../core/settings';
import type { Settings } from '../../core/settings';
import Icon from '../Icon';
import MaterialCommunityIcon from '../MaterialCommunityIcon';

const AppbarBackIcon = ({
  size,
  color,
}: {
  size: number;
  color: ColorValue;
}) => {
  const { direction } = useLocale();
  const { icon } = React.useContext<Settings>(SettingsContext);
  const isRTL = direction === 'rtl';
  const iosIconSize = size - 3;

  // The bundled chevron is only kept while the default icon renderer is in
  // place, so a renderer configured through `PaperProvider` wins on iOS too.
  const shouldUseIOSAsset =
    Platform.OS === 'ios' && (!icon || icon === MaterialCommunityIcon);

  return shouldUseIOSAsset ? (
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
