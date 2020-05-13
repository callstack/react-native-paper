import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Colors,
  RadioButton,
  Paragraph,
  List,
  useTheme,
} from 'react-native-paper';

const RadioButtonGroupExample = () => {
  const [value, setValue] = React.useState<string>('first');
  const [value2, setValue2] = React.useState<string>('first');

  const {
    colors: { background, primary },
  } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
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
    </View>
  );
};

RadioButtonGroupExample.title = 'Radio Button Group';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default RadioButtonGroupExample;
