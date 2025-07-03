import * as React from 'react';
import { StyleSheet } from 'react-native';

import { List, SegmentedButtons } from 'react-native-paper';

type Size = 'size-s' | 'size-m' | 'size-l' | 'size-xl' | 'size-xxl';

const SegmentedButtonMultiselectIcons = () => {
  const [value, setValue] = React.useState<Size[]>([]);

  return (
    <List.Section title={`Segmented Button - multiselect only icons`}>
      <SegmentedButtons
        multiSelect
        onValueChange={setValue}
        value={value}
        style={styles.group}
        buttons={[
          {
            value: 'size-s',
            icon: 'size-s',
          },
          {
            value: 'size-m',
            icon: 'size-m',
          },
          {
            value: 'size-l',
            icon: 'size-l',
          },
          {
            value: 'size-xl',
            icon: 'size-xl',
          },
          {
            value: 'size-xxl',
            icon: 'size-xxl',
          },
        ]}
      />
    </List.Section>
  );
};

const styles = StyleSheet.create({
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentedButtonMultiselectIcons;
