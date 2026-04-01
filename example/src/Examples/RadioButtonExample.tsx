import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  MD3Colors,
  RadioButton,
  Text,
  TouchableRipple,
} from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

type State = 'normal' | 'normal-ios' | 'normal-item' | 'custom';

const RadioButtonExample = () => {
  const [checked, setChecked] = React.useState<State>('normal');
  const TextComponent = Text;

  return (
    <ScreenWrapper style={styles.container}>
      <TouchableRipple onPress={() => setChecked('normal')}>
        <View style={styles.row}>
          <TextComponent>Normal - Material Design</TextComponent>
          <View pointerEvents="none">
            <RadioButton.Android
              value="normal"
              status={checked === 'normal' ? 'checked' : 'unchecked'}
            />
          </View>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={() => setChecked('normal-ios')}>
        <View style={styles.row}>
          <TextComponent>Normal 2 - IOS</TextComponent>
          <View pointerEvents="none">
            <RadioButton.IOS
              value="normal-ios"
              status={checked === 'normal-ios' ? 'checked' : 'unchecked'}
            />
          </View>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={() => setChecked('custom')}>
        <View style={styles.row}>
          <TextComponent>Custom</TextComponent>
          <View pointerEvents="none">
            <RadioButton
              value="custom"
              color={MD3Colors.error70}
              status={checked === 'custom' ? 'checked' : 'unchecked'}
            />
          </View>
        </View>
      </TouchableRipple>
      <RadioButton.Item
        label="Normal 3 - Item"
        value="normal-item"
        status={checked === 'normal-item' ? 'checked' : 'unchecked'}
        onPress={() => setChecked('normal-item')}
      />
      <View style={styles.row}>
        <TextComponent>Checked (Disabled)</TextComponent>
        <RadioButton value="first" status="checked" disabled />
      </View>
      <View style={styles.row}>
        <TextComponent>Unchecked (Disabled)</TextComponent>
        <RadioButton value="second" status="unchecked" disabled />
      </View>
      <RadioButton.Item
        label="Checked - Item (Disabled)"
        value="third"
        status="checked"
        disabled
      />
      <RadioButton.Item
        label="Unchecked - Item (Disabled)"
        value="fourth"
        status="unchecked"
        disabled
      />
    </ScreenWrapper>
  );
};

RadioButtonExample.title = 'Radio Button';

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

export default RadioButtonExample;
