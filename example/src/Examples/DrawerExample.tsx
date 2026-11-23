import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ColorValue } from 'react-native';

import { Badge, Drawer, Text, useTheme } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const DRAWER_WIDTH = 360;

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text
        variant="labelSmall"
        style={[styles.caption, { color: theme.colors.onSurfaceVariant }]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.drawer,
          { backgroundColor: theme.colors.surfaceContainerLow },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const Destinations = () => {
  const [active, setActive] = React.useState('inbox');

  return (
    <Drawer.Section title="Mail" showDivider={false}>
      <Drawer.Item
        icon="inbox"
        label="Inbox"
        active={active === 'inbox'}
        onPress={() => setActive('inbox')}
        right={() => <Text variant="labelLarge">24</Text>}
      />
      <Drawer.Item
        icon="star"
        label="Starred"
        active={active === 'starred'}
        onPress={() => setActive('starred')}
      />
      <Drawer.Item
        icon="send"
        label="Sent"
        active={active === 'sent'}
        onPress={() => setActive('sent')}
      />
    </Drawer.Section>
  );
};

const DrawerExample = () => {
  const [collapsed, setCollapsed] = React.useState('inbox');
  // The destinations in the sections below share one active destination, so
  // each of them can be pressed and focused like a real one.
  const [selected, setSelected] = React.useState<string>();
  const destination = (key: string) => ({
    active: selected === key,
    onPress: () => setSelected(key),
  });

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <Section title="Destinations — tap to change the active one">
        <Destinations />
      </Section>

      <Section title="Without an icon, and with a truncated label">
        <Drawer.Section showDivider={false}>
          <Drawer.Item label="No icon" {...destination('no-icon')} />
          <Drawer.Item
            icon="delete"
            label="A very long destination label that will be truncated"
            {...destination('truncated')}
          />
        </Drawer.Section>
      </Section>

      <Section title="Disabled">
        <Drawer.Section showDivider={false}>
          <Drawer.Item icon="archive" label="Archive" disabled />
          <Drawer.Item
            icon="star"
            label="Active and disabled"
            active
            disabled
            right={() => <Text variant="labelLarge">24</Text>}
          />
        </Drawer.Section>
      </Section>

      <Section title="Trailing slot">
        <Drawer.Section showDivider={false}>
          <Drawer.Item
            icon="alert"
            label="Badge"
            right={() => <Badge visible style={styles.badge} />}
            {...destination('badge')}
          />
          <Drawer.Item
            icon="palette"
            label="Coloured dot"
            {...destination('dot')}
            right={({ color }: { color: ColorValue }) => (
              <Badge
                visible
                style={[styles.badge, { backgroundColor: color }]}
              />
            )}
          />
        </Drawer.Section>
      </Section>

      <Section title="Sections separated by a divider">
        <Drawer.Section title="Mailboxes">
          <Drawer.Item
            icon="inbox"
            label="Inbox"
            {...destination('mailboxes-inbox')}
          />
        </Drawer.Section>
        <Drawer.Section title="Labels" showDivider={false}>
          <Drawer.Item icon="tag" label="Work" {...destination('work')} />
        </Drawer.Section>
      </Section>

      <Section title="Collapsed destinations">
        <View style={styles.collapsed}>
          <Drawer.CollapsedItem
            focusedIcon="inbox"
            unfocusedIcon="inbox-outline"
            label="Inbox"
            badge={24}
            active={collapsed === 'inbox'}
            onPress={() => setCollapsed('inbox')}
          />
          <Drawer.CollapsedItem
            focusedIcon="star"
            unfocusedIcon="star-outline"
            label="Starred"
            active={collapsed === 'starred'}
            onPress={() => setCollapsed('starred')}
          />
          <Drawer.CollapsedItem
            focusedIcon="bell"
            unfocusedIcon="bell-outline"
            badge
            aria-label="Alerts"
            active={collapsed === 'alerts'}
            onPress={() => setCollapsed('alerts')}
          />
          <Drawer.CollapsedItem
            focusedIcon="archive"
            unfocusedIcon="archive-outline"
            label="Disabled"
            disabled
          />
        </View>
      </Section>
    </ScreenWrapper>
  );
};

DrawerExample.title = 'Drawer';

const styles = StyleSheet.create({
  content: {
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  caption: {
    marginBottom: 8,
    marginHorizontal: 16,
  },
  drawer: {
    width: DRAWER_WIDTH,
    maxWidth: '100%',
    alignSelf: 'center',
    paddingVertical: 8,
    borderTopEndRadius: 16,
    borderBottomEndRadius: 16,
  },
  badge: {
    alignSelf: 'center',
  },
  collapsed: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});

export default DrawerExample;
