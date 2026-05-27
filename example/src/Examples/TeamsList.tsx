import * as React from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';

import { teamsList } from '../../utils';
import ScreenWrapper from '../ScreenWrapper';

const TeamsList = () => {
  const navigation = useNavigation('TeamsList');

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={styles.first}>Team</DataTable.Title>
          <DataTable.Title numeric>MP</DataTable.Title>
          <DataTable.Title numeric>G</DataTable.Title>
          <DataTable.Title numeric>PTS</DataTable.Title>
        </DataTable.Header>

        {teamsList.map((item) => (
          <DataTable.Row
            key={item.key}
            onPress={() =>
              navigation.navigate('TeamDetails', {
                sourceColor: item.name.split(' ')[1].toLowerCase(),
                headerTitle: item.name,
                darkMode: item.darkMode ?? false,
              })
            }
          >
            <DataTable.Cell style={styles.first}>{item.name}</DataTable.Cell>
            <DataTable.Cell numeric>{item.matchesPlayed}</DataTable.Cell>
            <DataTable.Cell numeric>{item.goals}</DataTable.Cell>
            <DataTable.Cell numeric>{item.points}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 8,
  },
  first: {
    flex: 2,
  },
});

TeamsList.title = 'Teams';

export default TeamsList;
