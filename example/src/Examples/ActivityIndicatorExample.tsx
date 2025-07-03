import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  ActivityIndicator,
  FAB,
  List,
  MD2Colors,
  MD3Colors,
} from 'react-native-paper';

import { useExampleTheme } from '../hooks/useExampleTheme';
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

      <List.Section title="Default">
        <ActivityIndicator animating={animating} hidesWhenStopped={false} />
      </List.Section>

      <List.Section title="Large">
        <ActivityIndicator
          animating={animating}
          size="large"
          hidesWhenStopped={false}
        />
      </List.Section>

      <List.Section title="Custom size">
        <ActivityIndicator
          animating={animating}
          size={100}
          hidesWhenStopped={false}
        />
      </List.Section>

      <List.Section title="Custom color">
        <ActivityIndicator
          animating={animating}
          color={isV3 ? MD3Colors.error20 : MD2Colors.red500}
          hidesWhenStopped={false}
        />
      </List.Section>
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
