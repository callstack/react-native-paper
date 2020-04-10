import * as React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Menu,
  Appbar,
  Divider,
  Button,
  useTheme,
  List,
  TouchableRipple,
} from 'react-native-paper';

type ContextualMenuCoord = { x: number; y: number };

type Props = {
  navigation: StackNavigationProp<{}>;
};

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const MenuExample = ({ navigation }: Props) => {
  const [visible1, setVisible1] = React.useState<boolean>(false);
  const [visible2, setVisible2] = React.useState<boolean>(false);
  const [visible3, setVisible3] = React.useState<boolean>(false);
  const [contextualMenuCoord, setContextualMenuCoor] = React.useState<
    ContextualMenuCoord
  >({ x: 0, y: 0 });

  const _openMenu1 = () => setVisible1(true);
  const _openMenu2 = () => setVisible2(true);
  const _openMenu3 = () => setVisible3(true);

  const _closeMenu1 = () => setVisible1(false);
  const _closeMenu2 = () => setVisible2(false);
  const _closeMenu3 = () => setVisible3(false);

  const _handleLongPress = (event: GestureResponderEvent) => {
    const { nativeEvent } = event;
    setContextualMenuCoor({
      x: nativeEvent.pageX,
      y: nativeEvent.pageY,
    });
    _openMenu3();
  };

  const {
    colors: { background },
  } = useTheme();

  navigation.setOptions({
    headerShown: false,
  });

  return (
    <View style={styles.screen}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Menu" />
        <Menu
          visible={visible1}
          onDismiss={_closeMenu1}
          anchor={
            <Appbar.Action
              icon={MORE_ICON}
              color="white"
              onPress={_openMenu1}
            />
          }
        >
          <Menu.Item onPress={() => {}} title="Undo" />
          <Menu.Item onPress={() => {}} title="Redo" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Cut" disabled />
          <Menu.Item onPress={() => {}} title="Copy" disabled />
          <Menu.Item onPress={() => {}} title="Paste" />
        </Menu>
      </Appbar.Header>
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.alignCenter}>
          <Menu
            visible={visible2}
            onDismiss={_closeMenu2}
            anchor={
              <Button mode="outlined" onPress={_openMenu2}>
                Menu with icons
              </Button>
            }
          >
            <Menu.Item icon="undo" onPress={() => {}} title="Undo" />
            <Menu.Item icon="redo" onPress={() => {}} title="Redo" />
            <Divider />
            <Menu.Item
              icon="content-cut"
              onPress={() => {}}
              title="Cut"
              disabled
            />
            <Menu.Item
              icon="content-copy"
              onPress={() => {}}
              title="Copy"
              disabled
            />
            <Menu.Item icon="content-paste" onPress={() => {}} title="Paste" />
          </Menu>
        </View>
        <Menu
          visible={visible3}
          onDismiss={_closeMenu3}
          anchor={contextualMenuCoord}
        >
          <Menu.Item onPress={() => {}} title="Item 1" />
          <Menu.Item onPress={() => {}} title="Item 2" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Item 3" disabled />
        </Menu>
        <List.Section style={styles.list} title="Contextual menu">
          <TouchableRipple
            onPress={() => {}}
            // @ts-ignore
            onLongPress={_handleLongPress}
          >
            <List.Item
              title="List item"
              description="Long press me to open contextual menu"
            />
          </TouchableRipple>
        </List.Section>
      </View>
    </View>
  );
};

MenuExample.title = 'Menu';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 48,
  },
  list: {
    marginTop: 48,
  },
  alignCenter: {
    alignItems: 'center',
  },
});

export default MenuExample;
