import * as React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import { Icon, List } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const AssetIcon = ({ size, testID }: { size: number; testID: string }) => (
  <Image
    accessibilityIgnoresInvertColors
    source={require('../../assets/images/paper-icon.png')}
    style={{ width: size, height: size }}
    testID={testID}
  />
);

const IconExample = () => {
  return (
    <ScreenWrapper>
      <List.Section title="Default icon (MaterialCommunityIcon)">
        <View style={styles.row}>
          <Icon source="camera" size={24} />
        </View>
      </List.Section>
      <List.Section title="Image icon">
        <View style={styles.row}>
          <Icon source={{ uri: 'https://picsum.photos/700' }} size={48} />
        </View>
      </List.Section>
      <List.Section title="Render function icon">
        <View style={styles.row}>
          <Icon source={AssetIcon} size={48} />
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

IconExample.title = 'Icon';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: 16,
  },
});

export default IconExample;
