import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ColorValue } from 'react-native';

import { Badge, Drawer, Text, useTheme } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

// MD3 specifies a 360dp drawer container. The surface below stands in for the
// container that `@react-navigation/drawer` would normally provide, so the
// 336dp active indicator sits at its intended proportions.
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

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <Section title="Destinations — tap to change the active one">
        <Destinations />
      </Section>

      <Section title="Without an icon, and with a truncated label">
        <Drawer.Section showDivider={false}>
          <Drawer.Item label="No icon" />
          <Drawer.Item
            icon="delete"
            label="A very long destination label that will be truncated"
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
          />
          <Drawer.Item
            icon="palette"
            label="Coloured dot"
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
          <Drawer.Item icon="inbox" label="Inbox" />
        </Drawer.Section>
        <Drawer.Section title="Labels" showDivider={false}>
          <Drawer.Item icon="tag" label="Work" />
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
    // MD3: rounded corners on the drawer's ending edge only.
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
