import * as React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import {
  NavigationBar,
  SegmentedButtons,
  Switch,
  Text,
} from 'react-native-paper';

type VariantMode = 'auto' | 'stacked' | 'horizontal';

// The flexible navigation bar switches to a horizontal item arrangement in
// medium-width windows. M3 recommends ~600dp as the breakpoint, but the
// component leaves the decision to the consumer — here it is driven by
// `useWindowDimensions`.
const MEDIUM_WINDOW_WIDTH = 600;

const routes = [
  { key: 'album', title: 'Album', focusedIcon: 'image-album', badge: 3 },
  { key: 'library', title: 'Library', focusedIcon: 'bookshelf' },
  {
    key: 'favorites',
    title: 'Favorites',
    focusedIcon: 'heart',
    unfocusedIcon: 'heart-outline',
  },
  {
    key: 'settings',
    title: 'Settings',
    focusedIcon: 'cog',
    unfocusedIcon: 'cog-outline',
  },
];

const NavigationBarExample = () => {
  const [index, setIndex] = React.useState(0);
  const [labeled, setLabeled] = React.useState(true);
  const [variantMode, setVariantMode] = React.useState<VariantMode>('auto');

  const { width } = useWindowDimensions();
  const autoVariant = width >= MEDIUM_WINDOW_WIDTH ? 'horizontal' : 'stacked';
  const variant = variantMode === 'auto' ? autoVariant : variantMode;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineSmall">{routes[index].title}</Text>

        <View style={styles.controls}>
          <View style={styles.row}>
            <Text variant="labelLarge">Show labels</Text>
            <Switch value={labeled} onValueChange={setLabeled} />
          </View>

          <SegmentedButtons
            value={variantMode}
            onValueChange={(value) => setVariantMode(value as VariantMode)}
            buttons={[
              { value: 'auto', label: `Auto (${autoVariant})` },
              { value: 'stacked', label: 'Stacked' },
              { value: 'horizontal', label: 'Horizontal' },
            ]}
          />
        </View>
      </View>

      <NavigationBar
        navigationState={{ index, routes }}
        labeled={labeled}
        variant={variant}
        onTabPress={({ route }) => {
          const nextIndex = routes.findIndex((r) => r.key === route.key);
          if (nextIndex !== -1) {
            setIndex(nextIndex);
          }
        }}
      />
    </View>
  );
};

NavigationBarExample.title = 'Navigation Bar (flexible)';

export default NavigationBarExample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  controls: {
    marginTop: 32,
    width: '100%',
    maxWidth: 480,
    gap: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
