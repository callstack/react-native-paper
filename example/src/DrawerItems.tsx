import * as React from 'react';
import { I18nManager, StyleSheet, View, Platform } from 'react-native';

import { DrawerContentScrollView } from '@react-navigation/drawer';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Updates from 'expo-updates';
import {
  Badge,
  Button,
  Dialog,
  Drawer,
  Colors,
  Switch,
  Text,
  TouchableRipple,
  Portal,
  useTheme,
} from 'react-native-paper';

import { deviceColorsSupported, isWeb } from '../utils';
import { PreferencesContext } from './PreferencesContext';

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
    focusedIcon: 'inbox',
    unfocusedIcon: 'inbox-outline',
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
    label: 'Sent mail',
    focusedIcon: 'send',
    unfocusedIcon: 'send-outline',
    key: 2,
  },
  {
    label: 'A very long title that will be truncated',
    focusedIcon: 'delete',
    unfocusedIcon: 'delete-outline',
    key: 3,
  },
  {
    label: 'Full width',
    focusedIcon: 'arrow-all',
    key: 4,
  },
  {
    focusedIcon: 'bell',
    unfocusedIcon: 'bell-outline',
    key: 5,
    badge: true,
  },
];

function DrawerItems() {
  const [drawerItemIndex, setDrawerItemIndex] = React.useState<number>(0);
  const [showRTLDialog, setShowRTLDialog] = React.useState(false);
  const preferences = React.useContext(PreferencesContext);

  const _setDrawerItem = (index: number) => setDrawerItemIndex(index);

  const { colors } = useTheme();
  const isIOS = Platform.OS === 'ios';
  const expoGoExecution =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  if (!preferences) throw new Error('PreferencesContext not provided');

  const {
    toggleShouldUseDeviceColors,
    toggleTheme,
    toggleRtl: toggleRTL,
    toggleCollapsed,
    toggleCustomFont,
    toggleRippleEffect,
    customFontLoaded,
    rippleEffectEnabled,
    collapsed,
    rtl: isRTL,
    theme: { dark: isDarkTheme },
    shouldUseDeviceColors,
  } = preferences;

  const _handleToggleRTL = () => {
    if (expoGoExecution) {
      setShowRTLDialog(true);
      return;
    }

    toggleRTL();
    I18nManager.forceRTL(!isRTL);
    if (isWeb) {
      Updates.reloadAsync();
    }
  };

  const _handleDismissRTLDialog = () => {
    setShowRTLDialog(false);
  };

  const coloredLabelTheme = {
    colors: {
      secondaryContainer: Colors.tertiary80,
      onSecondaryContainer: Colors.tertiary20,
    },
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
      {collapsed && (
        <Drawer.Section style={styles.collapsedSection}>
          {DrawerCollapsedItemsData.map((props, index) => (
            <Drawer.CollapsedItem
              {...props}
              key={props.key}
              active={drawerItemIndex === index}
              onPress={() => {
                _setDrawerItem(index);
                index === 4 && toggleCollapsed();
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
                theme={props.key === 3 ? coloredLabelTheme : undefined}
                active={drawerItemIndex === index}
                onPress={() => _setDrawerItem(index)}
              />
            ))}
          </Drawer.Section>

          <Drawer.Section title="Preferences">
            {deviceColorsSupported ? (
              <TouchableRipple onPress={toggleShouldUseDeviceColors}>
                <View style={styles.preference}>
                  <Text variant="labelLarge">Use device colors</Text>
                  <View pointerEvents="none">
                    <Switch value={shouldUseDeviceColors} />
                  </View>
                </View>
              </TouchableRipple>
            ) : null}
            <TouchableRipple onPress={toggleTheme}>
              <View style={styles.preference}>
                <Text variant="labelLarge">Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={isDarkTheme} />
                </View>
              </View>
            </TouchableRipple>

            {!isWeb && (
              <TouchableRipple onPress={_handleToggleRTL}>
                <View style={styles.preference}>
                  <Text variant="labelLarge">RTL</Text>
                  <View pointerEvents="none">
                    <Switch value={isRTL} />
                  </View>
                </View>
              </TouchableRipple>
            )}

            <TouchableRipple onPress={toggleCollapsed}>
              <View style={styles.preference}>
                <Text variant="labelLarge">Collapsed drawer</Text>
                <View pointerEvents="none">
                  <Switch value={collapsed} />
                </View>
              </View>
            </TouchableRipple>

            <TouchableRipple onPress={toggleCustomFont}>
              <View style={styles.preference}>
                <Text variant="labelLarge">Custom font</Text>
                <View pointerEvents="none">
                  <Switch value={customFontLoaded} />
                </View>
              </View>
            </TouchableRipple>

            <TouchableRipple onPress={toggleRippleEffect}>
              <View style={styles.preference}>
                <Text variant="labelLarge">
                  {isIOS ? 'Highlight' : 'Ripple'} effect
                </Text>
                <View pointerEvents="none">
                  <Switch value={rippleEffectEnabled} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
          <Text variant="bodySmall" style={styles.annotation}>
            React Native Paper Version{' '}
            {require('react-native-paper/package.json').version}
          </Text>
        </>
      )}
      <Portal>
        <Dialog visible={showRTLDialog} onDismiss={_handleDismissRTLDialog}>
          <Dialog.Title>Changing to RTL</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Due to Expo Go limitations it is impossible to change RTL
              dynamically. To do so, you need to create a development build of
              Example app or change it statically by setting{' '}
              <Text variant="labelMedium">forcesRTL</Text> property to true in{' '}
              <Text variant="labelMedium">app.json</Text> within{' '}
              <Text variant="labelMedium">example</Text> directory.
            </Text>
            <Dialog.Actions>
              <Button onPress={_handleDismissRTLDialog}>Ok</Button>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    height: 56,
    paddingHorizontal: 28,
  },
  badge: {
    alignSelf: 'center',
  },
  collapsedSection: {
    marginTop: 16,
  },
  annotation: {
    marginHorizontal: 24,
    marginVertical: 6,
  },
});

export default DrawerItems;
