import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { List, Paragraph, RadioButton, Text } from 'react-native-paper';

import { useExampleTheme } from '..';
import ScreenWrapper from '../ScreenWrapper';

const RadioButtonGroupExample = () => {
  const [value, setValue] = React.useState('first');
  const [value2, setValue2] = React.useState('first');

  const { colors, isV3 } = useExampleTheme();
  const TextComponent = isV3 ? Text : Paragraph;

  return (
    <ScreenWrapper>
      <List.Section title="With RadioButton">
        <RadioButton.Group
          value={value}
          onValueChange={(value: string) => setValue(value)}
        >
          <View style={styles.row}>
            <TextComponent>First</TextComponent>
            <RadioButton value="first" />
          </View>
          <View style={styles.row}>
            <TextComponent>Second</TextComponent>
            <RadioButton.Android value="second" />
          </View>
          <View style={styles.row}>
            <TextComponent>Third</TextComponent>
            <RadioButton.IOS value="third" />
          </View>
        </RadioButton.Group>
      </List.Section>
      <List.Section title="With RadioButton.Item">
        <RadioButton.Group
          value={value2}
          onValueChange={(value: string) => setValue2(value)}
        >
          <RadioButton.Item label="First item" value="first" />
          <RadioButton.Item label="Second item" value="second" />
          <RadioButton.Item
            label="Third item"
            value="third"
            labelStyle={{ color: colors?.primary }}
          />
        </RadioButton.Group>
      </List.Section>
    </ScreenWrapper>
  );
};

RadioButtonGroupExample.title = 'Radio Button Group';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default RadioButtonGroupExample;
