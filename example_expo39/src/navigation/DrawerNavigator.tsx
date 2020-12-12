import * as React from "react";
import DrawerItems from "..//DrawerItems";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator<{ Home: undefined }>();
const PreferencesContext = React.createContext<any>(null);

const DrawerContent = () => {
  return (
    <PreferencesContext.Consumer>
      {(preferences) => (
        <DrawerItems
          toggleTheme={preferences.toggleTheme}
          toggleRTL={preferences.toggleRtl}
          isRTL={preferences.rtl}
          isDarkTheme={preferences.theme.dark}
        />
      )}
    </PreferencesContext.Consumer>
  );
};

export default function DrawerNavigator(props) {
    const {Home} = props;
  return (
    <Drawer.Navigator drawerContent={() => <DrawerContent />}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
}
