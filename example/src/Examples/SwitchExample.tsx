import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Colors, Switch, Text, TouchableRipple } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const SwitchExample = () => {
  const [valueNormal, setNormalValue] = React.useState<boolean>(true);
  const [valueCustom, setCustomValue] = React.useState<boolean>(true);

  const switchValueNormalLabel = `switch ${
    valueNormal === true ? 'on' : 'off'
  }`;
  const switchValueCustomlLabel = `switch ${
    valueCustom === true ? 'on' : 'off'
  }`;

  return Platform.OS === 'android' ? (
    <ScreenWrapper style={styles.container}>
      <TouchableRipple onPress={() => setNormalValue(!valueNormal)}>
        <View style={styles.row}>
          <Text>Normal {switchValueNormalLabel}</Text>
          <View pointerEvents="none">
            <Switch value={valueNormal} />
          </View>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={() => setCustomValue(!valueCustom)}>
        <View style={styles.row}>
          <Text>Custom {switchValueCustomlLabel}</Text>
          <View pointerEvents="none">
            <Switch value={valueCustom} color={Colors.tertiary50} />
          </View>
        </View>
      </TouchableRipple>
      <View style={styles.row}>
        <Text>Switch on (disabled)</Text>
        <Switch disabled value />
      </View>
      <View style={styles.row}>
        <Text>Switch off (disabled)</Text>
        <Switch disabled />
      </View>
    </ScreenWrapper>
  ) : (
    <ScreenWrapper style={styles.container}>
      <View style={styles.row}>
        <Text>Normal {switchValueNormalLabel}</Text>
        <Switch
          value={valueNormal}
          onValueChange={() => setNormalValue(!valueNormal)}
        />
      </View>
      <View style={styles.row}>
        <Text>Custom {switchValueCustomlLabel}</Text>
        <Switch
          value={valueCustom}
          onValueChange={() => setCustomValue(!valueCustom)}
          color={Colors.tertiary50}
        />
      </View>
      <View style={styles.row}>
        <Text>Switch on (disabled)</Text>
        <Switch value disabled />
      </View>
      <View style={styles.row}>
        <Text>Switch off (disabled)</Text>
        <Switch value={false} disabled />
      </View>
    </ScreenWrapper>
  );
};

SwitchExample.title = 'Switch';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default SwitchExample;
