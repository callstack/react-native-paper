import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ConnectedButtonGroup, List } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const sizes = ['extra-small', 'small', 'medium'] as const;

const ConnectedButtonGroupExample = () => {
  const [transport, setTransport] = React.useState('walk');
  const [align, setAlign] = React.useState('center');
  const [formatting, setFormatting] = React.useState<string[]>(['bold']);
  const [view, setView] = React.useState('week');

  return (
    <ScreenWrapper>
      <List.Section title="Single select">
        <View style={styles.row}>
          <ConnectedButtonGroup
            value={transport}
            onValueChange={setTransport}
            buttons={[
              { value: 'walk', label: 'Walking' },
              { value: 'train', label: 'Transit' },
              { value: 'drive', label: 'Driving' },
            ]}
          />
        </View>
      </List.Section>

      <List.Section title="Icons with selection check">
        <View style={styles.row}>
          <ConnectedButtonGroup
            value={align}
            onValueChange={setAlign}
            buttons={[
              {
                value: 'left',
                icon: 'format-align-left',
                label: 'Left',
                showSelectedCheck: true,
              },
              {
                value: 'center',
                icon: 'format-align-center',
                label: 'Center',
                showSelectedCheck: true,
              },
              {
                value: 'right',
                icon: 'format-align-right',
                label: 'Right',
                showSelectedCheck: true,
              },
            ]}
          />
        </View>
      </List.Section>

      <List.Section title="Multi-select (icon only)">
        <View style={styles.row}>
          <ConnectedButtonGroup
            multiSelect
            value={formatting}
            onValueChange={setFormatting}
            buttons={[
              { value: 'bold', icon: 'format-bold', 'aria-label': 'Bold' },
              {
                value: 'italic',
                icon: 'format-italic',
                'aria-label': 'Italic',
              },
              {
                value: 'underline',
                icon: 'format-underline',
                'aria-label': 'Underline',
              },
            ]}
          />
        </View>
      </List.Section>

      <List.Section title="Sizes">
        {sizes.map((size) => (
          <View style={styles.row} key={size}>
            <ConnectedButtonGroup
              size={size}
              value={view}
              onValueChange={setView}
              buttons={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
              ]}
            />
          </View>
        ))}
      </List.Section>

      <List.Section title="Disabled">
        <View style={styles.row}>
          <ConnectedButtonGroup
            value="week"
            onValueChange={() => {}}
            buttons={[
              { value: 'day', label: 'Day', disabled: true },
              { value: 'week', label: 'Week', disabled: true },
              { value: 'month', label: 'Month', disabled: true },
            ]}
          />
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

ConnectedButtonGroupExample.title = 'Connected Button Group';

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default ConnectedButtonGroupExample;
