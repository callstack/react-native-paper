import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Colors, FAB } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const ActivityIndicatorExample = () => {
  const [animating, setAnimating] = React.useState<boolean>(true);

  return (
    <ScreenWrapper style={styles.container}>
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
    </ScreenWrapper>
  );
};

ActivityIndicatorExample.title = 'Activity Indicator';

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});

export default ActivityIndicatorExample;
