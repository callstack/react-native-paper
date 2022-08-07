import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, SegmentedButton } from 'react-native-paper';

const SegmentedButtonMultiselect = () => {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <List.Section title={`Segmented Button - multiselect`}>
      <SegmentedButton.Group
        multiselect
        onValueChange={(value) => {
          if (Array.isArray(value)) {
            setValue(value);
          }
        }}
        value={value}
        style={styles.group}
      >
        <SegmentedButton
          style={styles.button}
          value="walk"
          label="Walking"
          showSelectedCheck
        />
        <SegmentedButton
          style={styles.button}
          label="Transit"
          value="transit"
          showSelectedCheck
        />
        <SegmentedButton
          style={styles.button}
          label="Driving"
          value="drive"
          showSelectedCheck
        />
      </SegmentedButton.Group>
    </List.Section>
  );
};

const styles = StyleSheet.create({
  group: { paddingHorizontal: 20, justifyContent: 'center' },
  button: {
    flex: 1,
  },
});

export default SegmentedButtonMultiselect;
