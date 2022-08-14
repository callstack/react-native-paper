import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, SegmentedButton } from 'react-native-paper';

const SegmentedButtonMultiselectIcons = () => {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <List.Section title={`Segmented Button - multiselect only icons`}>
      <SegmentedButton.Group
        multiSelect
        onValueChange={(value) => {
          if (Array.isArray(value)) {
            setValue(value);
          }
        }}
        value={value}
        style={styles.group}
      >
        <SegmentedButton value="size-s" icon="size-s" />
        <SegmentedButton value="size-m" icon="size-m" />
        <SegmentedButton value="size-l" icon="size-l" />
        <SegmentedButton value="size-xl" icon="size-xl" />
        <SegmentedButton value="size-xxl" icon="size-xxl" />
      </SegmentedButton.Group>
    </List.Section>
  );
};

const styles = StyleSheet.create({
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentedButtonMultiselectIcons;
