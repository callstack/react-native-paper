import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { useNavigation, usePreventRemove } from '@react-navigation/native';
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Badge,
  BottomNavigation,
  FAB,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import type { BottomNavigationRoute, Theme } from 'react-native-paper';

import type { SampleConfig } from './types';
import PreferencesAction from '../Preferences/PreferencesAction';
import ScreenWrapper from '../ScreenWrapper';

export const WorkspaceSampleConfig: SampleConfig = {
  title: 'Workspace',
  icon: 'view-dashboard-outline',
  headerShown: false,
  components: [
    'ActivityIndicator',
    'Appbar',
    'Avatar',
    'Badge',
    'BottomNavigation',
    'FAB',
    'IconButton',
    'Text',
    'TouchableRipple',
  ],
};

type Message = {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  time: string;
  unread: boolean;
  starred: boolean;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'Ken Thompson',
    subject: 'Release 2.4 is out',
    snippet: 'Changelog and migration notes are attached to the post.',
    time: '09:41',
    unread: true,
    starred: false,
  },
  {
    id: '2',
    sender: 'Calendar',
    subject: 'Design review moved to 14:00',
    snippet: 'The meeting room changed too. See the updated invite.',
    time: '08:15',
    unread: true,
    starred: true,
  },
  {
    id: '3',
    sender: 'Frances Allen',
    subject: 'Compiler benchmarks',
    snippet: 'The new pass is 12% faster on the large fixture set.',
    time: '07:02',
    unread: true,
    starred: false,
  },
  {
    id: '4',
    sender: 'Release Bot',
    subject: 'Nightly build succeeded',
    snippet: 'All 1,224 tests passed on iOS, Android and web.',
    time: 'Yesterday',
    unread: true,
    starred: false,
  },
  {
    id: '5',
    sender: 'Dennis Ritchie',
    subject: 'Re: naming things',
    snippet: 'Short names are fine as long as the scope is small.',
    time: 'Mon',
    unread: false,
    starred: false,
  },
  {
    id: '6',
    sender: 'Edsger Dijkstra',
    subject: 'Re: shortest path to the office',
    snippet: 'Take the second left, it saves you four minutes.',
    time: 'Sun',
    unread: false,
    starred: true,
  },
];

const INCOMING_MESSAGES: Omit<Message, 'id' | 'unread' | 'starred'>[] = [
  {
    sender: 'Margaret Hamilton',
    subject: 'Launch checklist v2',
    snippet: 'Added the abort scenarios we discussed on Friday.',
    time: 'Now',
  },
  {
    sender: 'Donald Knuth',
    subject: 'Chapter 7 is ready for review',
    snippet: 'Please send corrections before the end of the month.',
    time: 'Now',
  },
];

const SYNC_DURATION = 1500;

const TEAM = ['Ken Thompson', 'Frances Allen', 'Dennis Ritchie'];

const getAvatarColors = (sender: string, colors: Theme['colors']) => {
  const palette = [
    [colors.primary, colors.onPrimary],
    [colors.primaryContainer, colors.onPrimaryContainer],
    [colors.secondary, colors.onSecondary],
    [colors.secondaryContainer, colors.onSecondaryContainer],
    [colors.tertiary, colors.onTertiary],
    [colors.tertiaryContainer, colors.onTertiaryContainer],
  ];
  const hash = [...sender].reduce(
    (sum, char) => (sum * 31 + char.charCodeAt(0)) % 997,
    7
  );

  return palette[hash % palette.length];
};

type MessageRowProps = {
  message: Message;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onToggleStar: () => void;
};

