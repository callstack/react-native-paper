import * as React from 'react';
import {
  GestureResponderEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Appbar,
  Button,
  Divider,
  List,
  Menu,
  TouchableRipple,
} from 'react-native-paper';

import { useExampleTheme } from '..';
import ScreenWrapper from '../ScreenWrapper';

type ContextualMenuCoord = { x: number; y: number };

type Props = {
  navigation: StackNavigationProp<{}>;
};

type MenuVisibility = {
  [key: string]: boolean | undefined;
};

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const MenuExample = ({ navigation }: Props) => {
  const [visible, setVisible] = React.useState<MenuVisibility>({});
  const [contextualMenuCoord, setContextualMenuCoor] =
    React.useState<ContextualMenuCoord>({ x: 0, y: 0 });
  const { isV3 } = useExampleTheme();

  const _toggleMenu = (name: string) => () =>
    setVisible({ ...visible, [name]: !visible[name] });

  const _getVisible = (name: string) => !!visible[name];

  const _handleLongPress = (event: GestureResponderEvent) => {
    const { nativeEvent } = event;
    setContextualMenuCoor({
      x: nativeEvent.pageX,
      y: nativeEvent.pageY,
    });
    setVisible({ menu3: true });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Menu" />
        <Menu
          visible={_getVisible('menu1')}
          onDismiss={_toggleMenu('menu1')}
          anchor={
            <Appbar.Action
              icon={MORE_ICON}
              onPress={_toggleMenu('menu1')}
              {...(!isV3 && { color: 'white' })}
            />
          }
        >
          <Menu.Item onPress={() => {}} title="Undo" />
          <Menu.Item onPress={() => {}} title="Redo" />
          <Divider style={isV3 && styles.md3Divider} />
          <Menu.Item onPress={() => {}} title="Cut" disabled />
          <Menu.Item onPress={() => {}} title="Copy" disabled />
          <Menu.Item onPress={() => {}} title="Paste" />
        </Menu>
      </Appbar.Header>
      <ScreenWrapper
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      >
        <View>
          <View style={styles.alignCenter}>
            <Menu
              visible={_getVisible('menu2')}
              onDismiss={_toggleMenu('menu2')}
              anchor={
                <Button mode="outlined" onPress={_toggleMenu('menu2')}>
                  Menu with icons
                </Button>
              }
            >
              <Menu.Item leadingIcon="undo" onPress={() => {}} title="Undo" />
              <Menu.Item leadingIcon="redo" onPress={() => {}} title="Redo" />

              <Divider style={isV3 && styles.md3Divider} />

              <Menu.Item
                leadingIcon="content-cut"
                onPress={() => {}}
                title="Cut"
                disabled
              />
              <Menu.Item
                leadingIcon="content-copy"
                onPress={() => {}}
                title="Copy"
                disabled
              />
              <Menu.Item
                leadingIcon="content-paste"
                onPress={() => {}}
                title="Paste"
              />
              {isV3 && (
                <Menu.Item
                  trailingIcon="share-variant"
                  onPress={() => {}}
                  title="Share"
                />
              )}
            </Menu>
          </View>
          <Menu
            visible={_getVisible('menu3')}
            onDismiss={_toggleMenu('menu3')}
            anchor={contextualMenuCoord}
          >
            <Menu.Item onPress={() => {}} title="Item 1" />
            <Menu.Item onPress={() => {}} title="Item 2" />
            <Divider style={isV3 && styles.md3Divider} />
            <Menu.Item onPress={() => {}} title="Item 3" disabled />
          </Menu>
          <List.Section style={styles.list} title="Contextual menu">
            <TouchableRipple onPress={() => {}} onLongPress={_handleLongPress}>
              <List.Item
                title="List item"
                description="Long press me to open contextual menu"
              />
            </TouchableRipple>
          </List.Section>
        </View>

        <View style={styles.bottomMenu}>
          <Menu
            visible={_getVisible('menu4')}
            onDismiss={_toggleMenu('menu4')}
            anchor={
              <Button mode="outlined" onPress={_toggleMenu('menu4')}>
                Menu at bottom
              </Button>
            }
          >
            <Menu.Item onPress={() => {}} title="Bottom Item 1" />
            <Menu.Item onPress={() => {}} title="Bottom Item 2" />
            <Menu.Item onPress={() => {}} title="Bottom Item 3" />
          </Menu>
        </View>
      </ScreenWrapper>
    </View>
  );
};

MenuExample.title = 'Menu';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    paddingTop: 48,
  },
  list: {
    marginTop: 48,
  },
  alignCenter: {
    alignItems: 'center',
  },
  md3Divider: {
    marginVertical: 8,
  },
  bottomMenu: { width: '40%' },
  contentContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },
});

export default MenuExample;
