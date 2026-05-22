import * as React from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  Chip,
  Divider,
  ExtendedFloatingActionButton,
  FloatingActionButton,
  FloatingActionButtonMenu,
  FloatingActionButtonSize,
  FloatingActionButtonVariant,
  List,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FabType = 'icon' | 'extended' | 'extendedTransforming' | 'menu';
type FabPosition = 'start' | 'center' | 'end';

// Pixels of scroll change required to flip the transforming FAB. Avoids
// flicker from sub-pixel scroll jitter at the top of the list.
const SCROLL_DELTA_THRESHOLD = 4;

const justifyContentByPosition = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
} as const satisfies Record<FabPosition, 'flex-start' | 'center' | 'flex-end'>;

const variants: FloatingActionButtonVariant[] = [
  'primary',
  'secondary',
  'tertiary',
  'tonalPrimary',
  'tonalSecondary',
  'tonalTertiary',
];

const sizes: FloatingActionButtonSize[] = ['default', 'medium', 'large'];

const types: FabType[] = ['icon', 'extended', 'extendedTransforming', 'menu'];

const positions: FabPosition[] = ['start', 'center', 'end'];

const rows = Array.from({ length: 40 }, (_, i) => ({
  id: String(i + 1),
  text: `Item ${i + 1}`,
}));

type ChipRowProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

const ChipRow = <T extends string>({
  label,
  options,
  value,
  onChange,
}: ChipRowProps<T>) => (
  <View style={styles.chipRow}>
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
          onPress={() => onChange(option)}
        >
          {option}
        </Chip>
      ))}
    </ScrollView>
  </View>
);

const FABExample = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [variant, setVariant] =
    React.useState<FloatingActionButtonVariant>('tonalPrimary');
  const [size, setSize] = React.useState<FloatingActionButtonSize>('medium');
  const [type, setType] = React.useState<FabType>('icon');
  const [position, setPosition] = React.useState<FabPosition>('end');
  const [showFab, setShowFab] = React.useState<boolean>(true);
  const [transformingExpanded, setTransformingExpanded] = React.useState(true);
  const [menuExpanded, setMenuExpanded] = React.useState(false);
  const lastScrollY = React.useRef(0);

  const fabPadding = 16;

  const renderItem = React.useCallback(
    ({ item }: { item: (typeof rows)[number] }) => (
      <View style={styles.listItem}>
        <Text variant="bodyLarge">{item.text}</Text>
      </View>
    ),
    []
  );

  const onScroll = React.useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = nativeEvent.contentOffset.y;
      const delta = y - lastScrollY.current;
      if (Math.abs(delta) < SCROLL_DELTA_THRESHOLD) {
        return;
      }
      lastScrollY.current = y;
      if (y <= 0) {
        setTransformingExpanded(true);
      } else if (delta > 0) {
        setTransformingExpanded(false);
      } else {
        setTransformingExpanded(true);
      }
    },
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.controls}>
        <ChipRow
          label="Color"
          options={variants}
          value={variant}
          onChange={setVariant}
        />
        <ChipRow label="Size" options={sizes} value={size} onChange={setSize} />
        <ChipRow label="Type" options={types} value={type} onChange={setType} />
        <ChipRow
          label="Position"
          options={positions}
          value={position}
          onChange={setPosition}
        />
        <List.Item
          title="Show FAB"
          right={() => (
            <View pointerEvents="none">
              <Switch value={showFab} />
            </View>
          )}
          onPress={() => setShowFab((v) => !v)}
        />
        <Divider bold style={{ backgroundColor: colors.outline }} />
      </View>
      <FlatList
        data={rows}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + fabPadding + 96 },
        ]}
        onScroll={type === 'extendedTransforming' ? onScroll : undefined}
        scrollEventThrottle={16}
      />
      <View
        pointerEvents="box-none"
        style={[
          styles.fabContainer,
          {
            bottom: insets.bottom + fabPadding,
            left: insets.left + fabPadding,
            right: insets.right + fabPadding,
            justifyContent: justifyContentByPosition[position],
          },
        ]}
      >
        {type === 'icon' && (
          <FloatingActionButton
            icon="pencil"
            variant={variant}
            size={size}
            visible={showFab}
            onPress={() => {}}
          />
        )}
        {(type === 'extended' || type === 'extendedTransforming') && (
          <ExtendedFloatingActionButton
            icon="pencil"
            label="Compose"
            variant={variant}
            size={size}
            expanded={type === 'extended' ? true : transformingExpanded}
            visible={showFab}
            onPress={() => {}}
          />
        )}
      </View>
      {type === 'menu' ? (
        <FloatingActionButtonMenu
          expanded={menuExpanded}
          onDismiss={() => setMenuExpanded(false)}
          horizontalAlignment={position}
          button={
            <FloatingActionButton
              icon="pencil"
              variant={variant}
              size={size}
              visible={showFab}
              onPress={() => setMenuExpanded(true)}
            />
          }
        >
          <FloatingActionButtonMenu.Item
            icon="email"
            label="Send"
            onPress={() => {}}
          />
          <FloatingActionButtonMenu.Item
            icon="bell"
            label="Remind me"
            onPress={() => {}}
          />
          <FloatingActionButtonMenu.Item
            icon="star"
            label="Favorite"
            onPress={() => {}}
          />
        </FloatingActionButtonMenu>
      ) : null}
    </View>
  );
};

FABExample.title = 'Floating Action Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    paddingTop: 8,
    paddingBottom: 8,
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
  listContent: {
    paddingHorizontal: 16,
  },
  listItem: {
    paddingVertical: 12,
  },
  fabContainer: {
    position: 'absolute',
    flexDirection: 'row',
  },
});

export default FABExample;
