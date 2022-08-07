import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, SegmentedButton } from 'react-native-paper';

const SegmentedButtonDisabled = () => {
  const [value, setValue] = React.useState('');

  return (
    <List.Section title={`Segmented Button - disabled`}>
      <SegmentedButton.Group
        multiselect
        onValueChange={(value) => {
          typeof value === 'string' && setValue(value);
        }}
        value={value}
        style={styles.group}
      >
        <SegmentedButton style={styles.button} value="walk" label="Walking" />
        <SegmentedButton style={styles.button} label="Disabled" disabled />
        <SegmentedButton style={styles.button} label="Driving" value="drive" />
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

export default SegmentedButtonDisabled;
