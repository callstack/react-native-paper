import * as React from 'react';
import { StatusBar, Platform, OpaqueColorValue } from 'react-native';
import { withTheme } from '../core/theming';

type Props = {
  /**
   * Set the background color of status bar.
   *  React Native Paper Theme Color or your custom Theme Color;
   */
  backgroundColor: string | OpaqueColorValue;
  /**
   * Set the color of the status bar text.
   * Available color: 'default' | 'light-content' | 'dark-content';
   */
  textColor: 'default' | 'light-content' | 'dark-content';
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};
/**
 * Component to control the app's status bar. The status bar is the zone, typically at
 * the top of the screen, that displays the current time, Wi-Fi and cellular network
 * information, battery level and/or other status icons.
 */
const HeaderBar = ({ textColor, backgroundColor }: Props) => {
  return (
    <StatusBar
      backgroundColor={Platform.OS === 'android' ? backgroundColor : undefined}
      barStyle={textColor}
    />
  );
};

export default withTheme(HeaderBar);
