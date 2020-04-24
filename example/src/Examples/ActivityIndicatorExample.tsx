import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Colors, FAB, useTheme } from 'react-native-paper';

const ActivityIndicatorExample = () => {
  const [animating, setAnimating] = React.useState<boolean>(true);
  const {
    colors: { background },
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.row}>
        <FAB
          small
          icon={animating ? 'pause' : 'play'}
          onPress={() => setAnimating(!animating)}
        />
      </View>

      <View style={styles.row}>
        <ActivityIndicator animating={animating} />
      </View>

      <View style={styles.row}>
        <ActivityIndicator animating={animating} hidesWhenStopped={false} />
      </View>

      <View style={styles.row}>
        <ActivityIndicator animating={animating} size="large" />
      </View>

      <View style={styles.row}>
        <ActivityIndicator animating={animating} color={Colors.red500} />
      </View>
    </View>
  );
};

ActivityIndicatorExample.title = 'Activity Indicator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },

  row: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});

export default ActivityIndicatorExample;
