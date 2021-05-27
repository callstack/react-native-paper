import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton, Paragraph, List, useTheme } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const RadioButtonGroupExample = () => {
  const [value, setValue] = React.useState<string>('first');
  const [value2, setValue2] = React.useState<string>('first');

  const {
    colors: { primary },
  } = useTheme();
  return (
    <ScreenWrapper>
      <List.Section title="With RadioButton">
        <RadioButton.Group
          value={value}
          onValueChange={(value: string) => setValue(value)}
        >
          <View style={styles.row}>
            <Paragraph>First</Paragraph>
            <RadioButton value="first" />
          </View>
          <View style={styles.row}>
            <Paragraph>Second</Paragraph>
            <RadioButton.Android value="second" />
          </View>
          <View style={styles.row}>
            <Paragraph>Third</Paragraph>
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
            labelStyle={{ color: primary }}
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
