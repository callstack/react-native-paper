import * as React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  GestureResponderEvent,
  TouchableWithoutFeedback as TouchableWithoutFeedbackRN,
  TouchableOpacity as TouchableOpacityRN,
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
import {
  TapGestureHandler,
  TouchableOpacity as TouchableOpacityRNGH,
  TouchableWithoutFeedback as TouchableWithoutFeedbackRNGH,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

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
  const [contextualMenuCoord, setContextualMenuCoor] = React.useState<
    ContextualMenuCoord
  >({ x: 0, y: 0 });

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

  const {
    colors: { background },
  } = useTheme();

  navigation.setOptions({
    headerShown: false,
  });

  const TouchableOpacity =
    Platform.OS === 'android' ? TouchableOpacityRNGH : TouchableOpacityRN;

  return (
    <View style={styles.screen}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Menu" />
        <Menu
          visible={_getVisible('menu1')}
          onDismiss={_toggleMenu('menu1')}
          anchor={
            <Appbar.Action
              icon={MORE_ICON}
              color="white"
              onPress={_toggleMenu('menu1')}
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
            visible={_getVisible('menu2')}
            onDismiss={_toggleMenu('menu2')}
            anchor={
              <Button mode="outlined" onPress={_toggleMenu('menu2')}>
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
          visible={_getVisible('menu3')}
          onDismiss={_toggleMenu('menu3')}
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
            onLongPress={() => _handleLongPress}
          >
            <List.Item
              title="List item"
              description="Long press me to open contextual menu"
            />
          </TouchableRipple>
        </List.Section>
        <TapGestureHandler>
          <Animated.View>
            <Menu
              visible={_getVisible('menu4')}
              onDismiss={_toggleMenu('menu4')}
              renderBackdrop={onDismiss =>
                Platform.OS === 'android' ? (
                  // use react-native-gesture-handler to still get onPress event on android
                  <TouchableWithoutFeedbackRNGH
                    onPress={onDismiss}
                    containerStyle={styles.backdrop}
                  />
                ) : (
                  <TouchableWithoutFeedbackRN onPress={onDismiss}>
                    <View style={styles.backdrop} />
                  </TouchableWithoutFeedbackRN>
                )
              }
              anchor={
                // react-native-gesture-handler touchable used on android, so this would steal
                // the onPress event from the react-native default backdrop touchable
                <TouchableOpacity onPress={_toggleMenu('menu4')}>
                  <List.Item
                    title="List item"
                    description="Press me to open a menu with a custom backdrop"
                  />
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={() => {}} title="Item 1" />
              <Menu.Item onPress={() => {}} title="Item 2" />
              <Divider />
              <Menu.Item onPress={() => {}} title="Item 3" disabled />
            </Menu>
          </Animated.View>
        </TapGestureHandler>
      </View>
    </View>
  );
};

MenuExample.title = 'Menu';

const backdropColor = '#00000066';

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
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: backdropColor,
  },
});

export default MenuExample;
