import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  Paragraph,
  Switch,
  MD2Colors,
  MD3Colors,
  TouchableRipple,
  useTheme,
  Text,
} from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const SwitchExample = () => {
  const [valueNormal, setNormalValue] = React.useState<boolean>(true);
  const [valueCustom, setCustomValue] = React.useState<boolean>(true);

  const { isV3 } = useTheme();

  const switchValueNormalLabel = `switch ${
    valueNormal === true ? 'on' : 'off'
  }`;
  const switchValueCustomlLabel = `switch ${
    valueCustom === true ? 'on' : 'off'
  }`;

  const TextComponent = isV3 ? Text : Paragraph;

  return Platform.OS === 'android' ? (
    <ScreenWrapper style={styles.container}>
      <TouchableRipple onPress={() => setNormalValue(!valueNormal)}>
        <View style={styles.row}>
          <TextComponent>Normal {switchValueNormalLabel}</TextComponent>
          <View pointerEvents="none">
            <Switch value={valueNormal} />
          </View>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={() => setCustomValue(!valueCustom)}>
        <View style={styles.row}>
          <TextComponent>Custom {switchValueCustomlLabel}</TextComponent>
          <View pointerEvents="none">
            <Switch
              value={valueCustom}
              color={isV3 ? MD3Colors.tertiary50 : MD2Colors.blue500}
            />
          </View>
        </View>
      </TouchableRipple>
      <View style={styles.row}>
        <TextComponent>Switch on (disabled)</TextComponent>
        <Switch disabled value />
      </View>
      <View style={styles.row}>
        <TextComponent>Switch off (disabled)</TextComponent>
        <Switch disabled />
      </View>
    </ScreenWrapper>
  ) : (
    <ScreenWrapper style={styles.container}>
      <View style={styles.row}>
        <TextComponent>Normal {switchValueNormalLabel}</TextComponent>
        <Switch
          value={valueNormal}
          onValueChange={() => setNormalValue(!valueNormal)}
        />
      </View>
      <View style={styles.row}>
        <TextComponent>Custom {switchValueCustomlLabel}</TextComponent>
        <Switch
          value={valueCustom}
          onValueChange={() => setCustomValue(!valueCustom)}
          color={isV3 ? MD3Colors.tertiary50 : MD2Colors.blue500}
        />
      </View>
      <View style={styles.row}>
        <TextComponent>Switch on (disabled)</TextComponent>
        <Switch value disabled />
      </View>
      <View style={styles.row}>
        <TextComponent>Switch off (disabled)</TextComponent>
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
