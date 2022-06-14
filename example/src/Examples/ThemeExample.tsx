import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Provider as PaperProvider } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const Content = () => {
  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <Text style={styles.paragraph}>
        React Native Paper automatically adapts theme based on system
        preferences
      </Text>
      <Text style={styles.paragraph}>
        Please change system theme to dark/light to see the effect
      </Text>
    </ScreenWrapper>
  );
};

const ThemeExample = () => {
  return (
    <PaperProvider>
      <Content />
    </PaperProvider>
  );
};
ThemeExample.title = 'Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  paragraph: {
    textAlign: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
  },
});
export default ThemeExample;
