import * as React from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import {
  Chip,
  Divider,
  IconButton,
  Text,
  Toolbar,
  useTheme,
} from 'react-native-paper';
import type {
  ToolbarColorScheme,
  ToolbarOrientation,
  ToolbarVariant,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const variants: ToolbarVariant[] = ['floating', 'docked'];
const orientations: ToolbarOrientation[] = ['horizontal', 'vertical'];
const colorSchemes: ToolbarColorScheme[] = ['standard', 'vibrant'];

const toolbarItems = [
  { icon: 'format-bold', label: 'Bold' },
  { icon: 'format-italic', label: 'Italic' },
  { icon: 'format-underline', label: 'Underline' },
] as const;

// Dummy list content, purely to give the screen something to scroll behind
// the toolbar.
const rows = Array.from({ length: 40 }, (_, i) => ({
  id: String(i + 1),
  text: `Item ${i + 1}`,
}));

type ChipRowProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  // Controls that don't apply to the current variant stay visible but
  // greyed out and non-interactive, per MD3's disabled-state guidance—
  // hiding them outright would shift the layout and lose the user's place.
  disabled?: boolean;
};

const ChipRow = <T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: ChipRowProps<T>) => (
  <View style={[styles.chipRow, disabled && styles.disabled]}>
    <Text variant="labelLarge" style={styles.chipRowLabel}>
      {label}
    </Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRowContent}
    >
      {options.map((option) => (
        <Chip
          key={option}
          selected={option === value}
          showSelectedOverlay
          disabled={disabled}
          onPress={() => onChange(option)}
        >
          {option}
        </Chip>
      ))}
    </ScrollView>
  </View>
);

const ToolbarExample = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [variant, setVariant] = React.useState<ToolbarVariant>('floating');
  const [orientation, setOrientation] =
    React.useState<ToolbarOrientation>('horizontal');
  const [colorScheme, setColorScheme] =
    React.useState<ToolbarColorScheme>('standard');

  const isFloating = variant === 'floating';
  const isVertical = isFloating && orientation === 'vertical';

  const renderItem = React.useCallback(
    ({ item }: { item: (typeof rows)[number] }) => (
      <View style={styles.listItem}>
        <Text variant="bodyLarge">{item.text}</Text>
      </View>
    ),
    []
  );

  const toolbarChildren = (
    <>
      {toolbarItems.map(({ icon, label }) => (
        <IconButton
          key={label}
          icon={icon}
          aria-label={label}
          onPress={() => {}}
        />
      ))}
    </>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.controls}>
        <ChipRow
          label="Variant"
          options={variants}
          value={variant}
          onChange={setVariant}
        />
        <ChipRow
          label="Orientation"
          options={orientations}
          value={orientation}
          onChange={setOrientation}
          disabled={!isFloating}
        />
        <ChipRow
          label="Color scheme"
          options={colorSchemes}
          value={colorScheme}
          onChange={setColorScheme}
        />
        <Divider
          bold
          style={[styles.divider, { backgroundColor: theme.colors.outline }]}
        />
      </View>
      <FlatList
        style={styles.list}
        data={rows}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          !isFloating
            ? { paddingBottom: insets.bottom + 64 }
            : isVertical
              ? { paddingBottom: insets.bottom + 24 }
              : { paddingBottom: insets.bottom + 96 },
        ]}
      />
      {isFloating ? (
        // `floating` doesn't anchor itself (same as `FAB`)—position it with
        // a wrapping `View`, same as the component's own doc example.
        <View
          pointerEvents="box-none"
          style={
            isVertical
              ? [styles.verticalAnchor, { right: insets.right + 16 }]
              : [styles.horizontalAnchor, { bottom: insets.bottom + 24 }]
          }
        >
          <Toolbar
            variant={variant}
            colorScheme={colorScheme}
            orientation={orientation}
          >
            {toolbarChildren}
          </Toolbar>
        </View>
      ) : (
        // `docked` anchors itself, flush to the bottom edge, on its own.
        <Toolbar
          variant={variant}
          colorScheme={colorScheme}
          orientation={orientation}
        >
          {toolbarChildren}
        </Toolbar>
      )}
    </View>
  );
};

ToolbarExample.title = 'Toolbar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalAnchor: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  verticalAnchor: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  controls: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  divider: {
    marginTop: 8,
  },
  chipRow: {
    paddingVertical: 4,
  },
  chipRowLabel: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  chipRowContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  disabled: {
    opacity: 0.38,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  listItem: {
    paddingVertical: 12,
  },
});

export default ToolbarExample;
