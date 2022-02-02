import * as React from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  Badge,
  Drawer,
  Switch,
  TouchableRipple,
  Text,
  MD2Colors,
  useTheme,
} from 'react-native-paper';
import * as Updates from 'expo-updates';

type Props = {
  toggleTheme: () => void;
  toggleRTL: () => void;
  toggleThemeVersion: () => void;
  isRTL: boolean;
  isDarkTheme: boolean;
};

const DrawerItemsData = [
  {
    label: 'Inbox',
    icon: 'inbox',
    key: 0,
    right: () => <Text>24</Text>,
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
    right: ({ color }: { color: string }) => (
      <Badge
        visible
        size={8}
        style={[styles.badge, { backgroundColor: color }]}
      />
    ),
  },
];

const DrawerItems = ({
  toggleTheme,
  toggleRTL,
  toggleThemeVersion,
  isRTL,
  isDarkTheme,
}: Props) => {
  const [drawerItemIndex, setDrawerItemIndex] = React.useState<number>(0);

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
      style={[styles.drawerContent, { backgroundColor: colors?.surface }]}
    >
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
          <View style={styles.preference}>
            <Text>Dark Theme</Text>
            <View pointerEvents="none">
              <Switch value={isDarkTheme} />
            </View>
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={_handleToggleRTL}>
          <View style={styles.preference}>
            <Text>RTL</Text>
            <View pointerEvents="none">
              <Switch value={isRTL} />
            </View>
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={toggleThemeVersion}>
          <View style={styles.preference}>
            <Text>Switch back to Material 2</Text>
            <View pointerEvents="none">
              <Switch value={!isV3} />
            </View>
          </View>
        </TouchableRipple>
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  preference: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 28,
  },
  badge: {
    alignSelf: 'center',
  },
});

export default DrawerItems;
