import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, SegmentedButton } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const SegmentedButtonExample = () => {
  const [first, setFirst] = React.useState('week');
  const [second, setSecond] = React.useState('');
  const [third, setThird] = React.useState('');
  const [fourth, setFourth] = React.useState('');
  const [fifth, setFifth] = React.useState('');
  const [sixth, setSixth] = React.useState<string[]>([]);
  const [seventh, setSeventh] = React.useState<string[]>([]);
  const [eighth, setEighth] = React.useState<string[]>([]);

  return (
    <ScreenWrapper>
      <List.Section title={`Segmented Button`}>
        <SegmentedButton.Group
          onValueChange={(value) => {
            typeof value === 'string' && setFirst(value);
          }}
          value={first}
          style={styles.group}
        >
          <SegmentedButton
            style={styles.button}
            icon="walk"
            value="walk"
            label="Walking"
          />
          <SegmentedButton
            style={styles.button}
            icon="train"
            label="Transit"
            value="transit"
          />
          <SegmentedButton
            style={styles.button}
            icon="car"
            label="Driving"
            value="drive"
          />
        </SegmentedButton.Group>
      </List.Section>
      <List.Section title={`Segmented Button - show selected check`}>
        <SegmentedButton.Group
          onValueChange={(value) => {
            typeof value === 'string' && setSecond(value);
          }}
          value={second}
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
      <List.Section title={`Segmented Button - only labels + density`}>
        <SegmentedButton.Group
          onValueChange={(value) => {
            typeof value === 'string' && setThird(value);
          }}
          value={third}
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
      <List.Section title={`Segmented Button - only icons`}>
        <SegmentedButton.Group
          onValueChange={(value) => {
            typeof value === 'string' && setFourth(value);
          }}
          style={styles.group}
          value={fourth}
        >
          <SegmentedButton icon="walk" value="walk" />
          <SegmentedButton icon="train" value="transit" />
          <SegmentedButton icon="car" value="drive" />
        </SegmentedButton.Group>
      </List.Section>
      <List.Section title={`Segmented Button - icons + show selected check`}>
        <SegmentedButton.Group
          onValueChange={(value) => {
            typeof value === 'string' && setFifth(value);
          }}
          style={styles.group}
          value={fifth}
        >
          <SegmentedButton icon="walk" showSelectedCheck value="walk" />
          <SegmentedButton icon="train" showSelectedCheck value="transit" />
          <SegmentedButton icon="car" showSelectedCheck value="drive" />
        </SegmentedButton.Group>
      </List.Section>
      <List.Section title={`Segmented Button - multiselect`}>
        <SegmentedButton.Group
          multiselect
          onValueChange={(value) => {
            if (Array.isArray(value)) {
              setSixth(value);
            }
          }}
          value={sixth}
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
      <List.Section title={`Segmented Button - multiselect only icons`}>
        <SegmentedButton.Group
          multiselect
          onValueChange={(value) => {
            if (Array.isArray(value)) {
              setSeventh(value);
            }
          }}
          value={seventh}
          style={styles.group}
        >
          <SegmentedButton value="size-s" icon="size-s" />
          <SegmentedButton value="size-m" icon="size-m" />
          <SegmentedButton value="size-l" icon="size-l" />
          <SegmentedButton value="size-xl" icon="size-xl" />
          <SegmentedButton value="size-xxl" icon="size-xxl" />
        </SegmentedButton.Group>
      </List.Section>
      <List.Section
        title={`Segmented Button - multiselect (disabled)`}
        style={styles.lastSection}
      >
        <SegmentedButton.Group
          multiselect
          onValueChange={(value) => {
            if (Array.isArray(value)) {
              setEighth(value);
            }
          }}
          value={eighth}
          style={styles.group}
        >
          <SegmentedButton style={styles.button} value="walk" label="Walking" />
          <SegmentedButton style={styles.button} label="Disabled" disabled />
          <SegmentedButton
            style={styles.button}
            label="Driving"
            value="drive"
          />
        </SegmentedButton.Group>
      </List.Section>
    </ScreenWrapper>
  );
};

SegmentedButtonExample.title = 'Segmented Button';

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  group: { paddingHorizontal: 20, justifyContent: 'center' },
  lastSection: { paddingBottom: 30 },
});

export default SegmentedButtonExample;
