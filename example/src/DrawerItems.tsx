import * as React from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  Badge,
  Drawer,
  Switch,
  Text,
  TouchableRipple,
  MD2Colors,
  useTheme,
} from 'react-native-paper';
import * as Updates from 'expo-updates';
import { PreferencesContext } from './';

type Props = {
  toggleTheme: () => void;
  toggleRTL: () => void;
  toggleThemeVersion: () => void;
  toggleCollapsed: () => void;
  collapsed: boolean;
  isRTL: boolean;
  isDarkTheme: boolean;
};

const DrawerItemsData = [
  {
    label: 'Inbox',
    icon: 'inbox',
    key: 0,
    right: () => <Text variant="labelLarge">44</Text>,
  },
  {
    label: 'Starred',
    icon: 'star',
    key: 1,
    right: ({ color }: { color: string }) => (
      <Badge
        visible
        size={8}
        style={[styles.badge, { backgroundColor: color }]}
      />
    ),
  },
  { label: 'Sent mail', icon: 'send', key: 2 },
  { label: 'Colored label', icon: 'palette', key: 3 },
  {
    label: 'A very long title that will be truncated',
    icon: 'delete',
    key: 4,
    right: () => <Badge visible size={8} style={styles.badge} />,
  },
];

const DrawerCollapsedItemsData = [
  {
    label: 'Inbox',
    icon: 'inbox',
    key: 0,
    badge: 44,
  },
  {
    label: 'Starred',
    icon: 'star',
    key: 1,
  },
  { label: 'Sent mail', icon: 'send', key: 2 },
  {
    label: 'A very long title that will be truncated',
    icon: 'delete',
    key: 3,
  },
  { label: 'Full width', icon: 'arrow-all', key: 4 },
  {
    icon: 'bell',
    key: 5,
    badge: true,
  },
];

const DrawerItems = ({
  toggleTheme,
  toggleRTL,
  toggleThemeVersion,
  toggleCollapsed,
  collapsed,
  isRTL,
  isDarkTheme,
}: Props) => {
  const [drawerItemIndex, setDrawerItemIndex] = React.useState<number>(0);
  const preferences = React.useContext(PreferencesContext);

  const _setDrawerItem = (index: number) => setDrawerItemIndex(index);

  const { colors, isV3 } = useTheme();

  const _handleToggleRTL = () => {
    toggleRTL();
    I18nManager.forceRTL(!isRTL);
    Updates.reloadAsync();
  };

  return (
    <DrawerContentScrollView
      alwaysBounceVertical={false}
      style={[
        styles.drawerContent,
        {
          backgroundColor: colors.surface,
        },
      ]}
    >
      {isV3 && collapsed && (
        <Drawer.Section>
          {DrawerCollapsedItemsData.map((props, index) => (
            <Drawer.CollapsedItem
              {...props}
              key={props.key}
              active={drawerItemIndex === index}
              onPress={() => {
                _setDrawerItem(index);
                index === 4 && preferences.toggleCollapsed();
              }}
            />
          ))}
        </Drawer.Section>
      )}
      {!collapsed && (
        <>
          <Drawer.Section title="Example items">
            {DrawerItemsData.map((props, index) => (
              <Drawer.Item
                {...props}
                key={props.key}
                theme={
                  props.key === 3
                    ? { colors: { primary: MD2Colors.tealA200 } }
                    : undefined
                }
                active={drawerItemIndex === index}
                onPress={() => _setDrawerItem(index)}
              />
            ))}
          </Drawer.Section>

          <Drawer.Section title="Preferences">
            <TouchableRipple onPress={toggleTheme}>
              <View style={[styles.preference, isV3 && styles.v3Preference]}>
                <Text variant="labelLarge">Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={isDarkTheme} />
                </View>
              </View>
            </TouchableRipple>

            <TouchableRipple onPress={_handleToggleRTL}>
              <View style={[styles.preference, isV3 && styles.v3Preference]}>
                <Text variant="labelLarge">RTL</Text>
                <View pointerEvents="none">
                  <Switch value={isRTL} />
                </View>
              </View>
            </TouchableRipple>

            <TouchableRipple onPress={toggleThemeVersion}>
              <View style={[styles.preference, isV3 && styles.v3Preference]}>
                <Text variant="labelLarge">Switch back to Material 2</Text>
                <View pointerEvents="none">
                  <Switch value={!isV3} />
                </View>
              </View>
            </TouchableRipple>

            {isV3 && (
              <TouchableRipple onPress={toggleCollapsed}>
                <View style={[styles.preference, isV3 && styles.v3Preference]}>
                  <Text variant="labelLarge">Collapsed drawer</Text>
                  <View pointerEvents="none">
                    <Switch value={collapsed} />
                  </View>
                </View>
              </TouchableRipple>
            )}
          </Drawer.Section>
        </>
      )}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  v3Preference: {
    height: 56,
    paddingHorizontal: 28,
  },
  badge: {
    alignSelf: 'center',
  },
});

export default DrawerItems;
