import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, SegmentedButton } from 'react-native-paper';

const SegmentedButtonOnlyIcons = () => {
  const [value, setValue] = React.useState('');

  return (
    <List.Section title={`Segmented Button - only icons`}>
      <SegmentedButton.Group
        onValueChange={(value) => {
          typeof value === 'string' && setValue(value);
        }}
        style={styles.group}
        value={value}
      >
        <SegmentedButton icon="walk" value="walk" />
        <SegmentedButton icon="train" value="transit" />
        <SegmentedButton icon="car" value="drive" />
      </SegmentedButton.Group>
    </List.Section>
  );
};

const styles = StyleSheet.create({
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentedButtonOnlyIcons;
