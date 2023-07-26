import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, List, MD2Colors } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const IconExample = () => {
  return (
    <ScreenWrapper>
      <List.Section title="Default color">
        <View style={styles.row}>
          <Icon source="camera" size={24} />
        </View>
      </List.Section>
      <List.Section title="Custom color">
        <View style={styles.row}>
          <Icon source="camera" color={MD2Colors.green500} size={24} />
        </View>
      </List.Section>
      <List.Section title="Custom Size">
        <View style={styles.row}>
          <Icon source="heart" color={MD2Colors.pink300} size={50} />
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
