import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Paragraph, Switch, Colors, TouchableRipple } from 'react-native-paper';
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
          <Paragraph>Normal {switchValueNormalLabel}</Paragraph>
          <View pointerEvents="none">
            <Switch value={valueNormal} />
          </View>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={() => setCustomValue(!valueCustom)}>
        <View style={styles.row}>
          <Paragraph>Custom {switchValueCustomlLabel}</Paragraph>
          <View pointerEvents="none">
            <Switch value={valueCustom} color={Colors.blue500} />
          </View>
        </View>
      </TouchableRipple>
      <View style={styles.row}>
        <Paragraph>Switch on (disabled)</Paragraph>
        <Switch disabled value />
      </View>
      <View style={styles.row}>
        <Paragraph>Switch off (disabled)</Paragraph>
        <Switch disabled />
      </View>
    </ScreenWrapper>
  ) : (
    <ScreenWrapper style={styles.container}>
      <View style={styles.row}>
        <Paragraph>Normal {switchValueNormalLabel}</Paragraph>
        <Switch
          value={valueNormal}
          onValueChange={() => setNormalValue(!valueNormal)}
        />
      </View>
      <View style={styles.row}>
        <Paragraph>Custom {switchValueCustomlLabel}</Paragraph>
        <Switch
          value={valueCustom}
          onValueChange={() => setCustomValue(!valueCustom)}
          color={Colors.blue500}
        />
      </View>
      <View style={styles.row}>
        <Paragraph>Switch on (disabled)</Paragraph>
        <Switch value disabled />
      </View>
      <View style={styles.row}>
        <Paragraph>Switch off (disabled)</Paragraph>
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
