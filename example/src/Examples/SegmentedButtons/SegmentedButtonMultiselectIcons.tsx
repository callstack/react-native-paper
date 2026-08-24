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
            'aria-label': 'Small',
          },
          {
            value: 'size-m',
            icon: 'size-m',
            'aria-label': 'Medium',
          },
          {
            value: 'size-l',
            icon: 'size-l',
            'aria-label': 'Large',
          },
          {
            value: 'size-xl',
            icon: 'size-xl',
            'aria-label': 'Extra large',
          },
          {
            value: 'size-xxl',
            icon: 'size-xxl',
            'aria-label': 'Extra extra large',
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
