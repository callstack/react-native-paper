import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import {
  Avatar,
  Badge,
  Divider,
  FAB,
  List,
  Searchbar,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SampleConfig } from './types';
import ScreenWrapper from '../ScreenWrapper';

export const ContactsSampleConfig: SampleConfig = {
  title: 'Contacts',
  icon: 'account-group-outline',
  components: ['Avatar', 'Badge', 'Divider', 'FAB', 'List', 'Searchbar'],
};

const CONTACTS = [
  { id: '1', name: 'Ada Lovelace', role: 'Engineering', unread: 3 },
  { id: '2', name: 'Grace Hopper', role: 'Engineering', unread: 0 },
  { id: '3', name: 'Katherine Johnson', role: 'Research', unread: 12 },
  { id: '4', name: 'Mary Jackson', role: 'Research', unread: 0 },
  { id: '5', name: 'Radia Perlman', role: 'Networking', unread: 1 },
  { id: '6', name: 'Barbara Liskov', role: 'Architecture', unread: 0 },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('');

const ContactsSample = () => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = React.useState('');

  const search = query.trim().toLowerCase();
  const contacts = search
    ? CONTACTS.filter((contact) => contact.name.toLowerCase().includes(search))
    : CONTACTS;

  return (
    <>
      <ScreenWrapper withScrollView={false}>
        <Searchbar
          placeholder="Search contacts"
          value={query}
          onChangeText={setQuery}
          style={styles.searchbar}
        />
        <FlatList
          data={contacts}
          keyExtractor={(contact) => contact.id}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={Divider}
          contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={item.role}
              onPress={() => {}}
              left={({ style }) => (
                <Avatar.Text
                  style={style}
                  size={40}
                  label={getInitials(item.name)}
                />
              )}
              right={({ style }) =>
                item.unread ? (
                  <Badge style={[style, styles.badge]}>{item.unread}</Badge>
                ) : null
              }
            />
          )}
        />
      </ScreenWrapper>

      <FAB.Extended
        icon="account-plus"
        label="New contact"
        expanded
        onPress={() => {}}
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    margin: 16,
  },
  badge: {
    alignSelf: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
  },
});

export default ContactsSample;
