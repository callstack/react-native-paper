import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Avatar,
  Caption,
  Drawer,
  Paragraph,
  Switch,
  Text,
  Title,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';

type Props = {
  preferences: Object;
  navigation: DrawerContentComponentProps<DrawerNavigationProp>;
};

export function DrawerContent(props: Props) {
  const { navigation } = props;

  const paperTheme = useTheme();
  const { toggleTheme, toggleRTL, rtl, theme } = props.preferences;

  const goTo = (screen: string) => {
    console.log("drawer navigation works");
    navigation.navigate(screen);
  }

  return (
    <DrawerContentScrollView
      style={[
        styles.drawerContent,
        {
          backgroundColor: paperTheme.colors.surface
        },
      ]}
      {...props}
    >
      <Animated.View
        //@ts-ignore
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
          },
        ]}
      >
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              props.navigation.toggleDrawer();
            }}
          >
            <Avatar.Image
              source={require("../../assets/images/clock.png")}
              size={50}
            />
          </TouchableOpacity>
          <Title style={styles.title}>Austin Powers</Title>
          <Caption style={styles.caption}>@Pooch</Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                202
              </Paragraph>
              <Caption style={styles.caption}>Pimped</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                159
              </Paragraph>
              <Caption style={styles.caption}>Shagged</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <Drawer.Item
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="dna"
                color={color}
                size={size}
              />
            )}
            label="Feed"
            onPress={() => {
              goTo("Feed");
            }}
          />
          <Drawer.Item
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="chart-donut" color={color} size={size} />
            )}
            label="Progress"
            onPress={() => {
              goTo("Progress");
            }}
          />
          <Drawer.Item
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="rocket"
                color={color}
                size={size}
              />
            )}
            label="Fly Rocket"
            onPress={() => {
              goTo("Rocket");
            }}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={theme.dark} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={toggleRTL}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={rtl} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
