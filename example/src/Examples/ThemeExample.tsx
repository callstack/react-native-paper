import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { List, PaperProvider, Banner } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const ThemeExample = () => {
  const navigation = useNavigation('Theme');

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
            onPress={() => navigation.navigate('TeamsList')}
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
