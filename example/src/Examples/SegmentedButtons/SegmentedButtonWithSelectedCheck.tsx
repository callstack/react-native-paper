import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, SegmentedButton } from 'react-native-paper';

const SegmentedButtonWithSelectedCheck = () => {
  const [value, setValue] = React.useState('');

  return (
    <List.Section title={`Segmented Button - show selected check`}>
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
          showSelectedCheck
        />
        <SegmentedButton
          style={styles.button}
          icon="train"
          label="Transit"
          value="transit"
          showSelectedCheck
        />
        <SegmentedButton
          style={styles.button}
          icon="car"
          label="Driving"
          value="drive"
          showSelectedCheck
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

export default SegmentedButtonWithSelectedCheck;
