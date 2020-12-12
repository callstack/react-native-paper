import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import {
  Drawer,
  Switch,
  TouchableRipple,
  Text,
  Colors,
  useTheme,
} from 'react-native-paper';

type Props = {
  toggleTheme: () => void;
  toggleRTL: () => void;
  isRTL: boolean;
  isDarkTheme: boolean;
  navigation: DrawerContentComponentProps<DrawerNavigationProp>;
};


const DrawerItemsData = [
  { label: 'Home', icon: 'home', key: 0 },
  { label: 'Starred', icon: 'star', key: 1 },
  { label: 'Sent mail', icon: 'send', key: 2 },
  { label: 'Colored label', icon: 'palette', key: 3 },
  { label: 'A very long title that will be truncated', icon: 'delete', key: 4 },
];

function DrawerItems (props: Props) {
  const { toggleTheme, toggleRTL, isRTL, isDarkTheme, navigation } = props;
  const [drawerItemIndex, setDrawerItemIndex] = React.useState<number>(0);
  //console.log(props);
  //const navigation = useNavigation();

  function  _setDrawerItem  (index: number)  {
    setDrawerItemIndex(index);
    if(index===0){
      //navigation.goBack();
    }
  }

  const { colors } = useTheme();

  return (
    <View style={[styles.drawerContent, { backgroundColor: colors.surface }]}>
      {/* title="Example items" */}
      <Drawer.Section style={{marginTop: 40}}> 
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
        <TouchableRipple onPress={toggleRTL}>
          <View style={styles.preference}>
            <Text>RTL</Text>
            <View pointerEvents="none">
              <Switch value={isRTL} />
            </View>
          </View>
        </TouchableRipple>
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 22,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerItems;