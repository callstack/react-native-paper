import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  Appbar,
  Avatar,
  BottomNavigation,
  Drawer,
  Text,
} from 'react-native-paper';
import type { BottomNavigationRoute } from 'react-native-paper';

import type { SampleConfig } from './types';
import ScreenWrapper from '../ScreenWrapper';

export const WorkspaceSampleConfig: SampleConfig = {
  title: 'Workspace',
  icon: 'view-dashboard-outline',
  headerShown: false,
  components: ['Appbar', 'Avatar', 'BottomNavigation', 'Drawer', 'Text'],
};

const FOLDERS = [
  { key: 'primary', label: 'Primary', icon: 'inbox' },
  { key: 'starred', label: 'Starred', icon: 'star-outline' },
  { key: 'archive', label: 'Archive', icon: 'archive-outline' },
];

const TEAM = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing'];

const InboxRoute = () => {
  const [folder, setFolder] = React.useState('primary');

  return (
    <ScreenWrapper>
      <Drawer.Section title="Folders">
        {FOLDERS.map((item) => (
          <Drawer.Item
            key={item.key}
            label={item.label}
            icon={item.icon}
            active={folder === item.key}
            onPress={() => setFolder(item.key)}
          />
        ))}
      </Drawer.Section>
    </ScreenWrapper>
  );
};

const TasksRoute = () => (
  <ScreenWrapper contentContainerStyle={styles.content}>
    <Text variant="titleMedium">Today</Text>
    <Text variant="bodyMedium">Review the release checklist</Text>
    <Text variant="bodyMedium">Prepare the design handoff</Text>
  </ScreenWrapper>
);

const TeamRoute = () => (
  <ScreenWrapper contentContainerStyle={styles.content}>
    {TEAM.map((member) => (
      <View key={member} style={styles.member}>
        <Avatar.Image
          size={40}
          source={require('../../assets/images/avatar.png')}
        />
        <Text variant="bodyLarge">{member}</Text>
      </View>
    ))}
  </ScreenWrapper>
);

const renderScene = BottomNavigation.SceneMap({
  inbox: InboxRoute,
  tasks: TasksRoute,
  team: TeamRoute,
});

const routes: BottomNavigationRoute[] = [
  {
    key: 'inbox',
    title: 'Inbox',
    focusedIcon: 'inbox',
    unfocusedIcon: 'inbox-outline',
    badge: 4,
  },
  {
    key: 'tasks',
    title: 'Tasks',
    focusedIcon: 'check-circle',
    unfocusedIcon: 'check-circle-outline',
  },
  {
    key: 'team',
    title: 'Team',
    focusedIcon: 'account-group',
    unfocusedIcon: 'account-group-outline',
  },
];

const WorkspaceSample = () => {
  const navigation = useNavigation('WorkspaceSample');
  const [index, setIndex] = React.useState(0);

  return (
    <View style={styles.screen}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Workspace" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});

export default WorkspaceSample;
