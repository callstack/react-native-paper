import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, SegmentedButton } from 'react-native-paper';

const SegmentedButtonWithDensity = () => {
  const [value, setValue] = React.useState('');

  return (
    <List.Section title={`Segmented Button - only labels + density`}>
      <SegmentedButton.Group
        onValueChange={(value) => {
          typeof value === 'string' && setValue(value);
        }}
        value={value}
        style={styles.group}
      >
        <SegmentedButton
          density={-2}
          style={styles.button}
          value="walk"
          label="Walking"
        />
        <SegmentedButton
          density={-2}
          style={styles.button}
          label="Transit"
          value="transit"
        />
        <SegmentedButton
          density={-2}
          style={styles.button}
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

export default SegmentedButtonWithDensity;
