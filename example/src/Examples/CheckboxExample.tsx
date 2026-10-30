import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Checkbox, Text, useTheme } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

type Status = 'unchecked' | 'checked' | 'indeterminate';

const STATUSES: Status[] = ['unchecked', 'checked', 'indeterminate'];

type Row = {
  label: string;
  render: (status: Status, label: string) => React.ReactNode;
};

const ROWS: Row[] = [
  {
    label: 'Default',
    render: (status, label) => (
      <Checkbox status={status} onPress={() => {}} aria-label={label} />
    ),
  },
  {
    label: 'Disabled',
    render: (status, label) => (
      <Checkbox status={status} disabled aria-label={label} />
    ),
  },
  {
    label: 'Custom color (tertiary)',
    render: (status, label) => (
      <CustomColorCheckbox status={status} label={label} />
    ),
  },
  {
    label: 'Error',
    render: (status, label) => (
      <Checkbox status={status} error onPress={() => {}} aria-label={label} />
    ),
  },
];

const CustomColorCheckbox = ({
  status,
  label,
}: {
  status: Status;
  label: string;
}) => {
  const theme = useTheme();
  return (
    <Checkbox
      status={status}
      color={theme.colors.tertiary}
      uncheckedColor={theme.colors.tertiary}
      onPress={() => {}}
      aria-label={label}
    />
  );
};

const Interactive = () => {
  const theme = useTheme();
  const [aChecked, setAChecked] = React.useState(false);
  const [bIndeterminate, setBIndeterminate] = React.useState(false);
  return (
    <View style={styles.interactive}>
      <Text style={[styles.rowLabel, { color: theme.colors.onSurfaceVariant }]}>
        Tap to toggle
      </Text>
      <View style={styles.interactiveRow}>
        <View style={styles.cell}>
          <Checkbox
            status={aChecked ? 'checked' : 'unchecked'}
            onPress={() => setAChecked((v) => !v)}
            aria-label="Unchecked or checked"
          />
        </View>
        <Text
          style={[
            styles.interactiveLabel,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          unchecked ↔ checked
        </Text>
      </View>
      <View style={[styles.interactiveRow, styles.interactiveRowSpacing]}>
        <View style={styles.cell}>
          <Checkbox
            status={bIndeterminate ? 'indeterminate' : 'unchecked'}
            onPress={() => setBIndeterminate((v) => !v)}
            aria-label="Unchecked or indeterminate"
          />
        </View>
        <Text
          style={[
            styles.interactiveLabel,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          unchecked ↔ indeterminate
        </Text>
      </View>
    </View>
  );
};

const IndeterminateParent = () => {
  const theme = useTheme();
  const [child1, setChild1] = React.useState(true);
  const [child2, setChild2] = React.useState(false);
  const [child3, setChild3] = React.useState(true);
  const allChecked = child1 && child2 && child3;
  const noneChecked = !child1 && !child2 && !child3;
  const parentStatus: Status = allChecked
    ? 'checked'
    : noneChecked
      ? 'unchecked'
      : 'indeterminate';
  const toggleAll = () => {
    const next = !allChecked;
    setChild1(next);
    setChild2(next);
    setChild3(next);
  };
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.colors.onSurfaceVariant }]}>
        Parent / children (indeterminate)
      </Text>
      <View style={styles.parentRow}>
        <Checkbox
          status={parentStatus}
          onPress={toggleAll}
          aria-label="Select all"
        />
        <Text
          style={[styles.interactiveLabel, { color: theme.colors.onSurface }]}
        >
          Select all
        </Text>
      </View>
      <View style={styles.childRow}>
        <Checkbox
          status={child1 ? 'checked' : 'unchecked'}
          onPress={() => setChild1((v) => !v)}
          aria-label="Apples"
        />
        <Text
          style={[styles.interactiveLabel, { color: theme.colors.onSurface }]}
        >
          Apples
        </Text>
      </View>
      <View style={styles.childRow}>
        <Checkbox
          status={child2 ? 'checked' : 'unchecked'}
          onPress={() => setChild2((v) => !v)}
          aria-label="Bananas"
        />
        <Text
          style={[styles.interactiveLabel, { color: theme.colors.onSurface }]}
        >
          Bananas
        </Text>
      </View>
      <View style={styles.childRow}>
        <Checkbox
          status={child3 ? 'checked' : 'unchecked'}
          onPress={() => setChild3((v) => !v)}
          aria-label="Cherries"
        />
        <Text
          style={[styles.interactiveLabel, { color: theme.colors.onSurface }]}
        >
          Cherries
        </Text>
      </View>
    </View>
  );
};

const CheckboxExample = () => {
  const theme = useTheme();
  return (
    <ScreenWrapper contentContainerStyle={styles.scrollContent}>
      <Interactive />
      {ROWS.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text
            style={[styles.rowLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            {row.label}
          </Text>
          <View style={styles.cells}>
            {STATUSES.map((status) => (
              <View key={status} style={styles.cell}>
                {row.render(status, row.label)}
              </View>
            ))}
          </View>
        </View>
      ))}
      <IndeterminateParent />
    </ScreenWrapper>
  );
};

CheckboxExample.title = 'Checkbox';

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },
  row: { marginBottom: 20 },
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    opacity: 0.7,
  },
  cells: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    width: 60,
    alignItems: 'center',
  },
  interactive: { marginBottom: 24 },
  interactiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  interactiveRowSpacing: { marginTop: 8 },
  interactiveLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  parentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 32,
  },
});

export default CheckboxExample;
