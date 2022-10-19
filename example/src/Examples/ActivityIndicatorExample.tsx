import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  ActivityIndicator,
  FAB,
  MD2Colors,
  MD3Colors,
} from 'react-native-paper';

import { useExampleTheme } from '..';
import ScreenWrapper from '../ScreenWrapper';

const ActivityIndicatorExample = () => {
  const [animating, setAnimating] = React.useState<boolean>(true);
  const { isV3 } = useExampleTheme();

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.row}>
        <FAB
          size="small"
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
        <ActivityIndicator
          animating={animating}
          color={isV3 ? MD3Colors.error20 : MD2Colors.red500}
        />
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
