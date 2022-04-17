import * as React from 'react';
import { StatusBar, StatusBarStyle, Platform } from 'react-native';
import { withTheme } from '../core/theming';

type Props = React.ComponentPropsWithRef<typeof StatusBar> & {
  /**
   * Se the background color of status bar.
   */
  backgroundColor: string | ReactNativePaper.ThemeColors;
  /**
   * Set the color of the status bar text.
   */
  textColor: StatusBarStyle;
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
      animated={true}
      backgroundColor={Platform.OS === 'android' ? backgroundColor : undefined}
      barStyle={textColor}
      networkActivityIndicatorVisible={true}
    />
  );
};

export default withTheme(HeaderBar);
