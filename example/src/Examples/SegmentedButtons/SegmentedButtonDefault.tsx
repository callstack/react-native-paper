import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, SegmentedButton } from 'react-native-paper';

const SegmentedButtonDefault = () => {
  const [value, setValue] = React.useState('');

  return (
    <List.Section title={`Segmented Button`}>
      <SegmentedButton.Group
        onValueChange={(value) => {
          typeof value === 'string' && setValue(value);
        }}
        value={value}
        style={styles.group}
      >
        <SegmentedButton
          style={styles.button}
          icon="walk"
          value="walk"
          label="Walking"
        />
        <SegmentedButton
          style={styles.button}
          icon="train"
          label="Transit"
          value="transit"
        />
        <SegmentedButton
          style={styles.button}
          icon="car"
          label="Driving"
          value="drive"
        />
      </SegmentedButton.Group>
    </List.Section>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentedButtonDefault;
