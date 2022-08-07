import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, SegmentedButton } from 'react-native-paper';

const SegmentedButtonOnlyIconsWithCheck = () => {
  const [value, setValue] = React.useState('');

  return (
    <List.Section title={`Segmented Button - icons + show selected check`}>
      <SegmentedButton.Group
        onValueChange={(value) => {
          typeof value === 'string' && setValue(value);
        }}
        style={styles.group}
        value={value}
      >
        <SegmentedButton icon="walk" showSelectedCheck value="walk" />
        <SegmentedButton icon="train" showSelectedCheck value="transit" />
        <SegmentedButton icon="car" showSelectedCheck value="drive" />
      </SegmentedButton.Group>
    </List.Section>
  );
};

const styles = StyleSheet.create({
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentedButtonOnlyIconsWithCheck;
