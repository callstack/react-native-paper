import * as React from "react";
import { I18nManager, Platform, LogBox, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as Updates from "expo-updates";
import { useKeepAwake } from "expo-keep-awake";
import { InitialState, NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from '@react-navigation/stack';
import {
  Provider as PaperProvider,
  DarkTheme,
  DefaultTheme,
} from "react-native-paper";
import App from "./src/navigation/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  BottomTabBar,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { TabBarAdvancedButton } from "./src/components";
import { IS_IPHONE_X } from "./src/utils";
import CardExample from './Examples/CardExample';
import BannerExample from './Examples/BannerExample';
import AvatarExample from './Examples/AvatarExample';
import ButtonExample from './Examples/ButtonExample';
import { DrawerContent } from './src/navigation/drawerContent';
import { PreferencesContext } from './src/context/preferencesContext';
// Add new typescript properties to the theme
declare global {
  namespace ReactNativePaper {
    interface ThemeFonts {
      superLight: ThemeFont;
    }
    interface ThemeColors {
      customColor: string;
    }
    interface ThemeAnimation {
      customProperty: number;
    }
    interface Theme {
      userDefinedThemeProperty: string;
    }
  }
}

//YellowBox.ignoreWarnings(['Require cycle:']);
LogBox.ignoreLogs(["Require cycle"]);

const PERSISTENCE_KEY = "NAVIGATION_STATE";
const PREFERENCES_KEY = "APP_PREFERENCES";

const CustomDarkTheme: ReactNativePaper.Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    customColor: "#E94F37",
  },
  fonts: {
    ...DarkTheme.fonts,
    superLight: { ...DarkTheme.fonts["light"] },
  },
  userDefinedThemeProperty: "",
  animation: {
    ...DarkTheme.animation,
    customProperty: 1,
  },
};

const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    customColor: "#E94F37",
  },
  fonts: {
    ...DefaultTheme.fonts,
    superLight: { ...DefaultTheme.fonts["light"] },
  },
  userDefinedThemeProperty: "",
  animation: {
    ...DefaultTheme.animation,
    customProperty: 1,
  },
};

const Drawer = createDrawerNavigator();

