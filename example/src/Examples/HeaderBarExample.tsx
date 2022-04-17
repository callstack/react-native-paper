import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenWrapper from '../ScreenWrapper';
import { HeaderBar, useTheme, Title } from 'react-native-paper';

const HeaderBarExample = () => {
  const { colors } = useTheme();
  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <HeaderBar
        textColor="light-content"
        backgroundColor={colors.notification}
      />
      <View style={styles.container}>
        <Title style={styles.title}>Status bar</Title>
      </View>
    </ScreenWrapper>
  );
};

HeaderBarExample.title = 'HeaderBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    padding: 4,
  },
});

export default HeaderBarExample;
