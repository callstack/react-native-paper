import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  Badge,
  Drawer,
  Switch,
  TouchableRipple,
  Text,
  Colors,
  useTheme,
} from 'react-native-paper';
import * as Updates from 'expo-updates';

type Props = {
  toggleTheme: () => void;
  toggleRTL: () => void;
  isRTL: boolean;
  isDarkTheme: boolean;
};

const DrawerItemsData = [
  { label: 'Inbox', icon: 'inbox', key: 0 },
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
  { label: 'A very long title that will be truncated', icon: 'delete', key: 4 },
];

const DrawerItems = ({ toggleTheme, toggleRTL, isRTL, isDarkTheme }: Props) => {
  const [drawerItemIndex, setDrawerItemIndex] = React.useState<number>(0);

  const _setDrawerItem = (index: number) => setDrawerItemIndex(index);

  const { colors } = useTheme();

  const _handleToggleRTL = () => {
    toggleRTL();
    Updates.reloadAsync();
  };

  return (
    <DrawerContentScrollView
      alwaysBounceVertical={false}
      style={[styles.drawerContent, { backgroundColor: colors.surface }]}
    >
      <Drawer.Section title="Example items">
        {DrawerItemsData.map((props, index) => (
          <Drawer.Item
            {...props}
            key={props.key}
            theme={
              props.key === 3
                ? { colors: { primary: Colors.tealA200 } }
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
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  badge: {
    alignSelf: 'center',
  },
});

export default DrawerItems;