export default function PaperExample() {
  useKeepAwake();

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [theme, setTheme] = React.useState<ReactNativePaper.Theme>(
    CustomDefaultTheme
  );
  const [rtl, setRtl] = React.useState<boolean>(I18nManager.isRTL);

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = JSON.parse(savedStateString || "");

        setInitialState(state);
      } catch (e) {
        // ignore error
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  React.useEffect(() => {
    const restorePrefs = async () => {
      try {
        const prefString = await AsyncStorage.getItem(PREFERENCES_KEY);
        const preferences = JSON.parse(prefString || "");

        if (preferences) {
          // eslint-disable-next-line react/no-did-mount-set-state
          setTheme(
            preferences.theme === "dark" ? CustomDarkTheme : CustomDefaultTheme
          );

          if (typeof preferences.rtl === "boolean") {
            setRtl(preferences.rtl);
          }
        }
      } catch (e) {
        // ignore error
      }
    };

    restorePrefs();
  }, []);

  React.useEffect(() => {
    const savePrefs = async () => {
      try {
        await AsyncStorage.setItem(
          PREFERENCES_KEY,
          JSON.stringify({
            theme: theme === DarkTheme ? "dark" : "light",
            rtl,
          })
        );
      } catch (e) {
        // ignore error
      }

      if (I18nManager.isRTL !== rtl) {
        I18nManager.forceRTL(rtl);
        //Updates.reloadFromCache();
        Updates.reloadAsync();
      }
    };

    savePrefs();
  }, [rtl, theme]);

  const toggleRTL = React.useCallback(() => {
    I18nManager.forceRTL(!rtl);
    setRtl((rtl) => !rtl);
  }, [rtl]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme: () =>
        setTheme((theme) =>
          theme === CustomDefaultTheme ? CustomDarkTheme : CustomDefaultTheme
        ),
      toggleRTL,
      rtl,
      theme,
    }),
    [rtl, theme, toggleRTL]
  );

  if (!isReady) {
    return null;
  }

  const Tab = createBottomTabNavigator();
  const Stack1 = createStackNavigator();
  const Stack2 = createStackNavigator();
  const Stack3 = createStackNavigator();
  const Stack4 = createStackNavigator();

  function Home() {
    return (
      <Tab.Navigator
        tabBar={(props) => (
          <View style={styles.navigatorContainer}>
            <BottomTabBar {...props} />
            {IS_IPHONE_X && (
              <View
                style={[
                  styles.xFillLine,
                  {
                    backgroundColor: theme.colors.background,
                  },
                ]}
              />
            )}
          </View>
        )}
        tabBarOptions={{
          showIcon: true,
          style: [styles.navigator],
          activeTintColor: theme.colors.accent,
          tabStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Tab.Screen
          name="Feed"
          component={FeedStack}
          options={{
            title: "Feed",
            tabBarIcon: ({ color }) => (
              <Icon name="feed" size={22} color={color} />
            ),
          }}
          //options={{ title: "3" }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="pie-chart" size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Rocket"
          component={RocketStack}
          options={{
            tabBarButton: (props) => (
              <TabBarAdvancedButton colors={theme.colors} bgColor={theme.colors.background} {...props} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="user" size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="More"
          component={App}
          options={{
            tabBarVisible: false,
            tabBarIcon: ({ color }) => (
              <Icon name="navicon" size={22} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }



function FeedStack() {
  //options={{headerShown: false}}
  return (
    <Stack1.Navigator>
      <Stack1.Screen
        name="Feed"
        component={BannerExample}
        options={{
          title: "Feed with banner",
          headerStyle: {
            backgroundColor: theme.colors.background,
            shadowColor: "transparent",
            shadowRadius: 0,
            shadowOffset: {
              height: 0,
            },
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack1.Navigator>
  );
}

function ProgressStack({navigation}) {
  //options={{headerShown: false}}
  return (
    <Stack2.Navigator>
      <Stack2.Screen
        name="Progress"
        component={ButtonExample}
        options={{
          title: "My Progress",
          headerStyle: {
            backgroundColor: theme.colors.background,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0,
            }
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft:() => ( <Icon name={'backward'} onPress={ () => { navigation.goBack() }} />),
        }}
      />
    </Stack2.Navigator>
  );
}

function RocketStack() {
  //options={{headerShown: false}}
  return (
    <Stack3.Navigator>
      <Stack3.Screen
        name="Rocket"
        component={CardExample}
        options={{
          title: "Fly Rocket",
          headerStyle: {
            backgroundColor: theme.colors.background,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0,
            }
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack3.Navigator>
  );
}

function ProfileStack() {
  //options={{headerShown: false}}
  return (
    <Stack4.Navigator>
      <Stack4.Screen
        name="Profile"
        component={AvatarExample}
        options={{
          title: "Profile",
          headerStyle: {
            backgroundColor: theme.colors.background,
            shadowColor: "transparent",
            shadowRadius: 0,
            shadowOffset: {
              height: 0,
            },
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack4.Navigator>
  );
}

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <PreferencesContext.Provider value={preferences}>
          <React.Fragment>
            <NavigationContainer
              initialState={initialState}
              onStateChange={(state) =>
                AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
              }
            >
              {Platform.OS === "web" ? (
                <App />
              ) : (
                <Drawer.Navigator  drawerContent={props => <DrawerContent preferences={preferences} {...props} />}>
                  <Drawer.Screen name="Home" component={Home} />
                </Drawer.Navigator>
              )}
            </NavigationContainer>
          </React.Fragment>
        </PreferencesContext.Provider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigatorContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  navigator: {
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 30,
  },
  xFillLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
});
