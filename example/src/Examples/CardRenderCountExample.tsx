import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Button, Card, Text } from 'react-native-paper';

const benchmarkItems = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  title: `List item ${String(index + 1).padStart(2, '0')}`,
}));

type BenchmarkItem = (typeof benchmarkItems)[number];

const handleCardPress = () => {};

const StableCardContent = React.memo(({ item }: { item: BenchmarkItem }) => {
  const renderCount = React.useRef(0);
  renderCount.current += 1;

  return (
    <Card.Content>
      <Text variant="bodyMedium">Referentially stable slot content</Text>
      <Text
        testID={`card-benchmark-render-count-${item.id}`}
        variant="labelMedium"
      >
        {`Stable content renders: ${renderCount.current}`}
      </Text>
    </Card.Content>
  );
});

StableCardContent.displayName = 'StableCardContent';

const BenchmarkCard = ({ item }: { item: BenchmarkItem }) => (
  <Card
    style={styles.card}
    testID={`card-benchmark-item-${item.id}`}
    accessibilityLabel={`${item.title}, render-boundary benchmark`}
    onPress={handleCardPress}
    title={item.title}
    content={<StableCardContent item={item} />}
  />
);

const CardRenderCountExample = () => {
  const [listRevision, setListRevision] = React.useState(0);
  const parentRenderCount = React.useRef(0);
  parentRenderCount.current += 1;

  const renderItem = React.useCallback(
    ({ item }: { item: BenchmarkItem }) => <BenchmarkCard item={item} />,
    []
  );

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Large-list render boundary</Text>
      <Text variant="bodyMedium">
        Interact with a Card using touch, hover, or keyboard focus. Its stable
        content counter should remain at 1.
      </Text>
      <View style={styles.metrics}>
        <Text
          testID="card-benchmark-parent-count"
          variant="labelLarge"
        >{`Parent render passes: ${parentRenderCount.current}`}</Text>
        <Button
          testID="card-benchmark-rerender"
          mode="outlined"
          onPress={() => setListRevision((revision) => revision + 1)}
        >
          Rerender parent
        </Button>
      </View>
      <FlatList
        horizontal
        data={benchmarkItems}
        extraData={listRevision}
        initialNumToRender={8}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsHorizontalScrollIndicator
        contentContainerStyle={styles.list}
      />
      <Text variant="bodySmall">
        30 actionable Cards · counters are recorded by memoized content
        subtrees, not by the Card shell.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  metrics: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  list: {
    gap: 12,
    padding: 4,
  },
  card: {
    marginVertical: 4,
    width: 240,
  },
});

export default CardRenderCountExample;
