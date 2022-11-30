import * as React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';

import { DrawerContentScrollView } from '@react-navigation/drawer';
import { StackActions, useNavigation } from '@react-navigation/native';
import * as Updates from 'expo-updates';
import {
  Badge,
  Drawer,
  MD2Colors,
  MD3Colors,
  Switch,
  Text,
  TouchableRipple,
} from 'react-native-paper';

import { isWeb } from '../utils';

import { PreferencesContext, useExampleTheme } from './';

type Props = {
  toggleTheme: () => void;
  toggleRTL: () => void;
  toggleThemeVersion: () => void;
  toggleCollapsed: () => void;
  toggleCustomFont: () => void;
  customFontLoaded: boolean;
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
    label: 'Example',
    focusedIcon: 'view-list',
    unfocusedIcon: 'view-list-outline',
    key: 0,
    badge: 44,
  },
  {
    label: 'Starred',
    focusedIcon: 'star',
    unfocusedIcon: 'star-outline',
    key: 1,
  },
  {
    label: 'New',
    focusedIcon: 'alpha-n-box',
    unfocusedIcon: 'alpha-n-box-outline',

    key: 2,
  },
  {
    focusedIcon: 'bell',
    unfocusedIcon: 'bell-outline',
    key: 3,
    badge: true,
  },
];

const DrawerItems = ({
  toggleTheme,
  toggleRTL,
  toggleThemeVersion,
  toggleCollapsed,
  toggleCustomFont,
  customFontLoaded,
  collapsed,
  isRTL,
  isDarkTheme,
}: Props) => {
  const [drawerItemIndex, setDrawerItemIndex] = React.useState<number>(0);
  const preferences = React.useContext(PreferencesContext);

  const _setDrawerItem = (index: number) => setDrawerItemIndex(index);

  const { isV3, colors } = useExampleTheme();

  const _handleToggleRTL = () => {
    toggleRTL();
    I18nManager.forceRTL(!isRTL);
    if (isWeb) {
      Updates.reloadAsync();
    }
  };

  const coloredLabelTheme = {
    colors: isV3
      ? {
          secondaryContainer: MD3Colors.tertiary80,
          onSecondaryContainer: MD3Colors.tertiary20,
        }
      : {
          primary: MD2Colors.tealA200,
        },
  };

  const navigation = useNavigation();

  return (
    <DrawerContentScrollView
      alwaysBounceVertical={false}
      style={[
        styles.drawerContent,
        {
          backgroundColor: colors.surface,
        },
      ]}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
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
                index === 0 &&
                  navigation.dispatch(StackActions.replace('ExampleList'));
                index === 1 &&
                  navigation.dispatch(StackActions.replace('starred'));
                index === 4 && preferences.toggleCollapsed();
              }}
            />
          ))}
        </Drawer.Section>
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
  annotation: {
    marginHorizontal: 24,
  },
});

export default DrawerItems;
