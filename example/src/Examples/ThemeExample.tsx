import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';
import { List, PaperProvider, Banner } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

type Props = {
  navigation: StackNavigationProp<{ [key: string]: undefined }>;
};

const ThemeExample = ({ navigation }: Props) => {
  return (
    <PaperProvider>
      <ScreenWrapper contentContainerStyle={styles.container}>
        <Banner visible>
          React Native Paper automatically adapts theme based on system
          preferences. Please change system theme to dark/light to see the
          effect
        </Banner>
        <List.Section title={`Theme based on the source color`}>
          <List.Item
            title="Themed Sport App"
            description="Go to the example"
            onPress={() => navigation.navigate('teamsList')}
            right={(props) => <List.Icon {...props} icon="arrow-right" />}
          />
        </List.Section>
      </ScreenWrapper>
    </PaperProvider>
  );
};
ThemeExample.title = 'Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ThemeExample;