const MessageRow = ({
  message,
  selected,
  onPress,
  onLongPress,
  onToggleStar,
}: MessageRowProps) => {
  const { colors } = useTheme();
  const [avatarBackground, avatarColor] = getAvatarColors(
    message.sender,
    colors
  );
  const emphasis = message.unread
    ? [styles.unread, { color: colors.onSurface }]
    : { color: colors.onSurfaceVariant };

  return (
    <TouchableRipple
      onPress={onPress}
      onLongPress={onLongPress}
      aria-selected={selected}
      style={[
        styles.row,
        selected && { backgroundColor: colors.secondaryContainer },
      ]}
    >
      <View style={styles.rowContent}>
        {selected ? (
          <Avatar.Icon size={40} icon="check" />
        ) : (
          <Avatar.Text
            size={40}
            label={message.sender[0]}
            backgroundColor={avatarBackground}
            labelStyle={{ color: avatarColor }}
          />
        )}
        <View style={styles.message}>
          <View style={styles.line}>
            <Text
              variant="bodyLarge"
              numberOfLines={1}
              style={[styles.grow, emphasis]}
            >
              {message.sender}
            </Text>
            <Text
              variant="labelSmall"
              style={
                message.unread
                  ? [styles.unread, { color: colors.primary }]
                  : { color: colors.onSurfaceVariant }
              }
            >
              {message.time}
            </Text>
            {message.unread ? (
              <Badge
                style={[styles.unreadDot, { backgroundColor: colors.primary }]}
              />
            ) : null}
          </View>
          <View style={styles.line}>
            <View style={styles.grow}>
              <Text variant="bodyMedium" numberOfLines={1} style={emphasis}>
                {message.subject}
              </Text>
              <Text
                variant="bodyMedium"
                numberOfLines={1}
                style={{ color: colors.onSurfaceVariant }}
              >
                {message.snippet}
              </Text>
            </View>
            <IconButton
              icon={message.starred ? 'star' : 'star-outline'}
              selected={message.starred}
              size={20}
              aria-label={message.starred ? 'Unstar' : 'Star'}
              onPress={onToggleStar}
              style={styles.star}
            />
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

type InboxProps = {
  messages: Message[];
  selectedIds: string[];
  onOpen: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onToggleStar: (id: string) => void;
};

const Inbox = ({
  messages,
  selectedIds,
  onOpen,
  onToggleSelection,
  onToggleStar,
}: InboxProps) => {
  const { colors } = useTheme();
  const [composeExpanded, setComposeExpanded] = React.useState(true);
  const lastOffset = React.useRef(0);
  const selectionMode = selectedIds.length > 0;

  const handleScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = nativeEvent.contentOffset.y;
    setComposeExpanded(offset <= 0 || offset < lastOffset.current);
    lastOffset.current = offset;
  };

  return (
    <View style={styles.screen}>
      <ScreenWrapper
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.inbox}
      >
        {messages.length === 0 ? (
          <Text
            variant="bodyLarge"
            style={[styles.empty, { color: colors.onSurfaceVariant }]}
          >
            All caught up
          </Text>
        ) : (
          messages.map((message) => (
            <MessageRow
              key={message.id}
              message={message}
              selected={selectedIds.includes(message.id)}
              onPress={() =>
                selectionMode
                  ? onToggleSelection(message.id)
                  : onOpen(message.id)
              }
              onLongPress={() => onToggleSelection(message.id)}
              onToggleStar={() => onToggleStar(message.id)}
            />
          ))
        )}
      </ScreenWrapper>
      <View pointerEvents="box-none" style={styles.fabContainer}>
        <FAB.Extended
          icon="pencil-outline"
          label="Compose"
          expanded={composeExpanded}
          visible={!selectionMode}
          onPress={() => {}}
        />
      </View>
    </View>
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

const WorkspaceSample = () => {
  const navigation = useNavigation('WorkspaceSample');
  const [index, setIndex] = React.useState(0);
  const [messages, setMessages] = React.useState(INITIAL_MESSAGES);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [syncing, setSyncing] = React.useState(false);
  const syncCount = React.useRef(0);
  const syncTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const selectionMode = selectedIds.length > 0;
  const unreadCount = messages.filter((message) => message.unread).length;

  const clearSelection = () => setSelectedIds([]);

  usePreventRemove(selectionMode, clearSelection);

  React.useEffect(() => () => clearTimeout(syncTimeout.current), []);

  const toggleSelection = (id: string) =>
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
    );

  const updateMessages = (ids: string[], changes: Partial<Message>) =>
    setMessages((items) =>
      items.map((message) =>
        ids.includes(message.id) ? { ...message, ...changes } : message
      )
    );

  const toggleStar = (id: string) =>
    setMessages((items) =>
      items.map((message) =>
        message.id === id ? { ...message, starred: !message.starred } : message
      )
    );

  const archiveSelected = () => {
    setMessages((items) =>
      items.filter((message) => !selectedIds.includes(message.id))
    );
    clearSelection();
  };

  const markSelectedAsRead = () => {
    updateMessages(selectedIds, { unread: false });
    clearSelection();
  };

  const sync = () => {
    setSyncing(true);
    syncTimeout.current = setTimeout(() => {
      const incoming =
        INCOMING_MESSAGES[syncCount.current % INCOMING_MESSAGES.length];
      syncCount.current += 1;
      setMessages((items) => [
        {
          ...incoming,
          id: `incoming-${syncCount.current}`,
          unread: true,
          starred: false,
        },
        ...items,
      ]);
      setSyncing(false);
    }, SYNC_DURATION);
  };

  const handleIndexChange = (newIndex: number) => {
    clearSelection();
    setIndex(newIndex);
  };

  const routes: BottomNavigationRoute[] = [
    {
      key: 'inbox',
      title: 'Inbox',
      focusedIcon: 'inbox',
      unfocusedIcon: 'inbox-outline',
      badge: unreadCount > 0 ? unreadCount : false,
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

  const renderScene = ({ route }: { route: BottomNavigationRoute }) => {
    switch (route.key) {
      case 'inbox':
        return (
          <Inbox
            messages={messages}
            selectedIds={selectedIds}
            onOpen={(id) => updateMessages([id], { unread: false })}
            onToggleSelection={toggleSelection}
            onToggleStar={toggleStar}
          />
        );
      case 'tasks':
        return <TasksRoute />;
      case 'team':
        return <TeamRoute />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.screen}>
      {selectionMode ? (
        <Appbar.Header>
          <Appbar.Action
            isLeading
            icon="close"
            aria-label="Clear selection"
            onPress={clearSelection}
          />
          <Appbar.Content title={`${selectedIds.length} selected`} />
          <Appbar.Action
            icon="email-open-outline"
            aria-label="Mark as read"
            onPress={markSelectedAsRead}
          />
          <Appbar.Action
            icon="archive-outline"
            aria-label="Archive"
            onPress={archiveSelected}
          />
        </Appbar.Header>
      ) : (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Workspace" />
          {syncing ? (
            <ActivityIndicator
              style={styles.syncIndicator}
              aria-label="Syncing"
            />
          ) : (
            <Appbar.Action icon="sync" aria-label="Sync" onPress={sync} />
          )}
          <Appbar.Action
            aria-label="Search"
            icon="magnify"
            onPress={() => {}}
          />
          <PreferencesAction />
        </Appbar.Header>
      )}
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={handleIndexChange}
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
  inbox: {
    paddingTop: 8,
    paddingBottom: 96,
  },
  empty: {
    padding: 16,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rowContent: {
    flexDirection: 'row',
    gap: 16,
  },
  message: {
    flex: 1,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  grow: {
    flex: 1,
  },
  unread: {
    fontWeight: '700',
  },
  unreadDot: {
    alignSelf: 'center',
  },
  star: {
    marginEnd: -8,
  },
  fabContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    alignItems: 'flex-end',
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  syncIndicator: {
    marginHorizontal: 12,
  },
});

export default WorkspaceSample;
